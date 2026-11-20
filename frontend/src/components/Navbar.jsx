import { KeyRound, LogOut, Star } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const home =
    user?.role === "ADMIN" ? "/admin" : user?.role === "STORE_OWNER" ? "/owner" : "/dashboard";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={home} className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Star size={18} />
          </span>
          RateHub
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-slate-500 sm:inline">
            {user?.name} · {user?.role?.replace("_", " ")}
          </span>
          {(user?.role === "USER" || user?.role === "STORE_OWNER") && (
            <NavLink
              to="/change-password"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              <KeyRound size={16} />
              Password
            </NavLink>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
