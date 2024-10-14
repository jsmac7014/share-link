import React from 'react'
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <div className="mb-2">
        <Navbar />
      </div>
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  )
}
