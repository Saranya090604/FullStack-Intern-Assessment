import { useEffect, useMemo, useState } from "react";
import { Store, Users, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import SortableTable from "../components/SortableTable";
import RatingStars from "../components/RatingStars";
import api from "../api/axios";
import { validateAddress, validateEmail, validateName, validatePassword } from "../utils/validation";

const emptyUser = { name: "", email: "", address: "", password: "", role: "USER" };
const emptyStore = { name: "", email: "", address: "", ownerId: "" };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFilters, setUserFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [storeFilters, setStoreFilters] = useState({ name: "", email: "", address: "" });
  const [userSort, setUserSort] = useState({ sortBy: "name", order: "asc" });
  const [storeSort, setStoreSort] = useState({ sortBy: "name", order: "asc" });
  const [userForm, setUserForm] = useState(emptyUser);
  const [storeForm, setStoreForm] = useState(emptyStore);
  const [userErrors, setUserErrors] = useState({});
  const [storeErrors, setStoreErrors] = useState({});
  const [notice, setNotice] = useState("");

  const loadStats = async () => {
    const { data } = await api.get("/admin/stats");
    setStats(data.data);
  };

  const loadUsers = async () => {
    const { data } = await api.get("/admin/users", { params: { ...userFilters, ...userSort } });
    setUsers(data.data);
  };

  const loadStores = async () => {
    const { data } = await api.get("/admin/stores", { params: { ...storeFilters, ...storeSort } });
    setStores(data.data);
  };

  const loadOwners = async () => {
    const { data } = await api.get("/admin/owners/available");
    setOwners(data.data);
  };

  useEffect(() => {
    loadStats();
    loadOwners();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [userFilters, userSort]);

  useEffect(() => {
    loadStores();
  }, [storeFilters, storeSort]);

  const toggleSort = (setter) => (key) => {
    setter((prev) => ({
      sortBy: key,
      order: prev.sortBy === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const createUser = async (event) => {
    event.preventDefault();
    const errors = {
      name: validateName(userForm.name),
      email: validateEmail(userForm.email),
      address: validateAddress(userForm.address),
      password: validatePassword(userForm.password),
    };
    setUserErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    await api.post("/admin/users", userForm);
    setUserForm(emptyUser);
    setNotice("User created.");
    await Promise.all([loadUsers(), loadStats(), loadOwners()]);
  };

  const createStore = async (event) => {
    event.preventDefault();
    const errors = {
      name: validateName(storeForm.name),
      email: validateEmail(storeForm.email),
      address: validateAddress(storeForm.address),
      ownerId: storeForm.ownerId ? "" : "Select a store owner",
    };
    setStoreErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    await api.post("/admin/stores", { ...storeForm, ownerId: Number(storeForm.ownerId) });
    setStoreForm(emptyStore);
    setNotice("Store created.");
    await Promise.all([loadStores(), loadStats(), loadOwners()]);
  };

  const viewUser = async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);
    setSelectedUser(data.data);
  };

  const userColumns = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address" },
      { key: "role", label: "Role" },
      {
        key: "actions",
        label: "Details",
        sortable: false,
        render: (row) => (
          <button className="text-blue-700 hover:underline" onClick={() => viewUser(row.id)}>
            View
          </button>
        ),
      },
    ],
    []
  );

  const storeColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    {
      key: "averageRating",
      label: "Rating",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <RatingStars value={Math.round(row.averageRating)} readOnly size={16} />
          {row.averageRating.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold">Administrator dashboard</h1>
          <p className="text-slate-500">Manage users, stores, and platform health.</p>
        </div>
        {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
          <StatCard icon={Store} label="Total stores" value={stats.totalStores} />
          <StatCard icon={Star} label="Submitted ratings" value={stats.totalRatings} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={createUser} className="card">
            <h2 className="text-lg font-semibold">Create user</h2>
            <Field label="Name (20–60)" error={userErrors.name}>
              <input className="input" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            </Field>
            <Field label="Email" error={userErrors.email}>
              <input className="input" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            </Field>
            <Field label="Address" error={userErrors.address}>
              <textarea className="input" rows="2" value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} />
            </Field>
            <Field label="Password" error={userErrors.password}>
              <input type="password" className="input" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
            </Field>
            <Field label="Role">
              <select className="input" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="STORE_OWNER">STORE_OWNER</option>
              </select>
            </Field>
            <button className="btn-primary mt-4">Add user</button>
          </form>

          <form onSubmit={createStore} className="card">
            <h2 className="text-lg font-semibold">Create store</h2>
            <Field label="Store name (20–60)" error={storeErrors.name}>
              <input className="input" value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} />
            </Field>
            <Field label="Email" error={storeErrors.email}>
              <input className="input" value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} />
            </Field>
            <Field label="Address" error={storeErrors.address}>
              <textarea className="input" rows="2" value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} />
            </Field>
            <Field label="Store owner" error={storeErrors.ownerId}>
              <select className="input" value={storeForm.ownerId} onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}>
                <option value="">Select owner without a store</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            </Field>
            <button className="btn-primary mt-4">Add store</button>
          </form>
        </section>

        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Users</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <input className="input" placeholder="Filter name" value={userFilters.name} onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })} />
            <input className="input" placeholder="Filter email" value={userFilters.email} onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })} />
            <input className="input" placeholder="Filter address" value={userFilters.address} onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })} />
            <select className="input" value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}>
              <option value="">All roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="STORE_OWNER">STORE_OWNER</option>
            </select>
          </div>
          <SortableTable
            columns={userColumns}
            data={users}
            sortKey={userSort.sortBy}
            sortOrder={userSort.order}
            onSort={toggleSort(setUserSort)}
          />
        </section>

        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Stores</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <input className="input" placeholder="Filter name" value={storeFilters.name} onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })} />
            <input className="input" placeholder="Filter email" value={storeFilters.email} onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })} />
            <input className="input" placeholder="Filter address" value={storeFilters.address} onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })} />
          </div>
          <SortableTable
            columns={storeColumns}
            data={stores}
            sortKey={storeSort.sortBy}
            sortOrder={storeSort.order}
            onSort={toggleSort(setStoreSort)}
          />
        </section>

        {selectedUser && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setSelectedUser(null)}>
            <div className="card max-w-lg" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold">User details</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Name" value={selectedUser.name} />
                <Row label="Email" value={selectedUser.email} />
                <Row label="Address" value={selectedUser.address} />
                <Row label="Role" value={selectedUser.role} />
                {selectedUser.role === "STORE_OWNER" && (
                  <>
                    <Row label="Store" value={selectedUser.store?.name || "Not assigned"} />
                    <Row label="Store average rating" value={Number(selectedUser.averageRating || 0).toFixed(2)} />
                  </>
                )}
              </dl>
              <button className="btn-secondary mt-6" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="mt-3">
      <label className="label">{label}</label>
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
