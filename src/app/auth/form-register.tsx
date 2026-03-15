'use client';

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleSigninButton from "@/components/GoogleSigninButton";
import GithubSigninButton from "@/components/GithubSigninButton";
import { useRouter } from "next/navigation";
import { createUser } from "@/data/api/userApi";
import type { RegisterPayload } from "@/types/userInterface";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("")
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload: RegisterPayload = {
        name,
        email,
        password,
        address
      };

      const res = await createUser(payload);

      if (!res.success) {
        setError(res.message || "Registrasi gagal");
        return;
      }

      setSuccess(res.message || "Registrasi berhasil!");

      // reset form
      setName("");
      setEmail("");
      setPassword("");

      // redirect ke login
      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 mt-14">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">

        <div className="flex flex-col md:flex-row">

          {/* LEFT SIDE */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-700 to-indigo-900 p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">DON GYM FITNESS</h1>
              <div className="w-20 h-1 bg-white mb-6"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Welcome</h2>
              <h3 className="text-3xl font-bold text-white">Join Us</h3>
            </div>

            <p className="text-white/80 text-lg mt-8">
              Transform your body, transform your life. Start your fitness journey with us today.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-3/5 p-8 md:p-12 bg-white">
            <div className="max-w-md mx-auto">

              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Start Your Journey!</h2>
                <p className="text-gray-600 mt-2">Create Your Account</p>
              </div>

              {error && <p className="text-red-600 text-center mb-4">{error}</p>}
              {success && <p className="text-green-600 text-center mb-4">{success}</p>}

              <div className="mb-6">
                <GoogleSigninButton />
              </div>

              <div className="mb-6">
                <GithubSigninButton />
              </div>

              <div className="relative mt-4 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-500">
                    or register with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* NAME */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>

                 {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Adress
                  </label>

                  <div className="relative">
                    <input
                      type="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>

                

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition"
                >
                  Register
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-purple-600 font-medium">
                    Sign In
                  </a>
                </p>
              </div>

            </div>
          </div>

        </div>

        <div className="bg-gray-800 p-4 text-center text-gray-300 text-sm">
          Copyright © DON GYM FITNESS 2025. All rights reserved.
        </div>

      </div>
    </div>
  );
}