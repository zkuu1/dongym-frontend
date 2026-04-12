"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipboardList, Trash2, Search, Calendar, User, Info, Hash, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { getAllAbsensi, deleteAbsensi } from "@/data/api/absensiApi";
import { utils, writeFile } from "xlsx";

export default function AdminAbsensiPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<"delete" | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await getAllAbsensi();
      setRecords(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDelete = (record: any) => {
    setSelected(record);
    setError("");
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setError("");
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      await deleteAbsensi(selected.id);
      toast.success("Record deleted");
      setRecords(records.filter((r) => r.id !== selected.id));
      setTimeout(closeModal, 500);
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      toast.error(err.message || "Failed to delete");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.noMember?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportToExcel = () => {
    if (filteredRecords.length === 0) {
      toast.warn("No data to export");
      return;
    }

    const dataToExport = filteredRecords.map((r) => ({
      "User Name": r.users?.name || "Unknown",
      "Email": r.users?.email || "N/A",
      "Member ID": r.noMember || "-",
      "Date": new Date(r.date).toLocaleDateString("id-ID"),
      "Status": r.status.toUpperCase(),
      "Created At": new Date(r.createdAt).toLocaleString("id-ID"),
    }));

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Attendance List");

    const fileName = `Attendance_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
    writeFile(workbook, fileName);
    toast.success("Excel exported successfully!");
  };

  return (
    <div className="space-y-6">
      <ToastContainer theme="dark" position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance Management</h1>
          <p className="text-gray-400 text-sm mt-1">{records.length} total data absensi</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition active:scale-95 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            <FileSpreadsheet size={18} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          placeholder="Cari absensi (nama atau id member)..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition" 
        />
      </div>

      {/* Table Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800/60 border-b border-gray-700 text-gray-400 text-sm">
                <th className="px-5 py-3.5 text-left w-16 text-xs uppercase tracking-widest font-black">User</th>
                <th className="px-5 py-3.5 text-left text-xs uppercase tracking-widest font-black">Member ID</th>
                <th className="px-5 py-3.5 text-left text-xs uppercase tracking-widest font-black">Date</th>
                <th className="px-5 py-3.5 text-left text-xs uppercase tracking-widest font-black">Status</th>
                <th className="px-5 py-3.5 text-center text-xs uppercase tracking-widest font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500">
                    <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No attendance records found.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20 shadow-sm">
                          {record.users?.image && !record.users.image.includes("image.com") ? (
                            <img src={record.users.image} alt={record.users.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-blue-400 font-bold text-sm">
                              {record.users?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{record.users?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{record.users?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-300 text-sm font-mono">{record.noMember || "-"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar size={14} className="text-purple-500" />
                        {new Date(record.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        record.status === 'member' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button 
                        onClick={() => openDelete(record)}
                        className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition shadow-lg"
                      >
                        <Trash2 size={16} />
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
              <h2 className="text-lg font-bold text-white">Hapus Data Kehadiran</h2>
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
              <p className="text-gray-400 text-sm">
                Yakin ingin menghapus data kehadiran milik <span className="text-white font-semibold">{selected?.users?.name || "User ini"}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              {selected && (
                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Calendar size={16} className="text-blue-400" />
                   </div>
                   <div className="text-xs">
                      <p className="text-gray-400">Tanggal Kehadiran:</p>
                      <p className="text-white font-bold">{new Date(selected.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
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
  );
}
