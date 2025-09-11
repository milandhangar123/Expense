import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        console.error("Failed to fetch transactions:", res.status);
        setTransactions([]);
        return;
      }

      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Delete failed" }));
        alert(err.message || "Failed to delete");
        return;
      }

      fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting transaction");
    }
  };

  // Calculate statistics
  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch = categoryFilter ? 
      t.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
    const typeMatch = typeFilter === "all" ? true :
      typeFilter === "income" ? t.amount > 0 : t.amount < 0;
    return categoryMatch && typeMatch;
  });

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  const balance = totalIncome - totalExpenses;

  const categories = [...new Set(transactions.map(t => t.category))];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading transactions...
      </div>
    );
  }

  return (
    <div>
      <h1>💰 Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value positive">₹{totalIncome.toFixed(2)}</div>
          <div className="stat-label">Total Income</div>
        </div>
        <div className="stat-card">
          <div className="stat-value negative">₹{totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            ₹{balance.toFixed(2)}
          </div>
          <div className="stat-label">Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{transactions.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-container">
        <h3>Filter Transactions</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Transactions</h3>
        </div>
        <div className="card-body">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No transactions found</h3>
              <p>
                {transactions.length === 0 
                  ? "Start by adding your first transaction!" 
                  : "Try adjusting your filters to see more transactions."}
              </p>
              {transactions.length === 0 && (
                <Link to="/add" className="btn btn-primary">
                  Add Transaction
                </Link>
              )}
            </div>
          ) : (
            <ul className="transaction-list">
              {filteredTransactions.map((t) => (
                <li key={t._id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-title">{t.title}</div>
                    <div className="transaction-details">
                      <span>📅 {new Date(t.date).toLocaleDateString()}</span>
                      <span>🏷️ {t.category}</span>
                    </div>
                  </div>
                  <div className="transaction-amount-container">
                    <div className={`transaction-amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                      {t.amount >= 0 ? '+' : ''}₹{Math.abs(t.amount).toFixed(2)}
                    </div>
                    <div className="transaction-actions">
                      <Link to={`/${t._id}/edit`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(t._id)} 
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
