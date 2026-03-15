// import { getServerSession } from "next-auth";
// import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import { CreateButton, EditButton, DeleteButton } from "./Button";
// import { getUsers } from "@/lib/data";
// import { formatDate } from "@/lib/utils";
// import { UserPayload } from "@/types/userInterface";
// import { getAllUser } from "@/data/api/userApi";

// const Statistic = async ({ searchParams }: { searchParams: { query?: string } }) => {
//   const query = searchParams?.query || "";
//   const users = await getUsers(query);

//   const allUsers = await getAllUser();

//   const getAllUsers = allUsers.map((user: any) => ({
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     image: user.image,
//     address: user.address,
//     membership: user.membership,
//     token: user.token,
//     createdAt: user.createdAt,
//   }));

//   return (
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="p-6 border-b">
//         <h1 className="text-2xl font-bold text-gray-800">
//         </h1>
//          <p className="text-gray-600">
//           Here's what's happening with your business today.
//         </p>
//         <div className="mt-4">
//           <CreateButton />
//         </div>

//         {/* Search form */}
//         <form className="mt-4">
//           <input
//             type="text"
//             name="query"
//             placeholder="Search by name or member ID..."
//             defaultValue={query}
//             className="w-full md:w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
//           />
//         </form>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Foto Profil</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Akun Dibuat Pada</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {getAllUsers.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{user.id}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.address}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.role}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.membership}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.image}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                   {formatDate(
//                     user.createdAt ? new Date(user.createdAt) : ""
//                   )}
//                 </td>
//                 <td>
//                   <EditButton id={user.id} />
//                   <DeleteButton id={user.id} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Statistic;

