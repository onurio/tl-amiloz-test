import { Request, Response } from "express";
import * as paymentService from "@services/paymentService";

export const applyPayment = async (req: Request, res: Response) => {
  const { loanId } = req.params;
  const { amount } = req.body;

  try {
    const updatedLoan = await paymentService.applyPayment(
      Number(loanId),
      amount
    );
    return res.status(201).json({ loan: updatedLoan });
  } catch (error: any) {
    if (
      error.message === "Loan not found" ||
      error.message === "Payment not found"
    ) {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message === "Loan is already paid" ||
      error.message.startsWith(
        "Amount exceeds the remaining balance of the loan"
      )
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const revertPayment = async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  try {
    const updatedPayment = await paymentService.revertPayment(
      Number(paymentId)
    );
    return res.status(200).json({ payment: updatedPayment });
  } catch (error: any) {
    if (
      error.message === "Loan not found" ||
      error.message === "Payment not found"
    ) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "No funds to revert payment") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
};
