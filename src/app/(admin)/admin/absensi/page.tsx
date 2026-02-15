import AbsensiTable from "@/app/admin/client/absensi/page";
import { getAllAbsensi } from "@/lib/api";

export default async function Page() {
  const absensiResponse = await getAllAbsensi();
  console.log("📌 SERVER: absensiResponse =", absensiResponse);

  const allAbsensi = Array.isArray(absensiResponse?.data?.data)
    ? absensiResponse.data.data
    : [];

  return (
    <AbsensiTable data={allAbsensi} />
  );
}
