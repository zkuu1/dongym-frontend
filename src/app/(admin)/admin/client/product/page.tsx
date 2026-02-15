"use client";

import { useState } from "react";
import type { Product } from "@/types/interface";
import { formatDate, formatPrice } from "@/lib/utils";
import { DeleteButton, EditButton } from "@/components/Button";
import { useMemo } from "react";

interface ProductTableProps {
  data: Product[];
}

export default function ProductTable({ data }: ProductTableProps) {
 // ================= IMPORT PAGINATION RESOURCE =============================
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   const [search, setSearch] = useState("");
   const filteredData = useMemo(() => {
   if (!search) return data;
 
   return data.filter((product) =>
     [product.name, product.description, product.price, product.stock, product.categoryId, product.createdAt]
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
        <h3 className="text-lg font-semibold text-gray-800">List Produk</h3>
      </div>

      {/* Search Input */}
        <input
          type="text"
          placeholder="Cari produk..."
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
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Produk</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Gambar</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Harga</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Stock</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Category ID</th>
              <th className="px-6 py-3 text-left text-xs text-black font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 text-black">{customer.id}</td>
                <td className="px-6 py-4 text-black">{customer.name}</td>
                <td className="px-6 py-4 text-black">{customer.description}</td>
                <td className="px-6 py-4 text-black">
                  {customer.image ? customer.image : "Tidak ada gambar"}
                </td>
                <td className="px-6 py-4 text-black">
                  {formatPrice(customer.price)}
                </td>
                <td className="px-6 py-4 text-black">{customer.stock}</td>
                <td className="px-6 py-4 text-black">{customer.categoryId}</td>
                <td className="text-black">
                  <EditButton id={""}/>
                  <DeleteButton id={""}/>
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
