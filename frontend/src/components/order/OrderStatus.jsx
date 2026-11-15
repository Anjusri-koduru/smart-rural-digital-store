const OrderStatus = ({ status }) => {
  const statusText = {
    placed: "Order Placed",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <span className={`order-status status-${status}`}>
      {statusText[status] || status}
    </span>
  );
};

export default OrderStatus;