import { useRef, useState } from "react";
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
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image_url || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG/PNG/WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 2MB.");
      return;
    }

    setError("");
    setRemoveImage(false);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setPreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name);
      if (form.sku) payload.append("sku", form.sku);
      payload.append("price", form.price);
      payload.append("stock", form.stock || 0);
      if (form.description) payload.append("description", form.description);
      if (imageFile) payload.append("image", imageFile);
      if (removeImage && !imageFile) payload.append("remove_image", "1");

      await onSubmit(payload);
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
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700">Foto Produk</span>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-ink-200 bg-ink-100">
                {preview ? (
                  <img src={preview} alt="Preview produk" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl text-ink-200">🛍</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="w-fit cursor-pointer rounded-md border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-ink-100">
                  {preview ? "Ganti Foto" : "Unggah Foto"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="w-fit text-xs font-medium text-red-600 hover:underline"
                  >
                    Hapus foto
                  </button>
                )}
                <span className="text-[11px] text-ink-500">JPG, PNG, atau WebP. Maks 2MB.</span>
              </div>
            </div>
          </div>

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
