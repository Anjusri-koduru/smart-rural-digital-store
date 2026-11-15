import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/cartService";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
      });
      return;
    }

    try {
      setLoading(true);

      const response = await getCart();

      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Cart loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProductToCart = async (
    productId,
    quantity = 1
  ) => {
    try {
      const response = await addToCart(
        productId,
        quantity
      );

      if (response.success) {
        setCart(response.cart);

        toast.success(
          "Product added to cart"
        );
      }

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );

      throw error;
    }
  };

  const changeQuantity = async (
    productId,
    quantity
  ) => {
    try {
      const response =
        await updateCartItem(
          productId,
          quantity
        );

      if (response.success) {
        setCart(response.cart);
      }

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update cart"
      );

      throw error;
    }
  };

  const removeProduct = async (
    productId
  ) => {
    try {
      const response =
        await removeFromCart(productId);

      if (response.success) {
        setCart(response.cart);

        toast.success(
          "Product removed from cart"
        );
      }

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product"
      );

      throw error;
    }
  };

  const emptyCart = async () => {
    try {
      const response = await clearCart();

      if (response.success) {
        setCart({
          items: [],
        });

        toast.success("Cart cleared");
      }

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to clear cart"
      );

      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const cartCount =
    cart?.items?.reduce(
      (total, item) =>
        total + item.quantity,
      0
    ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        fetchCart,
        addProductToCart,
        changeQuantity,
        removeProduct,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);