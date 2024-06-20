import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import User from "./user";
import Offer from "./offer";
import Payment from "./payment";

interface LoanAttributes {
  id: number;
  userId: number;
  offerId: number;
  amount: number;
  isPaid: boolean;
  term: number; // in weeks
  interestRate: number; // in percentage
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
  public isPaid!: boolean;
  public term!: number;
  public interestRate!: number;
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
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.DECIMAL,
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

Loan.hasMany(Payment, { foreignKey: "loanId", as: "payments" });
Payment.belongsTo(Loan, { foreignKey: "loanId", as: "loan" });

export default Loan;
