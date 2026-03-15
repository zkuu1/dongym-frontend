'use client'

import { useEffect, useState } from "react"

export default function UserPage() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const storedUser = localStorage.getItem("user")

    console.log("USER FROM STORAGE:", storedUser)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

  }, [])

  if (!user) return <p>Loading...</p>

  return (
    <div>

      <h1>User Dashboard</h1>

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p></p>

    </div>
  )
}