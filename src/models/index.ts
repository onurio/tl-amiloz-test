"use strict";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const sequelize = new Sequelize(config);

sequelize
  .authenticate()
  .then(() => {
    console.log("DB connection has been established successfully.");
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
