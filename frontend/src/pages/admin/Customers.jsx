import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import {
  getAllCustomers,
} from "../../services/adminService";

const Customers = () => {
  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response =
          await getAllCustomers();

        if (response.success) {
          setCustomers(
            response.customers || []
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load customers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h1>All Customers</h1>

          <p>
            View registered customers
          </p>
        </div>

        <div className="admin-count-badge">
          <UserRound size={18} />
          {customers.length} Customers
        </div>

      </div>

      {customers.length === 0 ? (
        <div className="admin-empty-state">

          <UserRound size={60} />

          <h2>No Customers Found</h2>

          <p>
            No customer accounts are available.
          </p>

        </div>
      ) : (
        <div className="admin-card-grid">

          {customers.map((customer) => (

            <div
              className="admin-person-card"
              key={customer._id}
            >

              <div className="admin-person-avatar">

                {customer.profileImage ? (
                  <img
                    src={`http://localhost:5000${customer.profileImage}`}
                    alt={customer.name}
                  />
                ) : (
                  <UserRound size={35} />
                )}

              </div>

              <div className="admin-person-info">

                <h3>
                  {customer.name}
                </h3>

                <div>
                  <Mail size={15} />
                  <span>
                    {customer.email}
                  </span>
                </div>

                <div>
                  <Phone size={15} />
                  <span>
                    {customer.phone ||
                      "Phone not added"}
                  </span>
                </div>

                <span className="admin-role-badge customer">
                  Customer
                </span>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Customers;