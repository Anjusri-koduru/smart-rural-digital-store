const CartSummary = ({
  items,
  onClear,
}) => {
  const subtotal =
    items?.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0
    ) || 0;

  return (
    <div className="cart-summary">

      <h2>Cart Summary</h2>

      <div className="summary-row">
        <span>Items</span>

        <span>
          {items?.reduce(
            (total, item) =>
              total + item.quantity,
            0
          ) || 0}
        </span>
      </div>

      <div className="summary-row">
        <span>Subtotal</span>

        <strong>
          ₹{subtotal}
        </strong>
      </div>

      <div className="summary-divider" />

      <div className="summary-total">
        <span>Total</span>

        <strong>
          ₹{subtotal}
        </strong>
      </div>

      <button
        className="checkout-button"
        onClick={() => {
          window.location.href =
            "/checkout";
        }}
      >
        Proceed to Checkout
      </button>

      <button
        className="clear-cart-button"
        onClick={onClear}
      >
        Clear Cart
      </button>

    </div>
  );
};

export default CartSummary;