import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Placedorders() {
    let nav = useNavigate()


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-8 text-center">
                {/* Success Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>



                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition">
                        Track Order
                    </button> */}
                    <button className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-gray-500 text-white font-semibold rounded-xl shadow-md transition cursor-pointer"
                        onClick={() => nav('/products')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Placedorders