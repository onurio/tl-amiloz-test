import Loan from "@models/loan";
import Payment from "@models/payment";
import { createTransactions } from "./transactionService";
import { TransactionCreationAttributes } from "@/models/transaction";
import sequelize from "@/models";

export const applyPayment = async (loanId: number, amount: number) => {
  const loan = await Loan.findByPk(loanId, {
    include: { model: Payment, as: "payments" },
  });

  if (!loan) {
    throw new Error("Loan not found");
  }

  if (loan.isPaid) {
    throw new Error("Loan is already paid");
  }

  const payments = loan.payments ?? [];
  const totalRemainingAmount = payments.reduce(
    (sum, payment) => sum + (payment.amount - payment.amountPaid),
    0
  );

  if (amount > totalRemainingAmount) {
    throw new Error(
      `Amount exceeds the remaining balance of the loan. Remaining balance: ${totalRemainingAmount}`
    );
  }

  const isPaid = await _processPayment(payments, amount);

  loan.isPaid = isPaid;
  await loan.save();

  const updatedLoan = await Loan.findByPk(loanId, {
    include: { model: Payment, as: "payments" },
  });

  return updatedLoan;
};

const _processPayment = async (payments: Payment[], amount: number) => {
  const dbTransaction = await sequelize.transaction();

  try {
    let remainingAmount = amount;
    let isPaid = true;

    const transactions: TransactionCreationAttributes[] = [];

    const updatedPayments = payments.map(async (payment) => {
      const unpaidAmount = payment.amount - payment.amountPaid;
      if (remainingAmount > 0) {
        if (unpaidAmount > remainingAmount) {
          payment.amountPaid += remainingAmount;
          payment.amountPaid > 0
            ? transactions.push({
                paymentId: payment.id,
                amount: remainingAmount,
                direction: "incoming",
                loanId: payment.loanId,
              })
            : null;
          remainingAmount = 0;
        } else {
          remainingAmount -= unpaidAmount;
          payment.amountPaid = payment.amount;
          unpaidAmount > 0
            ? transactions.push({
                paymentId: payment.id,
                amount: unpaidAmount,
                direction: "incoming",
                loanId: payment.loanId,
              })
            : null;
        }
        await payment.save({ transaction: dbTransaction });
      }
      if (payment.amount > payment.amountPaid) {
        isPaid = false;
      }
      return payment;
    });

    await Promise.all(updatedPayments);
    await createTransactions(transactions, dbTransaction);

    await dbTransaction.commit();

    return isPaid;
  } catch (error) {
    await dbTransaction.rollback();
    throw error;
  }
};

export const revertPayment = async (paymentId: number) => {
  const payment = await Payment.findByPk(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  const loan = await Loan.findByPk(payment.loanId, {
    include: { model: Payment, as: "payments" },
  });

  if (!loan) {
    throw new Error("Loan not found");
  }

  if (payment.amountPaid === 0) {
    throw new Error("No funds to revert payment");
  }

  const revertAmount = payment.amountPaid;

  payment.amountPaid = 0;
  loan.isPaid = false;

  const dbTransaction = await sequelize.transaction();
  try {
    await createTransactions(
      [
        {
          paymentId: payment.id,
          amount: revertAmount,
          direction: "outgoing",
          loanId: payment.loanId,
        },
      ],
      dbTransaction
    );
    await payment.save({ transaction: dbTransaction });
    await loan.save({ transaction: dbTransaction });
  } catch (error) {
    await dbTransaction.rollback();
    throw error;
  }

  return payment;
};
