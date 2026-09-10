import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { fetchOrder, fetchPayment } from "../api/orders";
import { formatIDR } from "../utils/format";

function OrderDetailContent() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchOrder(id)
      .then(setOrder)
      .catch(() => setError("Pesanan tidak ditemukan."))
      .finally(() => setLoading(false));

    fetchPayment(id)
      .then(setPayment)
      .catch(() => {
        /* wajar kalau belum ada data pembayaran */
      });
  }, [id]);

  if (loading) return <p className="text-sm text-ink-500">Memuat...</p>;

  if (error || !order) {
    return (
      <div>
        <p className="text-sm text-red-600">{error || "Pesanan tidak ditemukan."}</p>
        <Link to="/pesanan-saya" className="mt-3 inline-block text-sm text-brand hover:underline">
          ← Kembali ke pesanan saya
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/pesanan-saya" className="mb-4 inline-block text-sm text-brand hover:underline">
        ← Kembali ke pesanan saya
      </Link>

      <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h1 className="font-mono text-lg font-bold text-ink-900">
            {order.order_number || `#${order.id}`}
          </h1>
          <span className="rounded bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700">
            {order.status}
          </span>
        </div>
        {order.store_name && <p className="mt-1 text-sm text-ink-500">Toko: {order.store_name}</p>}
        {order.address && <p className="mt-1 text-sm text-ink-500">Alamat: {order.address}</p>}

        {order.items && order.items.length > 0 && (
          <div className="mt-4 divide-y divide-ink-200 border-t border-ink-200 pt-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 text-sm">
                <span>
                  {item.product_name || item.name} × {item.quantity}
                </span>
                <span className="font-medium">{formatIDR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex justify-between border-t border-ink-200 pt-3 text-base font-bold text-ink-900">
          <span>Total</span>
          <span>{formatIDR(order.total)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-ink-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Informasi Pembayaran</h2>
        {payment ? (
          <div className="space-y-1.5 text-sm text-ink-700">
            <div className="flex justify-between">
              <span>Metode</span>
              <span className="font-medium">{payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-medium">{payment.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah</span>
              <span className="font-medium">{formatIDR(payment.amount)}</span>
            </div>
            {payment.paid_at && (
              <div className="flex justify-between">
                <span>Dibayar pada</span>
                <span className="font-medium">
                  {new Date(payment.paid_at).toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-500">Belum ada data pembayaran untuk pesanan ini.</p>
        )}
      </div>
    </div>
  );
}

export default function OrderDetail() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <OrderDetailContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
