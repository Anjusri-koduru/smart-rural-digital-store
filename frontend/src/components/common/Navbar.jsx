import { useEffect, useState } from "react";

import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Bell,
  User,
  LogOut,
  UserRoundCog,
  Home,
  Store,
  ShieldCheck,
  Package,
  BarChart3,
  Star,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import {
  getUnreadNotificationCount,
} from "../../services/notificationService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const role = user?.role;

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  const fetchNotificationCount = async () => {
    try {
      const response = await getUnreadNotificationCount();

      if (response.success) {
        setNotificationCount(
          response.count || response.unreadCount || 0
        );
      }
    } catch (error) {
      console.error("Notification count error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  if (!user) return null;

  const handleLogout = async () => {
    closeMenu();

    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Unable to log out. Please try again.");
    }
  };

  const customerMenu = [
    { label: "Home", path: "/", icon: Home },
    { label: "Products", path: "/products", icon: Package },
    { label: "Recommendations", path: "/recommendations", icon: Star },
    { label: "Orders", path: "/orders", icon: Package },
  ];

  const sellerMenu = [
    { label: "Dashboard", path: "/seller/dashboard", icon: BarChart3 },
    { label: "Products", path: "/seller/products", icon: Package },
    { label: "Orders", path: "/seller/orders", icon: ShoppingCart },
    { label: "Analytics", path: "/seller/analytics", icon: BarChart3 },
  ];

  const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: ShieldCheck },
    { label: "Users", path: "/admin/users", icon: User },
    { label: "Sellers", path: "/admin/sellers", icon: Store },
    { label: "Customers", path: "/admin/customers", icon: User },
    { label: "Coupons", path: "/admin/coupons", icon: Package },
  ];

  const menuItems =
    role === "admin"
      ? adminMenu
      : role === "seller"
      ? sellerMenu
      : customerMenu;

  const profilePath =
    role === "admin"
      ? "/admin/profile"
      : role === "seller"
      ? "/seller/profile"
      : "/profile";

  const logoPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "seller"
      ? "/seller/dashboard"
      : "/";

  const showAccountSwitch =
    Array.isArray(user.roles) && user.roles.length > 1;

  const countLabel = (count) => (count > 99 ? "99+" : count);

  const actionLinkClass = (path, extra = "") =>
    `navbar-icon-button ${extra} ${isActive(path) ? "active" : ""}`;

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link
          to={logoPath}
          className="navbar-logo"
          onClick={closeMenu}
        >
          <img src="/logo.png" alt="Smart Rural Digital Store" />
          <span>
            Smart Rural
            <small>Digital Store</small>
          </span>
        </Link>

        {/* DESKTOP MAIN LINKS */}
        <div className="navbar-links">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="navbar-actions">
          {role === "customer" && (
            <>
              <Link
                to="/favorites"
                className={actionLinkClass("/favorites")}
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                <span className="navbar-action-label">Wishlist</span>
              </Link>

              <Link
                to="/cart"
                className={actionLinkClass("/cart", "navbar-badge-button")}
                title="Cart"
                aria-label="Cart"
              >
                <ShoppingCart size={19} />
                <span className="navbar-action-label">Cart</span>
                {cartCount > 0 && (
                  <span className="navbar-count">
                    {countLabel(cartCount)}
                  </span>
                )}
              </Link>
            </>
          )}

          <Link
            to="/notifications"
            className={actionLinkClass(
              "/notifications",
              "navbar-badge-button"
            )}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="navbar-action-label">Notifications</span>
            {notificationCount > 0 && (
              <span className="navbar-count notification-count">
                {countLabel(notificationCount)}
              </span>
            )}
          </Link>

          <Link
            to={profilePath}
            className={`navbar-profile ${isActive(profilePath) ? "active" : ""}`}
            title="Profile"
          >
            <User size={18} />
            <span>{user.name}</span>
          </Link>

          {showAccountSwitch && (
            <Link
              to="/account/switch"
              className={actionLinkClass(
                "/account/switch",
                "navbar-account-switch"
              )}
              title="Switch Account"
              aria-label="Switch Account"
            >
              <UserRoundCog size={19} />
              <span className="navbar-action-label">Switch Account</span>
            </Link>
          )}

          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={19} />
          </button>

          <button
            type="button"
            className="navbar-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-navbar-menu">
          <div className="mobile-user-info">
            <div className="mobile-user-icon">
              <User size={24} />
            </div>
            <div>
              <strong>{user.name}</strong>
              <span>{role}</span>
            </div>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`mobile-navbar-link ${isActive(item.path) ? "active" : ""}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {role === "customer" && (
            <>
              <Link
                to="/favorites"
                onClick={closeMenu}
                className={`mobile-navbar-link ${isActive("/favorites") ? "active" : ""}`}
              >
                <Heart size={18} />
                Wishlist
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className={`mobile-navbar-link ${isActive("/cart") ? "active" : ""}`}
              >
                <ShoppingCart size={18} />
                Cart
                {cartCount > 0 && (
                  <span className="mobile-count">
                    {countLabel(cartCount)}
                  </span>
                )}
              </Link>

              <Link
                to="/following-sellers"
                onClick={closeMenu}
                className={`mobile-navbar-link ${isActive("/following-sellers") ? "active" : ""}`}
              >
                <Store size={18} />
                Following Sellers
              </Link>
            </>
          )}

          <Link
            to="/notifications"
            onClick={closeMenu}
            className={`mobile-navbar-link ${isActive("/notifications") ? "active" : ""}`}
          >
            <Bell size={18} />
            Notifications
            {notificationCount > 0 && (
              <span className="mobile-count">
                {countLabel(notificationCount)}
              </span>
            )}
          </Link>

          <Link
            to={profilePath}
            onClick={closeMenu}
            className={`mobile-navbar-link ${isActive(profilePath) ? "active" : ""}`}
          >
            <User size={18} />
            Profile
          </Link>

          {showAccountSwitch && (
            <Link
              to="/account/switch"
              onClick={closeMenu}
              className={`mobile-navbar-link ${isActive("/account/switch") ? "active" : ""}`}
            >
              <UserRoundCog size={18} />
              Switch Account
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="mobile-logout-button"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;