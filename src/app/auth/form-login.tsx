'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleSigninButton from "@/components/GoogleSigninButton";
import GithubSigninButton from "@/components/GithubSigninButton";
import { signIn } from "next-auth/react";
import { loginUser } from "@/data/api/userApi";
import type { LoginPayload } from "@/types/userInterface";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi dasar: pastikan tidak kosong
    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }
    if (!password.trim()) {
      setError("Password tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: LoginPayload = { email, password };
      const res = await loginUser(payload);

      if (!res.success) {
        setError(res.message || "Login gagal.");
        return;
      }

      const user = res.data.data;
      const token = res.data.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=86400`;

      setSuccess("Login berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/user");
      }, 1000);

    } catch (err: any) {
      // Tampilkan pesan langsung dari backend (ex: "Invalid email or password")
      setError(err.message || "Login gagal. Silakan coba lagi.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 mt-14 overflow-hidden">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex flex-col md:flex-row">
          {/* Welcome Section - Left */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-700 to-indigo-900 p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">DON GYM FITNESS</h1>
              <div className="w-20 h-1 bg-white mb-6"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Welcome</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white">Login</h3>
            </div>

            <div className="mt-8">
              <p className="text-white/80 text-lg">
                Transform your body, transform your life. Start your fitness journey with us today.
              </p>
            </div>
          </div>

          {/* Form Section - Right */}
          <div className="w-full md:w-3/5 p-8 md:p-12 bg-white">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Member Login</h2>
                <p className="text-gray-600 mt-2">Sign in to access your account</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 mb-4 animate-pulse">
                  <span className="text-red-500 mt-0.5 text-lg">⚠️</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 mb-4">
                  <span className="text-green-500 mt-0.5 text-lg">✅</span>
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              <div className="relative mb-8">
                <GoogleSigninButton />
              </div>

              <div className="relative mb-8">
                <GithubSigninButton />
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-500">or login with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 text-center text-gray-300 text-sm">
          <p>Copyright © DON GYM FITNESS 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
