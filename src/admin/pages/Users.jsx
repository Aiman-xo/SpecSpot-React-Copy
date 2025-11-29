import React, { useEffect, useState } from 'react'
import { Lock, Unlock } from "lucide-react";
import axios from 'axios';
import Api from '../api/api';

function Users() {
    let [users, setUsers] = useState([]);
    let [flag, setFlag] = useState(false);
    let [searchValue, setSearchValue] = useState("");
    let [notfound, setNotfound] = useState('');
    let [sortStatus, setSortStatus] = useState('all');
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnblockModal, setShowunBlockModal] = useState(false);
    let [userId, setUserId] = useState();
    let [state, setState] = useState([]);
    let { products1, users1 } = Api();

    //show number of blocked users
    const BolckedUsers = state.filter((val) => val.status === "Inactive");
    console.log(BolckedUsers.length);
    useEffect(() => {
        async function GetUsers() {
            const resp = await axios.get(users1);
            const data = await resp.data;
            setState(data)

            let filtered = data;

            if (searchValue.trim() !== '') {
                filtered = filtered.filter((val) => {
                    return val.name.toLowerCase().includes(searchValue.toLowerCase())
                })
            }

            //sort based on status

            if (sortStatus !== "all") {

                filtered = filtered.filter((val) => {
                    return val.status === sortStatus
                })
            }
            setUsers(filtered);
            if (filtered.length === 0) {
                setNotfound("No users Found!");
            } else {
                setNotfound("")
            }

        }
        GetUsers()
    }, [searchValue, flag, sortStatus])


    async function SetBlock(userId) {

        setShowBlockModal(false)
        // const Activate = setstatus === "Active" ? "Inactive" : "Active"

        await axios.patch(`${users1}/${userId}`, {
            status: "Inactive"
        })
        setFlag(pre => !pre)
    }

    async function Unblock(userId) {
        setShowunBlockModal(false);
        // const Activate = setstatus === "Active" ? "Inactive" : "Active"

        await axios.patch(`${users1}/${userId}`, {
            status: "Active"
        })
        setFlag(pre => !pre)
    }

    function ShowConfirmationBlock(userId) {
        setShowBlockModal(true);
        setUserId(userId)

    }

    function ShowConfirmationunBlock(userId) {
        setShowunBlockModal(true);
        setUserId(userId)

    }

    return (
        <div className="p-2">
            <i><h1 className="text-xl sm:text-3xl font-bold text-gray-400 text-center">
                <span className="font-[verdana]">S</span>pec
                <span className="text-yellow-400 font-[verdana]">S</span>pot
            </h1></i>
            {/* Header */}
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">All Users</h1>

            <div className="flex justify-end items-center gap-4 mb-6">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                {/* Select Option */}
                <select
                    className="p-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setSortStatus(e.target.value)}
                    value={sortStatus}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="all">All</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-blue-600 text-white rounded-t-xl">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Sno</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">#id</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Total Orders</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Total Products Ordered</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.map(
                            (user, index) =>
                                user.role === "user" && (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-shadow shadow-sm rounded-lg">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{index}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.orders.length}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.orders.reduce((acc, val) => acc + val.products.length, 0)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.status === "Active" ? (
                                                <button
                                                    className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm cursor-pointer"
                                                    onClick={() => ShowConfirmationBlock(user.id)}
                                                >
                                                    <Lock size={16} /> Block
                                                </button>
                                            ) : (
                                                <button
                                                    className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm cursor-pointer"
                                                    onClick={() => ShowConfirmationunBlock(user.id)}
                                                >
                                                    <Unlock size={16} /> Unblock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center text-red-700 mt-10">
                <div>{notfound}</div>
            </div>


            {showBlockModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
                        <h2 className="text-base  mb-4">
                            Are you sure you want to Block the user?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => SetBlock(userId)}
                                className="bg-red-500 text-white px-4 py-1 rounded-lg cursor-pointer hover:bg-red-600"
                            >
                                Yes, Block
                            </button>
                            <button
                                onClick={() => setShowBlockModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showUnblockModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
                        <h2 className="text-base  mb-4">
                            Are you sure you want to Unblock the user?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => Unblock(userId)}
                                className="bg-green-500 text-white px-4 py-1 rounded-lg cursor-pointer hover:bg-green-600"
                            >
                                Yes, Unblock
                            </button>
                            <button
                                onClick={() => setShowunBlockModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users