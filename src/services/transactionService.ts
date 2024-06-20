import Transaction, {
  TransactionCreationAttributes,
} from "@/models/transaction";

export async function createTransactions(
  transactions: TransactionCreationAttributes[]
): Promise<Transaction[]> {
  const txs = Transaction.bulkCreate(transactions);
  return txs;
}
