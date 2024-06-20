import { Request, Response } from "express";
import Loan from "@models/loan";
import Offer from "@models/offer";

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

    const loan = await Loan.create({
      userId: offer.userId,
      offerId: offer.id,
      amount: offer.amount,
      term: offer.term,
      interestRate: offer.interestRate,
      paymentSchedule: Array.from({ length: offer.term * 4 }, (_, i) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7 * i); // Set the due date for each week
        return {
          week: i + 1,
          amount: offer.amount / (offer.term * 4),
          dueDate,
        };
      }),
    });

    return res.status(201).json({ loan });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
