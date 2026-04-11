'use client'

import { useEffect, useState } from "react"
import {
  getAllComments,
  deleteComment,
} from "@/data/api/commentApi"
import { getAllUser } from "@/data/api/userApi"
import { getAllProduct } from "@/data/api/productApi"
import {
  MessageSquare,
  Trash2,
  X,
  Search,
  Loader2,
  User,
  Package,
  Calendar,
} from "lucide-react"

type CommentData = {
  id: string | number
  idUser: string | number
  idProduct: string | number
  comment: string
  createdAt: string
}

type UserData = { id: string | number; name: string }
type ProductData = { id: string | number; name: string }
type ModalMode = "delete" | null

export default function AdminCommentPage() {
  const [comments, setComments] = useState<CommentData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<CommentData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const [comRes, userRes, prodRes] = await Promise.allSettled([
        getAllComments(1, 100), // Fetch a good chunk
        getAllUser(),
        getAllProduct(),
      ])

      if (comRes.status === "fulfilled") setComments(comRes.value?.data ?? [])
      if (userRes.status === "fulfilled") setUsers(userRes.value?.data ?? [])
      if (prodRes.status === "fulfilled") setProducts(prodRes.value?.data ?? [])
    } catch (err) {
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openDelete = (c: CommentData) => {
    setSelected(c)
    setError("")
    setModalMode("delete")
  }

  const closeModal = () => {
    setModalMode(null)
    setSelected(null)
    setError("")
    setSuccess("")
  }

  const handleDelete = async () => {
    if (!selected) return
    setSubmitting(true); setError("")
    try {
      await deleteComment(selected.id)
      setSuccess("Komentar berhasil dihapus!")
      await fetchData()
      setTimeout(closeModal, 1000)
    } catch (err: any) {
      setError(err.message || "Gagal menghapus komentar.")
    } finally {
      setSubmitting(false)
    }
  }

  const getUserName = (id: string | number) => {
    return users.find(u => String(u.id) === String(id))?.name || `User ID: ${id}`
  }

  const getProductName = (id: string | number) => {
    return products.find(p => String(p.id) === String(id))?.name || `Product ID: ${id}`
  }

  const filtered = comments.filter(c =>
    c.comment.toLowerCase().includes(search.toLowerCase()) ||
    getUserName(c.idUser).toLowerCase().includes(search.toLowerCase()) ||
    getProductName(c.idProduct).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Comment Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Moderasi komentar dari user pada produk
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Cari komentar, user, atau produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800/60 border-b border-gray-700 text-gray-400 text-sm">
                <th className="px-5 py-3.5 text-left w-16">No</th>
                <th className="px-5 py-3.5 text-left">User</th>
                <th className="px-5 py-3.5 text-left">Produk</th>
                <th className="px-5 py-3.5 text-left">Komentar</th>
                <th className="px-5 py-3.5 text-left">Waktu</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 size={28} className="animate-spin text-blue-400 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Tidak ada komentar ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4 text-gray-500 text-sm font-medium">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        <span className="text-white font-medium text-sm">
                          {getUserName(c.idUser)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-500" />
                        <span className="text-gray-300 text-sm truncate max-w-[150px]">
                          {getProductName(c.idProduct)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-200 text-sm line-clamp-2 max-w-xs">{c.comment}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar size={12} />
                        {new Date(c.createdAt).toLocaleDateString("id-ID", {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => openDelete(c)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition"
                        title="Hapus Komentar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      {modalMode === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Hapus Komentar</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
                  ✅ {success}
                </div>
              )}
              <p className="text-gray-400 text-sm">
                Yakin ingin menghapus komentar dari <span className="text-white font-semibold">{getUserName(selected?.idUser || "")}</span>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              {selected && (
                <div className="p-3 bg-gray-800 rounded-xl border border-gray-700 italic text-sm text-gray-300">
                  "{selected.comment}"
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700 bg-gray-900/50">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-60"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {submitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
