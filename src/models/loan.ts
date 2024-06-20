import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import Payment from "./payment";

interface LoanAttributes {
  id: number;
  userId: number;
  offerId: number;
  amount: number;
  term: number;
  interestRate: number;
  isPaid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LoanCreationAttributes extends Optional<LoanAttributes, "id"> {}

class Loan
  extends Model<LoanAttributes, LoanCreationAttributes>
  implements LoanAttributes
{
  public id!: number;
  public userId!: number;
  public offerId!: number;
  public amount!: number;
  public term!: number;
  public interestRate!: number;
  public isPaid!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public payments?: Payment[];
}

Loan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "Loans",
  }
);

Loan.hasMany(Payment, { foreignKey: "loanId", as: "payments" });
Payment.belongsTo(Loan, { foreignKey: "loanId", as: "loan" });

export default Loan;
