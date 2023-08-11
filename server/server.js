const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const Expense = require('./Expense');
const Budget = require('./Budget');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Get all expenses
app.get('/api/expenses', (req, res) => {
  Expense.find({})
    .then((expenses) => res.json(expenses))
    .catch((err) => res.status(500).json({ error: 'Error fetching expenses from the database.' }));
});

// Add an expense
app.post('/api/expenses', (req, res) => {
  const newExpense = req.body;
  Expense.create(newExpense)
    .then(() => res.status(201).json({ success: true }))
    .catch((err) => res.status(500).json({ error: 'Error adding expense to the database.' }));
});

// Delete an expense by ID
app.delete('/api/expenses/:id', (req, res) => {
  const expenseId = req.params.id;
  Expense.findOneAndDelete({ id: expenseId })
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json({ error: 'Error deleting expense from the database.' }));
});

app.post('/api/budget', (req, res) => {
  const { month, year, amount } = req.body;
  Budget.findOneAndUpdate({ month, year }, { month, year, amount }, { upsert: true, new: true })
    .then((updatedBudget) => res.json(updatedBudget))
    .catch((err) => res.status(500).json({ error: 'Error updating monthly budget.' }));
});

// Fetch monthly budget
app.get('/api/budget/:year/:month', (req, res) => {
  const { year, month } = req.params;
  Budget.findOne({ year, month })
    .then((budget) => {
      // If no budget document exists for the specified year and month, create a new one with a default budget value
      if (!budget) {
        const defaultBudgetValue = 1000; // Set your default budget value here
        return Budget.create({ month, year, amount: defaultBudgetValue })
          .then((newBudget) => res.json(newBudget))
          .catch((err) => res.status(500).json({ error: 'Error fetching monthly budget.' }));
      }
      res.json(budget);
    })
    .catch((err) => res.status(500).json({ error: 'Error fetching monthly budget.' }));
});

// Update monthly budget
app.post('/api/budget/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const { amount } = req.body;
  Budget.findOneAndUpdate({ year, month }, { amount }, { new: true })
    .then((updatedBudget) => res.json(updatedBudget))
    .catch((err) => res.status(500).json({ error: 'Error updating monthly budget.' }));
});

// Delete monthly budget
app.delete('/api/budget/:year/:month', (req, res) => {
  const { year, month } = req.params;
  Budget.findOneAndDelete({ year, month })
    .then((deletedBudget) => res.json(deletedBudget))
    .catch((err) => res.status(500).json({ error: 'Error deleting monthly budget.' }));
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
