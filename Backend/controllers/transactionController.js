import Transaction from "../models/Transaction.js";

// contains actual DB logic

export const getTransactions = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Not found" });

    // ownership check (requires auth middleware that sets req.user)
    if (!req.user || transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Scope to authenticated user
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addTransaction = async (req, res) => {
  const { title, amount, date, category } = req.body;

  // ensure amount is provided (0 is valid)
  if (!title || amount == null || !date || !category) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const numAmount = Number(amount);
  if (Number.isNaN(numAmount)) {
    return res.status(400).json({ message: "Amount must be a number" });
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "Invalid date" });
  }

  try {
    // Ensure user is authenticated (should be guaranteed by protect middleware, but double-check)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const newTransaction = new Transaction({
      title,
      amount: numAmount,
      date: parsedDate,
      category,
      user: req.user.id,
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Add transaction error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // ownership check
    if (!req.user || transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, amount, date, category } = req.body;
    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (Number.isNaN(numAmount)) return res.status(400).json({ message: "Amount must be a number" });
      transaction.amount = numAmount;
    }
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Invalid date" });
      transaction.date = parsedDate;
    }
    if (category !== undefined) transaction.category = category;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ownership check
    if (!req.user || transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
