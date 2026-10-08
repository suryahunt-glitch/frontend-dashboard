import { NavLink, Outlet } from "react-router-dom";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { AdminRoute } from "../../components/ProtectedRoute";

const MENU = [
  { to: "/admin", label: "📊 Dashboard", end: true },
  { to: "/admin/produk", label: "📦 Produk" },
  { to: "/admin/pesanan", label: "🧾 Pesanan" },
  { to: "/admin/toko", label: "🏪 Toko" },
  { to: "/admin/pengguna", label: "👥 Pengguna" },
];

function AdminShell() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 overflow-hidden rounded-[28px] bg-sage-900 p-5 text-white shadow-card sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">KelontongKu • Admin</p>
          <h1 className="mt-2 font-display text-2xl font-bold">Panel Admin</h1>
          <p className="mt-1 text-sm text-sage-100">Kelola produk, pesanan, toko, dan pengguna dalam satu tempat.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-3xl border border-sage-200 bg-white p-3 shadow-card md:sticky md:top-24">
            <nav className="flex gap-2 overflow-x-auto md:flex-col">
              {MENU.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  end={m.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                      isActive ? "bg-sage-900 text-white" : "text-sage-900 hover:bg-sage-100"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

export default function AdminLayout() {
  return (
    <AdminRoute>
      <AdminShell />
    </AdminRoute>
  );
}
