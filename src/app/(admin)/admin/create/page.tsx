import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateUserForm from "@/components/Create-form";
import { Backbutton } from "@/components/Button";

const CreateUserPage = async () => {
  

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
       {/* Header */}
        <header className="bg-gray-100 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Create User</h2>
            <div className="flex items-center space-x-2">
            </div>
          </div>
        </header>


        {/* Content */}
        <main className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h1>
            <CreateUserForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateUserPage;