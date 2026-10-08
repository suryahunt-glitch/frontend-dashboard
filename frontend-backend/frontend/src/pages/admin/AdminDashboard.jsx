import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminStats } from "../../api/admin";
import { formatIDR } from "../../utils/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => setError("Gagal memuat statistik."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink-500">Memuat statistik...</p>;
  if (error) return <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;

  const cards = [
    { label: "Total Pengguna", value: stats.users, icon: "👥", to: "/admin/pengguna" },
    { label: "Total Toko", value: stats.stores, icon: "🏪", to: "/admin/toko" },
    { label: "Total Produk", value: stats.products, icon: "📦", to: "/admin/produk" },
    { label: "Total Pesanan", value: stats.orders, icon: "🧾", to: "/admin/pesanan" },
    { label: "Pesanan Pending", value: stats.pending_orders, icon: "⏳", to: "/admin/pesanan" },
    { label: "Pendapatan (lunas)", value: formatIDR(stats.revenue), icon: "💰", to: "/admin/pesanan" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-3xl border border-sage-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">{c.icon}</div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-500">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-sage-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-dashed border-sage-200 bg-white p-5 text-sm text-ink-500 shadow-card">
        💡 Toko yang dibuat pengguna dari halaman "Toko Saya" otomatis tercatat di sini
        (menu <Link to="/admin/toko" className="font-bold text-brand hover:underline">Toko</Link>) dan
        juga tampil di dashboard Filament <span className="font-mono">/admin</span> backend.
      </div>
    </div>
  );
}
