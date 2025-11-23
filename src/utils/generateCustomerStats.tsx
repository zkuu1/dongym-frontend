import { Customer } from "@/types/interface";

export function generateCustomerStats(customers: Customer[]) {
  const totalCustomers = customers.length;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const newThisMonth = customers.filter((c) => {
    const created = new Date(c.createdAt);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;

  const memberCount = customers.filter((c) => c.membership === "member").length;

  return [
    {
      title: "Total Customers",
      value: totalCustomers,
      target: "Semua pelanggan terdaftar",
    },
    {
      title: "Pelanggan Baru Bulan Ini",
      value: newThisMonth,
      target: "User baru per bulan",
    },
    {
      title: "Total Member",
      value: memberCount,
      target: "Membership aktif",
    },
  ];
}
