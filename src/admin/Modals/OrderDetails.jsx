import React from 'react'
import { X, Package, Calendar, User, Truck, DollarSign, MapPin, FileDown } from "lucide-react";

function OrderDetails({ onClose, OrderObj }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="w-6 h-6" /> Order #{OrderObj.id}
                        </h2>
                        <p className="flex items-center gap-2 text-gray-200">
                            <Calendar className="w-4 h-4" />{OrderObj.date}
                        </p>
                        <p className="flex items-center gap-2 text-gray-200">
                            Customer: {OrderObj.userName}
                        </p>
                    </div>
                    <button
                        className="hover:bg-white/20 p-2 rounded-full cursor-pointer"
                        onClick={() => onClose(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Shipping Info */}
                    <div className="rounded-2xl shadow-sm p-6 bg-gray-50">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Truck className="w-5 h-5 text-blue-600" /> Shipping Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <p><span className="font-medium">Name:</span> {OrderObj.shipping.fullname}</p>
                            <p><span className="font-medium">Phone:</span> {OrderObj.shipping.phone}</p>
                            <p><span className="font-medium">Address:</span> {OrderObj.shipping.mainAddress}</p>
                            <p><span className="font-medium">City:</span> {OrderObj.shipping.city}</p>
                            <p><span className="font-medium">Region:</span> {OrderObj.shipping.region}</p>
                            <p><span className="font-medium">Postal Code:</span> {OrderObj.shipping.pin}</p>

                            <p className="col-span-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" /> {OrderObj.shipping.country}
                            </p>
                            <span className={`mt-2 inline-block px-3 py-2 rounded-full text-xs font-medium w-20 text-center ${OrderObj.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : OrderObj.orderStatus === "shipped" ? "bg-blue-100 text-blue-700" :
                                OrderObj.orderStatus === "delivered" ? "bg-green-100 text-green-700" : OrderObj.orderStatus === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{OrderObj.orderStatus}</span>
                        </div>
                    </div>

                    {/* Ordered Products */}
                    <div className="rounded-2xl shadow-sm p-6 bg-gray-50">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-blue-600" /> Ordered Products
                        </h3>

                        {/* Product 1 */}

                        {
                            OrderObj.products.map((val) => {
                                return <div className="flex items-center justify-between pb-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={val.image}
                                            alt={val.brand}
                                            className="w-30 h-20 object-cover rounded-xl shadow-md"
                                        />
                                        <div>
                                            <h4 className="font-semibold">{val.brand}</h4>
                                            <p className="text-sm text-gray-500">{val.cartQty}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-blue-600 flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" /> {val.price}
                                    </p>
                                </div>
                            })
                        }



                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 flex justify-end items-center bg-gray-50">
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
                        <FileDown className="w-4 h-4" /> Download Invoice
                    </button> */}
                    <div className="text-right">
                        <h3 className="text-lg font-semibold me-4">Total Amount</h3>
                        <p className="text-2xl font-bold text-green-600 me-4">{OrderObj.products.reduce((acc, val) => acc += val.price * val.cartQty, 0)}</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OrderDetails