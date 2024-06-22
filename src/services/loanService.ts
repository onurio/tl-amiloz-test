import Loan from "@models/loan";
import Offer from "@models/offer";
import Payment from "@models/payment";
import { createTransactions } from "./transactionService";
import sequelize from "@/models";

export const createLoan = async (userId: number, offerId: number) => {
  const offer = await Offer.findOne({
    where: {
      id: offerId,
      userId,
    },
  });

  if (!offer) {
    throw new Error("Offer not found");
  }

  const totalAmount = offer.amount * (1 + offer.interestRate);

  const loan = await Loan.create({
    userId: offer.userId,
    offerId: offer.id,
    amount: offer.amount,
    term: offer.term,
    interestRate: offer.interestRate,
    isPaid: false,
  });

  const paymentSchedule = Array.from({ length: offer.term }, (_, i) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7 * (i + 1)); // Set the due date for each week
    return {
      loanId: loan.id,
      amount: totalAmount / offer.term,
      amountPaid: 0,
      dueDate,
    };
  });

  const dbTransaction = await sequelize.transaction();
  try {
    await createTransactions(
      [{ loanId: loan.id, amount: loan.amount, direction: "outgoing" }],
      dbTransaction
    );

    const payments = await Payment.bulkCreate(paymentSchedule, {
      transaction: dbTransaction,
    });
    return { loan, payments };
  } catch (error) {
    await dbTransaction.rollback();
    throw error;
  }
};
