"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Medal, User, Activity, TrendingUp } from "lucide-react";
import { getLeaderboard } from "@/data/api/absensiApi";

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await getLeaderboard();
                if (res.success) {
                    setLeaderboard(res.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-base_purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-base_purple/20 rounded-3xl mb-6 shadow-2xl shadow-base_purple/20"
                    >
                        <Trophy size={48} className="text-base_purple" />
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
                        Member <span className="text-base_purple">Leaderboard</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto font-medium">
                        Daftar member paling aktif dengan tingkat kehadiran tertinggi. Jadilah inspirasi bagi member lainnya!
                    </p>
                </div>

                {/* Top 3 Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {leaderboard.slice(0, 3).map((user, index) => (
                        <motion.div
                            key={user.id_user}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden group ${
                                index === 0 
                                    ? "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-500/50 scale-105 z-10" 
                                    : index === 1 
                                        ? "bg-gradient-to-br from-gray-300/10 to-gray-500/10 border-gray-400/30" 
                                        : "bg-gradient-to-br from-orange-800/10 to-orange-900/10 border-orange-800/30"
                            }`}
                        >
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Medal size={80} className={index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-300" : "text-orange-700"} />
                            </div>
                            
                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl font-black mb-4">
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                </div>
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/10 mb-4 shadow-2xl">
                                    {user.image ? (
                                        <Image src={user.image} alt={user.name} width={96} height={96} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <User size={40} className="text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold truncate w-full">{user.name}</h3>
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${user.isMember ? 'text-emerald-500' : 'text-gray-500'}`}>
                                    {user.isMember ? 'Active Member' : 'Non-Member'}
                                </p>
                                <div className="mt-2 px-4 py-1 bg-white/5 rounded-full border border-white/5 flex items-center gap-2">
                                    <Activity size={14} className="text-base_purple" />
                                    <span className="text-sm font-black">{user.count} Kunjungan</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* List Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="bg-gray-950/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-white/5 flex items-center gap-3">
                        <TrendingUp size={20} className="text-base_purple" />
                        <h2 className="text-lg font-bold">Top Rankings</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {leaderboard.length > 0 ? (
                            leaderboard.map((user, index) => (
                                <motion.div
                                    key={user.id_user}
                                    variants={itemVariants}
                                    className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="w-10 text-center font-black text-gray-500 group-hover:text-white transition-colors">
                                        #{index + 1}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                        {user.image ? (
                                            <Image src={user.image} alt={user.name} width={48} height={48} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                <User size={20} className="text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate text-gray-200 group-hover:text-white transition-colors">{user.name}</h4>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${user.isMember ? 'text-emerald-500' : 'text-gray-500'}`}>
                                            {user.isMember ? 'Active Member' : 'Non-Member'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-base_purple">{user.count}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Absensi</div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-500 font-medium">
                                Belum ada data leaderboard.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
