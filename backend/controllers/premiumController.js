const { User, Expense, sequelize } = require("../models");

const s3 = require("../config/s3");
const fastCsv = require("fast-csv");
const { PassThrough } = require("stream");
const { AWS_BUCKET_NAME } = process.env;

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch users along with their total expenses
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "isPremium",
        [
          sequelize.fn("SUM", sequelize.col("Expenses.amount")),
          "totalExpenses",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["User.id"],
      order: [[sequelize.literal("totalExpenses"), "DESC"]], // Sort by total expenses
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error });
  }
};

exports.downloadExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch all expenses for the logged-in user
    const expenses = await Expense.findAll({ where: { userId }, raw: true });

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found to download." });
    }

    // Create a CSV file using fast-csv
    const passThrough = new PassThrough();
    fastCsv
      .write(expenses, { headers: true })
      .on("error", (err) => console.error("Error creating CSV:", err))
      .pipe(passThrough);

    // Define the S3 file key
    const fileName = `expenses_${userId}_${Date.now()}.csv`;

    // Upload the CSV to S3
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
      Body: passThrough,
      ContentType: "text/csv",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        return res
          .status(500)
          .json({ message: "Failed to upload file", error: err });
      }

      // Return the S3 file URL
      res.status(200).json({ downloadUrl: data.Location });
    });
  } catch (error) {
    console.error("Error downloading expenses:", error);
    res.status(500).json({ message: "Failed to download expenses", error });
  }
};
