import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SortableTable from "../components/SortableTable";
import RatingStars from "../components/RatingStars";
import api from "../api/axios";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "name", order: "asc" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get("/stores", { params: { ...filters, ...sort } });
    setStores(data.data);
  };

  useEffect(() => {
    load();
  }, [filters, sort]);

  const rate = async (storeId, rating) => {
    await api.put(`/ratings/${storeId}`, { rating });
    setMessage("Rating saved.");
    load();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    {
      key: "averageRating",
      label: "Overall rating",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <RatingStars value={Math.round(row.averageRating)} readOnly size={16} />
          {row.averageRating.toFixed(2)}
        </span>
      ),
    },
    {
      key: "userRating",
      label: "Your rating",
      sortable: false,
      render: (row) => (
        <div>
          <RatingStars value={row.userRating || 0} onChange={(value) => rate(row.id, value)} />
          <p className="mt-1 text-xs text-slate-500">{row.userRating ? `Saved: ${row.userRating}/5` : "Not rated yet"}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold">Store directory</h1>
          <p className="text-slate-500">Search stores and submit or update your 1–5 rating.</p>
        </div>
        {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Search by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input className="input" placeholder="Search by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        </div>
        <SortableTable
          columns={columns}
          data={stores}
          sortKey={sort.sortBy}
          sortOrder={sort.order}
          onSort={(key) =>
            setSort((prev) => ({
              sortBy: key,
              order: prev.sortBy === key && prev.order === "asc" ? "desc" : "asc",
            }))
          }
        />
      </main>
    </div>
  );
}
