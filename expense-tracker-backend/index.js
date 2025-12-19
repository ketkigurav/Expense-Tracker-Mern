const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Models
const Expense = require('./models/Expense');
const User = require('./models/User');

// Import Middleware
const authMiddleware = require('./models/authMiddleware');

const app = express();
const port = 5000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing JSON request bodies

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- AUTH ROUTES ---

// REGISTER A NEW USER (POST /api/auth/register)
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < 6) {
    return res.status(400).json({ message: 'Username and a password (min 6 chars) are required.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// LOGIN A USER (POST /api/auth/login)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET || 'fallback_secret_key'; // Use secret from .env
    const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour

    res.json({ token, message: 'Login successful!' });

  } catch (err) {
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

// --- EXPENSE API ROUTES (Protected) ---

// Apply authMiddleware to all routes below this point that start with /api/expenses
app.use('/api/expenses', authMiddleware);

// GET user's expenses
app.get('/api/expenses', async (req, res) => {
  try {
    // Find only expenses matching the logged-in user's ID from the middleware
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST (create) a new expense for the logged-in user
app.post('/api/expenses', async (req, res) => {
  const expense = new Expense({
    description: req.body.description,
    amount: req.body.amount,
    date: req.body.date,
    category: req.body.category,
    userId: req.userId // Associate the expense with the logged-in user
  });
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE user's expense by ID
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    // Find the expense by ID AND ensure it belongs to the logged-in user
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found or you do not have permission to delete it.' });
    }
    res.json({ message: 'Deleted Expense' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (update) user's expense by ID
app.put('/api/expenses/:id', async (req, res) => {
  // Exclude userId from being updated directly via req.body
  const { userId, ...updateData } = req.body;
  try {
    // Find the expense by ID, ensure it belongs to the user, and update it
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Filter criteria
      updateData, // The new data (without userId)
      { new: true } // Return the updated document
    );
     if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found or you do not have permission to update it.' });
    }
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});