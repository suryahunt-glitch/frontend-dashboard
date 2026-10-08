import client from "./client";

function extractPage(data) {
  if (Array.isArray(data)) return { items: data, meta: null };
  const inner = data?.data ?? [];
  if (Array.isArray(inner)) return { items: inner, meta: null };
  return { items: inner?.data ?? [], meta: inner };
}

export async function fetchAdminStats() {
  const { data } = await client.get("/admin/stats");
  return data;
}

export async function fetchAdminProducts({ search = "", page = 1 } = {}) {
  const { data } = await client.get("/admin/products", {
    params: { search: search || undefined, page: page > 1 ? page : undefined },
  });
  return extractPage(data);
}

export async function deleteAdminProduct(id) {
  const { data } = await client.delete(`/admin/products/${id}`);
  return data;
}

export async function fetchAdminOrders({ status = "", page = 1 } = {}) {
  const { data } = await client.get("/admin/orders", {
    params: { status: status || undefined, page: page > 1 ? page : undefined },
  });
  return extractPage(data);
}

export async function updateAdminOrderStatus(id, status) {
  const { data } = await client.put(`/admin/orders/${id}/status`, { status });
  return data.data ?? data;
}

export async function fetchAdminStores({ search = "", page = 1 } = {}) {
  const { data } = await client.get("/admin/stores", {
    params: { search: search || undefined, page: page > 1 ? page : undefined },
  });
  return extractPage(data);
}

export async function deleteAdminStore(id) {
  const { data } = await client.delete(`/admin/stores/${id}`);
  return data;
}

export async function fetchAdminUsers({ search = "", page = 1 } = {}) {
  const { data } = await client.get("/admin/users", {
    params: { search: search || undefined, page: page > 1 ? page : undefined },
  });
  return extractPage(data);
}

export async function setAdminUser(id, isAdmin) {
  const { data } = await client.put(`/admin/users/${id}/admin`, { is_admin: isAdmin });
  return data;
}
