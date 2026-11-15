import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../services/authService";

import {
  getAvailableRoles,
  switchAccountRole,
} from "../services/accountService";

import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearStorage,
} from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(
    getUser()
  );

  const [loading, setLoading] = useState(true);

  // ================= CHECK AUTH =================

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await getCurrentUser();

        if (response.success) {
          setUserState(response.user);
          setUser(response.user);
        }
      } catch (error) {
        console.error(
          "Authentication check error:",
          error
        );

        clearStorage();
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ================= REGISTER =================

  const register = async (userData) => {
    const response =
      await registerUser(userData);

    if (response.success) {
      setToken(response.token);
      setUser(response.user);
      setUserState(response.user);
    }

    return response;
  };

  // ================= LOGIN =================

  const login = async (credentials) => {
    const response =
      await loginUser(credentials);

    if (response.success) {
      setToken(response.token);
      setUser(response.user);
      setUserState(response.user);
    }

    return response;
  };

  // ================= GET ROLES =================

  const getRoles = async () => {
    const response =
      await getAvailableRoles();

    return response;
  };

  // ================= SWITCH ROLE =================

  const switchRole = async (role) => {
    const response =
      await switchAccountRole(role);

    if (response.success) {
      /*
        Update JWT token because backend creates
        a new token with the new active role.
      */

      if (response.token) {
        setToken(response.token);
      }

      /*
        Update current user in localStorage.
      */

      if (response.user) {
        setUser(response.user);
        setUserState(response.user);
      }
    }

    return response;
  };

  // ================= LOGOUT =================

  const logout = async () => {
    try {
      if (getToken()) {
        await logoutUser();
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      clearStorage();
      setUserState(null);
    }
  };

  // ================= CONTEXT =================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        isAuthenticated:
          !!user && !!getToken(),

        register,
        login,
        logout,

        // Account switching
        getRoles,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================

export const useAuth = () =>
  useContext(AuthContext);