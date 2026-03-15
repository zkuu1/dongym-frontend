'use client'

import { useEffect, useState } from "react"
import { getAllUser } from "@/data/api/userApi"

export default function Membershiptable() {

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
        Membership Management
      </h1>

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">

          {/* Header */}
          <thead className="bg-gray-800 text-gray-300">

            <tr>
              <th className="px-6 py-3 text-left">ID User</th>
              <th className="px-6 py-3 text-left">ID Membership</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Membership</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Number Member</th>
              <th className="px-6 py-3 text-left">Expired At</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>

          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-700">

            {users.map((user) =>
            user.memberships.length > 0 ? (
                user.memberships.map((membership:any) => (

                <tr key={membership.idMembership} className="hover:bg-gray-800">

                    <td className="px-6 py-4">{user.id}</td>

                    <td className="px-6 py-4">{membership.idMembership}</td>

                    <td className="px-6 py-4">{user.name}</td>

                    <td className="px-6 py-4">{membership.name}</td>

                    <td className="px-6 py-4">{membership.description}</td>

                    <td className="px-6 py-4">{membership.numberMember}</td>

                    <td className="px-6 py-4">
                    {new Date(membership.expiredAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                    <button className="text-yellow-400 mr-3">Edit</button>
                    <button className="text-red-400">Delete</button>
                    </td>

                </tr>

                ))
            ) : (
                <tr key={user.id}>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">No Membership</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
                </tr>
            )
            )}

        </tbody>

        </table>

      </div>

    </div>
  )
}