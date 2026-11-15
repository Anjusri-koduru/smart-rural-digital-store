import { useEffect, useState } from "react";
import {
  UserRound,
  UserMinus,
  Store,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";

import {
  getFollowingSellers,
  unfollowSeller,
} from "../../services/customerService";

const FollowingSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowing = async () => {
    try {
      setLoading(true);

      const response =
        await getFollowingSellers();

      if (response.success) {
        setSellers(
          response.sellers ||
            response.following ||
            []
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load followed sellers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const handleUnfollow = async (sellerId) => {
    try {
      const response =
        await unfollowSeller(sellerId);

      if (response.success) {
        setSellers((previous) =>
          previous.filter(
            (seller) =>
              seller._id !== sellerId
          )
        );

        toast.success(
          "Seller unfollowed successfully"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to unfollow seller"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="following-page">

      <div className="following-container">

        <div className="following-header">

          <div>
            <div className="following-title">
              <Store size={28} />
              <h1>Following Sellers</h1>
            </div>

            <p>
              Sellers you are following
            </p>
          </div>

          <div className="following-count">
            {sellers.length}{" "}
            {sellers.length === 1
              ? "Seller"
              : "Sellers"}
          </div>

        </div>

        {sellers.length === 0 ? (

          <div className="following-empty">

            <div className="following-empty-icon">
              <Store size={55} />
            </div>

            <h2>
              No Sellers Followed
            </h2>

            <p>
              Follow your favorite sellers
              to stay connected with their
              products.
            </p>

          </div>

        ) : (

          <div className="following-grid">

            {sellers.map((seller) => (

              <div
                className="seller-follow-card"
                key={seller._id}
              >

                <div className="seller-follow-avatar">

                  {seller.profileImage ? (
                    <img
                      src={seller.profileImage}
                      alt={seller.name}
                    />
                  ) : (
                    <UserRound size={38} />
                  )}

                </div>

                <div className="seller-follow-info">

                  <h3>
                    {seller.name}
                  </h3>

                  <p>
                    {seller.email}
                  </p>

                  <span>
                    Seller
                  </span>

                </div>

                <button
                  type="button"
                  className="unfollow-button"
                  onClick={() =>
                    handleUnfollow(
                      seller._id
                    )
                  }
                >
                  <UserMinus size={17} />
                  Unfollow
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default FollowingSellers;