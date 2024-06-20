import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.createTable("Payments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
        defaultValue: 0,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
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
    return queryInterface.dropTable("Payments");
  },
};
