"use client";

import { useState, useEffect } from "react";
import { searchUserById, updateUserById } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function EditUserModal({ userId, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    membership: ""
  });

  const [original, setOriginal] = useState<any>(null);

  // ==========================
  // FETCH USER DATA
  // ==========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await searchUserById(userId);

        if (!res.success || !res.data) {
          toast.error(res.message || "User not found");
          return;
        }

        const user = res.data;

        setOriginal(user);
        setForm({
          name: user.name || "",
          email: user.email || "",
          address: user.address || "",
          role: user.role || "",
          membership: user.membership || ""
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
      const res = await updateUserById(userId, form);

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
              <p><b>Email:</b> {original.email}</p>
              <p><b>Alamat:</b> {original.address}</p>
              <p><b>Role:</b> {original.role}</p>
              <p><b>Membership:</b> {original.membership}</p>
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
            <label className="text-sm">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="text-sm">Alamat</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div>
            <label className="text-sm">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            >
              <option value="">Pilih Role</option>
              <option value="admin">admin</option>
              <option value="customer">customer</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Membership</label>
            <select
              name="membership"  // ✔ FIXED FIELD NAME
              value={form.membership}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
            >
              <option value="">Pilih Membership</option>
              <option value="member">member</option>
              <option value="non_member">non_member</option>
            </select>
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
              className="px-4 py-2 bg-base_semi_purple text-white rounded disabled:bg-blue-300"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
