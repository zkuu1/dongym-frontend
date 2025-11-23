"use client";

import { useState } from "react";
import EditUserModal from "../ui/edit-user-modal";
import EditAbsensiModal from "./edit-absensi-modal";
import CreateUserModal from "./create-user-modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteAbsensiById, deleteUserById } from "@/lib/api";
import { IoPencil, IoTrash } from "react-icons/io5";

interface Props {
  userId: string;
}

/* =========================
     BUTTON EDIT
========================= */
export function EditUserButton({ userId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
              className="inline-flex items-center space-x-1 text-base_purple hover:text-purple-300 px-5 py-[9px] rounded-sm text-sm"
            >
              <IoPencil size={16} className="mr-1" />
              Edit
      </button>
      {open && (
        <EditUserModal
          userId={userId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
} 

export function EditAbsensiButton({ userId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
              className="inline-flex items-center space-x-1 text-base_purple hover:text-purple-300 px-5 py-[9px] rounded-sm text-sm"
            >
              <IoPencil size={16} className="mr-1" />
              Edit
      </button>
      {open && (
        <EditAbsensiModal
          userId={userId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
} 


/* =========================
     BUTTON CREATE
========================= */
export function CreateUserButton({ userId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
              className="inline-flex items-center space-x-1 text-base_purple hover:text-purple-300 px-5 py-[9px] rounded-sm text-sm"
            >
              <IoPencil size={16} className="mr-1" />
              Buat Customer Baru
      </button>
      {open && (
        <CreateUserModal
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* =========================
     BUTTON DELETE
========================= */
export function DeleteUserButton({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteUserById(userId);

      if (!res.success) {
        toast.error(res.message || "Gagal menghapus user");
        setLoading(false);
        return;
      }

      toast.success("User berhasil dihapus!");

      setOpen(false);
      router.refresh();

    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan saat menghapus");
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}          // ✔ FIXED
        className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 px-5 py-[9px] rounded-sm text-sm"
        disabled={loading}
      >
        <IoTrash size={16} className="mr-1" />
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[350px]">

            <h2 className="text-lg font-semibold mb-3">Konfirmasi Hapus</h2>

            <p className="text-sm text-gray-700 mb-5">
              Apakah Anda yakin ingin menghapus user ini?  
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-red-300"
              >
                {loading ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export function DeleteAbsensiButton({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteAbsensiById(userId);

      if (!res.success) {
        toast.error(res.message || "Gagal menghapus absensi");
        setLoading(false);
        return;
      }

      toast.success("Absensi berhasil dihapus!");

      setOpen(false);
      router.refresh();

    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan saat menghapus");
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}          // ✔ FIXED
        className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 px-5 py-[9px] rounded-sm text-sm"
        disabled={loading}
      >
        <IoTrash size={16} className="mr-1" />
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[350px]">

            <h2 className="text-lg font-semibold mb-3">Konfirmasi Hapus</h2>

            <p className="text-sm text-gray-700 mb-5">
              Apakah Anda yakin ingin menghapus user ini?  
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-red-300"
              >
                {loading ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}