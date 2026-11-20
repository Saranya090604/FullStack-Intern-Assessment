import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validation";

export default function Login() {
  const { user, login, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email),
      password: form.password ? "" : "Password is required",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      navigate(dashboardPath(data.user.role));
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Star /> RateHub
        </div>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight">Rate stores. Discover quality. Own the feedback loop.</h1>
          <p className="mt-4 max-w-md text-slate-300">
            A role-based platform for administrators, store owners, and shoppers with trusted 1–5 ratings.
          </p>
        </div>
        <p className="text-sm text-slate-400">Seed admin: admin@storerating.com / Admin@1234</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="card w-full max-w-md">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your dashboard</p>
          {serverError && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>}
          <div className="mt-6">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" className="input" value={form.email} onChange={onChange} />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" value={form.password} onChange={onChange} />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button className="btn-primary mt-6 w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-500">
            New shopper?{" "}
            <Link to="/signup" className="font-semibold text-blue-700">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
