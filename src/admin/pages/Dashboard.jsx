import React, { useEffect, useState, useContext } from "react";
import { Users, Package, DollarSign, ShoppingCart, UserPlus, Activity, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import axios from "axios";
import api from "../../refreshFetch/api";
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    let nav = useNavigate();

    const token = sessionStorage.getItem('access_token')
    

    useEffect(() => {
        async function fetchDashboard() {
          try {
            const resp = await api.get(
              "/admin/dashboard/",
              {
                withCredentials:true,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setDashboardData(resp.data);
          } catch (error) {
            if (error.response?.status === 401) {
                sessionStorage.removeItem("access_token");
                nav("/login");
            }else{

                console.error("Dashboard fetch failed", error);
            }
          } finally {
            setLoading(false);
          }
        }

        if (token) {
            fetchDashboard();
          } else {
            nav("/login");
          }
      
        // fetchDashboard();
      }, [token]);

      const OverlaySpinner = () => (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      );
      
      if (loading) {
        return (
          <OverlaySpinner/>
        );
      }
    
      if (!dashboardData) {
        return (
          <div className="min-h-screen flex items-center justify-center text-red-500">
            Failed to load dashboard
          </div>
        );
      }
      

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{dashboardData.stats.total_users}</h3>
                            </div>
                            <div className="p-3 bg-blue-500 rounded-full">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{dashboardData.stats.total_orders}</h3>
                            </div>
                            <div className="p-3 bg-green-500 rounded-full">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">${dashboardData.stats.total_revenue.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-yellow-500 rounded-full">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Products</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{dashboardData.stats.total_products}</h3>
                            </div>
                            <div className="p-3 bg-purple-500 rounded-full">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Placeholder (static blocks instead of charts) */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">

        {/* Sales Trends Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-6 pb-15 h-90">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-green-500" />
            Sales Trends
        </h2>

        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.sales_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="count"
                stroke="#4CAF50"
                strokeWidth={3}
                dot={{ r: 5 }}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>

        {/* Orders Status Pie Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-6 pb-15 h-90">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-gray-500" />
            Orders Status
        </h2>

        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={Object.entries(
                dashboardData.order_status_distribution
                ).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
                }
            >
                {["#4CAF50", "#FFCC00", "#2196F3", "#FF9800", "#EF4444"].map(
                (color, index) => (
                    <Cell key={index} fill={color} />
                )
                )}
            </Pie>
            <Tooltip />
            </PieChart>
        </ResponsiveContainer>
        </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">

        {/* Recent Orders */}
        <div
        className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
        onClick={() => nav("checkorders")}
        >
        <h3 className="text-xl font-bold mb-6 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3 text-blue-500" />
            Recent Orders
        </h3>

        {dashboardData.recent_orders.map((order) => (
            <div
            key={order.id}
            className="flex justify-between items-center p-4 mb-3 bg-gray-50 rounded"
            >
            <p className="font-medium">#{order.id} - {order.username}</p>

            <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                order.order_status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : order.order_status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : order.order_status === "shipped"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-red-100 text-red-600"
                }`}
            >
                {order.order_status}
            </span>
            </div>
        ))}
        </div>

        {/* Recently Logged Users */}
        <div
        className="bg-white rounded-xl shadow-sm p-6 cursor-pointer"
        onClick={() => nav("users")}
        >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-green-500" />
            Recently Logged Users
        </h3>

        {dashboardData.recent_users.map((user, index) => (
            <p
            key={index}
            className={`mb-4 text-xs rounded p-3 ${
                user.is_staff
                ? "bg-red-100 text-red-500"
                : "bg-gray-100 text-gray-500"
            }`}
            >
            {user.name.toUpperCase()}
            </p>
        ))}
        </div>
        </div>

            </div>
        </div>
    );
};

export default Dashboard;
