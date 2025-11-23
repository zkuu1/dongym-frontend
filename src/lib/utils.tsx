export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "-"; // fallback kalau kosong

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "-"; // fallback kalau invalid

  const formatter = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(parsedDate);
}

export function formatPrice(price: any): string {
  if (price === null || price === undefined || price === "") return "-";

  // Hilangkan spasi & koma
  const cleaned = String(price).replace(/[^\d]/g, "");

  const numeric = Number(cleaned);
  if (isNaN(numeric)) return "-";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}


