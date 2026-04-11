import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <main className="flex-1 p-4 sm:p-8 lg:ml-64 transition-all duration-300">
        {children}
      </main>

    </div>
  );
}
