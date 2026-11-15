import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Loader from "../../components/common/Loader";

const Cart = () => {
  const {
    cart,
    loading,
    changeQuantity,
    removeProduct,
    emptyCart,
  } = useCart();

  const items = cart?.items || [];

  const handleIncrease = async (
    productId,
    quantity
  ) => {
    await changeQuantity(
      productId,
      quantity + 1
    );
  };

  const handleDecrease = async (
    productId,
    quantity
  ) => {
    if (quantity <= 1) return;

    await changeQuantity(
      productId,
      quantity - 1
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-page-header">

        <div className="cart-title-section">

          <div className="cart-title-icon">
            <ShoppingCart size={28} />
          </div>

          <div>
            <h1>My Cart</h1>

            <p>
              Review your selected products
              before checkout
            </p>
          </div>

        </div>

        {items.length > 0 && (
          <div className="cart-item-count">
            {items.reduce(
              (total, item) =>
                total + item.quantity,
              0
            )}{" "}
            items
          </div>
        )}

      </div>


      {/* Empty Cart */}
      {items.length === 0 ? (
        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingCart size={55} />
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="browse-products-button"
          >
            <ShoppingBag size={19} />
            Browse Products
          </Link>

        </div>
      ) : (

        /* Cart with Products */
        <div className="cart-layout">

          <div className="cart-left">

            <div className="cart-items-header">

              <h2>
                Cart Items
              </h2>

              <Link to="/products">
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

            </div>

            <div className="cart-items">

              {items.map((item) => (
                <CartItem
                  key={
                    item.product?._id ||
                    item._id
                  }
                  item={item}
                  onIncrease={
                    handleIncrease
                  }
                  onDecrease={
                    handleDecrease
                  }
                  onRemove={
                    removeProduct
                  }
                />
              ))}

            </div>

          </div>


          {/* Summary */}
          <CartSummary
            items={items}
            onClear={emptyCart}
          />

        </div>
      )}

    </div>
  );
};

export default Cart;