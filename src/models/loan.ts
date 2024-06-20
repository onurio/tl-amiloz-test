import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import User from "./user";
import Offer from "./offer";

interface LoanAttributes {
  id: number;
  userId: number;
  offerId: number;
  amount: number;
  term: number; // in weeks
  interestRate: number; // in percentage
  paymentSchedule: { week: number; amount: number; dueDate: Date }[];
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
  public paymentSchedule!: { week: number; amount: number; dueDate: Date }[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    offerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Offers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    paymentSchedule: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Loans",
  }
);

User.hasMany(Loan, { foreignKey: "userId", as: "loans" });
Loan.belongsTo(User, { foreignKey: "userId", as: "user" });

Offer.hasMany(Loan, { foreignKey: "offerId", as: "loans" });
Loan.belongsTo(Offer, { foreignKey: "offerId", as: "offer" });

export default Loan;