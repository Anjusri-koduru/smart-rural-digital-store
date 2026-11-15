import { useEffect, useState } from "react";
import { Plus, Tag } from "lucide-react";
import toast from "react-hot-toast";

import {
  createCoupon,
  getCoupons,
} from "../../services/couponService";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  expiryDate: "",
  usageLimit: "",
};

const Coupons = () => {
  const [coupons, setCoupons] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response =
        await getCoupons();

      if (response.success) {
        setCoupons(
          response.coupons || []
        );
      }
    } catch (error) {
      console.error(
        "Get coupons error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load coupons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCoupon = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.code.trim() ||
      !form.discountValue ||
      !form.expiryDate
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    try {
      setCreating(true);

      const couponData = {
        code: form.code.trim().toUpperCase(),
        discountType:
          form.discountType,
        discountValue:
          Number(form.discountValue),
        minOrderAmount:
          Number(form.minOrderAmount || 0),
        maxDiscount:
          form.maxDiscount
            ? Number(form.maxDiscount)
            : null,
        expiryDate:
          form.expiryDate,
        usageLimit:
          form.usageLimit
            ? Number(form.usageLimit)
            : null,
      };

      const response =
        await createCoupon(
          couponData
        );

      if (response.success) {
        toast.success(
          "Coupon created successfully"
        );

        setForm(initialForm);

        await fetchCoupons();
      } else {
        toast.error(
          response.message ||
            "Unable to create coupon"
        );
      }
    } catch (error) {
      console.error(
        "Create coupon error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create coupon"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h1>Coupons</h1>
          <p>
            Create and manage store coupons
          </p>
        </div>

      </div>

      {/* Create Coupon */}

      <section className="admin-section">

        <div className="coupon-admin-heading">
          <Tag size={22} />

          <div>
            <h2>Create Coupon</h2>
            <p>
              Add a new discount coupon
            </p>
          </div>
        </div>

        <form
          className="admin-coupon-form"
          onSubmit={handleCreateCoupon}
        >

          <div className="coupon-form-group">
            <label>
              Coupon Code *
            </label>

            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="SAVE20"
            />
          </div>

          <div className="coupon-form-group">
            <label>
              Discount Type *
            </label>

            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="fixed">
                Fixed Amount
              </option>
            </select>
          </div>

          <div className="coupon-form-group">
            <label>
              Discount Value *
            </label>

            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              min="0"
              placeholder="20"
            />
          </div>

          <div className="coupon-form-group">
            <label>
              Minimum Order Amount
            </label>

            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              min="0"
              placeholder="500"
            />
          </div>

          <div className="coupon-form-group">
            <label>
              Maximum Discount
            </label>

            <input
              type="number"
              name="maxDiscount"
              value={form.maxDiscount}
              onChange={handleChange}
              min="0"
              placeholder="100"
            />
          </div>

          <div className="coupon-form-group">
            <label>
              Expiry Date *
            </label>

            <input
              type="datetime-local"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="coupon-form-group">
            <label>
              Usage Limit
            </label>

            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              min="1"
              placeholder="100"
            />
          </div>

          <button
            type="submit"
            className="admin-create-coupon-button"
            disabled={creating}
          >
            <Plus size={18} />

            {creating
              ? "Creating..."
              : "Create Coupon"}
          </button>

        </form>

      </section>

      {/* Coupon List */}

      <section className="admin-section">

        <div className="admin-section-header">
          <div>
            <h2>All Coupons</h2>
            <p>
              {coupons.length} coupons created
            </p>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="admin-empty-state">
            <Tag size={40} />

            <h3>
              No coupons found
            </h3>

            <p>
              Create your first coupon above.
            </p>
          </div>
        ) : (
          <div className="coupon-admin-grid">

            {coupons.map((coupon) => {

              const expired =
                new Date(
                  coupon.expiryDate
                ) < new Date();

              return (
                <div
                  key={coupon._id}
                  className="coupon-admin-card"
                >

                  <div className="coupon-admin-card-top">

                    <div className="coupon-code">
                      {coupon.code}
                    </div>

                    <span
                      className={`coupon-status ${
                        coupon.isActive &&
                        !expired
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {coupon.isActive &&
                      !expired
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <h3>
                    {coupon.discountType ===
                    "percentage"
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} OFF`}
                  </h3>

                  <p>
                    Minimum order: ₹
                    {coupon.minOrderAmount}
                  </p>

                  {coupon.maxDiscount !==
                    null && (
                    <p>
                      Maximum discount: ₹
                      {coupon.maxDiscount}
                    </p>
                  )}

                  <p>
                    Used:{" "}
                    {coupon.usedCount || 0}
                    {coupon.usageLimit !==
                      null &&
                      ` / ${coupon.usageLimit}`}
                  </p>

                  <small>
                    Expires:{" "}
                    {new Date(
                      coupon.expiryDate
                    ).toLocaleString()}
                  </small>

                </div>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
};

export default Coupons;