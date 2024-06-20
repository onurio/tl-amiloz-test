import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export interface UserAttributes {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface UserInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function (sequelize: Sequelize) {
  var User = sequelize.define("User", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  return User;
}
