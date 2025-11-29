import React, { useEffect, useState, useContext } from "react";
import { Users, Package, DollarSign, ShoppingCart, UserPlus, Activity, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import axios from "axios";
import { adminContext } from "../../Context-API/adminContext";
import UserComparisonChart from "./charts/SignUpTrend";
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    let { totalOrders, totalRevenue } = useContext(adminContext);
    let [totalUser, setTotalUser] = useState([]);
    let [totalProducts, setTotalProducts] = useState([]);
    let nav = useNavigate();

    useEffect(() => {
        async function GetTotalUser() {
            const resp = await axios.get('https://specspot-db.onrender.com/users');
            const data = resp.data;

            setTotalUser(data)
        }
        GetTotalUser()
        async function GetTotalProducts() {
            const resp = await axios.get('https://specspot-db.onrender.com/products');
            const data = resp.data;

            setTotalProducts(data)
        }
        GetTotalProducts()

    }, [])
    console.log(totalOrders);

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
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalUser.length}</h3>
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
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalOrders.length}</h3>
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
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</h3>
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
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalProducts.length}</h3>
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
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-13 h-80">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                            <LineChartIcon className="w-5 h-5 text-green-500" />
                            Sales Trends
                        </h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={Object.entries(
                                    totalOrders.reduce((acc, order) => {
                                        const date = new Date(order.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                        acc[date] = (acc[date] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).map(([date, count]) => ({ date, count }))}
                                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                            >
                                <defs>
                                    <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7280" }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #E5E7EB" }}
                                    labelStyle={{ fontWeight: "bold", color: "#374151" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="url(#lineColor)"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#4CAF50", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Orders Status Pie Chart */}
                    <div className=" lg:col-span-3 bg-white rounded-2xl shadow-md p-6 h-80">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Orders Status</span>
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.entries(
                                            totalOrders.reduce((acc, order) => {
                                                acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
                                                return acc;
                                            }, {})
                                        ).map(([status, value]) => ({ name: status, value }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {["#4CAF50", "#FFCC00", "#2196F3", "#FF9800"].map((color, index) => (
                                            <Cell key={index} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #E5E7EB" }}
                                        formatter={(value, name) => [`${value} orders`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>




                {/* User Signups Chart Placeholder */}
                <UserComparisonChart totalUser={totalUser} />

                {/* Recent Activity */}
                <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-20">
                    {/* Orders */}
                    <div className="relative group bg-white rounded-2xl shadow-lg p-6 w-full cursor-pointer " onClick={() => nav('checkorders')}>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                            <ShoppingCart className="w-6 h-6 mr-3 text-blue-500" /> Recent Orders
                        </h3>
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-0 bg-gray-400 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            view all Orders
                        </div>

                        {totalOrders.slice(0, 6).map((order) => (
                            <div
                                key={order.id}
                                className="flex justify-between items-center p-4 mb-3 bg-gray-50 rounded hover:bg-blue-50 cursor-pointer transition-colors "
                            >
                                {/* Left: Order info */}
                                <div className="text-sm text-gray-700">
                                    <p className="font-medium text-gray-900">#{order.id} - {order.userName}</p>
                                </div>

                                {/* Right: Status */}
                                <p className={`text-sm font-semibold ${order.orderStatus === "delivered" ? "text-green-600  bg-green-100 rounded-full px-3 py-1" :
                                    order.orderStatus === "pending" ? "text-yellow-600 bg-yellow-100 rounded-full px-3 py-1" : order.orderStatus === "shipped" ? "text-blue-600  bg-blue-100 rounded-full px-3 py-1" : "text-red-600  bg-red-100 rounded-full px-3 py-1"

                                    }`}>
                                    {order.orderStatus}
                                </p>
                            </div>
                        ))}
                    </div>


                    {/* Users */}
                    <div className="relative group bg-white rounded-xl shadow-sm p-6 cursor-pointer" onClick={() => nav('users')}>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                            <UserPlus className="w-5 h-5 mr-2 text-green-500" /> Recently Logged Users
                        </h3>

                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-0 bg-gray-400 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            view all Users
                        </div>
                        {
                            totalUser.slice(1, 7).map((val) => {
                                return val.role === "admin" ? (<div className="space-y-3 text-sm text-gray-700">
                                    <p className="mb-4 text-xs text-red-500 bg-red-100 rounded p-3">{val.name.toUpperCase()}</p>

                                </div>) : (
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <p className="mb-4 text-xs text-gray-500 bg-gray-100 rounded p-5">{val.name.toUpperCase()}</p>

                                    </div>
                                )
                            })
                        }

                    </div>

                    {/* System Updates */}
                    {/* <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                            <Settings className="w-5 h-5 mr-2 text-purple-500" /> System Updates
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p>Database backup completed</p>
                            <p>SSL certificate renewed</p>
                            <p>New analytics module deployed</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
