'use client';

import { useEffect, useState } from 'react';
import { getAllProduct } from '@/data/api/productApi';

export default function Membershiptable() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllProduct();
        console.log('Response dari API:', res); // untuk debugging

        // Menangani berbagai kemungkinan struktur response
        let productsData: any[] = [];

        if (res && typeof res === 'object') {
          // Jika response langsung array
          if (Array.isArray(res)) {
            productsData = res;
          }
          // Jika response berupa objek dengan properti data (misal: { data: [...] })
          else if (res.data && Array.isArray(res.data)) {
            productsData = res.data;
          }
          // Jika response berupa objek dengan properti lain yang berisi array
          else if (res.products && Array.isArray(res.products)) {
            productsData = res.products;
          }
          // Jika tidak ditemukan array, coba cari properti pertama yang bernilai array
          else {
            const firstArrayProp = Object.values(res).find(
              (value) => Array.isArray(value)
            );
            if (firstArrayProp) {
              productsData = firstArrayProp as any[];
            }
          }
        }

        setProducts(productsData);
      } catch (err: any) {
        console.error('Gagal mengambil produk:', err);
        setError(err.message || 'Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Tampilkan loading
  if (loading) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  // Tampilkan error
  if (error) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada data
  if (products.length === 0) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <p className="text-center text-gray-400">Belum ada produk tersedia.</p>
      </div>
    );
  }

  // Render tabel
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left">ID Product</th>
              <th className="px-6 py-3 text-left">ID Category</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {products.map((product) => (
              <tr
                key={product.id || product.productId || Math.random()}
                className="hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4">{product.id || '-'}</td>
                <td className="px-6 py-4">{product.idCategory || product.categoryId || '-'}</td>
                <td className="px-6 py-4 font-medium">{product.name || '-'}</td>
                <td className="px-6 py-4 text-gray-400">{product.description || '-'}</td>
                <td className="px-6 py-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4">
                  {product.price
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(product.price)
                    : '-'}
                </td>
                <td className="px-6 py-4">
                  {/* Tombol aksi bisa ditambahkan di sini */}
                  <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                  <button className="text-red-400 hover:text-red-300">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}