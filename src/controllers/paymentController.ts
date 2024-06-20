import { Request, Response } from "express";
import Loan from "@models/loan";
import Payment from "@models/payment";

export const applyPayment = async (req: Request, res: Response) => {
  const { loanId } = req.params;
  const { amount } = req.body;

  try {
    const loan = await Loan.findByPk(loanId, { include: ["payments"] });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.isPaid) {
      return res.status(400).json({ message: "Loan is already paid" });
    }

    const payments = await Payment.findAll({
      where: { loanId },
      order: [["dueDate", "ASC"]],
    });

    const totalRemainingAmount = payments.reduce(
      (sum, payment) => sum + (payment.amount - payment.amountPaid),
      0
    );

    if (amount > totalRemainingAmount) {
      return res.status(400).json({
        message: `Amount exceeds the remaining balance of the loan. Remaining balance is: ${totalRemainingAmount}`,
      });
    }

    let remainingAmount = amount;
    let isPaid = true;

    const updatedPayments = payments.map((payment) => {
      const unpaidAmount = payment.amount - payment.amountPaid;
      if (remainingAmount > 0) {
        if (unpaidAmount > remainingAmount) {
          payment.amountPaid += remainingAmount;
          remainingAmount = 0;
        } else {
          remainingAmount -= unpaidAmount;
          payment.amountPaid = payment.amount;
        }
        payment.save();
      }
      if (payment.amount > payment.amountPaid) {
        isPaid = false;
      }
      return payment;
    });

    loan.isPaid = isPaid;
    await loan.save();

    const updatedLoan = await Loan.findByPk(loanId, { include: ["payments"] });

    return res.status(201).json({ loan: updatedLoan });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
