import client from "./client";

// Publik: semua produk (opsional filter per toko), atau detail satu produk
export async function fetchProducts({ search = "", storeId = "" } = {}) {
  const { data } = await client.get("/products", {
    params: { search: search || undefined, store_id: storeId || undefined },
  });
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function fetchProduct(id) {
  const { data } = await client.get(`/products/${id}`);
  return data.data ?? data;
}

// Kelola produk milik toko sendiri (butuh login + punya toko)
export async function createProduct(payload) {
  const { data } = await client.post("/products", payload);
  return data.data ?? data;
}

export async function updateProduct(id, payload) {
  const { data } = await client.put(`/products/${id}`, payload);
  return data.data ?? data;
}

export async function deleteProduct(id) {
  await client.delete(`/products/${id}`);
}
