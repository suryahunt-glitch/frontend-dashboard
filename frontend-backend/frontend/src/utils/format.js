export function formatIDR(value) {
  const num = Number(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}
