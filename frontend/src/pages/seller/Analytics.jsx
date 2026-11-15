import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";

import {
  getSellerDashboardData,
} from "../../services/dashboardService";

const Analytics = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response =
          await getSellerDashboardData();

        if (response.success) {
          setDashboard(response.dashboard);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!dashboard) {
    return (
      <div className="seller-page">
        <h2>
          Analytics unavailable
        </h2>
      </div>
    );
  }

  const maxValue = Math.max(
    dashboard.totalProducts || 1,
    dashboard.totalOrders || 1,
    dashboard.totalItemsSold || 1,
    dashboard.deliveredOrders || 1,
    1
  );

  return (
    <div className="seller-page">

      <div className="seller-page-header">

        <div>
          <h1>Sales Analytics</h1>

          <p>
            Overview of your store performance
          </p>
        </div>

      </div>

      <div className="analytics-stat-grid">

        <div className="analytics-stat-card">

          <Package />

          <span>
            Products
          </span>

          <strong>
            {dashboard.totalProducts}
          </strong>

        </div>

        <div className="analytics-stat-card">

          <ShoppingBag />

          <span>
            Orders
          </span>

          <strong>
            {dashboard.totalOrders}
          </strong>

        </div>

        <div className="analytics-stat-card">

          <IndianRupee />

          <span>
            Revenue
          </span>

          <strong>
            ₹{dashboard.totalRevenue || 0}
          </strong>

        </div>

        <div className="analytics-stat-card">

          <Truck />

          <span>
            Items Sold
          </span>

          <strong>
            {dashboard.totalItemsSold}
          </strong>

        </div>

      </div>

      <div className="analytics-card">

        <h2>
          Store Performance
        </h2>

        <div className="analytics-chart">

          <div className="chart-item">

            <div className="chart-label">
              <span>
                Products
              </span>

              <strong>
                {dashboard.totalProducts}
              </strong>
            </div>

            <div className="chart-track">

              <div
                className="chart-bar"
                style={{
                  width: `${
                    ((dashboard.totalProducts ||
                      0) /
                      maxValue) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          <div className="chart-item">

            <div className="chart-label">
              <span>
                Orders
              </span>

              <strong>
                {dashboard.totalOrders}
              </strong>
            </div>

            <div className="chart-track">

              <div
                className="chart-bar"
                style={{
                  width: `${
                    ((dashboard.totalOrders ||
                      0) /
                      maxValue) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          <div className="chart-item">

            <div className="chart-label">
              <span>
                Items Sold
              </span>

              <strong>
                {dashboard.totalItemsSold}
              </strong>
            </div>

            <div className="chart-track">

              <div
                className="chart-bar"
                style={{
                  width: `${
                    ((dashboard.totalItemsSold ||
                      0) /
                      maxValue) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          <div className="chart-item">

            <div className="chart-label">
              <span>
                Delivered Orders
              </span>

              <strong>
                {dashboard.deliveredOrders}
              </strong>
            </div>

            <div className="chart-track">

              <div
                className="chart-bar"
                style={{
                  width: `${
                    ((dashboard.deliveredOrders ||
                      0) /
                      maxValue) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;