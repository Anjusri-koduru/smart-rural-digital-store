import { useEffect, useState } from "react";
import {
  Store,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import {
  getAllSellers,
} from "../../services/adminService";

const Sellers = () => {
  const [sellers, setSellers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response =
          await getAllSellers();

        if (response.success) {
          setSellers(
            response.sellers || []
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load sellers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h1>All Sellers</h1>
          <p>
            Manage registered rural sellers
          </p>
        </div>

        <div className="admin-count-badge">
          <Store size={18} />
          {sellers.length} Sellers
        </div>

      </div>

      {sellers.length === 0 ? (
        <div className="admin-empty-state">

          <Store size={60} />

          <h2>No Sellers Found</h2>

          <p>
            No seller accounts are available.
          </p>

        </div>
      ) : (
        <div className="admin-card-grid">

          {sellers.map((seller) => (

            <div
              className="admin-person-card"
              key={seller._id}
            >

              <div className="admin-person-avatar">

                {seller.profileImage ? (
                  <img
                    src={`http://localhost:5000${seller.profileImage}`}
                    alt={seller.name}
                  />
                ) : (
                  <Store size={35} />
                )}

              </div>

              <div className="admin-person-info">

                <h3>
                  {seller.name}
                </h3>

                <div>
                  <Mail size={15} />
                  <span>
                    {seller.email}
                  </span>
                </div>

                <div>
                  <Phone size={15} />
                  <span>
                    {seller.phone ||
                      "Phone not added"}
                  </span>
                </div>

                <span className="admin-role-badge seller">
                  Seller
                </span>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Sellers;