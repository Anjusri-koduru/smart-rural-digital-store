
import {
  ShoppingBag,
  Store,
  Users,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <div className="home-badge">
              <div className="home-badge-logo">
                <img
                  src="/logo.png"
                  alt="Smart Rural Digital Store"
                />
              </div>

              <span>Empowering Rural India</span>
            </div>

            <h1>
              Smart Rural
              <span> Digital Store</span>
            </h1>

            <p>
              A simple digital marketplace connecting
              rural sellers, farmers, artisans and
              customers in one place.
            </p>

            <div className="home-hero-buttons">
              <Link
                to="/products"
                className="home-primary-button"
              >
                <ShoppingBag size={19} />
                Explore Products
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="home-secondary-button"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="home-hero-card">
            <div className="home-logo-circle">
              <img
                src="/logo.png"
                alt="Smart Rural Digital Store"
              />
            </div>

            <h2>Rural Products</h2>

            <p>
              Directly from local sellers to customers.
            </p>

            <div className="home-mini-stats">
              <div>
                <strong>3</strong>
                <span>Roles</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Marketplace</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="home-section">
        <div className="home-section-heading">
          <span>Why Smart Rural Digital Store?</span>

          <h2>Everything in one place</h2>

          <p>
            Designed to make rural e-commerce
            simple, accessible and useful.
          </p>
        </div>

        <div className="home-features">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Store size={28} />
            </div>

            <h3>Local Sellers</h3>

            <p>
              Rural sellers can showcase their
              products directly to customers.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">
              <ShoppingBag size={28} />
            </div>

            <h3>Easy Shopping</h3>

            <p>
              Customers can discover products,
              add them to cart and place orders.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Users size={28} />
            </div>

            <h3>Three User Roles</h3>

            <p>
              Customer, Seller and Admin roles
              work together in one platform.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-how-section">
        <div className="home-section-heading">
          <span>Simple Process</span>
          <h2>How it works</h2>
        </div>

        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-number">1</div>

            <h3>Create Account</h3>

            <p>
              Register as a customer or seller.
            </p>
          </div>

          <div className="home-step">
            <div className="home-step-number">2</div>

            <h3>Explore Products</h3>

            <p>
              Find products from rural sellers.
            </p>
          </div>

          <div className="home-step">
            <div className="home-step-number">3</div>

            <h3>Place Order</h3>

            <p>
              Add products to cart and checkout.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="home-benefits-section">
        <div className="home-benefits-content">
          <div>
            <span className="home-small-title">
              Built for Rural Commerce
            </span>

            <h2>
              Helping local businesses grow digitally.
            </h2>

            <p>
              Smart Rural Digital Store helps rural
              sellers reach more customers while giving
              customers a convenient way to discover
              local products.
            </p>

            <Link
              to="/register"
              className="home-benefit-button"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="home-benefit-list">
            <div>
              <ShieldCheck size={23} />

              <span>
                Secure user authentication
              </span>
            </div>

            <div>
              <Truck size={23} />

              <span>
                Simple order management
              </span>
            </div>

            <div>
              <Star size={23} />

              <span>
                Product ratings and reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="home-cta">
        <h2>Ready to explore rural products?</h2>

        <p>
          Discover products and support local sellers.
        </p>

        <Link
          to="/products"
          className="home-cta-button"
        >
          Start Shopping
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default Home;
