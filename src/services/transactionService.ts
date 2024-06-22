import Transaction, {
  TransactionCreationAttributes,
} from "@/models/transaction";
import SequelizeTransaction from "sequelize/types/transaction";

export async function createTransactions(
  transactions: TransactionCreationAttributes[],
  transaction?: SequelizeTransaction
): Promise<Transaction[]> {
  const txs = Transaction.bulkCreate(transactions, { transaction });
  return txs;
}
