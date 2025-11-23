"use client";

import { useState } from "react";
import { createUser } from "@/lib/api"; 
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; 

interface Props {
  onClose: () => void;
}

export default function CreateUserModal({ onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
    membership: ""
  });

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================
  // SUBMIT CREATE
  // ==========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await createUser(form);

      if (!res.success) {
        toast.error(res.message || "Gagal membuat user");
        return;
      }

      toast.success("User berhasil dibuat!");

      router.refresh(); // refresh halaman
      onClose(); // tutup modal

    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // UI MODAL
  // ==========================
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-[450px]">

        <h2 className="text-xl font-semibold mb-4 text-black">Create User</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="text-sm text-black">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama...."
              className="border px-3 py-2 w-full rounded text-black"
              required
            />
          </div>

          <div>
            <label className="text-sm text-black">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Masukkan email...."
              value={form.email}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded text-blac"
              required
            />
          </div>
          
           <div className="relative">
              <label className="text-sm text-black">Password</label>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password minimal 6 karakter..."
                value={form.password}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded text-black pr-10"
                required
              />
              {/* Ikon Mata */}
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
          </div>


          <div>
            <label className="text-sm text-black">Alamat</label>
            <input
              name="address"
              value={form.address}
              placeholder="Masukkan alamat...."
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded text-black"
            />
          </div>

          <div>
            <label className="text-sm text-black">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded text-black"
              required
            >
              <option value="">Pilih Role</option>
              <option value="admin">admin</option>
              <option value="customer">customer</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-black">Membership</label>
            <select
              name="membership"
              value={form.membership}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded text-black"
              required
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
              className="px-4 py-2 bg-gray-200 rounded text-black"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className="px-4 py-2 bg-base_semi_purple text-white rounded disabled:bg-blue-300"
            >
              {saving ? "Saving..." : "Create"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
