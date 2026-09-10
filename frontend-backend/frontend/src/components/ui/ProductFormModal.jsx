import { useState } from "react";
import { TextInput, TextArea } from "./Field";
import { Button } from "./Button";

export function ProductFormModal({ initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData?.id);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    price: initialData?.price || "",
    stock: initialData?.stock || "",
    description: initialData?.description || "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      const laravelErrors = err.response?.data?.errors;
      setError(
        laravelErrors ? Object.values(laravelErrors).flat().join(" ") : "Gagal menyimpan produk."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-ink-900">
          {isEdit ? "Ubah Produk" : "Tambah Produk"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Nama Produk"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextInput
            label="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
          <TextInput
            label="Harga"
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextInput
            label="Stok"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <TextArea
            label="Deskripsi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
