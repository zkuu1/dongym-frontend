'use client'

import Link from "next/link"
import { IoAddSharp, IoPencil, IoTrash } from "react-icons/io5"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { signOut } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

// ================ FETCH API ================
import { deleteUserById } from "@/lib/api";

export const Backbutton = () => {
  return (
   <Link
      href="/admin"
      className="inline-flex items-center space-x-1 text-white bg-base_purple hover:bg-base_semi_purple px-5 py-[9px] rounded-lg text-sm"
   >
    Back
   </Link>
  )
}

export const LogoutButton = () => {
    return (
      <button onClick={() => signOut()} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Logout Account</button>
    )
    
  }

export const EditAbsensiButton = ({id}: {id: string}) => {
  return (
     <Link
      href={`/admin/absensi/edit/${id}`}
      className="inline-flex items-center space-x-1 text-base_purple hover:text-purple-300 px-5 py-[9px] rounded-sm text-sm"
    >
      <IoPencil size={16} className="mr-1" />
      Edit
    </Link>
  )
}

export const DeleteAbsensiButton = ({id}: {id: string}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
  setIsDeleting(true);

  try {
    const result = await deleteUserById(id);

    console.log(result);
    toast.success(result.message || "User berhasil dihapus!");

    setTimeout(() => {
      router.refresh();
    }, 1000);
    
  } catch (error: any) {
    toast.error(error.message || "Gagal menghapus user!");
  } finally {
    setIsDeleting(false);
    setShowModal(false);
  }
};



  return (
  <>
    {/* Tombol Delete */}
    <button
      onClick={() => setShowModal(true)}
      className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 px-5 py-[9px] rounded-sm text-sm"
      disabled={isDeleting}
    >
      <IoTrash size={16} className="mr-1" />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>

    {/* Modal Konfirmasi */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Konfirmasi Penghapusan
          </h3>

          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex justify-end space-x-3">
            {/* Tombol batal */}
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
              disabled={isDeleting}
            >
              Batal
            </button>

            {/* Tombol hapus */}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 text-sm"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    )}
  

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}


export const CreateButton = () => {
  return (
    <Link
      href="/admin/create"
      className="inline-flex items-center space-x-1 text-white bg-base_purple hover:bg-base_semi_purple px-5 py-[9px] rounded-lg text-sm"
    >
      <IoAddSharp size={20} className="h-4 w-4" />
      Create User
    </Link>
  );
};

export const EditButton = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/admin/edit/${id}`}
      className="inline-flex items-center space-x-1 text-base_purple hover:text-purple-300 px-5 py-[9px] rounded-sm text-sm"
    >
      <IoPencil size={16} className="mr-1" />
      Edit
    </Link>
  );
};

export const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
  setIsDeleting(true);

  try {
    const result = await deleteUserById(id);

    console.log(result);
    toast.success(result.message || "User berhasil dihapus!");

    setTimeout(() => {
      router.refresh();
    }, 1000);
    
  } catch (error: any) {
    toast.error(error.message || "Gagal menghapus user!");
  } finally {
    setIsDeleting(false);
    setShowModal(false);
  }
};



  return (
  <>
    {/* Tombol Delete */}
    <button
      onClick={() => setShowModal(true)}
      className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 px-5 py-[9px] rounded-sm text-sm"
      disabled={isDeleting}
    >
      <IoTrash size={16} className="mr-1" />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>

    {/* Modal Konfirmasi */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Konfirmasi Penghapusan
          </h3>

          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex justify-end space-x-3">
            {/* Tombol batal */}
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
              disabled={isDeleting}
            >
              Batal
            </button>

            {/* Tombol hapus */}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 text-sm"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    )}
  

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};
