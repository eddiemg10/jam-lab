import { Outlet, Navigate } from "react-router";

export default function ProtectedRoutes() {
  const accessToken = localStorage.getItem("access_token");

  return accessToken ? <Outlet /> : <Navigate to="/login" />;
}
