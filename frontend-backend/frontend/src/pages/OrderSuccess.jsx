import { useLocation, Link, Navigate } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { Button } from "../components/ui/Button";

export default function OrderSuccess() {
  const location = useLocation();
  const orders = location.state?.orders;

  if (!orders || orders.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl">✅</p>
        <h1 className="mt-4 text-xl font-bold text-ink-900">
          {orders.length > 1 ? `${orders.length} Pesanan Berhasil Dibuat!` : "Pesanan Berhasil Dibuat!"}
        </h1>
        <div className="mt-4 space-y-2 text-left">
          {orders.map((order) => (
            <div key={order.id} className="rounded-md border border-ink-200 bg-ink-100 px-3 py-2 text-sm">
              Nomor Pesanan:{" "}
              <span className="font-mono font-semibold text-ink-900">
                {order.order_number || `#${order.id}`}
              </span>
            </div>
          ))}
        </div>
        <Link to="/pesanan-saya">
          <Button variant="brand" className="mt-6">
            Lihat Pesanan Saya
          </Button>
        </Link>
      </div>
    </SiteLayout>
  );
}
