"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { updateAbsensiById } from "@/lib/api";

interface EditFormProps {
  user: any;
}

export default function EditUserForm({ user }: EditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: user.id || "",
    name: user.name || "",
    email: user.email || "",
    role: user.role || "user",
    image: user.image || "",
    address: user.address || "",
    token: user.token || "",
    membership: {
      status: user.membership?.status ?? "nonactive",
      startDate: user.membership?.startDate
        ? new Date(user.membership.startDate).toISOString().split("T")[0]
        : "",
      endDate: user.membership?.endDate
        ? new Date(user.membership.endDate).toISOString().split("T")[0]
        : "",
    },
    createdAt: user.createdAt || "",
  });

  // Menghandle perubahan input biasa
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Menghandle perubahan membership
  const handleMembershipChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      membership: {
        ...formData.membership,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        image: formData.image,
        address: formData.address,
        token: formData.token,
        membership: formData.membership,
      };

      const result = await updateUserByid(formData.id, payload);

      toast.success("User berhasil diupdate!");

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch (error: any) {
      toast.error(error?.message || "Gagal update user!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={1500} theme="dark" />

      <form
        id="edit-user-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Alamat</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Membership Start Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              value={formData.membership.startDate}
              onChange={handleMembershipChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          {/* Membership End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
            <input
              type="date"
              name="endDate"
              value={formData.membership.endDate}
              onChange={handleMembershipChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          {/* Membership Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status Membership</label>
            <select
              name="status"
              value={formData.membership.status}
              onChange={handleMembershipChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="active">Active</option>
              <option value="nonactive">Nonactive</option>
            </select>
          </div>

          {/* Token */}
          <div>
            <label className="block text-sm font-medium mb-1">Token</label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="lg:col-span-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-base_purple text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
          >
            {isSubmitting ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
}
