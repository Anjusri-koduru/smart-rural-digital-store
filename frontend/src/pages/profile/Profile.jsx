import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Shield,
  Pencil,
  Save,
  X,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/userService";

import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();

        if (response.success) {
          setProfile(response.user);

          setFormData({
            name: response.user.name || "",
            phone: response.user.phone || "",
            profileImage:
              response.user.profileImage || "",
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error(
        "Name must contain at least 2 characters"
      );
      return;
    }

    if (
      formData.phone &&
      formData.phone.trim().length < 10
    ) {
      toast.error(
        "Please enter a valid phone number"
      );
      return;
    }

    try {
      setSaving(true);

      const response = await updateUserProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        profileImage:
          formData.profileImage.trim(),
      });

      if (response.success) {
        setProfile(response.user);

        setFormData({
          name: response.user.name || "",
          phone: response.user.phone || "",
          profileImage:
            response.user.profileImage || "",
        });

        setEditing(false);

        toast.success(
          "Profile updated successfully"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      profileImage:
        profile.profileImage || "",
    });

    setEditing(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <UserRound size={50} />
          <h2>Profile not found</h2>
          <p>
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  const displayImage =
    formData.profileImage ||
    profile.profileImage;

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Header */}

        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>
              Manage your personal account information
            </p>
          </div>

          {!editing ? (
            <button
              type="button"
              className="profile-edit-button"
              onClick={() => setEditing(true)}
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
            >
              <X size={18} />
              Cancel
            </button>
          )}
        </div>

        {/* Profile Card */}

        <div className="profile-main-card">

          <div className="profile-avatar-section">

            <div className="profile-avatar">

              {displayImage ? (
                <img
                  src={displayImage}
                  alt={profile.name}
                />
              ) : (
                <UserRound size={55} />
              )}

              {editing && (
                <div className="profile-camera-icon">
                  <Camera size={17} />
                </div>
              )}

            </div>

            <h2>{profile.name}</h2>

            <span
              className={`profile-role ${profile.role}`}
            >
              {profile.role}
            </span>

          </div>

          {/* Profile Details */}

          <div className="profile-details">

            <div className="profile-section-title">
              <h2>Personal Information</h2>
              <p>
                Your basic account details
              </p>
            </div>

            <form onSubmit={handleSave}>

              <div className="profile-form-grid">

                {/* Name */}

                <div className="profile-field">

                  <label>
                    <UserRound size={16} />
                    Full Name
                  </label>

                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="profile-value">
                      {profile.name || "-"}
                    </div>
                  )}

                </div>

                {/* Email */}

                <div className="profile-field">

                  <label>
                    <Mail size={16} />
                    Email Address
                  </label>

                  <div className="profile-value">
                    {profile.email || "-"}
                  </div>

                  <small>
                    Email address cannot be changed
                    here.
                  </small>

                </div>

                {/* Phone */}

                <div className="profile-field">

                  <label>
                    <Phone size={16} />
                    Phone Number
                  </label>

                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="profile-value">
                      {profile.phone ||
                        "Not added"}
                    </div>
                  )}

                </div>

                {/* Role */}

                <div className="profile-field">

                  <label>
                    <Shield size={16} />
                    Account Role
                  </label>

                  <div className="profile-value">
                    {profile.role || "-"}
                  </div>

                  <small>
                    Your active account role.
                  </small>

                </div>

              </div>

              {/* Profile Image URL */}

              {editing && (
                <div className="profile-field profile-image-field">

                  <label>
                    <Camera size={16} />
                    Profile Image URL
                  </label>

                  <input
                    type="url"
                    name="profileImage"
                    value={
                      formData.profileImage
                    }
                    onChange={handleChange}
                    placeholder="Paste profile image URL"
                  />

                  <small>
                    Enter a valid image URL.
                  </small>

                </div>
              )}

              {/* Save */}

              {editing && (
                <div className="profile-form-actions">

                  <button
                    type="button"
                    className="profile-cancel-form-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={18} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    <Save size={18} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>
              )}

            </form>

          </div>
        </div>

        {/* Account Information */}

        <div className="profile-account-info">

          <div>
            <h3>Account Information</h3>
            <p>
              Account created on{" "}
              {profile.createdAt
                ? new Date(
                    profile.createdAt
                  ).toLocaleDateString("en-IN")
                : "-"}
            </p>
          </div>

          <div className="profile-account-badge">
            <Shield size={18} />
            {profile.role}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;