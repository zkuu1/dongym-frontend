'use client'

import { useEffect, useState } from "react";
import { getAllUser } from "@/data/api/userApi";
import { getAllProduct } from "@/data/api/productApi";
import { getAllCategory } from "@/data/api/categoryApi";
import { getAllMembership } from "@/data/api/membershipApi";
import { getAllComments } from "@/data/api/commentApi";
import { getAllAbsensi } from "@/data/api/absensiApi";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  // Defs, 
  // LinearGradient, 
  // Stop 
} from "recharts";
import {
  Users,
  ShoppingBag,
  CreditCard,
  Activity,
  TrendingUp,
  UserCheck,
  Package,
  Dumbbell,
  MessageSquare,
  Calendar,
} from "lucide-react";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [membershipCount, setMembershipCount] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [attendanceTrends, setAttendanceTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, productsRes, categoriesRes, membershipsRes, commentsRes, absensiRes] = await Promise.allSettled([
          getAllUser(),
          getAllProduct(),
          getAllCategory(),
          getAllMembership(),
          getAllComments(),
          getAllAbsensi()
        ]);

        if (usersRes.status === "fulfilled") {
          setUserCount(usersRes.value?.data?.length ?? 0);
        }
        if (productsRes.status === "fulfilled") {
          setProductCount(productsRes.value?.data?.length ?? 0);
        }
        if (categoriesRes.status === "fulfilled") {
          setCategoryCount(categoriesRes.value?.data?.length ?? 0);
        }
        if (membershipsRes.status === "fulfilled") {
          setMembershipCount(membershipsRes.value?.data?.length ?? 0);
        }
        if (commentsRes.status === "fulfilled") {
          setCommentCount(commentsRes.value?.data?.length ?? 0);
        }

        if (absensiRes.status === "fulfilled") {
          const absensiData = absensiRes.value?.data || [];
          
          // Process data for trends (last 7 days)
          const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
          });

          const trendMap = absensiData.reduce((acc: any, curr: any) => {
            const date = curr.date?.split('T')[0] || new Date(curr.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

          const formattedTrends = last7Days.map(date => ({
            date: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
            count: trendMap[date] || 0
          }));

          setAttendanceTrends(formattedTrends);
        }

        const rejections = [usersRes, productsRes, categoriesRes, membershipsRes, commentsRes, absensiRes].filter(res => res.status === "rejected");
        if (rejections.length > 0) {
          setError("Some data failed to load. Please check your connection or try again.");
        }

      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      label: "Total Members",
      value: loading ? "..." : userCount ?? 0,
      icon: Users,
      color: "from-violet-500 to-purple-700",
      bg: "bg-violet-500/10 border-violet-500/30",
      iconColor: "text-violet-400",
      trend: "All time",
    },
    {
      label: "Total Products",
      value: loading ? "..." : productCount ?? 0,
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-500/10 border-blue-500/30",
      iconColor: "text-blue-400",
      trend: "In Catalog",
    },
    {
      label: "Categories",
      value: loading ? "..." : categoryCount ?? 0,
      icon: Dumbbell,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      iconColor: "text-emerald-400",
      trend: "Active",
    },
    {
      label: "Memberships",
      value: loading ? "..." : membershipCount ?? 0,
      icon: CreditCard,
      color: "from-orange-500 to-amber-500",
      bg: "bg-orange-500/10 border-orange-500/30",
      iconColor: "text-orange-400",
      trend: "Registered",
    },
    {
       label: "Total Comments",
       value: loading ? "..." : commentCount ?? 0,
       icon: MessageSquare,
       color: "from-pink-500 to-rose-600",
       bg: "bg-pink-500/10 border-pink-500/30",
       iconColor: "text-pink-400",
       trend: "User Feedbacks",
    }
  ];

  const chartData = [
    { name: "Members", total: userCount ?? 0, fill: "#8b5cf6" },
    { name: "Products", total: productCount ?? 0, fill: "#3b82f6" },
    { name: "Categories", total: categoryCount ?? 0, fill: "#10b981" },
    { name: "Memberships", total: membershipCount ?? 0, fill: "#f97316" },
    { name: "Comments", total: commentCount ?? 0, fill: "#ec4899" },
  ];

  const quickLinks = [
    { label: "Manage Members", href: "/admin/user", icon: UserCheck, color: "text-violet-400" },
    { label: "Manage Products", href: "/admin/product", icon: Package, color: "text-blue-400" },
    { label: "Categories", href: "/admin/category", icon: Dumbbell, color: "text-emerald-400" },
    { label: "Attendance", href: "/admin/comment", icon: TrendingUp, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin — here's what's happening today.</p>
        </div>
        {error && (
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition"
          >
            <Activity size={16} />
            Data partial load. Click to refresh
          </button>
        )}
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-4 text-amber-200/80 text-sm backdrop-blur-sm">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Activity size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-amber-400">Warning: Synchronization Issue</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border p-6 ${stat.bg} backdrop-blur-sm transition hover:scale-[1.02] duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gray-800`}>
                  <Icon size={22} className={stat.iconColor} />
                </div>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {loading ? (
                  <span className="animate-pulse text-gray-600">•••</span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-gray-800/60 border border-gray-700 hover:bg-gray-700/60 hover:border-gray-500 transition duration-200 group"
              >
                <div className="p-3 rounded-xl bg-gray-900 group-hover:scale-110 transition">
                  <Icon size={22} className={link.color} />
                </div>
                <span className="text-sm text-gray-300 font-medium">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Info bar */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <TrendingUp size={28} className="text-violet-400 shrink-0" />
        <div>
          <p className="text-white font-semibold">Don Gym Admin Panel</p>
          <p className="text-gray-400 text-sm">Manage all your gym operations from one place. Use the sidebar to navigate.</p>
        </div>
      </div>

      {/* Charts Section */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trends (Line/Area) */}
          <div className="rounded-2xl border bg-gray-900 border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Attendance Trends</h2>
                <p className="text-sm text-gray-400">Activity for the last 7 days</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Activity size={20} className="text-emerald-400" />
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrends}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Overview (Bar) */}
          <div className="rounded-2xl border bg-gray-900 border-gray-800 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">System Overview</h2>
                <p className="text-sm text-gray-400">Comparison of core resources</p>
              </div>
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <Package size={20} className="text-violet-400" />
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: '#374151', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}