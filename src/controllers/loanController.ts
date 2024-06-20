import { Request, Response } from "express";
import Loan from "@models/loan";
import Offer from "@models/offer";
import Payment from "@models/payment";

export const createLoan = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { offerId } = req.body;

  try {
    const offer = await Offer.findOne({
      where: {
        id: offerId,
        userId,
      },
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const totalAmount = offer.amount * (1 + offer.interestRate);

    const loan = await Loan.create({
      userId: offer.userId,
      offerId: offer.id,
      amount: totalAmount,
      term: offer.term,
      interestRate: offer.interestRate,
      isPaid: false,
    });

    const paymentSchedule = Array.from({ length: offer.term }, (_, i) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7 * i); // Set the due date for each week
      return {
        loanId: loan.id,
        amount: totalAmount / offer.term,
        amountPaid: 0,
        dueDate,
      };
    });

    await Payment.bulkCreate(paymentSchedule);

    return res
      .status(201)
      .json({ loan: { ...loan.toJSON(), payments: paymentSchedule } });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
