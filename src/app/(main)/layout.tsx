import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-700 text-white">

      <Appbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

    </div>
  );
}
