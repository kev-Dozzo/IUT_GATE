import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  const localToken = localStorage.getItem("token");

  if (!token && !localToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
