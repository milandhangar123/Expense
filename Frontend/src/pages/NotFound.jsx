import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
