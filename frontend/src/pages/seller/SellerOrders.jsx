import { useEffect, useState } from "react";
import {
  Package,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import OrderStatus from "../../components/order/OrderStatus";

import {
  getSellerOrders,
  updateOrderStatus,
} from "../../services/orderService";

const SellerOrders = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response =
        await getSellerOrders();

      if (response.success) {
        setOrders(
          response.orders || []
        );
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

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      const response =
        await updateOrderStatus(
          orderId,
          status
        );

      if (response.success) {
        toast.success(
          "Order status updated"
        );

        fetchOrders();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="seller-page">

      <div className="seller-page-header">

        <div>
          <h1>Seller Orders</h1>

          <p>
            Manage customer orders
          </p>
        </div>

      </div>

      {orders.length === 0 ? (
        <div className="seller-empty-state">

          <Package size={65} />

          <h2>No Orders Yet</h2>

          <p>
            Customer orders will appear here.
          </p>

        </div>
      ) : (
        <div className="seller-orders-list">

          {orders.map((order) => (

            <div
              className="seller-order-card"
              key={order._id}
            >

              <div className="seller-order-header">

                <div>
                  <span>Order ID</span>

                  <strong>
                    {order._id}
                  </strong>
                </div>

                <OrderStatus
                  status={
                    order.orderStatus
                  }
                />

              </div>

              <div className="seller-order-customer">

                <div>
                  <User size={18} />
                  <span>
                    {order.customer?.name ||
                      "Customer"}
                  </span>
                </div>

                <div>
                  <Calendar size={18} />
                  <span>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </span>
                </div>

              </div>

              <div className="seller-order-items">

                {order.items?.map(
                  (item, index) => (
                    <div
                      className="seller-order-item"
                      key={`${item.product?._id || item.product}-${index}`}
                    >

                      <div>
                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          Qty:{" "}
                          {item.quantity}
                        </span>
                      </div>

                      <strong>
                        ₹{item.subtotal}
                      </strong>

                    </div>
                  )
                )}

              </div>

              <div className="seller-order-footer">

                <strong className="seller-order-total">
                  Total: ₹
                  {order.totalAmount}
                </strong>

                <Link
                  to={`/orders/${order._id}`}
                  className="seller-view-order"
                >
                  View Order
                </Link>

                {order.orderStatus !==
                  "cancelled" &&
                  order.orderStatus !==
                    "delivered" && (
                    <select
                      value={
                        order.orderStatus
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="placed">
                        Placed
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="packed">
                        Packed
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>
                    </select>
                  )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default SellerOrders;