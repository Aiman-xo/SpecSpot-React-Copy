import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../Reusables/navbar';
import { toast } from 'react-toastify';

function Profile() {
    let [userProfile, setUserProfile] = useState([]);
    let [profileLoading, setProfileLoading] = useState(false);
    // let [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    let [orderId, setOrderId] = useState();
    let nav = useNavigate();

    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleOrder = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    useEffect(() => {
        setProfileLoading(true);
        setTimeout(() => {
            setProfileLoading(false);
        }, 2000)
        const userId = localStorage.getItem("userId");

        async function userProfile() {
            const resp = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
            const data = await resp.data;

            setUserProfile(data);
        }
        userProfile();
    }, [])

    function LogOut() {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        // alert('loggin out....')
        toast.warning('logging out...')
        nav('/login')
    }
    // console.log(userProfile?.orders?.products)

    async function CancelOrder(OrderID) {
        setShowModal(false)
        toast.error('order cancelled');
        const userId = localStorage.getItem("userId");
        const resp = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
        const data = resp.data;


        const updatedOrders = data.orders?.map((item) => {
            return item?.id === OrderID ? { ...item, orderStatus: "cancelled" } : item
        })

        await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
            orders: updatedOrders
        })

        setUserProfile({ ...data, orders: updatedOrders });


    }
    function showConfirmation(orderId) {
        setOrderId(orderId);
        setShowModal(true)
    }



    return (
        <>
            <Navbar />
            {profileLoading && <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
                {/* Avatar Skeleton */}
                <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse mb-6"></div>

                {/* Text Skeletons */}
                <div className="space-y-3 w-56">
                    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/5 animate-pulse"></div>
                </div>

                {/* Loading Text */}
                <p className="mt-6 text-gray-700 font-semibold text-lg animate-pulse">
                    Loading user profile...
                </p>
            </div>



            }
            <div className="max-w-4xl mx-auto mt-12 space-y-10">
                {/* Profile Card */}
                <div className="w-full bg-gray-100 py-16 px-10 flex flex-col items-center shadow-sm">
                    {/* Avatar */}
                    <div className="w-28 h-28 mb-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-5xl font-semibold shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-16 h-16"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12zm0 2c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z" />
                        </svg>
                    </div>

                    {/* User Info */}
                    <h2 className="text-3xl font-semibold text-rose-900 mb-2">{userProfile.name}</h2>
                    <p className="text-rose-900 opacity-90 text-base mb-1">{userProfile.email}</p>
                    <p className="uppercase font-semibold tracking-widest text-rose-900 text-sm mb-6">{userProfile.role}</p>

                    {/* Logout Button */}
                    <button
                        onClick={LogOut}
                        className="bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-full px-10 py-3 shadow-md transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>




                {/* Orders Section */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Orders</h3>

                    {userProfile?.orders?.length === 0 ? (
                        <div className="text-center py-14 text-red-600 font-medium text-lg">No Orders Found!</div>
                    ) : (
                        <div className="space-y-10">
                            {userProfile?.orders?.map((val) => (
                                <article
                                    key={val.id}
                                    className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300"
                                >
                                    {/* Order Header */}
                                    <header
                                        className="flex flex-col md:flex-row md:items-center md:justify-between px-8 py-5 bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => toggleOrder(val.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") toggleOrder(val.id);
                                        }}
                                        aria-expanded={expandedOrderId === val.id}
                                        aria-controls={`order-details-${val.id}`}
                                    >
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">Order #{val.id}</h4>
                                            <p className="text-gray-500 text-sm">{val.date}</p>
                                        </div>
                                        <span
                                            className={`mt-3 md:mt-0 px-5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 transition-colors ${val.orderStatus === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : val.orderStatus === "shipped"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : val.orderStatus === "delivered"
                                                        ? "bg-green-100 text-green-800"
                                                        : val.orderStatus === "cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {val.orderStatus}
                                        </span>
                                    </header>

                                    {/* Order Body */}
                                    {expandedOrderId === val.id && (
                                        <section
                                            id={`order-details-${val.id}`}
                                            className="grid md:grid-cols-2 gap-8 px-8 py-8"
                                            aria-live="polite"
                                            role="region"
                                        >
                                            {/* Shipping */}
                                            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                                                <h5 className="font-semibold text-gray-700 mb-5">Shipping Details</h5>
                                                <p className="text-gray-800 font-semibold">{val.shipping.fullname}</p>
                                                <p className="text-gray-600 text-sm">{val.shipping.mainAddress}</p>
                                                <p className="text-gray-600 text-sm">{val.shipping.city}, {val.shipping.country}</p>
                                                <p className="text-gray-600 text-sm">PIN: {val.shipping.pin}</p>
                                                <p className="text-gray-600 text-sm">Phone: {val.shipping.phone}</p>
                                            </div>

                                            {/* Items */}
                                            <div>
                                                <h5 className="font-semibold text-gray-700 mb-5">Items Ordered</h5>
                                                <div className="space-y-5">
                                                    {val.products.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                                                            <img
                                                                src={item.image}
                                                                alt={`${item.brand} product`}
                                                                className="w-24 h-20 object-cover rounded-lg border border-gray-200"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">{item.brand}</p>
                                                                <p className="text-gray-600 text-sm mt-1">Qty: {item.cartQty}</p>
                                                            </div>
                                                            <p className="font-bold text-indigo-600">${item.price}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {/* Order Footer */}
                                    <div className="flex justify-between items-center px-8 py-6 bg-gray-50 font-semibold text-gray-900">
                                        <span>Total (incl. Tax & Shipping)</span>
                                        <span>
                                            ${val.products.reduce((acc, item) => {
                                                const itemsTotal = item.price * item.cartQty;
                                                return acc + itemsTotal + itemsTotal * 0.1 + 10;
                                            }, 0).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Cancel Button */}
                                    {val.orderStatus !== "cancelled" && (
                                        <div className="flex justify-end px-8 py-6 bg-white">
                                            <button
                                                className="bg-red-500 px-6 py-2 rounded-lg text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer"
                                                onClick={() => showConfirmation(val.id)}
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>



            {showModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
                        <h2 className="text-base  mb-4">
                            Are you sure you want to cancel the order?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => CancelOrder(orderId)}
                                className="bg-red-500 text-white px-4 py-1 rounded-lg cursor-pointer hover:bg-red-600"
                            >
                                Yes, Cancel
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>

    )
}

export default Profile