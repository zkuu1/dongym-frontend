'use client'

import { useEffect, useState } from "react"
import {
  getAllMembership,
  createMembership,
  updateMembershipById,
  deleteMembershipById,
} from "@/data/api/membershipApi"
import { getAllUser } from "@/data/api/userApi"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  CreditCard,
  User,
  Calendar,
  FileSpreadsheet,
} from "lucide-react"
import { utils, writeFile } from "xlsx";

type MembershipData = {
  id: string | number
  idUser: string | number
  name: string
  description?: string | null
  noMember: string
  expiredAt: string
}

type UserData = { id: string | number; name: string; email: string; image?: string | null }
type ModalMode = "create" | "edit" | "delete" | null

export default function AdminMembershipPage() {
  const [memberships, setMemberships] = useState<MembershipData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<MembershipData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    idUser: "",
    name: "",
    description: "",
    noMember: "",
    expiredAt: "",
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [memRes, userRes] = await Promise.allSettled([
        getAllMembership(),
        getAllUser(),
      ])
      if (memRes.status === "fulfilled") setMemberships(memRes.value?.data ?? [])
      if (userRes.status === "fulfilled") setUsers(userRes.value?.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm({ 
      idUser: users[0]?.id ? String(users[0].id) : "", 
      name: "", 
      description: "", 
      noMember: "", 
      expiredAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16) 
    })
    setError(""); setModalMode("create")
  }

  const openEdit = (m: MembershipData) => {
    setSelected(m)
    setForm({ 
      idUser: String(m.idUser), 
      name: m.name, 
      description: m.description || "", 
      noMember: m.noMember, 
      expiredAt: m.expiredAt ? new Date(m.expiredAt).toISOString().slice(0, 16) : ""
    })
    setError(""); setModalMode("edit")
  }

  const openDelete = (m: MembershipData) => { setSelected(m); setError(""); setModalMode("delete") }
  const closeModal = () => { setModalMode(null); setSelected(null); setError(""); setSuccess("") }

  const handleCreate = async () => {
    if (!form.idUser || !form.name || !form.noMember || !form.expiredAt) { 
      setError("Field User, Nama, No Member, dan Expiry wajib diisi."); 
      return 
    }
    setSubmitting(true); setError("")
    try {
      const userId = Number(form.idUser)
      if (!userId || isNaN(userId)) {
        throw new Error("Silakan pilih member terlebih dahulu.")
      }

      const payload = { 
        idUser: userId, 
        name: form.name, 
        description: form.description, 
        noMember: form.noMember, 
        expiredAt: new Date(form.expiredAt).toISOString() 
      }
      console.log("Creating Membership Payload:", payload)
      await createMembership(payload)
      setSuccess("Membership berhasil dibuat!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { 
      console.error("Create Membership Error:", err)
      setError(err.message || "Gagal membuat membership.") 
    }
    finally { setSubmitting(false) }
  }

  const handleUpdate = async () => {
    if (!selected) return
    setSubmitting(true); setError("")
    try {
      const userId = Number(form.idUser)
      if (!userId || isNaN(userId)) {
        throw new Error("Silakan pilih member terlebih dahulu.")
      }

      const payload = { 
        idUser: userId, 
        name: form.name, 
        description: form.description, 
        noMember: form.noMember, 
        expiredAt: new Date(form.expiredAt).toISOString() 
      }
      console.log("Updating Membership Payload:", payload)
      await updateMembershipById(String(selected.id), payload)
      setSuccess("Membership berhasil diupdate!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { 
      console.error("Update Membership Error:", err)
      setError(err.message || "Gagal mengupdate membership.") 
    }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!selected) return
    setSubmitting(true); setError("")
    try {
      await deleteMembershipById(String(selected.id))
      setSuccess("Membership berhasil dihapus!")
      await fetchData(); setTimeout(closeModal, 1000)
    } catch (err: any) { setError(err.message || "Gagal menghapus membership.") }
    finally { setSubmitting(false) }
  }

  const filtered = memberships.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.noMember?.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportToExcel = () => {
    if (filtered.length === 0) return
    const data = filtered.map(m => {
      const u = users.find(u => String(u.id) === String(m.idUser))
      return {
        "User Name": u?.name || "N/A",
        "User Email": u?.email || "N/A",
        "Package": m.name,
        "No Member": m.noMember,
        "Expiry Date": new Date(m.expiredAt).toLocaleString("id-ID"),
        "Status": new Date(m.expiredAt) < new Date() ? "EXPIRED" : "ACTIVE"
      }
    })
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Memberships")
    writeFile(wb, `Memberships_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Membership Management</h1>
          <p className="text-gray-400 text-sm mt-1">{memberships.length} total membership</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition active:scale-95 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            <FileSpreadsheet size={18} /> Export to Excel
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition active:scale-95">
            <Plus size={18} /> Tambah Membership
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Cari membership (nama atau no member)..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800/60 border-b border-gray-700 text-gray-400 text-sm">
                <th className="px-5 py-3.5 text-left w-16">No</th>
                <th className="px-5 py-3.5 text-left">Member</th>
                <th className="px-5 py-3.5 text-left">Tipe & No</th>
                <th className="px-5 py-3.5 text-left">Masa Berlaku</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center"><Loader2 size={28} className="animate-spin text-blue-400 mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-500">
                  <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Tidak ada membership ditemukan.</p>
                </td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 text-gray-500 text-sm font-medium">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-500/20 shadow-sm">
                        {(() => {
                          const u = users.find(u => String(u.id) === String(m.idUser));
                          if (u?.image && !u.image.includes("image.com")) {
                            return <img src={u.image} alt={u.name} className="w-full h-full object-cover" />;
                          }
                          return (
                            <span className="text-blue-400 font-bold text-sm">
                              {u?.name?.charAt(0).toUpperCase() || <User size={18} />}
                            </span>
                          );
                        })()}
                      </div>
                      <div>
                        <span className="text-white font-medium block">
                          {users.find(u => String(u.id) === String(m.idUser))?.name || `ID: ${m.idUser}`}
                        </span>
                        <span className="text-xs text-gray-500">{users.find(u => String(u.id) === String(m.idUser))?.email || "User data loading..."}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white font-medium block">{m.name}</span>
                    <span className="text-xs text-blue-400 font-mono">{m.noMember}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={14} />
                      {new Date(m.expiredAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {new Date(m.expiredAt) < new Date() && (
                      <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md mt-1 inline-block border border-red-500/20">Expired</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(m)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"><Pencil size={15} /></button>
                      <button onClick={() => openDelete(m)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition"><Trash2 size={15} /></button>
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
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900/50">
              <h2 className="text-lg font-bold text-white">
                {modalMode === "create" ? "Tambah Membership" : modalMode === "edit" ? "Edit Membership" : "Hapus Membership"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  <p className="font-bold mb-1 flex items-center gap-2">Error Simpan Data</p>
                  <ul className="list-disc list-inside space-y-1 opacity-90">
                    {error.split("|").map((msg, idx) => (
                      <li key={idx}>{msg.trim().replace(/^Validasi Error:\s*/, "")}</li>
                    ))}
                  </ul>
                </div>
              )}
              {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">✅ {success}</div>}

              {modalMode === "delete" && (
                <p className="text-gray-400 text-sm">Yakin ingin menghapus membership <span className="text-white font-semibold">{selected?.name}</span> milik <span className="text-white font-semibold">{users.find(u => String(u.id) === String(selected?.idUser))?.name || "Member ini"}</span>?</p>
              )}

              {(modalMode === "create" || modalMode === "edit") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Pilih Member</label>
                    <select value={form.idUser} onChange={e => setForm({ ...form, idUser: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition">
                      <option value="">— Pilih Member —</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nama Paket / Tipe</label>
                    <select 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="">— Pilih Paket —</option>
                      <option value="Non Member">Non Member</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
                    <textarea placeholder="Deskripsi paket membership..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[80px]" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">No Member</label>
                      <input type="text" placeholder="1111" value={form.noMember} onChange={e => setForm({ ...form, noMember: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition uppercase" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Berlaku Hingga</label>
                      <input type="datetime-local" value={form.expiredAt} onChange={e => setForm({ ...form, expiredAt: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700 bg-gray-900/50">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition text-sm font-medium">Batal</button>
              {modalMode === "create" && (
                <button onClick={handleCreate} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {submitting ? "Menyimpan..." : "Buat Membership"}
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
                  {submitting ? "Ya, Hapus" : "Ya, Hapus"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
