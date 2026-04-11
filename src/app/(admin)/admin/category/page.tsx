'use client'

import { useEffect, useState } from "react"
import {
  getAllCategory,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "@/data/api/categoryApi"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  Tag,
} from "lucide-react"

type CategoryData = { id: string; name: string }
type ModalMode = "create" | "edit" | "delete" | null

const PALETTE = [
  "bg-violet-500/15 text-violet-400",
  "bg-blue-500/15 text-blue-400",
  "bg-emerald-500/15 text-emerald-400",
  "bg-orange-500/15 text-orange-400",
  "bg-pink-500/15 text-pink-400",
  "bg-cyan-500/15 text-cyan-400",
]

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<CategoryData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formName, setFormName] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllCategory()
      setCategories(res?.data ?? [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setFormName(""); setError(""); setModalMode("create") }
  const openEdit = (c: CategoryData) => { setSelected(c); setFormName(c.name); setError(""); setModalMode("edit") }
  const openDelete = (c: CategoryData) => { setSelected(c); setError(""); setModalMode("delete") }
  const closeModal = () => { setModalMode(null); setSelected(null); setError(""); setSuccess("") }

  const handleCreate = async () => {
    if (!formName.trim()) { setError("Nama kategori wajib diisi."); return }
    setSubmitting(true); setError("")
    try {
      await createCategory({ name: formName.trim() })
      setSuccess("Kategori berhasil dibuat!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal membuat kategori.") }
    finally { setSubmitting(false) }
  }

  const handleUpdate = async () => {
    if (!selected || !formName.trim()) { setError("Nama kategori wajib diisi."); return }
    setSubmitting(true); setError("")
    try {
      await updateCategoryById(selected.id, { name: formName.trim() })
      setSuccess("Kategori berhasil diupdate!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal mengupdate kategori.") }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!selected) return
    setSubmitting(true); setError("")
    try {
      await deleteCategoryById(selected.id)
      setSuccess("Kategori berhasil dihapus!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal menghapus kategori.") }
    finally { setSubmitting(false) }
  }

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} total kategori</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition">
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Cari kategori..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition" />
      </div>

      {/* Grid Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-emerald-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <Tag size={40} className="mx-auto mb-3 opacity-30" />
          <p>Tidak ada kategori ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c, i) => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${PALETTE[i % PALETTE.length].split(" ")[0]}`}>
                  <Tag size={18} className={PALETTE[i % PALETTE.length].split(" ")[1]} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"><Pencil size={14} /></button>
                  <button onClick={() => openDelete(c)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-white font-semibold">{c.name}</p>
              <p className="text-gray-500 text-xs mt-1">ID: {String(c.id).slice(0, 8)}...</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">
                {modalMode === "create" ? "Tambah Kategori" : modalMode === "edit" ? "Edit Kategori" : "Hapus Kategori"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">⚠️ {error}</div>}
              {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">✅ {success}</div>}

              {modalMode === "delete" ? (
                <p className="text-gray-400 text-sm">Yakin ingin menghapus kategori <span className="text-white font-semibold">{selected?.name}</span>?</p>
              ) : (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nama Kategori</label>
                  <input type="text" placeholder="contoh: Supplement" value={formName} onChange={e => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition" />
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition text-sm font-medium">Batal</button>
              {modalMode === "create" && (
                <button onClick={handleCreate} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {submitting ? "Menyimpan..." : "Buat"}
                </button>
              )}
              {modalMode === "edit" && (
                <button onClick={handleUpdate} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition disabled:opacity-60">
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