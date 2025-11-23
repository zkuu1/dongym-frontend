import EditUserForm from "@/components/Edit-form";
import { searchUserById } from "@/lib/api";

export default async function EditPage({ params }: { params: { id: string } }) {
  const response = await searchUserById(params.id);

  // Ambil hanya data user di dalam response
  const user = response.data;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>

      <EditUserForm user={user} />
    </div>
  );
}
