import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { validateAddress, validateEmail, validateName, validatePassword } from "../utils/validation";

export default function Signup() {
  const { user, login, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
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
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { data } = await api.post("/auth/signup", form);
      login(data.token, data.user);
      navigate(dashboardPath(data.user.role));
    } catch (error) {
      const details = error.response?.data?.details;
      if (details?.length) {
        const mapped = {};
        details.forEach((item) => {
          mapped[item.field] = item.message;
        });
        setErrors(mapped);
      }
      setServerError(error.response?.data?.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-lg">
        <h2 className="text-2xl font-bold">Create a shopper account</h2>
        <p className="mt-1 text-sm text-slate-500">Public signup is limited to the USER role.</p>
        {serverError && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>}
        <div className="mt-6">
          <label className="label">Full name (20–60 characters)</label>
          <input name="name" className="input" value={form.name} onChange={onChange} />
          <p className="mt-1 text-xs text-slate-400">{form.name.trim().length}/60</p>
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        <div className="mt-4">
          <label className="label">Email</label>
          <input name="email" className="input" value={form.email} onChange={onChange} />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="mt-4">
          <label className="label">Address (max 400)</label>
          <textarea name="address" rows="3" className="input" value={form.address} onChange={onChange} />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>
        <div className="mt-4">
          <label className="label">Password (8–16, 1 uppercase, 1 special)</label>
          <input name="password" type="password" className="input" value={form.password} onChange={onChange} />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button className="btn-primary mt-6 w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-blue-700">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
