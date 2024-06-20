import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";

interface PaymentAttributes {
  id: number;
  loanId: number;
  amount: number;
  amountPaid: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public loanId!: number;
  public amount!: number;
  public amountPaid!: number;
  public dueDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly loan?: any;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    amountPaid: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Payments",
  }
);

export default Payment;
