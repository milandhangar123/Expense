import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";

function AddTransaction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (transaction) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(API_ENDPOINTS.TRANSACTIONS.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(transaction),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to add transaction" }));
        setError(err.message || "Failed to add transaction");
        setLoading(false);
        return;
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Transaction</h1>
      {error && <div className="error">{error}</div>}
      <TransactionForm onSubmit={handleAdd} loading={loading} />
    </div>
  );
}

export default AddTransaction;
