// // app/dashboard/page.tsx
// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import MembershipCard from "./components/MembershipCard";

// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions);

//   // Cek apakah user sudah login
//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   try {
//       const user = await prisma.user.findUnique({
//   where: { id: session.user.id },
//   include: {
//     membership: true, // Ambil semua field Membership
//   },
// });


//     if (!user) {
//       redirect("/login");
//     }

//     return (
//       <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white shadow rounded-lg p-6 mb-8 mt-28">
//             <h1 className="text-3xl font-bold text-gray-900">
//               Selamat datang, {user.name || "Pengguna"}!
//             </h1>
//           </div>

//           {/* Kirim data membership ke komponen */}
//           <MembershipCard membership={user.membership} />
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h1>
//           <p className="mt-4 text-gray-600">
//             Gagal memuat data pengguna. Silakan coba lagi.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Muat Ulang
//           </button>
//         </div>
//       </div>
//     );
//   }
// }
