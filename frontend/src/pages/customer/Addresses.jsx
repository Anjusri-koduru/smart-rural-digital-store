import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../../services/addressService";

import Loader from "../../components/common/Loader";

const emptyForm = {
  name: "",
  phone: "",
  addressLine: "",
  village: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAddresses();

      if (response.success) {
        setAddresses(response.addresses || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address._id);

    setForm({
      name: address.name || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      village: address.village || "",
      city: address.city || "",
      district: address.district || "",
      state: address.state || "",
      pincode: address.pincode || "",
      landmark: address.landmark || "",
      isDefault: address.isDefault || false,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.addressLine ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error(
        "Pincode must contain 6 digits"
      );
      return;
    }

    try {
      setSaving(true);

      let response;

      if (editingId) {
        response = await updateAddress(
          editingId,
          form
        );
      } else {
        response = await createAddress(form);
      }

      if (response.success) {
        toast.success(
          editingId
            ? "Address updated successfully"
            : "Address added successfully"
        );

        closeForm();
        fetchAddresses();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDefault = async (id) => {
    try {
      const response =
        await setDefaultAddress(id);

      if (response.success) {
        toast.success(
          "Default address updated"
        );

        fetchAddresses();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update default address"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      const response =
        await deleteAddress(id);

      if (response.success) {
        toast.success(
          "Address deleted successfully"
        );

        fetchAddresses();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete address"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="addresses-page">

      {/* Header */}
      <div className="addresses-header">

        <div>
          <h1>My Addresses</h1>

          <p>
            Manage your delivery addresses
          </p>
        </div>

        <button
          className="add-address-button"
          onClick={openAddForm}
        >
          <Plus size={19} />
          Add Address
        </button>

      </div>


      {/* Address Form */}
      {showForm && (
        <div className="address-form-card">

          <div className="address-form-header">

            <h2>
              {editingId
                ? "Edit Address"
                : "Add New Address"}
            </h2>

            <button
              className="close-form-button"
              onClick={closeForm}
            >
              <X size={20} />
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
            className="address-form"
          >

            <div className="form-grid">

              <div className="form-field">
                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>


              <div className="form-field">
                <label>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>


              <div className="form-field full-width">
                <label>
                  Address *
                </label>

                <textarea
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  placeholder="House number, street, etc."
                  rows="3"
                />
              </div>


              <div className="form-field">
                <label>Village</label>

                <input
                  type="text"
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  placeholder="Village"
                />
              </div>


              <div className="form-field">
                <label>City *</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>


              <div className="form-field">
                <label>District</label>

                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="District"
                />
              </div>


              <div className="form-field">
                <label>State *</label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>


              <div className="form-field">
                <label>
                  Pincode *
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
              </div>


              <div className="form-field">
                <label>Landmark</label>

                <input
                  type="text"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark"
                />
              </div>

            </div>


            <label className="default-checkbox">

              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />

              <span>
                Make this my default address
              </span>

            </label>


            <div className="address-form-actions">

              <button
                type="button"
                className="cancel-address-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-address-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Address"
                  : "Save Address"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Address List */}
      {addresses.length === 0 ? (

        <div className="empty-addresses">

          <div className="empty-address-icon">
            <MapPin size={48} />
          </div>

          <h2>
            No addresses saved
          </h2>

          <p>
            Add a delivery address to
            make checkout faster.
          </p>

          <button
            className="add-address-button"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Your First Address
          </button>

        </div>

      ) : (

        <div className="addresses-grid">

          {addresses.map((address) => (

            <div
              className={`address-card ${
                address.isDefault
                  ? "default-address"
                  : ""
              }`}
              key={address._id}
            >

              <div className="address-card-top">

                <div className="address-name">

                  <MapPin size={19} />

                  <h3>
                    {address.name}
                  </h3>

                </div>

                {address.isDefault && (
                  <span className="default-badge">
                    <Check size={14} />
                    Default
                  </span>
                )}

              </div>


              <div className="address-details">

                <p>
                  {address.addressLine}
                </p>

                {address.village && (
                  <p>
                    {address.village}
                  </p>
                )}

                <p>
                  {address.city}
                  {address.district &&
                    `, ${address.district}`}
                </p>

                <p>
                  {address.state} -{" "}
                  {address.pincode}
                </p>

                {address.landmark && (
                  <p>
                    Landmark:{" "}
                    {address.landmark}
                  </p>
                )}

                <p className="address-phone">
                  Phone: {address.phone}
                </p>

              </div>


              <div className="address-card-actions">

                {!address.isDefault && (
                  <button
                    onClick={() =>
                      handleDefault(
                        address._id
                      )
                    }
                    className="default-action"
                  >
                    <Check size={16} />
                    Set Default
                  </button>
                )}

                <button
                  onClick={() =>
                    openEditForm(address)
                  }
                  className="edit-address-button"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      address._id
                    )
                  }
                  className="delete-address-button"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Addresses;