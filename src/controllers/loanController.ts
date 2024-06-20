import { Request, Response } from "express";
import * as loanService from "@services/loanService";

export const createLoan = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { offerId } = req.body;

  try {
    const { loan, payments } = await loanService.createLoan(
      Number(userId),
      Number(offerId)
    );

    return res.status(201).json({ loan: { ...loan.toJSON(), payments } });
  } catch (error: any) {
    if (error.message === "Offer not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
};
