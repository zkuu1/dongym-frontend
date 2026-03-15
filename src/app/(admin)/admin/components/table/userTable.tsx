'use client'

import { useEffect, useState } from "react"
import { getAllUser } from "@/data/api/userApi"

export default function Usertable() {

  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const res = await getAllUser()

        setUsers(res.data)

      } catch (err) {
        console.error(err)
      }
    }

    fetchUsers()

  }, [])

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">

      <h1 className="text-2xl font-bold mb-6">
        User Management
      </h1>

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">

          {/* Header */}
          <thead className="bg-gray-800 text-gray-300">

            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Membership</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>

          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-700">

            {users.map((user) => (

              <tr
                key={user.id}
                className="hover:bg-gray-800 transition"
              >

                <td className="px-6 py-4">{user.id}</td>

                <td className="px-6 py-4 font-medium">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  {user.address || "-"}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>

                </td>

                <td className="px-6 py-4">

                  {user.memberships?.length > 0
                    ? user.memberships[0].name
                    : "No membership"}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}