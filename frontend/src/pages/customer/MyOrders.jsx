import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import toast from "react-hot-toast";

import OrderCard from "../../components/order/OrderCard";
import Loader from "../../components/common/Loader";

import {
  getMyOrders,
  cancelOrder,
} from "../../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getMyOrders();

      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await cancelOrder(orderId);

      if (response.success) {
        toast.success(
          "Order cancelled successfully"
        );

        fetchOrders();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="orders-page">

      <div className="orders-page-header">

        <div>
          <h1>My Orders</h1>

          <p>
            Track and manage your orders
          </p>
        </div>

        <Link
          to="/products"
          className="continue-shopping-button"
        >
          Continue Shopping
        </Link>

      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">

          <PackageOpen size={70} />

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Browse Products
          </Link>

        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onCancel={handleCancelOrder}
            />
          ))}

        </div>
      )}

    </div>
  );
};

export default MyOrders;