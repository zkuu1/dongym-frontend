"use client";

import { useState, useEffect } from "react";
import { searchAbsensiById, updateAbsensiById } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function EditAbsensiModal({ userId, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    date: "",
    status: "",
  });

  const [original, setOriginal] = useState<any>(null);

  // ==========================
  // FETCH USER DATA
  // ==========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await searchAbsensiById(userId);

        if (!res.success || !res.data) {
          toast.error(res.message || "User not found");
          return;
        }

        const user = res.data;

        setOriginal(user);
        setForm({
          name: user.name || "",
          date: user.date || "",
          status: user.status || "",
         
        });
      } catch (err: any) {
        toast.error(err.message);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================
  // SUBMIT UPDATE
  // ==========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateAbsensiById(userId, form);

      if (!res.success) {
        toast.error(res.message || "Gagal update user");
        return;
      }

      toast.success("Berhasil update user!");

      router.refresh(); // refresh halaman
      onClose(); // tutup modal

    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false); // <-- selalu dijalankan
    }
  };

  // ==========================
  // LOADING STATE
  // ==========================
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-white">
        Loading user data...
      </div>
    );
  }

  // ==========================
  // UI MODAL
  // ==========================
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-[450px]">
        
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        {/* BEFORE UPDATE */}
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <h3 className="font-medium mb-2">Data User Sebelum Update :</h3>

          {original ? (
            <>
              <p><b>Name:</b> {original.name}</p>
              <p><b>Tanggal:</b> {original.date}</p>
              <p><b>Status:</b> {original.status}</p>
              
            </>
          ) : (
            <p className="text-red-500">No original data loaded.</p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="text-sm">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="text-sm">Tanggal Absensi</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="text-sm">Status Member</label>
            <input
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className="px-4 py-2 bg-base_purple text-white rounded disabled:bg-blue-300"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
