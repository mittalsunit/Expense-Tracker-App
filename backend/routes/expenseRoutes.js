const express = require('express');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { verifyTokenMiddleware } = require('../utils/jwt'); // Middleware to verify JWT

const router = express.Router();

// Protect routes with JWT middleware
router.post('/', verifyTokenMiddleware, addExpense);
router.get('/', verifyTokenMiddleware, getExpenses);
router.delete('/:id', verifyTokenMiddleware, deleteExpense);

module.exports = router;
