const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { syncDatabase } = require("./models");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const premiumRoutes = require("./routes/premiumRoutes");

require('dotenv').config
const Port = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});

app.use("/auth", authRoutes);

app.use("/expenses", expenseRoutes);

app.use("/payments", paymentRoutes);

app.use("/premium", premiumRoutes);

syncDatabase();

module.exports = app;
