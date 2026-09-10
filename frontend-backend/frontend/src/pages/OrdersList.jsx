import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { fetchMyOrders } from "../api/orders";
import { formatIDR } from "../utils/format";

const statusColor = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError("Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink-500">Memuat...</p>;

  if (error) {
    return <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-500">
        Anda belum memiliki pesanan.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/pesanan-saya/${order.id}`}
          className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4 shadow-card hover:shadow-lg"
        >
          <div>
            <p className="font-mono text-sm font-semibold text-ink-900">
              {order.order_number || `#${order.id}`}
            </p>
            <p className="mt-1 text-xs text-ink-500">{order.store_name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-ink-900">{formatIDR(order.total)}</p>
            <span
              className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                statusColor[order.status] || "bg-ink-100 text-ink-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function OrdersList() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="mb-6 text-xl font-bold text-ink-900">Pesanan Saya</h1>
          <OrdersContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
