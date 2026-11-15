import {
  ShieldCheck,
  Mail,
  User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Admin Profile</h1>
          <p>
            Administrator account information
          </p>
        </div>
      </div>

      <div className="admin-profile-card">

        <div className="admin-profile-icon">
          <ShieldCheck size={55} />
        </div>

        <div className="admin-profile-info">

          <h2>
            {user?.name || "Administrator"}
          </h2>

          <div className="admin-profile-row">
            <User size={18} />
            <span>
              Administrator
            </span>
          </div>

          <div className="admin-profile-row">
            <Mail size={18} />
            <span>
              {user?.email}
            </span>
          </div>

          <div className="admin-role-badge admin">
            Admin
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminProfile;