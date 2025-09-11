import { useState } from "react";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Gas & Fuel",
  "Insurance",
  "Rent/Mortgage",
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other"
];

const TransactionForm = ({ onSubmit, initialData, loading = false }) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState(initialData?.amount ?? "");
  const [date, setDate] = useState(() => {
    if (!initialData?.date) return "";
    const d = typeof initialData.date === "string" ? initialData.date : new Date(initialData.date).toISOString();
    return d.slice(0, 10);
  });
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title || amount === "" || !date || !category) {
      setError("Please fill all fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount)) {
      setError("Amount must be a number");
      return;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      setError("Invalid date");
      return;
    }

    const newTransaction = {
      title,
      amount: parsedAmount,
      date: parsedDate.toISOString(),
      category,
    };

    onSubmit(newTransaction);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{initialData ? "Edit Transaction" : "Add New Transaction"}</h2>
      </div>
      <div className="form-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter transaction title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
            <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Use positive for income, negative for expenses
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                {initialData ? "Updating..." : "Adding..."}
              </>
            ) : (
              initialData ? "Update Transaction" : "Add Transaction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
