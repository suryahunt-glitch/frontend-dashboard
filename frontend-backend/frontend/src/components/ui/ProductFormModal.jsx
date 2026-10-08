import { useRef, useState } from "react";
import { TextInput, TextArea } from "./Field";
import { Button } from "./Button";

const MAX_MB = 2;
const ACCEPT = "image/png,image/jpeg,image/webp";

export function ProductFormModal({ initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData?.id);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
    weight: initialData?.weight ?? "",
    description: initialData?.description || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image_url || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function pickFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG/PNG/WebP).");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format gambar harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Ukuran gambar maksimal ${MAX_MB}MB.`);
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
    if (!String(form.name).trim()) return setError("Nama produk wajib diisi.");
    if (form.price === "" || Number(form.price) < 0) return setError("Harga wajib diisi dan tidak boleh negatif.");
    if (form.stock === "" || Number(form.stock) < 0) return setError("Stok wajib diisi dan tidak boleh negatif.");

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", String(form.name).trim());
      if (form.sku) payload.append("sku", String(form.sku).trim());
      payload.append("price", form.price);
      payload.append("stock", form.stock === "" ? 0 : form.stock);
      if (form.weight !== "") payload.append("weight", form.weight);
      if (form.description) payload.append("description", form.description);
      if (imageFile) payload.append("image", imageFile);
      if (removeImage && !imageFile) payload.append("remove_image", "1");

      await onSubmit(payload);
    } catch (err) {
      const laravelErrors = err.response?.data?.errors;
      setError(
        laravelErrors
          ? Object.values(laravelErrors).flat().join(" ")
          : err.response?.data?.message || "Gagal menyimpan produk. Coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-sage-200 bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Toko Saya • Produk
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-sage-900">
              {isEdit ? "Ubah Produk" : "Tambah Produk Baru"}
            </h2>
            <p className="mt-1 text-xs text-ink-500">Unggah foto sendiri dari perangkat (bukan dari dashboard admin).</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-lg text-sage-700 transition hover:bg-sage-200"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`rounded-2xl border-2 border-dashed p-4 transition ${dragOver ? "border-brand bg-brand-light/40" : "border-sage-200 bg-sage-100/40"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]); }}
          >
            <span className="mb-2 block text-sm font-bold text-sage-900">
              Foto Produk <span className="font-normal text-ink-500">(opsional — bisa drag & drop)</span>
            </span>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sage-200 bg-white">
                {preview ? (
                  <img src={preview} alt="Preview produk" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl">🖼️</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <label className="cursor-pointer rounded-xl bg-sage-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-sage-700">
                    {preview ? "Ganti Foto" : "Pilih Foto"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT}
                      onChange={(e) => pickFile(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {preview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-ink-500">
                  {imageFile ? `Terpilih: ${imageFile.name}` : "JPG, PNG, atau WebP. Maks 2MB."}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <TextInput
                label="Nama Produk"
                required
                placeholder="cth: Kopi Arabika 250g"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <TextInput
              label="SKU (opsional)"
              placeholder="cth: KPI-001"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
            <TextInput
              label="Berat (gram, opsional)"
              type="number"
              min="0"
              placeholder="cth: 250"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
            <TextInput
              label="Harga (Rp)"
              type="number"
              min="0"
              required
              placeholder="cth: 50000"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextInput
              label="Stok"
              type="number"
              min="0"
              required
              placeholder="cth: 20"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Deskripsi"
                placeholder="Ceritakan keunggulan produk, bahan, cara pakai..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
