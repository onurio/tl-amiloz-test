import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.dropTable("Transactions");
  },
};
