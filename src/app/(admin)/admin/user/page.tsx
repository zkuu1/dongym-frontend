'use client'

import { useEffect, useState } from "react"
import {
  getAllUser,
  createUser,
  updateUserById,
  deleteUserById,
} from "@/data/api/userApi"
import {
  UserPlus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  Users,
  ShieldCheck,
  User,
  FileSpreadsheet,
} from "lucide-react"
import { utils, writeFile } from "xlsx";

type UserData = {
  id: string
  name: string
  email: string
  address: string | null
  image: string | null
  role: string
  memberships?: { name: string }[]
}

type ModalMode = "create" | "edit" | "delete" | null

export default function AdminUserPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await getAllUser()
      setUsers(res?.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openCreate = () => {
    setForm({ name: "", email: "", password: "", address: "", role: "user" })
    setError("")
    setModalMode("create")
  }

  const openEdit = (user: UserData) => {
    setSelectedUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      address: user.address ?? "",
      role: user.role,
    })
    setError("")
    setModalMode("edit")
  }

  const openDelete = (user: UserData) => {
    setSelectedUser(user)
    setError("")
    setModalMode("delete")
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedUser(null)
    setError("")
    setSuccess("")
  }

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Nama, email, dan password wajib diisi.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address,
      })
      setSuccess("User berhasil dibuat!")
      await fetchUsers()
      setTimeout(closeModal, 1000)
    } catch (err: any) {
      setError(err.message || "Gagal membuat user.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    setError("")
    try {
      await updateUserById(selectedUser.id, {
        name: form.name,
        email: form.email,
        address: form.address,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      })
      setSuccess("User berhasil diupdate!")
      await fetchUsers()
      setTimeout(closeModal, 1000)
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate user.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    setError("")
    try {
      await deleteUserById(selectedUser.id)
      setSuccess("User berhasil dihapus!")
      await fetchUsers()
      setTimeout(closeModal, 1000)
    } catch (err: any) {
      setError(err.message || "Gagal menghapus user.")
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportToExcel = () => {
    if (filtered.length === 0) return
    const data = filtered.map(u => ({
      "ID": u.id,
      "Name": u.name,
      "Email": u.email,
      "Role": u.role.toUpperCase(),
      "Address": u.address || "-",
      "Membership": u.memberships && u.memberships.length > 0 ? u.memberships[0].name : "Non Member"
    }))
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Users")
    writeFile(wb, `Users_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            {users.length} total member terdaftar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition active:scale-95 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            <FileSpreadsheet size={18} /> Export to Excel
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition active:scale-95"
          >
            <UserPlus size={18} />
            Tambah User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800/60 border-b border-gray-700 text-gray-400 text-sm">
                <th className="px-5 py-3.5 text-left">No</th>
                <th className="px-5 py-3.5 text-left">Nama</th>
                <th className="px-5 py-3.5 text-left">Email</th>
                <th className="px-5 py-3.5 text-left">Alamat</th>
                <th className="px-5 py-3.5 text-left">Role</th>
                <th className="px-5 py-3.5 text-left">Membership</th>
                <th className="px-5 py-3.5 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 size={28} className="animate-spin text-violet-400 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Tidak ada user ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 py-4 text-gray-500 text-sm">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0 overflow-hidden border border-violet-500/20 shadow-sm">
                          {user.image && !user.image.includes("image.com") ? (
                            <img 
                              src={user.image} 
                              alt={user.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-violet-400 font-bold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{user.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">ID: {user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{user.address || "—"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                          user.role?.toLowerCase() === "admin"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {user.role?.toLowerCase() === "admin" ? (
                          <ShieldCheck size={12} />
                        ) : (
                          <User size={12} />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">
                      {user.memberships && user.memberships.length > 0
                        ? user.memberships[0].name
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDelete(user)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== MODAL ====== */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">
                {modalMode === "create" && "Tambah User Baru"}
                {modalMode === "edit" && "Edit User"}
                {modalMode === "delete" && "Hapus User"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">

              {/* Error / Success */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
                  ✅ {success}
                </div>
              )}

              {/* DELETE CONFIRM */}
              {modalMode === "delete" && (
                <p className="text-gray-400 text-sm">
                  Yakin ingin menghapus user{" "}
                  <span className="text-white font-semibold">{selectedUser?.name}</span>?
                  Tindakan ini tidak bisa dibatalkan.
                </p>
              )}

              {/* CREATE / EDIT FORM */}
              {(modalMode === "create" || modalMode === "edit") && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nama</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Password {modalMode === "edit" && <span className="text-gray-600">(kosongkan jika tidak diubah)</span>}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Alamat</label>
                    <input
                      type="text"
                      placeholder="Jl. Contoh No. 1"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                  {modalMode === "edit" && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Role</label>
                      <select
                        value={form.role?.toLowerCase()}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-violet-500 transition"
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition text-sm font-medium"
              >
                Batal
              </button>

              {modalMode === "create" && (
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  {submitting ? "Menyimpan..." : "Buat User"}
                </button>
              )}

              {modalMode === "edit" && (
                <button
                  onClick={handleUpdate}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              )}

              {modalMode === "delete" && (
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-60"
                >
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