import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
  const { user, dashboardPath } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={["USER"]} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={["STORE_OWNER"]} />}>
        <Route path="/owner" element={<StoreOwnerDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={["USER", "STORE_OWNER"]} />}>
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
      <Route path="/" element={<Navigate to={user ? dashboardPath(user.role) : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
