import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { fetchStores } from "../api/stores";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStores()
      .then(setStores)
      .catch(() => setError("Gagal memuat daftar toko."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-xl font-bold text-ink-900">Semua Toko</h1>

        {error && (
          <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-ink-500">Memuat toko...</p>
        ) : stores.length === 0 ? (
          <p className="text-sm text-ink-500">Belum ada toko terdaftar.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/toko/${store.id}`}
                className="rounded-lg border border-ink-200 bg-white p-4 shadow-card transition hover:shadow-lg"
              >
                <h3 className="font-semibold text-ink-900">{store.name}</h3>
                {store.address && <p className="mt-1 text-sm text-ink-500">{store.address}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
