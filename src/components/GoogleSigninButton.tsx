'use client';

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { loginWithGoogle } from "@/data/api/oauthApi";

const AuthButton = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    window.location.reload();
  };

  return !user ? (
    <button
      onClick={() => loginWithGoogle()}
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow"
    >
      <FcGoogle className="text-2xl" />
      Login With Google
    </button>
  ) : (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
    >
      Sign Out
    </button>
  );
};

const SigninButton = () => {
  return (
    <div className="flex gap-4 ml-auto items-center w-full">
      <AuthButton />
    </div>
  );
};

export default SigninButton;