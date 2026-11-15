import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import {
  getSellerProfile,
} from "../../services/sellerService";

const SellerProfile = () => {
  const [seller, setSeller] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response =
          await getSellerProfile();

        if (response.success) {
          setSeller(response.seller);
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

  if (loading) {
    return <Loader />;
  }

  if (!seller) {
    return (
      <div className="seller-page">
        <h2>Seller profile not found</h2>
      </div>
    );
  }

  return (
    <div className="seller-page">

      <div className="seller-page-header">
        <div>
          <h1>Seller Profile</h1>
          <p>
            View your seller account information
          </p>
        </div>
      </div>

      <div className="seller-profile-card">

        <div className="seller-profile-avatar">

          {seller.profileImage ? (
            <img
              src={`https://smart-rural-digital-store.onrender.com${seller.profileImage}`}
              alt={seller.name}
            />
          ) : (
            <User size={55} />
          )}

        </div>

        <div className="seller-profile-info">

          <h2>{seller.name}</h2>

          <div className="seller-profile-row">
            <Mail size={19} />
            <span>{seller.email}</span>
          </div>

          <div className="seller-profile-row">
            <Phone size={19} />
            <span>
              {seller.phone || "Phone not added"}
            </span>
          </div>

          <div className="seller-role-badge">
            Seller
          </div>

        </div>

      </div>

    </div>
  );
};

export default SellerProfile;