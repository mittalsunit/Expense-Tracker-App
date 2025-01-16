const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.STRING, // Razorpay provides string IDs for orders
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
    defaultValue: "PENDING",
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },
});

Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;
