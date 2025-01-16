const sequelize = require("../config/database");
const User = require("./User");
const ForgotPassword = require("./ForgotPassword");
const Expense = require("./Expense");
const Order = require("./Order");

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  ForgotPassword,
  Expense,
  Order,
};
