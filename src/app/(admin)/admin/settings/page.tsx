'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, logout } from '@/utils/auth'
import { updateUserById } from '@/data/api/userApi'
import {
  User,
  Mail,
  MapPin,
  Lock,
  Camera,
  LogOut,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Settings as SettingsIcon,
} from 'lucide-react'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  })

  useEffect(() => {
    const userData = getUser()
    if (userData) {
      setAdmin(userData)
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        address: userData.address || '',
        password: '',
      })
      setPreview(userData.image || null)
    }
    setLoading(false)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Admin Object:", admin)
    
    // The backend DTO maps id_user to id
    const userId = admin?.id || admin?.id_user
    
    if (!userId) {
      console.error("User ID not found in admin object")
      setError("ID User tidak ditemukan. Silakan login kembali.")
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    console.log("Starting update for user ID:", userId)

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('address', form.address)
      if (form.password) formData.append('password', form.password)
      if (selectedFile) formData.append('image', selectedFile)

      console.log("Payload Prepared, sending to API...")
      const response = await updateUserById(String(userId), formData)
      console.log("API Response:", response)

      if (response.success) {
        setSuccess('Profil berhasil diperbarui!')
        
        // Sync localStorage
        const updatedUser = { 
            ...admin, 
            name: form.name, 
            email: form.email, 
            address: form.address,
            image: response.data?.image || preview 
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setAdmin(updatedUser)
        setForm(prev => ({ ...prev, password: '' }))
        setSelectedFile(null)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 rounded-xl">
            <SettingsIcon className="text-blue-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
            <p className="text-gray-400 text-sm mt-0.5">Kelola informasi profil dan keamanan akun Anda</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Profile Pic */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center space-y-6">
            <div className="relative inline-block mx-auto">
              <div className="w-32 h-32 rounded-3xl bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-blue-500/20 shadow-2xl">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-600" size={48} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl transition-all hover:scale-110 active:scale-95 border-4 border-gray-900"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{admin?.name}</h3>
              <p className="text-blue-500 text-xs font-medium uppercase tracking-wider">{admin?.role}</p>
            </div>
            <p className="text-gray-400 text-xs px-4">
              Disarankan menggunakan gambar persegi dengan ukuran minimal 400x400px (Max 5MB).
            </p>
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                <User size={18} className="text-blue-500" />
                Informasi Personal
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 rounded-2xl text-white transition outline-none"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email Aktif</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 rounded-2xl text-white transition outline-none"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Alamat</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 rounded-2xl text-white transition outline-none"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Lock size={18} className="text-blue-500" />
                Keamanan
              </h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Password Baru (Kosongkan jika tidak ingin diubah)</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 rounded-2xl text-white transition outline-none"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm italic">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl text-sm italic">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] w-full max-w-sm shadow-2xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <LogOut size={32} className="text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Konfirmasi Logout</h2>
              <p className="text-gray-400 text-sm">
                Apakah Anda yakin ingin keluar dari sistem? Anda harus login kembali untuk mengakses dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                Ya, Keluar Sekarang
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-medium rounded-2xl transition-all active:scale-95"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
