import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import { getAllUsers } from "../../services/adminService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        if (response.success) {
          setUsers(response.users || []);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>All Users</h1>
          <p>View all registered users</p>
        </div>

        <div className="admin-count-badge">
          <UsersIcon size={18} />
          {users.length} Users
        </div>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty-state">
          <UsersIcon size={60} />

          <h2>No Users Found</h2>

          <p>
            There are no registered users yet.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="admin-user-name">
                      {user.name}
                    </div>
                  </td>

                  <td>
                    <div className="admin-contact">
                      <Mail size={15} />
                      {user.email}
                    </div>
                  </td>

                  <td>
                    <div className="admin-contact">
                      <Phone size={15} />
                      {user.phone || "Not added"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`admin-role-badge ${user.role}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;