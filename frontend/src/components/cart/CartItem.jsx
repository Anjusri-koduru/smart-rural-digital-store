import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

const BACKEND_URL = "https://smart-rural-digital-store.onrender.com";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const product = item.product;

  if (!product) {
    return null;
  }

  const imageUrl = product.image
    ? `${BACKEND_URL}${product.image}`
    : "/logo.png";

  return (
    <div className="cart-item">

      <img
        src={imageUrl}
        alt={product.name}
        className="cart-item-image"
      />

      <div className="cart-item-info">

        <h3>{product.name}</h3>

        <p className="cart-item-category">
          {product.category}
        </p>

        <strong>
          ₹{product.price}
        </strong>

        <div className="cart-quantity">

          <button
            onClick={() =>
              onDecrease(
                product._id,
                item.quantity
              )
            }
            disabled={
              item.quantity <= 1
            }
          >
            <Minus size={16} />
          </button>

          <span>
            {item.quantity}
          </span>

          <button
            onClick={() =>
              onIncrease(
                product._id,
                item.quantity
              )
            }
            disabled={
              item.quantity >=
              product.quantity
            }
          >
            <Plus size={16} />
          </button>

        </div>

      </div>

      <div className="cart-item-right">

        <strong>
          ₹{product.price * item.quantity}
        </strong>

        <button
          className="remove-cart-button"
          onClick={() =>
            onRemove(product._id)
          }
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
};

export default CartItem;