import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { API_ENDPOINTS } from "../config/api";

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(API_ENDPOINTS.TRANSACTIONS.BY_ID(id), {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          if (res.status === 404) {
            setError("Transaction not found");
          } else if (res.status === 403) {
            setError("You don't have permission to edit this transaction");
          } else {
            setError("Failed to load transaction");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setTransaction(data);
      } catch (err) {
          console.error("EditTransaction load error:", err, "request:", API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
          const msg = err?.message || String(err);
          setError(`Network error: ${msg} (request: ${API_ENDPOINTS.TRANSACTIONS.BY_ID(id)})`);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line
  }, [id, navigate]);

  const handleUpdate = async (updatedTransaction) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(API_ENDPOINTS.TRANSACTIONS.BY_ID(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updatedTransaction),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Update failed" }));
        setError(err.message || "Failed to update transaction");
        setLoading(false);
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("EditTransaction update error:", err, "request:", API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
      const msg = err?.message || String(err);
      setError(`Network error: ${msg} (request: ${API_ENDPOINTS.TRANSACTIONS.BY_ID(id)})`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading transaction...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Edit Transaction</h1>
        <div className="error">{error}</div>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Transaction</h1>
      {transaction ? (
        <TransactionForm onSubmit={handleUpdate} initialData={transaction} loading={loading} />
      ) : (
        <div className="error">Transaction not found</div>
      )}
    </div>
  );
}

export default EditTransaction;
