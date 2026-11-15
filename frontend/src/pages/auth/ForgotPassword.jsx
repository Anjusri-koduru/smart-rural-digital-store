import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>

        <p className="auth-subtitle">
          Password recovery will be available soon.
        </p>

        <Link
          to="/login"
          className="auth-button back-button"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;