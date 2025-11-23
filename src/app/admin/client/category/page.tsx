"use client";

import { useState } from "react";
import type { Category } from "@/types/interface";
import { formatDate } from "@/lib/utils";
import { DeleteAbsensiButton, EditAbsensiButton } from "@/components/Button";
import { useMemo } from "react";

interface CategoryTableProps {
  data: Category[];
}

export default function CategoryTable({ data }: CategoryTableProps) {
  // ================= IMPORT PAGINATION RESOURCE =============================
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 10;
     const [search, setSearch] = useState("");
     const filteredData = useMemo(() => {
     if (!search) return data;
   
     return data.filter((category) =>
       [category.id, category.name, category.description, category.createdAt]
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">

      {/* Header */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Category</h3>
      </div>

      {/* Search Input */}
        <input
          type="text"
          placeholder="Cari category..."
          className="border px-4 py-2 rounded-md w-64 text-black"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

      

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">ID</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Nama Category</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 text-black">{category.id}</td>
                <td className="px-6 py-4 text-black">{category.name}</td>
                <td className="px-6 py-4 text-black">{category.description}</td>
                <td className="px-6 py-4 text-black">
                  {formatDate(category.createdAt)}
                </td>
                <td className=" text-black">
                    <EditAbsensiButton id={""}/>
                    <DeleteAbsensiButton id={""}/>
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
