import React from 'react'
import { useState } from 'react';
import AdminSidebar from './sidebar/sidebar';
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function AdminInterface() {
    let nav = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const admin = localStorage.getItem("adminId");
    console.log(admin);

    const token = sessionStorage.getItem('access_token')

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 md:translate-x-0 md:shadow-none`}
            >
                {/* Close button for mobile */}
                <div className="md:hidden flex justify-end p-4">
                    <button onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <AdminSidebar Logout={() => console.log("Logout clicked")} />


            </div>

            {/* Overlay (only on mobile when sidebar is open) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="md:hidden flex items-center justify-between p-4 shadow bg-white">
                    <button
                        className="text-gray-600"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-blue-600">Admin Panel</h1>
                </header>

                <main className="flex-1 p-4 ms-60 md:p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminInterface