'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Mail, 
  MapPin, 
  Shield, 
  Plus, 
  Trash2, 
  Camera,
  Key,
  Calendar,
  ChevronRight,
  Clock,
  Home
} from "lucide-react";
import { getUser, logout } from "@/utils/auth";
import { getMyComments, deleteComment } from "@/data/api/commentApi";
import { updateUserById } from "@/data/api/userApi";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // States for Settings Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        password: "",
      });
      setImagePreview(currentUser.image || null);

      try {
        const commentRes = await getMyComments();
        if (commentRes.success) {
          setComments(commentRes.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("address", formData.address);
      if (formData.password) data.append("password", formData.password);
      if (imageFile) data.append("image", imageFile);

      const res = await updateUserById(user.id, data);
      if (res.success) {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        // Update local storage and state
        const updatedUser = { ...user, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal memperbarui profil" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Hapus komentar ini?")) return;
    try {
      const res = await deleteComment(id);
      if (res.success) {
        setComments(comments.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus komentar");
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                {user.image && !user.image.includes("image.com") ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl border-4 border-gray-900 shadow-xl">
                <Shield size={20} className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                  {user.role}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-purple-500" />
                  {user.address || "Belum ada alamat"}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-500" />
                  Join {new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl transition-all duration-300 font-bold flex items-center gap-2 group shadow-lg shadow-red-500/5"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Keluar
            </button>
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Menu */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-900/50 backdrop-blur-lg border border-white/5 rounded-3xl p-4 sticky top-28 shadow-xl">
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { id: "history", label: "Comment History", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
                  { id: "settings", label: "Settings", icon: Settings, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                   { id: "back", label: "Back", icon: Home, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "back") {
                        router.push("/");
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id 
                        ? `${item.bg} border border-white/10 shadow-lg` 
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <div className={`p-2 rounded-xl border border-white/5 transition-colors ${activeTab === item.id ? item.color : "bg-gray-800 text-gray-500"}`}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-bold">{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={18} className="ml-auto animate-pulse" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3 min-h-[500px]">
            
            {/* 1. OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/40 p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <MessageSquare size={120} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Aktivitas</p>
                    <h3 className="text-5xl font-black mb-2">{comments.length}</h3>
                    <p className="text-gray-500 font-medium">Komentar diberikan pada produk fitnes.</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-3xl border border-white/10 shadow-xl group relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Status Akun</p>
                    <h3 className="text-3xl font-black mb-2 text-white">
                      {user.memberships && user.memberships.length > 0 ? "Member Aktif" : "Member Biasa"}
                    </h3>
                    <p className="text-gray-400 font-medium">
                      {user.memberships && user.memberships.length > 0 
                        ? "Akses penuh ke semua fitur gym & komunitas." 
                        : "Daftar membership untuk akses fitur premium."}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-lg border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Clock size={24} className="text-blue-500" />
                      Komentar Terakhir
                    </h2>
                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.slice(0, 3).map((comment) => (
                           <div key={comment.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all font-medium">
                              <p className="text-gray-300 italic mb-3">"{comment.comment}"</p>
                              <div className="flex justify-between items-center text-xs text-gray-400">
                                <span className="text-blue-400 font-bold tracking-tight">On {comment.products?.name || "Product"}</span>
                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                         <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                         <p>Belum ada aktivitas komentar.</p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* 2. HISTORY */}
            {activeTab === "history" && (
              <div className="bg-gray-900/50 backdrop-blur-lg border border-white/5 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black mb-8">Riwayat Komentar</h2>
                <div className="space-y-6">
                  {comments.length > 0 ? (
                     comments.map((comment) => (
                      <div key={comment.id} className="group bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all flex justify-between items-start gap-4">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500">
                               <MessageSquare size={14} />
                             </div>
                             <span className="text-sm font-black text-white hover:text-purple-400 cursor-pointer transition-colors">
                               {comment.products?.name || "Product Name"}
                             </span>
                           </div>
                           <p className="text-gray-300 font-medium leading-relaxed">"{comment.comment}"</p>
                           <p className="text-xs text-gray-500 mt-4 flex items-center gap-2 font-bold tracking-tight uppercase">
                              <Clock size={12} />
                              {new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                           </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-20 text-gray-500 font-bold">Tidak ada riwayat komentar.</p>
                  )}
                </div>
              </div>
            )}

            {/* 3. SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-gray-900/50 backdrop-blur-lg border border-white/5 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-black mb-8">Pengaturan Akun</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center sm:flex-row gap-8 pb-8 border-b border-white/5">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/10 relative">
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <User size={40} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl backdrop-blur-sm">
                        <Camera size={24} className="text-white" />
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Foto Profil</h4>
                      <p className="text-gray-400 text-sm mb-4">Unggah foto baru untuk mengubah tampilan profil Anda. PNG, JPG atau WEBP (Maks 2MB).</p>
                      <label className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors inline-block">
                        Pilih File
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-2xl text-sm font-bold animate-in zoom-in-95 duration-200 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {message.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
                       <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-bold" 
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Email</label>
                       <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-bold" 
                        placeholder="email@gym.com"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Alamat</label>
                       <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-bold" 
                        placeholder="Alamat lengkap"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2 pt-4 border-t border-white/5">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                         <Key size={14} className="text-emerald-500" />
                         Ubah Password
                       </label>
                       <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-bold" 
                        placeholder="••••••••"
                      />
                       <p className="text-xs text-gray-500 italic pl-1">Biarkan kosong jika tidak ingin mengubah password.</p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={updateLoading}
                    className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                  >
                    {updateLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-black text-center mb-2">Keluar Aplikasi?</h3>
            <p className="text-center text-gray-400 font-medium mb-8">Anda harus login kembali untuk mengakses fitur dashboad member.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all text-gray-300"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-bold transition-all text-white shadow-lg shadow-red-600/20"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}