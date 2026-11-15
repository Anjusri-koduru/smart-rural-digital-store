import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import {
  getSellerDashboardData,
} from "../../services/dashboardService";

const SellerDashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response =
          await getSellerDashboardData();

        if (response.success) {
          setDashboard(response.dashboard);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load seller dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!dashboard) {
    return (
      <div className="seller-page">
        <h2>Unable to load dashboard</h2>
      </div>
    );
  }

  return (
    <div className="seller-page">

      <div className="seller-page-header">

        <div>
          <h1>Seller Dashboard</h1>
          <p>
            Manage your products and orders
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="seller-primary-button"
        >
          + Add Product
        </Link>

      </div>

      <div className="seller-stat-grid">

        <div className="seller-stat-card">
          <div className="seller-stat-icon">
            <Package />
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {dashboard.totalProducts}
            </strong>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon">
            <CheckCircle />
          </div>

          <div>
            <span>Available Products</span>
            <strong>
              {dashboard.availableProducts}
            </strong>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon">
            <AlertTriangle />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>
              {dashboard.outOfStockProducts}
            </strong>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon">
            <ShoppingBag />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>
              {dashboard.totalOrders}
            </strong>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon">
            <IndianRupee />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{dashboard.totalRevenue || 0}
            </strong>
          </div>
        </div>

        <div className="seller-stat-card">
          <div className="seller-stat-icon">
            <Truck />
          </div>

          <div>
            <span>Pending Orders</span>
            <strong>
              {dashboard.pendingOrders}
            </strong>
          </div>
        </div>

      </div>

      <div className="seller-dashboard-sections">

        <div className="seller-dashboard-card">

          <div className="seller-section-header">
            <h2>Sales Overview</h2>

            <Link to="/seller/analytics">
              View Analytics
            </Link>
          </div>

          <div className="seller-overview-grid">

            <div>
              <span>Items Sold</span>
              <strong>
                {dashboard.totalItemsSold}
              </strong>
            </div>

            <div>
              <span>Delivered Orders</span>
              <strong>
                {dashboard.deliveredOrders}
              </strong>
            </div>

            <div>
              <span>Revenue</span>
              <strong>
                ₹{dashboard.totalRevenue || 0}
              </strong>
            </div>

          </div>

        </div>

        <div className="seller-dashboard-card">

          <div className="seller-section-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="seller-quick-actions">

            <Link to="/seller/products">
              My Products
            </Link>

            <Link to="/seller/orders">
              My Orders
            </Link>

            <Link to="/seller/profile">
              Seller Profile
            </Link>

            <Link to="/seller/analytics">
              Analytics
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SellerDashboard;