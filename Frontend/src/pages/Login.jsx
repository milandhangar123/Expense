import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = API_ENDPOINTS.AUTH.LOGIN;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError(`Server error: ${res.status} ${res.statusText}`);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        if (res.status === 401) {
          setError(data.message || "Invalid email or password");
        } else if (res.status === 400) {
          setError(data.message || "Please check your input");
        } else if (res.status === 500) {
          setError(data.message || "Server error. Please try again later.");
        } else if (res.status === 0 || res.status === 404) {
          setError("Cannot connect to server. Please check if the backend is running.");
        } else {
          setError(data.message || `Login failed (${res.status}). Please try again.`);
        }
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ 
          _id: data._id, 
          name: data.name, 
          email: data.email 
        }));
        // Dispatch event to update navigation
        window.dispatchEvent(new Event("userChanged"));
        navigate("/");
      } else {
        setError("Login failed: no token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to server. Please check if the backend is running at https://expense-eo6k.onrender.com");
      } else {
        setError(`Network error: ${err.message}. Please check your connection.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>
      <div className="auth-body">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
      <div className="auth-footer">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
}

export default Login;
