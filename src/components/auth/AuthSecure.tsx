// utils/auth.ts
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; // or however you store auth
};
