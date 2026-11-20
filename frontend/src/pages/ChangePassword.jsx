import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { validatePassword } from "../utils/validation";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      currentPassword: form.currentPassword ? "" : "Current password is required",
      newPassword: validatePassword(form.newPassword),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setServerError("");
    setMessage("");
    try {
      const { data } = await api.patch("/auth/update-password", form);
      setMessage(data.message);
      setForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setServerError(error.response?.data?.message || "Could not update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-10">
        <form onSubmit={onSubmit} className="card">
          <h1 className="text-2xl font-bold">Change password</h1>
          <p className="mt-1 text-sm text-slate-500">Available to shoppers and store owners.</p>
          {message && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          {serverError && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>}
          <div className="mt-6">
            <label className="label">Current password</label>
            <input
              type="password"
              className="input"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
          </div>
          <div className="mt-4">
            <label className="label">New password</label>
            <input
              type="password"
              className="input"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>
          <button className="btn-primary mt-6" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </main>
    </div>
  );
}
