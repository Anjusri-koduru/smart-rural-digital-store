import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAddresses } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import {
  getCart,
  clearCart,
} from "../../services/cartService";

import Loader from "../../components/common/Loader";

const BACKEND_URL = "https://smart-rural-digital-store.onrender.com";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] =
    useState(false);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);

      const [cartResponse, addressResponse] =
        await Promise.all([
          getCart(),
          getAddresses(),
        ]);

      if (cartResponse.success) {
        setCart(cartResponse.cart);
      }

      if (addressResponse.success) {
        const savedAddresses =
          addressResponse.addresses || [];

        setAddresses(savedAddresses);

        const defaultAddress =
          savedAddresses.find(
            (address) => address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddress(
            defaultAddress
          );
        } else if (
          savedAddresses.length > 0
        ) {
          setSelectedAddress(
            savedAddresses[0]
          );
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) => {
      const price =
        item.product?.price || 0;

      return (
        total +
        price * item.quantity
      );
    },
    0
  );

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error(
        "Please select a delivery address"
      );
      return;
    }

    if (items.length === 0) {
      toast.error(
        "Your cart is empty"
      );
      return;
    }

    const orderItems = items.map(
      (item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })
    );

    const shippingAddress = {
      name: selectedAddress.name,
      phone: selectedAddress.phone,
      addressLine:
        selectedAddress.addressLine,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode:
        selectedAddress.pincode,
    };

    try {
      setPlacingOrder(true);

      const response =
        await createOrder({
          items: orderItems,
          shippingAddress,
          paymentMethod,
        });

      if (response.success) {
        await clearCart();

        toast.success(
          "Order placed successfully!"
        );

        navigate(
          `/orders/${response.order._id}`
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="empty-checkout">

        <div className="empty-checkout-icon">
          <ShoppingBag size={50} />
        </div>

        <h2>
          Your cart is empty
        </h2>

        <p>
          Add some products before
          proceeding to checkout.
        </p>

        <Link
          to="/products"
          className="checkout-browse-button"
        >
          Browse Products
        </Link>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* Header */}
      <div className="checkout-header">

        <Link
          to="/cart"
          className="checkout-back-link"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <div>
          <h1>Checkout</h1>

          <p>
            Complete your order
          </p>
        </div>

      </div>


      <div className="checkout-layout">

        {/* LEFT */}
        <div className="checkout-left">

          {/* Address */}
          <section className="checkout-section">

            <div className="checkout-section-header">

              <div className="section-title">

                <MapPin size={21} />

                <h2>
                  Delivery Address
                </h2>

              </div>

              <Link
                to="/addresses"
                className="manage-address-link"
              >
                <Plus size={16} />
                Add Address
              </Link>

            </div>


            {addresses.length === 0 ? (

              <div className="no-address-checkout">

                <MapPin size={35} />

                <h3>
                  No delivery address
                </h3>

                <p>
                  Add an address to
                  continue.
                </p>

                <Link
                  to="/addresses"
                  className="add-checkout-address"
                >
                  Add Address
                </Link>

              </div>

            ) : (

              <div className="checkout-addresses">

                {addresses.map(
                  (address) => (

                    <button
                      key={address._id}
                      type="button"
                      className={`checkout-address-card ${
                        selectedAddress?._id ===
                        address._id
                          ? "selected-address"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedAddress(
                          address
                        )
                      }
                    >

                      <div className="address-radio">

                        {selectedAddress?._id ===
                          address._id && (
                          <CheckCircle
                            size={20}
                          />
                        )}

                      </div>


                      <div className="checkout-address-content">

                        <div className="checkout-address-name">

                          <strong>
                            {address.name}
                          </strong>

                          {address.isDefault && (
                            <span>
                              Default
                            </span>
                          )}

                        </div>

                        <p>
                          {address.addressLine}
                        </p>

                        <p>
                          {address.city},{" "}
                          {address.state} -{" "}
                          {address.pincode}
                        </p>

                        <p>
                          Phone:{" "}
                          {address.phone}
                        </p>

                      </div>

                    </button>

                  )
                )}

              </div>

            )}

          </section>


          {/* Payment */}
          <section className="checkout-section">

            <div className="section-title">

              <CreditCard size={21} />

              <h2>
                Payment Method
              </h2>

            </div>


            <div className="payment-options">

              <button
                type="button"
                className={`payment-option ${
                  paymentMethod === "COD"
                    ? "selected-payment"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("COD")
                }
              >

                <Banknote size={25} />

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <p>
                    Pay when your order
                    arrives
                  </p>
                </div>

                <div className="payment-radio">
                  {paymentMethod ===
                    "COD" && (
                    <CheckCircle size={20} />
                  )}
                </div>

              </button>


              <button
                type="button"
                className={`payment-option ${
                  paymentMethod === "ONLINE"
                    ? "selected-payment"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod(
                    "ONLINE"
                  )
                }
              >

                <CreditCard size={25} />

                <div>
                  <strong>
                    Online Payment
                  </strong>

                  <p>
                    Pay securely online
                  </p>
                </div>

                <div className="payment-radio">
                  {paymentMethod ===
                    "ONLINE" && (
                    <CheckCircle size={20} />
                  )}
                </div>

              </button>

            </div>

            {paymentMethod ===
              "ONLINE" && (
              <div className="online-note">
                Online payment gateway
                integration will be added
                later.
              </div>
            )}

          </section>

        </div>


        {/* RIGHT - ORDER SUMMARY */}
        <div className="checkout-summary">

          <div className="checkout-summary-header">

            <ShoppingBag size={21} />

            <h2>
              Order Summary
            </h2>

          </div>


          <div className="checkout-items">

            {items.map((item) => {

              const product =
                item.product;

              const imageUrl =
                product?.image
                  ? `${BACKEND_URL}${product.image}`
                  : "/logo.png";

              return (
                <div
                  className="checkout-item"
                  key={product?._id}
                >

                  <img
                    src={imageUrl}
                    alt={
                      product?.name
                    }
                  />

                  <div>
                    <h3>
                      {product?.name}
                    </h3>

                    <p>
                      Qty:{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {(
                      (product?.price ||
                        0) *
                      item.quantity
                    ).toFixed(2)}
                  </strong>

                </div>
              );
            })}

          </div>


          <div className="checkout-divider" />


          <div className="checkout-summary-row">
            <span>
              Items
            </span>

            <span>
              {totalItems}
            </span>
          </div>


          <div className="checkout-summary-row">
            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal.toFixed(2)}
            </span>
          </div>


          <div className="checkout-summary-row">
            <span>
              Delivery
            </span>

            <span className="free-delivery">
              FREE
            </span>
          </div>


          <div className="checkout-divider" />


          <div className="checkout-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>

          </div>


          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={
              placingOrder ||
              !selectedAddress
            }
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>


          {!selectedAddress && (
            <p className="checkout-warning">
              Please select a delivery
              address
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default Checkout;