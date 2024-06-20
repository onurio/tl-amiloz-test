import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import User from "./user";

interface OfferAttributes {
  id: number;
  userId: number;
  amount: number;
  term: number; // in weeks
  interestRate: number; // in percentage
  createdAt?: Date;
  updatedAt?: Date;
}

interface OfferCreationAttributes extends Optional<OfferAttributes, "id"> {}

class Offer
  extends Model<OfferAttributes, OfferCreationAttributes>
  implements OfferAttributes
{
  public id!: number;
  public userId!: number;
  public amount!: number;
  public term!: number;
  public interestRate!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Offer.init(
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
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Amount must be greater than or equal to 0",
        },
        isDecimal: {
          msg: "Amount must be a decimal number",
        },
      },
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Term must be at least 1 month",
        },
        isInt: {
          msg: "Term must be an integer",
        },
      },
    },
    interestRate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Interest rate must be greater than or equal to 0",
        },
        max: {
          args: [100],
          msg: "Interest rate must be less than or equal to 100",
        },
        isDecimal: {
          msg: "Interest rate must be a decimal number",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "Offers",
  }
);

User.hasMany(Offer, { foreignKey: "userId", as: "offers" });
Offer.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Offer;
