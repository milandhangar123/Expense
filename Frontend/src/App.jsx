import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (err) {
          console.error("Error parsing user data:", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkUser);

    // Listen for custom event when user logs in/out in same tab
    window.addEventListener("userChanged", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userChanged", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Dispatch event to update navigation
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  if (!user) {
    return (
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          💰 Finance Tracker
        </Link>
        <div className="navbar-nav">
          <Link to="/login" className={isActive("/login")}>
            Login
          </Link>
          <Link to="/register" className={isActive("/register")}>
            Register
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        💰 Finance Tracker
      </Link>
      <div className="navbar-nav">
        <Link to="/" className={isActive("/")}>
          Dashboard
        </Link>
        <Link to="/add" className={isActive("/add")}>
          Add Transaction
        </Link>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/:id/edit" element={<EditTransaction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
