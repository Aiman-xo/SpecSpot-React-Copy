import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Reusables/navbar'
import { toast } from "react-toastify";
// import { useContext } from 'react'
// import { searchContext } from '../Context-API/context'
import '../mystyle.css'
import axios from 'axios'
import { data, Link, useNavigate } from 'react-router-dom';
import { searchContext } from '../Context-API/context';

function Cart() {
    // let { addtocart, setAddtocart } = useContext(searchContext);
    let [userDetail, setuserDetails] = useState({ cart: [] });
    let nav = useNavigate()
    let [loading, setLoadaing] = useState(false);
    let [cartLoading, setCartLoading] = useState(false);
    let { setCartLength } = useContext(searchContext)
    // let [count, setCount] = useState(0);

    //shipping sharge

    const shipping = 10;



    async function RemoveCartItem(removeInd, removedProduct) {
        let userId = localStorage.getItem("userId")
        toast.error(`${removedProduct} is removed from your cart`)
        const filtered = userDetail.cart.filter((val) => {

            return val.id !== removeInd
        })
        setuserDetails({ cart: filtered })

        await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
            cart: filtered
        });
        setCartLength(filtered.length)



    }
    let userId = localStorage.getItem("userId")
    useEffect(() => {
        setCartLoading(true);
        setTimeout(() => {
            setCartLoading(false)
        }, 2000)
        async function getCart() {
            const resp = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
            const userDetails = await resp.data;
            setuserDetails(userDetails)
        }
        getCart()
    }, [])

    async function IncreCart(productId) {
        const updatedCart = userDetail.cart.map((cartItems) => {
            return cartItems.id === productId ? { ...cartItems, cartQty: cartItems.cartQty + 1 } : cartItems
        })


        setuserDetails(pre => ({ ...pre, cart: updatedCart }))
        await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
            cart: updatedCart
        });
    }

    async function DecreCart(productId) {
        const updatedCart = userDetail.cart.map((cartItems) => {
            // return cartItems.id === productId ? { ...cartItems, cartQty: cartItems.cartQty - 1 } : cartItems
            if (cartItems.id === productId) {
                return {
                    ...cartItems,
                    cartQty: cartItems.cartQty > 1 ? cartItems.cartQty - 1 : 1
                }
            }
            else {
                return cartItems
            }
        })
        console.log(updatedCart)

        setuserDetails(pre => ({ ...pre, cart: updatedCart }))
        await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
            cart: updatedCart
        });
    }

    async function GetOrders() {
        const resp = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
        const data = resp.data;
    }

    //printing total logic

    const total = userDetail.cart.reduce((acc, val) => {
        const itemTotal = val.price * val.cartQty;
        return ((acc + itemTotal + (itemTotal * 0.10)))
    }, 0);

    const grandTotal = (total + shipping).toFixed(2);

    function ProceedtoCheckOut() {
        setLoadaing(true);
        setTimeout(() => {
            setLoadaing(false);
            nav('/orders');

        }, 2000)
    }

    return (



        <div>
            <Navbar />
            {cartLoading && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-blue-50">
                    {/* Moving cart with smoke trail */}
                    <div className="relative mb-8 w-80 h-32 overflow-hidden">
                        {/* Smoke particles */}
                        <div className="absolute" style={{ animation: 'smokeTrail1 1.5s ease-out infinite' }}>
                            <div className="w-3 h-3 bg-gray-300 rounded-full opacity-60"></div>
                        </div>
                        <div className="absolute" style={{ animation: 'smokeTrail2 1.8s ease-out infinite', animationDelay: '0.2s' }}>
                            <div className="w-4 h-4 bg-gray-400 rounded-full opacity-50"></div>
                        </div>
                        <div className="absolute" style={{ animation: 'smokeTrail3 2s ease-out infinite', animationDelay: '0.4s' }}>
                            <div className="w-2 h-2 bg-gray-200 rounded-full opacity-70"></div>
                        </div>

                        {/* Moving cart */}
                        <div className="absolute top-12" style={{ animation: 'cartMove 3s ease-in-out infinite' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="blue" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>

                        </div>

                        {/* Speed lines */}
                        <div className="absolute top-14 opacity-40" style={{ animation: 'speedLines 1s ease-in-out infinite' }}>
                            <div className="w-8 h-0.5 bg-blue-400"></div>
                        </div>
                        <div className="absolute top-16 opacity-30" style={{ animation: 'speedLines 1.2s ease-in-out infinite', animationDelay: '0.1s' }}>
                            <div className="w-6 h-0.5 bg-blue-300"></div>
                        </div>
                    </div>



                    <style jsx>{`
            @keyframes cartMove {
                0% { 
                    transform: translateX(-50px);
                }
                50% { 
                    transform: translateX(200px);
                }
                100% { 
                    transform: translateX(-50px);
                }
            }

            @keyframes wheelSpin {
                from { 
                    transform: rotate(0deg);
                }
                to { 
                    transform: rotate(360deg);
                }
            }

            @keyframes smokeTrail1 {
                0% { 
                    transform: translate(-30px, 50px) scale(0);
                    opacity: 0.8;
                }
                100% { 
                    transform: translate(250px, 10px) scale(1.5);
                    opacity: 0;
                }
            }

            @keyframes smokeTrail2 {
                0% { 
                    transform: translate(-20px, 55px) scale(0);
                    opacity: 0.7;
                }
                100% { 
                    transform: translate(280px, 15px) scale(2);
                    opacity: 0;
                }
            }

            @keyframes smokeTrail3 {
                0% { 
                    transform: translate(-25px, 45px) scale(0);
                    opacity: 0.9;
                }
                100% { 
                    transform: translate(260px, 5px) scale(1.8);
                    opacity: 0;
                }
            }

            @keyframes speedLines {
                0% { 
                    transform: translateX(50px);
                    opacity: 0;
                }
                50% { 
                    opacity: 1;
                }
                100% { 
                    transform: translateX(-20px);
                    opacity: 0;
                }
            }
        `}</style>
                </div>
            )}


            {loading && (
                <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-white">
                    {/* simple spinner */}
                    <div className="flex flex-col items-center justify-center p-8 px-20">
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 40 40"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="20"
                                cy="20"
                                r="18"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="4"
                            />
                            <circle
                                cx="20"
                                cy="20"
                                r="18"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="56.5 56.5"
                                strokeDashoffset="0"
                            >
                                <animate
                                    attributeName="stroke-dasharray"
                                    values="0 113;28.25 84.75;0 113"
                                    dur="1.4s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-dashoffset"
                                    values="0;-28.25;-113"
                                    dur="1.4s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </svg>
                        <p className="text-lg font-semibold text-gray-700 mt-4">Proceeding...</p>
                    </div>
                </div>
            )}


            {/* <div className="">
                <h2 className="text-center mt-4 font-bold text-xl font-[verdana] text-gray-600">
                    Cart products:
                </h2>
            </div> */}

            {/* ✅ Wrap products + order summary together */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 px-4 md:px-10 mt-10">
                {/* ✅ Products Section */}
                <div className="flex-1 px-4 md:px-10 bg-gray-50 min-h-screen py-8">
                    {userDetail?.cart?.length === 0 ? (
                        <div className="flex flex-col justify-center items-center mt-20">
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto">
                                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="red" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 48 48">
                                        <circle cx="14" cy="41" r="3" />
                                        <circle cx="36" cy="41" r="3" />
                                        <path d="M8 13h32l-3 18H12L8 13zm2 0V9a1 1 0 0 1 1-1h3m24 5V9a1 1 0 0 0-1-1h-3" />
                                        <path d="M19 19h10" />
                                    </svg>



                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                                <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-700 mb-2">Shopping Cart</h1>
                                <p className="text-gray-600">{userDetail.cart.length} item{userDetail.cart.length > 1 ? 's' : ''} in your cart</p>
                            </div>

                            <div className="space-y-6">
                                {userDetail.cart.map((val) => {
                                    return (
                                        <div
                                            className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden "
                                            key={val.id}
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Image Section */}
                                                <div className="md:w-1/3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">

                                                    <Link to={`/induvidual/${val.id}`} className="block">
                                                        <img
                                                            src={val.image}
                                                            alt={val.model}
                                                            className="w-40 md:w-48 h-auto object-contain transition-transform duration-300 hover:scale-105"
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Content Section */}
                                                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="text-xl font-bold text-gray-900">{val.brand}</h3>

                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                                            <div className="bg-gray-50 rounded-lg p-2">
                                                                <span className="text-gray-500">Model:</span>
                                                                <span className="text-gray-700 font-medium ml-1">{val.model}</span>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg p-2">
                                                                <span className="text-gray-500">Type:</span>
                                                                <span className="text-gray-700 font-medium ml-1">{val.type}</span>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg p-2">
                                                                <span className="text-gray-500">Frame:</span>
                                                                <span className="text-gray-700 font-medium ml-1">{val.frame_material}</span>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg p-2">
                                                                <span className="text-gray-500">Unit Price:</span>
                                                                <span className="text-green-600 font-semibold ml-1">$ {val.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                                                <button
                                                                    className="bg-white text-gray-700 font-bold px-3 py-2 hover:bg-gray-50 transition-all cursor-pointer border-r border-gray-200"
                                                                    onClick={() => DecreCart(val.id)}
                                                                >
                                                                    -
                                                                </button>
                                                                <div className="px-4 py-2 bg-white border-r border-gray-200 min-w-[50px] text-center">
                                                                    <span className="text-lg font-semibold text-gray-900">{val.cartQty}</span>
                                                                </div>
                                                                <button
                                                                    className="bg-white text-gray-700 font-bold px-3 py-2 hover:bg-gray-50 transition-all cursor-pointer"
                                                                    onClick={() => IncreCart(val.id)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-500 mb-1">Total Price</div>
                                                            <div className="text-2xl font-bold text-green-600">
                                                                $ {(val.price * val.cartQty).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <button
                                                            className="w-full sm:w-auto bg-red-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-red-600 transition-all cursor-pointer flex items-center justify-center gap-2"
                                                            onClick={() => RemoveCartItem(val.id, val.brand)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Remove from Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>


                {/* ✅ Order Summary Section */}
                {userDetail.cart.length !== 0 && <div className="w-full md:w-1/3  ">
                    <div className="max-w-md mx-auto md:mx-0 bg-white rounded-lg shadow-lg p-6 mt-6 md:mt-0  ">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        {/* Order Items (static design for now) */}

                        <div className="space-y-3 text-sm ">

                            {userDetail.cart.map((val) => {
                                return <div className='flex justify-between' key={val.id}>
                                    <div>{val.brand} ({val.cartQty})</div>
                                    <div>{val.price * val.cartQty}</div>
                                </div>
                            })}



                        </div>

                        <hr className="my-4" />

                        {/* Totals */}
                        <div className="flex justify-between text-sm mb-2">
                            <span>Subtotal</span>
                            <span>${userDetail.cart.reduce((acc, val) => {
                                return acc + val.cartQty * val.price
                            }, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Tax (10%)</span>
                            <span>{userDetail.cart.reduce((acc, val) => {
                                const itemTotal = val.price * val.cartQty;
                                return (acc + (itemTotal * 0.10))
                            }, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Shipping</span>
                            <span>₹10.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{grandTotal}</span>
                        </div>

                        {/* Checkout Button */}
                        <button className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 cursor-pointer" onClick={() => ProceedtoCheckOut()}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>}

            </div>


        </div >

    )
}

export default Cart