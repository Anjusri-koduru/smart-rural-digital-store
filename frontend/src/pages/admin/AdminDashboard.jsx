import { useEffect, useState } from "react";
import {
  Users,
  Store,
  UserRound,
  ShoppingBag,
  Package,
  IndianRupee,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import {
  getAdminDashboard,
} from "../../services/adminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response =
          await getAdminDashboard();

        if (response.success) {
          setDashboard(response.dashboard);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load admin dashboard"
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
      <div className="admin-page">
        <h2>
          Unable to load admin dashboard
        </h2>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}

      <div className="admin-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage Smart Rural Digital Store
          </p>
        </div>
      </div>


      {/* Statistics */}

      <div className="admin-stat-grid">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Users />
          </div>

          <div>
            <span>Total Users</span>
            <strong>
              {dashboard.totalUsers || 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Store />
          </div>

          <div>
            <span>Total Sellers</span>
            <strong>
              {dashboard.totalSellers || 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <UserRound />
          </div>

          <div>
            <span>Total Customers</span>
            <strong>
              {dashboard.totalCustomers || 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Package />
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {dashboard.totalProducts || 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <ShoppingBag />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>
              {dashboard.totalOrders || 0}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <IndianRupee />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{dashboard.totalRevenue || 0}
            </strong>
          </div>
        </div>

      </div>


      {/* Quick Management */}

      <div className="admin-section">

        <h2>Quick Management</h2>

        <div className="admin-action-grid">

          <Link
            to="/admin/users"
            className="admin-action-card"
          >
            <Users size={28} />

            <strong>All Users</strong>

            <span>
              View registered users
            </span>
          </Link>


          <Link
            to="/admin/sellers"
            className="admin-action-card"
          >
            <Store size={28} />

            <strong>All Sellers</strong>

            <span>
              View seller accounts
            </span>
          </Link>


          <Link
            to="/admin/customers"
            className="admin-action-card"
          >
            <UserRound size={28} />

            <strong>All Customers</strong>

            <span>
              View customer accounts
            </span>
          </Link>


          {/* Coupons */}

          <Link
            to="/admin/coupons"
            className="admin-action-card"
          >
            <Tag size={28} />

            <strong>Coupons</strong>

            <span>
              Create and manage coupons
            </span>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;