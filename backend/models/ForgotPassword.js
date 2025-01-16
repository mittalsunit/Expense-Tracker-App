const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ForgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

ForgotPassword.belongsTo(User, { foreignKey: "userId" }); // Many-to-One relationship
module.exports = ForgotPassword;
