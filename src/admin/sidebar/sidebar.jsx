import { useState } from "react";
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
    let nav = useNavigate();

    function Logout() {
        const adminId = localStorage.getItem("adminId");
        // console.log(adminId);

        if (adminId) {
            localStorage.removeItem("adminId");
            nav('/')
        }



    }


    return (
        <aside className="w-64 bg-white shadow-lg min-h-screen  flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
                <p className="text-sm text-gray-500">Management System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-6">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to='/admin'
                            end
                            className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg  ${isActive ? "bg-blue-600 text-white shadow hover:bg-blue-700" : "text-gray-700 hover:bg-blue-100"
                                }`}>
                            <LayoutDashboard size={20} className="text-gray-300" />
                            <span className="ml-3">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'users'}
                            className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg  ${isActive ? "bg-blue-600 text-white shadow hover:bg-blue-700" : "text-gray-700 hover:bg-blue-100"}`}>
                            <Users size={20} className="text-gray-300" />
                            <span className="ml-3">Users</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'manage'}
                            className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg  ${isActive ? "bg-blue-600 text-white shadow hover:bg-blue-700" : "text-gray-700 hover:bg-blue-100"}`}>
                            <Package size={20} className="text-gray-300" />
                            <span className="ml-3">Products</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'checkorders'}
                            className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg  ${isActive ? "bg-blue-600 text-white shadow hover:bg-blue-700" : "text-gray-700 hover:bg-blue-100"}`}>
                            <ShoppingCart size={20} className="text-gray-300" />
                            <span className="ml-3">Orders</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer" onClick={Logout}>
                    <LogOut size={20} className="text-gray-500" />
                    <span className="ml-3" >Logout</span>
                </div>
            </div>
        </aside>
    )
}


export default AdminSidebar;