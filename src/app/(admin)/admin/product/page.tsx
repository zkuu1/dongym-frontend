'use client'

import { useEffect, useState } from "react"
import {
  getAllProduct,
  createProduct,
  updateProductById,
  deleteProductById,
} from "@/data/api/productApi"
import { getAllCategory } from "@/data/api/categoryApi"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  ShoppingBag,
} from "lucide-react"

type ProductData = {
  id: string | number
  name: string
  description?: string | null
  image?: string | null
  price: number
  stock: number
  idCategory?: string | number
  category?: { id: string | number; name: string }
}

type CategoryData = { id: string; name: string }
type ModalMode = "create" | "edit" | "delete" | null

export default function AdminProductPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<ProductData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState<{
    name: string;
    description: string;
    image: string | File | null;
    price: string;
    stock: string;
    idCategory: string;
  }>({
    name: "",
    description: "",
    image: null,
    price: "",
    stock: "",
    idCategory: "",
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        getAllProduct(),
        getAllCategory(),
      ])
      if (prodRes.status === "fulfilled") setProducts(prodRes.value?.data ?? [])
      if (catRes.status === "fulfilled") setCategories(catRes.value?.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm({ name: "", description: "", image: null, price: "", stock: "", idCategory: categories[0]?.id ?? "" })
    setError(""); setModalMode("create")
  }
  const openEdit = (p: ProductData) => {
    setSelected(p)
    setForm({ name: p.name, description: p.description ?? "", image: p.image ?? null, price: String(p.price), stock: String(p.stock), idCategory: String(p.idCategory ?? p.category?.id ?? "") })
    setError(""); setModalMode("edit")
  }
  const openDelete = (p: ProductData) => { setSelected(p); setError(""); setModalMode("delete") }
  const closeModal = () => { setModalMode(null); setSelected(null); setError(""); setSuccess("") }

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.stock) { setError("Field Nama, Harga, Stok wajib diisi."); return }
    setSubmitting(true); setError("")
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      if (form.description) formData.append("description", form.description)
      if (form.image instanceof File) formData.append("image", form.image)
      formData.append("price", String(form.price))
      formData.append("stock", String(form.stock))
      formData.append("category_id", String(form.idCategory))

      await createProduct(formData)
      setSuccess("Produk berhasil dibuat!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal membuat produk.") }
    finally { setSubmitting(false) }
  }

  const handleUpdate = async () => {
    if (!selected) return
    setSubmitting(true); setError("")
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      if (form.description) formData.append("description", form.description)
      if (form.image instanceof File) formData.append("image", form.image)
      formData.append("price", String(form.price))
      formData.append("stock", String(form.stock))
      formData.append("category_id", String(form.idCategory))

      await updateProductById(String(selected.id), formData)
      setSuccess("Produk berhasil diupdate!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal mengupdate produk.") }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!selected) return
    setSubmitting(true); setError("")
    try {
      await deleteProductById(String(selected.id))
      setSuccess("Produk berhasil dihapus!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal menghapus produk.") }
    finally { setSubmitting(false) }
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} total produk</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition">
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800/60 border-b border-gray-700 text-gray-400 text-sm">
                <th className="px-5 py-3.5 text-left w-16">No</th>
                <th className="px-5 py-3.5 text-left">Produk</th>
                <th className="px-5 py-3.5 text-left">Deskripsi</th>
                <th className="px-5 py-3.5 text-left">Harga</th>
                <th className="px-5 py-3.5 text-left">Stok</th>
                <th className="px-5 py-3.5 text-left">Kategori</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader2 size={28} className="animate-spin text-blue-400 mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-gray-500">
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Tidak ada produk ditemukan.</p>
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 text-gray-500 text-sm font-medium">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                          <ShoppingBag size={16} className="text-blue-400" />
                        </div>
                      )}
                      <span className="text-white font-medium line-clamp-2 max-w-[150px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">
                    <p className="line-clamp-2 max-w-[200px]">{p.description || "—"}</p>
                  </td>
                  <td className="px-5 py-4 text-emerald-400 font-medium">
                    Rp {p.price?.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.stock > 10 ? "bg-emerald-500/15 text-emerald-400" :
                      p.stock > 0  ? "bg-yellow-500/15 text-yellow-400" :
                                     "bg-red-500/15 text-red-400"
                    }`}>{p.stock} unit</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">
                    {categories.find(c => String(c.id) === String(p.idCategory))?.name ?? p.category?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"><Pencil size={15} /></button>
                      <button onClick={() => openDelete(p)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">
                {modalMode === "create" ? "Tambah Produk" : modalMode === "edit" ? "Edit Produk" : "Hapus Produk"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">⚠️ {error}</div>}
              {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">✅ {success}</div>}

              {modalMode === "delete" && (
                <p className="text-gray-400 text-sm">Yakin ingin menghapus produk <span className="text-white font-semibold">{selected?.name}</span>?</p>
              )}

              {(modalMode === "create" || modalMode === "edit") && (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nama Produk</label>
                    <input type="text" placeholder="Protein Bar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
                    <textarea placeholder="Deskripsi lengkap produk..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[80px]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
                    <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files?.[0] || null })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 custom-file-input" />
                    {typeof form.image === "string" && form.image && (
                      <p className="text-xs text-gray-400 mt-2">Gambar saat ini: <a href={form.image} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">{form.image}</a></p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Harga (Rp)</label>
                      <input type="number" placeholder="25000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Stok</label>
                      <input type="number" placeholder="100" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Kategori</label>
                    <select value={form.idCategory} onChange={e => setForm({ ...form, idCategory: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition">
                      <option value="">— Pilih Kategori —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition text-sm font-medium">Batal</button>
              {modalMode === "create" && (
                <button onClick={handleCreate} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {submitting ? "Menyimpan..." : "Buat Produk"}
                </button>
              )}
              {modalMode === "edit" && (
                <button onClick={handleUpdate} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              )}
              {modalMode === "delete" && (
                <button onClick={handleDelete} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {submitting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}