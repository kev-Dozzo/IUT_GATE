import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../config/permissions";

export default function PermissionRoute({ children, requiredPermission }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid var(--cyan-light)",
            borderTop: "3px solid var(--cyan)",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;
  if (requiredPermission && !hasPermission(admin, requiredPermission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
