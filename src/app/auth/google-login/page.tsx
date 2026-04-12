"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { searchUserById } from "@/data/api/userApi";

type TokenPayload = {
  id: number;
  name: string;
  role: string;
};

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // 1. Simpan Token ke Cookies & LocalStorage
        Cookies.set("token", token, { expires: 7, path: "/" });
        localStorage.setItem("token", token);

        // 2. Decode Token untuk mendapatkan User ID
        const decoded = jwtDecode<TokenPayload>(token);
        
        // 3. Fetch Data User Lengkap (termasuk image, address, dll)
        const userRes = await searchUserById(decoded.id.toString());
        
        if (userRes.success && userRes.data) {
          // 4. Simpan Data User ke LocalStorage
          const userData = {
              ...userRes.data,
              token // ensure token is in the object if needed
          }
          localStorage.setItem("user", JSON.stringify(userData));

          // 5. Redirect ke Dashboard berdasarkan Role
          const role = decoded.role;
          router.push(role === "admin" ? "/admin" : "/user");
        } else {
          throw new Error("Gagal mengambil data user");
        }
      } catch (err: any) {
        console.error("Auth sync error:", err);
        setError("Sinkronisasi akun gagal. Silakan coba lagi.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl animate-in zoom-in-95 duration-300">
            <h1 className="text-xl font-bold text-red-500 mb-2">Error!</h1>
            <p className="text-gray-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h1 className="text-2xl font-black mb-2 animate-pulse">Menghubungkan...</h1>
              <p className="text-gray-400 font-medium tracking-tight">Mohon tunggu sebentar, kami sedang menyiapkan sesi Anda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
