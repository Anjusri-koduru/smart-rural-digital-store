import { Link } from "react-router-dom";
import { Package, Calendar, IndianRupee } from "lucide-react";

import OrderStatus from "./OrderStatus";

const BACKEND_URL = "https://smart-rural-digital-store.onrender.com";

const OrderCard = ({ order, onCancel }) => {
  const firstItem = order.items?.[0];

  const imageUrl = firstItem?.image
    ? `${BACKEND_URL}${firstItem.image}`
    : "/logo.png";

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : "-";

  return (
    <div className="order-card">

      <div className="order-card-header">

        <div className="order-id">
          <Package size={20} />

          <div>
            <span>Order ID</span>
            <strong>{order._id}</strong>
          </div>
        </div>

        <OrderStatus status={order.orderStatus} />

      </div>

      <div className="order-card-body">

        <div className="order-product-image">
          <img
            src={imageUrl}
            alt={firstItem?.productName || "Product"}
          />
        </div>

        <div className="order-product-info">

          <h3>
            {firstItem?.productName || "Product"}
          </h3>

          {order.items?.length > 1 && (
            <p>
              + {order.items.length - 1} more item
              {order.items.length - 1 > 1 ? "s" : ""}
            </p>
          )}

          <div className="order-meta">

            <span>
              <Calendar size={15} />
              {orderDate}
            </span>

            <span>
              <IndianRupee size={15} />
              {order.totalAmount}
            </span>

          </div>

        </div>

      </div>

      <div className="order-card-footer">

        <Link
          to={`/orders/${order._id}`}
          className="order-view-button"
        >
          View Details
        </Link>

        {["placed", "confirmed", "packed"].includes(
          order.orderStatus
        ) && (
          <button
            className="order-cancel-button"
            onClick={() => onCancel(order._id)}
          >
            Cancel Order
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderCard;