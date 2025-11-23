"use client";

import { useState } from "react";
import { updateUserById } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Customer } from "@/types/interface";

export default function EditUserForm({ user }: { user: Customer }) {

  console.log("RAW USER PROPS:", user);
  console.log("USER TYPE:", typeof user);

  if (!user) {
    console.log("USER IS NULL DI EDITUSERFORM !!!");
    return <div>Loading...</div>;
  }

  const router = useRouter();

  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [role, setRole] = useState(user.role ?? "USER");
  const [membership, setMembership] = useState(user.membership ?? "BASIC");
  const [image, setImage] = useState(user.image ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("SUBMIT UPDATE USER ID:", user.id);
      console.log("DATA YANG DIKIRIM:", { name, email, address, role, membership, image });

      await updateUserById(user.id, {
        name,
        email,
        address,
        role,
        membership,
        image,
      });

      toast.success("Customer updated!");
      router.push("/admin/customer");
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      toast.error("Failed to update customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            className="w-full p-2 border rounded text-black"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Membership */}
        <div>
          <label className="block text-sm font-medium">Membership</label>
          <select
            className="w-full p-2 border rounded text-black"
            value={membership}
            onChange={(e) => setMembership(e.target.value)}
          >
            <option value="BASIC">BASIC</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
