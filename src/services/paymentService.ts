// src/services/paymentService.ts
import Loan from "@models/loan";
import Payment from "@models/payment";

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

  const updatedLoan = await Loan.findByPk(loanId, {
    include: { model: Payment, as: "payments" },
  });

  return updatedLoan;
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

  payment.amountPaid = 0;
  await payment.save();

  loan.isPaid = false;
  await loan.save();

  const updatedLoan = await Loan.findByPk(loan.id, {
    include: { model: Payment, as: "payments" },
  });

  return updatedLoan;
};
