"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  Settings,
  Menu,
  X,
  ChartSpline,
  Calendar,
  ChartBarStacked,
  MessageSquare,
  Home,
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    href: "/admin/user",
    icon: Users,
  },
  {
    title: "Membership",
    href: "/admin/membership",
    icon: CreditCard,
  },
  {
    title: "Product",
    href: "/admin/product",
    icon: Dumbbell,
  },
  {
    title: "Category",
    href: "/admin/category",
    icon: ChartBarStacked,
  },
  {
    title: "Comments",
    href: "/admin/comment",
    icon: MessageSquare,
  },
  {
    title: "Attendance",
    href: "/admin/absensi",
    icon: Calendar,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Back",
    href: "/",
    icon: Home,
  },
  
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <h1 className="font-bold text-lg text-white tracking-tight hidden sm:block">
            Don Gym <span className="text-blue-500">Admin</span>
          </h1>
        </Link>

        <button 
          onClick={() => setOpen(true)}
          className="p-2 bg-gray-900 rounded-xl border border-gray-800 text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[80] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
     <aside
        className={`
            fixed top-0 left-0 z-[90]
            w-20 lg:w-64 h-screen
            bg-gray-950/90 backdrop-blur-2xl border-r border-white/5
            transform transition-transform duration-300
            
            ${open ? "translate-x-0" : "-translate-x-full"}
            
            lg:translate-x-0
        `}
        >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-blue-500" size={24} />
            <h1 className="font-bold text-xl text-white hidden lg:block">Don Gym Admin</h1>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300
                  justify-center lg:justify-start
                  
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />
                <span className="hidden lg:block">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
