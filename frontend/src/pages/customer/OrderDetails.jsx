import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import OrderStatus from "../../components/order/OrderStatus";

import {
  getOrderById,
  cancelOrder,
} from "../../services/orderService";

const BACKEND_URL = "https://smart-rural-digital-store.onrender.com";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await getOrderById(id);

      if (response.success) {
        setOrder(response.order);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await cancelOrder(id);

      if (response.success) {
        toast.success(
          "Order cancelled successfully"
        );

        fetchOrder();
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

  if (!order) {
    return (
      <div className="empty-orders">

        <h2>Order Not Found</h2>

        <Link to="/orders">
          Back to My Orders
        </Link>

      </div>
    );
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString(
        "en-IN"
      )
    : "-";

  const canCancel = [
    "placed",
    "confirmed",
    "packed",
  ].includes(order.orderStatus);

  return (
    <div className="order-details-page">

      <Link
        to="/orders"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to My Orders
      </Link>

      <div className="order-details-header">

        <div>
          <h1>Order Details</h1>

          <p>
            Order ID:{" "}
            <strong>{order._id}</strong>
          </p>
        </div>

        <OrderStatus
          status={order.orderStatus}
        />

      </div>

      {/* Order information */}

      <div className="order-info-grid">

        <div className="order-info-card">

          <Calendar size={22} />

          <div>
            <span>Order Date</span>
            <strong>{orderDate}</strong>
          </div>

        </div>

        <div className="order-info-card">

          <CreditCard size={22} />

          <div>
            <span>Payment Method</span>
            <strong>
              {order.paymentMethod}
            </strong>
          </div>

        </div>

        <div className="order-info-card">

          <CreditCard size={22} />

          <div>
            <span>Payment Status</span>
            <strong>
              {order.paymentStatus}
            </strong>
          </div>

        </div>

      </div>

      {/* Products */}

      <div className="order-details-section">

        <h2>
          <Package size={22} />
          Ordered Products
        </h2>

        <div className="order-items">

          {order.items?.map((item, index) => {

            const imageUrl = item.image
              ? `${BACKEND_URL}${item.image}`
              : "/logo.png";

            return (
              <div
                className="order-detail-item"
                key={`${item.product?._id || item.product}-${index}`}
              >

                <div className="order-detail-image">

                  <img
                    src={imageUrl}
                    alt={item.productName}
                  />

                </div>

                <div className="order-detail-product">

                  <h3>
                    {item.productName}
                  </h3>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <p>
                    Price: ₹{item.price}
                  </p>

                </div>

                <strong className="order-item-subtotal">
                  ₹{item.subtotal}
                </strong>

              </div>
            );
          })}

        </div>

        <div className="order-total">

          <span>Total Amount</span>

          <strong>
            ₹{order.totalAmount}
          </strong>

        </div>

      </div>

      {/* Shipping Address */}

      <div className="order-details-section">

        <h2>
          <MapPin size={22} />
          Shipping Address
        </h2>

        <div className="shipping-address">

          <strong>
            {order.shippingAddress?.name}
          </strong>

          <p>
            {order.shippingAddress?.phone}
          </p>

          <p>
            {order.shippingAddress?.addressLine}
          </p>

          <p>
            {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state}
          </p>

          <p>
            Pincode:{" "}
            {order.shippingAddress?.pincode}
          </p>

        </div>

      </div>

      {/* Actions */}

      <div className="order-details-actions">

        <Link
          to="/products"
          className="continue-shopping-button"
        >
          Continue Shopping
        </Link>

        {canCancel && (
          <button
            className="order-cancel-button large"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderDetails;