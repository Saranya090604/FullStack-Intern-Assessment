import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SortableTable from "../components/SortableTable";
import RatingStars from "../components/RatingStars";
import api from "../api/axios";

export default function StoreOwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [sort, setSort] = useState({ sortBy: "name", order: "asc" });
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/owner/dashboard", { params: sort })
      .then(({ data }) => setDashboard(data.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load dashboard"));
  }, [sort]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <RatingStars value={row.rating} readOnly size={16} />
          {row.rating}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => new Date(row.date).toLocaleString(),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold">Store owner dashboard</h1>
          <p className="text-slate-500">See your store’s average rating and who submitted scores.</p>
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {dashboard && (
          <>
            <section className="card">
              <h2 className="text-xl font-semibold">{dashboard.store.name}</h2>
              <p className="text-slate-500">{dashboard.store.address}</p>
              <div className="mt-4 flex items-center gap-3">
                <RatingStars value={Math.round(dashboard.averageRating)} readOnly />
                <span className="text-2xl font-bold">{dashboard.averageRating.toFixed(2)}</span>
                <span className="text-sm text-slate-500">{dashboard.ratingsCount} ratings</span>
              </div>
            </section>
            <section className="card">
              <h3 className="mb-4 text-lg font-semibold">Users who rated your store</h3>
              <SortableTable
                columns={columns}
                data={dashboard.raters}
                sortKey={sort.sortBy}
                sortOrder={sort.order}
                onSort={(key) =>
                  setSort((prev) => ({
                    sortBy: key,
                    order: prev.sortBy === key && prev.order === "asc" ? "desc" : "asc",
                  }))
                }
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
