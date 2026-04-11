# Don Gym - Frontend Dashboard

Don Gym adalah aplikasi manajemen fitness modern yang dibangun menggunakan **Next.js 15 (App Router)**. Aplikasi ini dirancang untuk memberikan pengalaman pengguna yang premium bagi Admin maupun Member, dengan fitur manajemen data yang lengkap dan desain yang futuristik.

## 🚀 Fitur Utama

- **Role-Based Navigation**: Perbedaan tampilan dan akses menu otomatis antara Admin dan Member.
- **Admin Dashboard**: Statistik pengunjung, manajemen produk, membership, dan riwayat presensi.
- **User Dashboard**: Overview profil, riwayat komentar, dan pengaturan akun mandiri.
- **Premium UI**: Desain berbasis Glassmorphism dengan skema warna Midnight Blue & Indigo.
- **Responsive Design**: Optimal untuk perangkat mobile, tablet, dan desktop.

## 📂 Struktur Projek

```text
src/
├── app/                  # Routing & Layout (Next.js App Router)
│   ├── (admin)/          # Grouping rute khusus Administrator
│   ├── (main)/           # Halaman publik (Hero, Products, dll)
│   ├── (user)/           # Grouping rute khusus Member
│   ├── auth/             # Halaman Login & Register
│   └── globals.css       # Core styling & UI Tokens
├── components/           # Komponen UI Reusable (Navbar, Sidebar, Cards)
├── data/
│   └── api/              # Axios instance & Fetching logic per modul
├── lib/                  # Konfigurasi library eksternal (Prisma, etc)
├── types/                # Definisi TypeScript Interfaces
└── utils/                # Fungsi pembantu (Auth, Formatters, Validasi)
```

## 🛠️ Dependensi Utama

### Core
- **Next.js**: Framework React untuk produksi.
- **React & React DOM**: Library inti antarmuka.
- **TypeScript**: Superset JavaScript untuk pengetikan statis yang aman.

### Styling & Animation
- **Tailwind CSS**: Framework CSS berbasis utility untuk desain cepat.
- **Framer Motion**: Library animasi untuk transisi halaman dan micro-interactions.
- **Lucide React & React Icons**: Kumpulan ikon SVG yang konsisten dan modern.

### Data & State Management
- **Axios**: Klien HTTP berbasis promise untuk komunikasi dengan backend.
- **Recharts**: Library chart untuk visualisasi data statistik di dashboard.

### Authentication
- **js-cookie**: Library ringan untuk manajemen cookie (Token storage).
- **jwt-decode**: Mendecode payload JWT untuk sinkronisasi data user.

## 📥 Instalasi

1. Clone repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Atur variabel lingkungan di `.env.local`:
   ```text
   NEXT_PUBLIC_BASE_API=http://localhost:3000/
   ```
4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```

