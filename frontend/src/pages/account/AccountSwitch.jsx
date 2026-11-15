import { useEffect, useState } from "react";

import {
  UserRound,
  Store,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import Loader from "../../components/common/Loader";

import { useAuth } from "../../context/AuthContext";


const AccountSwitch = () => {
  const {
    user,
    getRoles,
    switchRole,
  } = useAuth();

  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchingRole, setSwitchingRole] =
    useState(null);


  // ================= LOAD ROLES =================

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response =
          await getRoles();

        if (response.success) {
          setRoles(
            response.availableRoles || []
          );
        } else {
          toast.error(
            response.message ||
              "Failed to load available accounts"
          );
        }
      } catch (error) {
        console.error(
          "Get roles error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load available accounts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);


  // ================= SWITCH ROLE =================

  const handleSwitch = async (role) => {
    if (role === user?.role) {
      toast.success(
        `You are already using the ${role} account`
      );

      return;
    }

    try {
      setSwitchingRole(role);

      const response =
        await switchRole(role);

      if (response.success) {
        toast.success(
          response.message ||
            `Switched to ${role} account successfully`
        );

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(
        "Switch role error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to switch account"
      );
    } finally {
      setSwitchingRole(null);
    }
  };


  // ================= ROLE ICON =================

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return <ShieldCheck size={30} />;
    }

    if (role === "seller") {
      return <Store size={30} />;
    }

    return <ShoppingBag size={30} />;
  };


  // ================= ROLE TITLE =================

  const getRoleTitle = (role) => {
    if (role === "admin") {
      return "Admin Account";
    }

    if (role === "seller") {
      return "Seller Account";
    }

    return "Customer Account";
  };


  // ================= ROLE DESCRIPTION =================

  const getRoleDescription = (role) => {
    if (role === "admin") {
      return "Manage users, sellers, customers and platform settings.";
    }

    if (role === "seller") {
      return "Manage products, orders, sales and your seller store.";
    }

    return "Shop products, manage cart, orders and your favorites.";
  };


  // ================= ROLE LABEL =================

  const getRoleLabel = (role) => {
    if (role === "admin") {
      return "Admin";
    }

    if (role === "seller") {
      return "Seller";
    }

    return "Customer";
  };


  if (loading) {
    return <Loader />;
  }


  return (
    <div className="account-switch-page">

      <div className="account-switch-container">

        {/* ================= HEADER ================= */}

        <div className="account-switch-header">

          <div className="account-switch-main-icon">
            <ArrowRightLeft size={30} />
          </div>

          <h1>
            Switch Account
          </h1>

          <p>
            Switch between the roles available
            on your Smart Rural Digital Store account.
          </p>

        </div>


        {/* ================= CURRENT ACCOUNT ================= */}

        <div className="current-account-card">

          <div className="current-account-left">

            <div className="current-account-icon">
              {getRoleIcon(user?.role)}
            </div>

            <div className="current-account-info">

              <span>
                Current Account
              </span>

              <strong>
                {getRoleTitle(user?.role)}
              </strong>

              <small>
                {user?.email}
              </small>

            </div>

          </div>

          <div className="current-account-status">

            <CheckCircle size={19} />

            <span>
              Active
            </span>

          </div>

        </div>


        {/* ================= AVAILABLE ACCOUNTS ================= */}

        <div className="available-account-title">

          <div>

            <h2>
              Available Accounts
            </h2>

            <p>
              Choose the role you want to use.
            </p>

          </div>

          <span className="role-count">
            {roles.length}{" "}
            {roles.length === 1
              ? "Role"
              : "Roles"}
          </span>

        </div>


        {/* ================= ROLE LIST ================= */}

        <div className="account-role-list">

          {roles.map((role) => {

            const isCurrent =
              role === user?.role;

            const isSwitching =
              switchingRole === role;

            return (
              <div
                key={role}
                className={`account-role-card ${
                  isCurrent
                    ? "active"
                    : ""
                }`}
              >

                <div
                  className={`account-role-icon ${role}`}
                >
                  {getRoleIcon(role)}
                </div>


                <div className="account-role-info">

                  <div className="account-role-title">

                    <h3>
                      {getRoleTitle(role)}
                    </h3>

                    {isCurrent && (
                      <span className="current-role-badge">
                        Current
                      </span>
                    )}

                  </div>

                  <p>
                    {getRoleDescription(role)}
                  </p>

                </div>


                <div className="account-role-action">

                  {isCurrent ? (

                    <div className="active-role-label">
                      <CheckCircle size={18} />
                      Active
                    </div>

                  ) : (

                    <button
                      type="button"
                      className="account-switch-button"
                      onClick={() =>
                        handleSwitch(role)
                      }
                      disabled={
                        switchingRole !== null
                      }
                    >
                      {isSwitching
                        ? "Switching..."
                        : `Switch to ${getRoleLabel(
                            role
                          )}`}
                    </button>

                  )}

                </div>

              </div>
            );
          })}

        </div>


        {/* ================= NO ROLES ================= */}

        {roles.length === 0 && (
          <div className="account-no-other-role">

            <UserRound size={30} />

            <h3>
              No account roles found
            </h3>

            <p>
              Please login again and try once more.
            </p>

          </div>
        )}


        {/* ================= INFO ================= */}

        <div className="account-switch-info">

          <ShieldCheck size={20} />

          <p>
            You can switch between the roles
            available to your account without
            creating another account.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AccountSwitch;