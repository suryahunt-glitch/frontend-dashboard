import client from "./client";

// Normalisasi: backend baru mengembalikan { data: {...} } yang sudah rapi,
// tapi tetap dukung format lama (detail/store nested, paginasi Laravel).
export function normalizeProduct(raw) {
  if (!raw) return raw;
  const detail = raw.detail ?? {};
  const store = raw.store ?? {};
  return {
    id: raw.id,
    store_id: raw.store_id ?? store.id,
    store_name: raw.store_name ?? store.name,
    name: raw.name,
    sku: raw.sku,
    price: Number(raw.price) || 0,
    stock: Number(raw.stock ?? 0),
    description: raw.description ?? detail.description ?? "",
    weight: raw.weight ?? detail.weight ?? null,
    image_path: raw.image_path,
    image_url: raw.image_url,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function extractList(data) {
  const paginated = data?.data ?? data;
  const items = Array.isArray(paginated) ? paginated : paginated?.data ?? [];
  return { items, meta: Array.isArray(paginated) ? null : paginated };
}

// Publik: semua produk (opsional filter per toko + search backend)
export async function fetchProducts({ search = "", storeId = "", page = 1 } = {}) {
  const { data } = await client.get("/products", {
    params: {
      search: search || undefined,
      store_id: storeId || undefined,
      page: page > 1 ? page : undefined,
    },
  });
  const { items, meta } = extractList(data);
  return { items: items.map(normalizeProduct), meta };
}

// Versi ringkas untuk komponen lama yang expects array langsung.
export async function fetchProductsArray(params) {
  const { items } = await fetchProducts(params);
  return items;
}

export async function fetchProduct(id) {
  const { data } = await client.get(`/products/${id}`);
  return normalizeProduct(data.data ?? data);
}

// Kelola produk milik toko sendiri (butuh login + punya toko).
// payload berupa FormData (mendukung upload file "image") atau object biasa.
export async function createProduct(payload) {
  const { data } = await client.post("/products", payload);
  return normalizeProduct(data.data ?? data);
}

export async function updateProduct(id, payload) {
  // Laravel tidak bisa parse file upload lewat method PUT langsung,
  // jadi kirim POST dengan "_method=PUT" (method spoofing).
  if (payload instanceof FormData) {
    if (![...payload.keys()].includes("_method")) payload.append("_method", "PUT");
    const { data } = await client.post(`/products/${id}`, payload);
    return normalizeProduct(data.data ?? data);
  }
  const { data } = await client.put(`/products/${id}`, payload);
  return normalizeProduct(data.data ?? data);
}

export async function deleteProduct(id) {
  await client.delete(`/products/${id}`);
}
