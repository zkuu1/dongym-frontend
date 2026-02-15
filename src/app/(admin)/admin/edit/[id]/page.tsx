import { getUserById } from "@/lib/data";
import EditForm from "@/components/Edit-form";

export default async function EditPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <p>User tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-100 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>

            <EditForm
              user={{
                ...user,
                membership: user.membership
                  ? {
                      ...user.membership,
                      startDate: user.membership.startDate
                        ? user.membership.startDate.toISOString()
                        : null,
                      endDate: user.membership.endDate
                        ? user.membership.endDate.toISOString()
                        : null,
                      status: user.membership.status ?? null,
                    }
                  : null,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
