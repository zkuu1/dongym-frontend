import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-950">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>

    </div>
  );
}
