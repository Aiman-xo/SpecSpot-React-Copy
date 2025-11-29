import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const UserComparisonChart = ({ totalUser }) => {
    // Transform the totalUser data into chart-friendly format
    const chartData = totalUser.slice(1).map(user => ({
        name: user?.name,
        Cart: user?.cart?.length,
        Wishlist: user?.wishlist?.length,
        Orders: user?.orders?.length
    }));

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">User Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Cart" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="Wishlist" fill="#f59e0b" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="Orders" fill="#10b981" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserComparisonChart;
