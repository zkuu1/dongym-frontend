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
  ChartBarStacked,
  MessageSquare,
  Home,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
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
    title: "Back",
    href: "/",
    icon: Home,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 p-4">
        <h1 className="font-bold text-lg text-white tracking-tight">
          Don Gym <span className="text-blue-500">Admin</span>
        </h1>

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
            w-64 h-screen
            bg-gray-900/60 backdrop-blur-xl border-r border-white/5
            transform transition-transform duration-300
            
            ${open ? "translate-x-0" : "-translate-x-full"}
            
            lg:translate-x-0
        `}
        >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="font-bold text-xl text-white ">Don Gym Admin</h1>

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
                  flex items-center gap-3 px-3 py-2 rounded-lg transition
                  
                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <Icon size={20} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
