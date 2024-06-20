import { Request, Response, NextFunction } from "express";
import Loan from "@models/loan";
import Offer from "@models/offer";
import Payment from "@models/payment";
import { RequestWithUserId } from "./authMiddleware";

export const checkLoanOwnership = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const { loanId } = req.params;
  const { userId } = req;

  try {
    const loan = await Loan.findByPk(loanId);

    if (!loan || loan.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const checkOfferOwnership = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.offerId ?? req.body.offerId;
  const { userId } = req;
  try {
    const offer = await Offer.findByPk(offerId);
    if (!offer || offer.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const checkPaymentOwnership = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const { paymentId } = req.params;
  const { userId } = req;

  try {
    const payment = await Payment.findByPk(paymentId, { include: ["loan"] });
    if (!payment || payment.loan.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
