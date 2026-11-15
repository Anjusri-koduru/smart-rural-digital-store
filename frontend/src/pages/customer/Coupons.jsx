import { useEffect, useState } from "react";
import {
  CheckCircle,
  Copy,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  applyCoupon,
  getCoupons,
} from "../../services/couponService";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [orderAmount, setOrderAmount] = useState("");

  const [discount, setDiscount] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);

        // Customer apply API is the important
        // customer coupon API.
        // GET /coupons is admin-only,
        // so customer coupon list is optional.

        setCoupons([]);
      } catch (error) {
        console.error(
          "Coupons error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter coupon code");
      return;
    }

    if (!orderAmount || Number(orderAmount) <= 0) {
      toast.error("Please enter order amount");
      return;
    }

    try {
      setApplying(true);
      setDiscount(null);

      const response = await applyCoupon(
        code.trim(),
        Number(orderAmount)
      );

      if (response.success) {
        setDiscount(response);

        toast.success(
          "Coupon applied successfully"
        );
      } else {
        toast.error(
          response.message ||
            "Unable to apply coupon"
        );
      }
    } catch (error) {
      console.error(
        "Apply coupon error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Invalid coupon code"
      );
    } finally {
      setApplying(false);
    }
  };

  const copyCode = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(
        couponCode
      );

      toast.success("Coupon code copied");
    } catch {
      toast.error("Unable to copy code");
    }
  };

  return (
    <div className="coupon-page">

      <div className="coupon-page-header">
        <div className="coupon-page-icon">
          <Tag size={25} />
        </div>

        <div>
          <h1>Coupons & Offers</h1>
          <p>
            Apply a coupon and save on your order
          </p>
        </div>
      </div>

      <div className="coupon-apply-card">

        <h2>Apply Coupon</h2>

        <form
          onSubmit={handleApplyCoupon}
          className="coupon-form"
        >
          <input
            type="text"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            placeholder="Enter coupon code"
          />

          <input
            type="number"
            value={orderAmount}
            onChange={(event) =>
              setOrderAmount(event.target.value)
            }
            placeholder="Order amount"
            min="0"
          />

          <button
            type="submit"
            disabled={applying}
          >
            {applying
              ? "Applying..."
              : "Apply Coupon"}
          </button>
        </form>

        {discount && (
          <div className="coupon-success">

            <CheckCircle size={22} />

            <div>
              <strong>
                {discount.code}
              </strong>

              <p>
                You saved ₹{discount.discount}
              </p>

              <span>
                Final Amount: ₹
                {discount.finalAmount}
              </span>
            </div>

          </div>
        )}

      </div>

      <div className="coupon-info-card">

        <h2>How Coupons Work</h2>

        <ul>
          <li>Enter your coupon code.</li>
          <li>
            Enter your current order amount.
          </li>
          <li>
            Click Apply Coupon.
          </li>
          <li>
            Valid coupons will show your
            discount and final amount.
          </li>
        </ul>

      </div>

    </div>
  );
};

export default Coupons;