import { useClerk } from "@clerk/clerk-react";

export const useAuth = () => {
  const { signOut, getToken } = useClerk();

  const logout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const getAuthToken = async () => {
    return await getToken();
  };

  return {
    logout,
    getToken: getAuthToken
  };
};

export const isAdmin = (user) => {
  return user?.publicMetadata?.role === "admin" || user?.publicMetadata?.role === "super-admin";
};

export const isSuperAdmin = (user) => {
  return user?.publicMetadata?.role === "super-admin";
};
