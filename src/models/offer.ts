import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import User from "./user";

interface OfferAttributes {
  id: number;
  userId: number;
  amount: number;
  term: number; // in months
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
  },
  {
    sequelize,
    tableName: "Offers",
  }
);

User.hasMany(Offer, { foreignKey: "userId", as: "offers" });
Offer.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Offer;
