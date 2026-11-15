import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <Link to="/" className="site-footer-logo">
        <img
          src="/logo.png"
          alt="Smart Rural Digital Store"
        />

        <span>
          <strong>Smart Rural Digital Store</strong>
          <small>Connecting rural India digitally</small>
        </span>
      </Link>

      <div className="site-footer-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/recommendations">Recommendations</Link>
        <Link to="/register">Create Account</Link>
      </div>

      <p>
        © {new Date().getFullYear()} Smart Rural Digital Store.
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;