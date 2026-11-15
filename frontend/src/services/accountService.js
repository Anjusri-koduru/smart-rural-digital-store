import api from "./api";

// ================= GET AVAILABLE ROLES =================

export const getAvailableRoles = async () => {
  const response = await api.get("/account/roles");
  return response.data;
};

// ================= SWITCH ACCOUNT ROLE =================

export const switchAccountRole = async (role) => {
  const response = await api.post(
    "/account/switch-role",
    { role }
  );

  return response.data;
};