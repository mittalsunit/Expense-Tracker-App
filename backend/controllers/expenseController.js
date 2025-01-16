const { Expense } = require('../models');

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id; // `req.user` contains the logged-in user's data

  try {
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense', error });
  }
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({ where: { userId } });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve expenses', error });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.destroy();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense', error });
  }
};
