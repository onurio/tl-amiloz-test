import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import Loan from "./loan";
import Payment from "./payment";

interface TransactionAttributes {
  id: number;
  amount: number;
  direction: "incoming" | "outgoing";
  loanId: number;
  paymentId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id"> {}

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public amount!: number;
  public direction!: "incoming" | "outgoing";
  public loanId!: number;
  public paymentId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("incoming", "outgoing"),
      allowNull: false,
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Loans",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Payments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "Transactions",
  }
);

Loan.hasMany(Transaction, { foreignKey: "loanId", as: "transactions" });
Transaction.belongsTo(Loan, { foreignKey: "loanId", as: "loan" });

Payment.hasMany(Transaction, { foreignKey: "paymentId", as: "transactions" });
Transaction.belongsTo(Payment, { foreignKey: "paymentId", as: "payment" });

export default Transaction;
