"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import Image from "next/image";
import { getUser, logout } from "@/utils/auth";
import { User as UserIcon, LogOut, ChevronDown, LayoutDashboard, ShieldCheck } from "lucide-react";

const Appbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); 
  const router = useRouter();

  useEffect(() => {
    const syncUser = () => {
      const currentUser = getUser();
      setUser(currentUser);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [pathname]);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isMember = user?.role?.toLowerCase() === "user";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/muscle", label: "Hit The Muscle" },
    { href: "/about", label: "About" },
    { href: "/others", label: "Others" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-xl bg-base_purple/80 py-3 shadow-xl backdrop-blur-xl md:top-6 md:rounded-[2rem] lg:px-6">
      <div className="px-4">
        <div className="flex items-center justify-between">
          {/* Hamburger menu (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex shrink-0 md:ml-0 mx-auto md:mx-0">
            <Link href="/" className="flex items-center">
              <h2 className="ml-4 text-md font-bold text-white">Don Gym</h2>
              <span className="sr-only">Website Title</span>
            </Link>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-base_purple shadow-lg md:hidden z-40">
              <div className="flex flex-col py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 transition ${
                      pathname === link.href
                        ? "bg-white text-gray-900"
                        : "text-white hover:bg-purple-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <Link
                    href="/absensi"
                    className={`px-4 py-2 transition ${
                      pathname === "/absensi"
                        ? "bg-white text-gray-900"
                        : "text-white hover:bg-purple-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Absensi
                  </Link>
                )}

                {isMember && (
                  <Link
                    href="/user"
                    className={`px-4 py-3 flex items-center gap-3 transition-all ${
                      pathname.startsWith("/user")
                        ? "bg-white text-gray-900 font-bold"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-4 py-3 flex items-center gap-3 transition-all ${
                      pathname.startsWith("/admin")
                        ? "bg-white text-gray-900 font-bold"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShieldCheck size={18} />
                    Admin Panel
                  </Link>
                )}

                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setUser(null);
                      setIsMobileMenuOpen(false);
                      router.push("/");
                    }}
                    className="px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 font-bold transition-all text-left"
                  >
                    <LogOut size={18} />
                    Keluar (Logout)
                  </button>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className={`px-4 py-2 transition ${
                        pathname === "/register"
                          ? "bg-white text-gray-900"
                          : "text-white hover:bg-purple-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/login"
                      className={`px-4 py-2 transition ${
                        pathname === "/login"
                          ? "bg-white text-gray-900"
                          : "text-white hover:bg-purple-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-block rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-white text-gray-900"
                    : "text-white hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/absensi"
                className={`inline-block rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 ${
                  pathname === "/absensi"
                    ? "bg-white text-gray-900"
                    : "text-white hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Absensi
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                  pathname.startsWith("/admin")
                    ? "bg-white text-violet-600 shadow-lg shadow-white/20"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <ShieldCheck size={16} />
                Admin Panel
              </Link>
            )}

            {isMember && (
              <Link
                href="/user"
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                  pathname.startsWith("/user")
                    ? "bg-white text-violet-600 shadow-lg shadow-white/20"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth (desktop kanan) */}
          <div className="flex items-center justify-end gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group"
                >
                  <div className="h-9 w-9 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform bg-gray-600 flex items-center justify-center">
                    {user.image && !user.image.includes("image.com") ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={36}
                        height={36}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <UserIcon size={20} className="text-white" />
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-white text-xs font-bold truncate max-w-[80px]">
                      {user.name}
                    </span>
                    <span className="text-blue-300 text-[10px] uppercase tracking-wider font-bold">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-white/60 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm text-white font-bold truncate">{user.email}</p>
                    </div>

                    <Link
                      href={isAdmin ? "/admin/settings" : "/user"}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon size={16} />
                      Pengaturan Profil
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUser(null);
                        setIsDropdownOpen(false);
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
                    >
                      <LogOut size={16} />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  className={`hidden sm:inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 ${
                    pathname === "/register"
                      ? "bg-purple-700 text-white"
                      : "bg-purple text-white hover:bg-purple-200"
                  }`}
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 shadow-sm transition-all duration-150 ${
                    pathname === "/login"
                      ? "bg-purple-700 text-white"
                      : "bg-white text-base_purple hover:bg-purple-200"
                  }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Appbar;
