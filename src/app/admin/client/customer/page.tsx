"use client";

  // ================= MAIN IMPORT =============================
import { useState, useMemo } from "react";
import type { Customer } from "@/types/interface";
import { formatDate } from "@/lib/utils";
import { EditUserButton } from "../../components/ui/button";
import { DeleteUserButton } from "../../components/ui/button";
import { CreateUserButton } from "../../components/ui/button";


  // ================= IMPORT FROM INTERFACE =============================
interface CustomerTableProps {
  data: Customer[];
}

export default function CustomerTable({ data }: CustomerTableProps) {

  // ================= IMPORT PAGINATION RESOURCE =============================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const filteredData = useMemo(() => {
  if (!search) return data;

  return data.filter((customer) =>
    [customer.name, customer.email, customer.address, customer.role, customer.membership, customer.createdAt]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  }, [data, search]);

const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  // ================= RETURN =============================
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">

        {/* // ================= HEADER =============================  */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Customer</h3>
      </div>

      {/* Search Input */}
        <input
          type="text"
          placeholder="Cari customer..."
          className="border px-4 py-2 rounded-md w-64 text-black"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <CreateUserButton userId={""}/>

      {/* // ================= TABLE =============================  */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">ID</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Customer</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Email</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Alamat</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Role</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Status Member</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Foto Profil</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Akun Dibuat</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Action</th>
            </tr>
          </thead>

          {/* // ================= MAPPING DATA FROM API =============================  */}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 text-black">{customer.id}</td>
                <td className="px-6 py-4 text-black">{customer.name}</td>
                <td className="px-6 py-4 text-black">{customer.email}</td>
                <td className="px-6 py-4 text-black">{customer.address}</td>
                <td className="px-6 py-4 text-black">{customer.role}</td>
                <td className="px-6 py-4 text-black">{customer.membership}</td>
                <td className="px-6 py-4 text-black">{customer.image}</td>
                <td className="px-6 py-4 text-black">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="text-black">
                  <EditUserButton userId={customer.id} />
                  <DeleteUserButton userId={customer.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* // ================= PAGINATION =============================  */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} results
        </div>

        <div className="flex space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 border rounded-md text-sm ${
              currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`px-3 py-1 border rounded-md text-sm ${
              currentPage === totalPages
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
