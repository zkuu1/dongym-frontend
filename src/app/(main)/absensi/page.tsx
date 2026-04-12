"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, User as UserIcon, ClipboardList, CheckCircle, Info, Hash } from "lucide-react";
import { getUser } from "@/utils/auth";
import { getAllUser } from "@/data/api/userApi";
import { createAbsensi, getAllAbsensi, getAbsensiMe } from "@/data/api/absensiApi";
import { containerVariants, itemVariants, cardVariants } from "@/utils/motion";

export default function AbsensiPage() {
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        idUser: "",
        noMember: "",
        date: new Date().toISOString().split("T")[0],
        status: "non member" as "member" | "non member",
    });

    useEffect(() => {
        const currentUser = getUser();
        if (currentUser && currentUser.activeRole !== "admin") {
            setFormData(prev => ({ ...prev, idUser: currentUser.id.toString() }));
        }
    }, [user]);

    const isAdmin = user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);

        const fetchData = async () => {
            try {
                if (currentUser?.role?.toLowerCase() === "admin") {
                    const [userData, absensiData] = await Promise.all([
                        getAllUser(),
                        getAllAbsensi()
                    ]);
                    setUsers(userData.data || []);
                    setAttendanceRecords(absensiData.data || []);
                } else if (currentUser) {
                    const absensiData = await getAbsensiMe();
                    setAttendanceRecords(absensiData.data || []);
                }
            } catch (error: any) {
                console.error("Error fetching data:", error);
                toast.error(error.message || "Gagal memuat data");
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.idUser) {
            toast.warn("Silakan pilih user terlebih dahulu");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                idUser: Number(formData.idUser),
                noMember: formData.noMember || undefined,
                date: new Date(formData.date),
                status: formData.status
            };

            await createAbsensi(payload);
            toast.success("Absensi berhasil dicatat!");
            
            // Refresh records
            if (isAdmin) {
                const updated = await getAllAbsensi();
                setAttendanceRecords(updated.data || []);
            } else {
                const updated = await getAbsensiMe();
                setAttendanceRecords(updated.data || []);
            }

            // Reset partial form
            setFormData(prev => ({
                ...prev,
                idUser: "",
                noMember: ""
            }));
        } catch (error: any) {
            toast.error(error.message || "Gagal mencatat absensi");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-base_purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8">
            <ToastContainer position="top-center" autoClose={2000} theme="dark" />
            
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    className="text-center mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.h1 
                        className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
                        variants={itemVariants}
                    >
                        ABSENSI GYM
                    </motion.h1>
                    <motion.p 
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
                        variants={itemVariants}
                    >
                        {isAdmin 
                            ? "Panel administrasi untuk mencatat kehadiran member dan non-member Don Gym."
                            : "Lakukan absensi kehadiran Anda hari ini di Don Gym."}
                    </motion.p>
                </motion.div>

                <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-8`}>
                    {/* Form Input */}
                    <motion.div 
                        className="lg:col-span-1"
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl sticky top-28 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ClipboardList className="text-base_purple" />
                                {isAdmin ? "Input Absensi" : "Self Check-in"}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* User Selection (Admin Only) */}
                                {isAdmin ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <UserIcon size={16} /> Pilih User
                                        </label>
                                        <select 
                                            name="idUser"
                                            value={formData.idUser}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-base_purple transition-all"
                                            required
                                        >
                                            <option value="" className="bg-gray-900">-- Pilih User --</option>
                                            {users.map(u => (
                                                <option key={u.id_user} value={u.id_user} className="bg-gray-900">
                                                    {u.name} ({u.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-1">Checking in as</p>
                                        <p className="text-lg font-bold text-white">{user?.name}</p>
                                        <p className="text-sm text-gray-400">{user?.email}</p>
                                    </div>
                                )}

                                    {/* Membership Status info (Simplified) */}
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Info size={16} className="text-blue-500" />
                                            <span className="text-sm font-medium text-gray-400">Membership Status</span>
                                        </div>
                                        <span className="text-xs font-black uppercase text-blue-400 tracking-widest">Auto Detect</span>
                                    </div>

                                    {/* No Member Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <Hash size={16} /> No Member (Opsional)
                                        </label>
                                        <input 
                                            type="text"
                                            name="noMember"
                                            value={formData.noMember}
                                            onChange={handleChange}
                                            placeholder="Contoh: 1111"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-base_purple transition-all"
                                        />
                                    </div>

                                    {/* Date selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <Calendar size={16} /> Tanggal
                                        </label>
                                        <input 
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-base_purple transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-base_purple hover:bg-base_semi_purple text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Memproses..." : (
                                            <>
                                                <CheckCircle size={20} />
                                                Catat Kehadiran
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                    {/* Records Table/List */}
                    <motion.div 
                        className={isAdmin ? "lg:col-span-2" : "w-full"}
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <ClipboardList className="text-base_purple" />
                                    Riwayat Kehadiran
                                </h2>
                                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-400">
                                    Total: {attendanceRecords.length}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">User</th>
                                            <th className="px-6 py-4 font-semibold">ID Member</th>
                                            <th className="px-6 py-4 font-semibold">Tanggal</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {attendanceRecords.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                                                    Belum ada riwayat absensi.
                                                </td>
                                            </tr>
                                        ) : (
                                            attendanceRecords.map((record, idx) => (
                                                <motion.tr 
                                                    key={record.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-base_purple flex items-center justify-center text-xs font-bold">
                                                                {isAdmin ? (record.users?.name?.charAt(0) || 'U') : (user?.name?.charAt(0))}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white">
                                                                    {isAdmin ? (record.users?.name || 'Unknown') : (user?.name)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {isAdmin ? (record.users?.email) : (user?.email)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        {record.noMember || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        {new Date(record.date).toLocaleDateString("id-ID", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric"
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                            record.status === 'member' 
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        }`}>
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}