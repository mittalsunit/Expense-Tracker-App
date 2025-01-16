const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("Food", "Entertainment", "Clothes", "Salary", "Other"),
    allowNull: false,
  },
});

Expense.belongsTo(User, { foreignKey: "userId" }); // Many-to-One relationship

module.exports = Expense;
