import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "../components/layout/SiteLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { TextInput, TextArea } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { fetchMyStore, createMyStore, updateMyStore } from "../api/stores";

function MyStoreContent() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyStore()
      .then((data) => {
        setStore(data);
        if (data) setForm({ name: data.name, address: data.address || "", phone: data.phone || "" });
      })
      .catch(() => setError("Gagal memuat data toko."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const saved = store ? await updateMyStore(form) : await createMyStore(form);
      setStore(saved);
      setEditing(false);
    } catch (err) {
      const laravelErrors = err.response?.data?.errors;
      setError(
        laravelErrors
          ? Object.values(laravelErrors).flat().join(" ")
          : "Gagal menyimpan toko. Ingat, 1 akun hanya boleh punya 1 toko."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-500">Memuat...</p>;
  }

  // Belum punya toko / sedang mengubah data toko -> tampilkan form
  if (!store || editing) {
    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-lg border border-ink-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink-900">
          {store ? "Ubah Data Toko" : "Buka Toko Baru"}
        </h2>
        {!store && (
          <p className="text-sm text-ink-500">
            Satu akun hanya bisa memiliki satu toko. Setelah dibuat, Anda bisa mulai menambahkan produk.
          </p>
        )}

        <TextInput
          label="Nama Toko"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextArea
          label="Alamat"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <TextInput
          label="Telepon"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          {editing && (
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Batal
            </Button>
          )}
          <Button type="submit" variant="brand" disabled={submitting}>
            {submitting ? "Menyimpan..." : store ? "Simpan Perubahan" : "Buka Toko"}
          </Button>
        </div>
      </form>
    );
  }

  // Sudah punya toko -> tampilkan info + link kelola produk
  return (
    <div className="max-w-md space-y-4">
      <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink-900">{store.name}</h2>
        {store.address && <p className="mt-1 text-sm text-ink-500">{store.address}</p>}
        {store.phone && <p className="mt-1 text-sm text-ink-500">{store.phone}</p>}
        <button
          onClick={() => setEditing(true)}
          className="mt-3 text-sm font-medium text-brand hover:underline"
        >
          Ubah data toko
        </button>
      </div>

      <Link to="/toko-saya/produk">
        <Button variant="primary" className="w-full">
          Kelola Produk Toko →
        </Button>
      </Link>
    </div>
  );
}

export default function MyStore() {
  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-xl font-bold text-ink-900">Toko Saya</h1>
          <MyStoreContent />
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
