import React, { useEffect, useReducer, useState } from 'react'
// import { useState } from 'react';
import Navbar from '../Reusables/navbar';
import axios from 'axios';
// import { authFetch } from '../refreshFetch/authFetch';
import api from '../refreshFetch/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';



function reducerFun(prev, action) {
    switch (action.type) {
        case 'get-name':
            return {
                ...prev,
                fullName: action.payLoad
            }
        case 'get-address':
            return {
                ...prev,
                address: action.payLoad
            }

        case 'get-phone':
            return {
                ...prev,
                phone: action.payLoad
            }

        case 'get-city':
            return {
                ...prev,
                city: action.payLoad
            }

        case 'get-state':
            return {
                ...prev,
                region: action.payLoad
            }

        case 'get-pincode':
            return {
                ...prev,
                pin: action.payLoad
            }

        case 'get-country':
            return {
                ...prev,
                country: action.payLoad
            }

        case 'error':
            return {
                ...prev,
                error: action.payLoad
            }
    }
}
function ShippingPage() {
    let [userObject, SetUserObject] = useState([]);
    let nav = useNavigate();
    let [state, dispatch] = useReducer(reducerFun, {});
    let [loading, setLoading] = useState(false);
    let[spinner,setSpinner] = useState(false);
    let userId = localStorage.getItem("userId");
    let [paymentType,setPaymentType]=useState(null);
    const shipping = 10;

    useEffect(() => {
    async function GetCartItems() {
        try {
            const data = await api.get(
                "/cart/"
            );

            // data is an ARRAY of cart items
            SetUserObject(data.data);

        } catch (err) {
            console.error("Failed to load cart", err);
            toast.error("Please login first");
            nav("/login");
        }
    }

    GetCartItems();
}, []);

    const location = useLocation();
    const singleProduct = location.state?.induvidual || null;


    const items = singleProduct ? [{

        id: singleProduct.id,
        cartQty: 1,
        price: Number(singleProduct.price),
        product: singleProduct

    }] : userObject;
    console.log(items);


    async function PostShippingDetails() {
        // 1️⃣ Validate shipping form
        if (
            !state.fullName ||
            !state.address ||
            !state.phone ||
            !state.city ||
            !state.region ||
            !state.pin ||
            !state.country
        ) {
            dispatch({
                type: 'error',
                payLoad: 'Please fill your full address'
            });
            return;
        }
    
        setLoading(true);
    
        try {
            // 2️⃣ Determine products to order
            let productsToOrder;
    
            // Case A: BUY NOW (single product)
            if (singleProduct) {
                productsToOrder = [
                    {
                        id: singleProduct.id,
                        cartQty: singleProduct.cartQty || 1,
                        price: singleProduct.price
                    }
                ];
            }
    
            // Case B: ORDER FULL CART
            else {
                productsToOrder = userObject.map(item => ({
                    id: item.product.id,      // product ID
                    cartQty: item.cartQty,    // qty from cart
                    price: item.product.price // product price
                }));
            }
    
            // 3️⃣ Create order in backend
            const resp = await api.post(
                "/orders/",
                {
                    products: productsToOrder,
                    shipping: {
                        fullname: state.fullName,
                        mainAddress: state.address,
                        phone: state.phone,
                        city: state.city,
                        region: state.region,
                        pin: state.pin,
                        country: state.country
                    }
                }
            );
    
            console.log("Order response:", resp.data);
    
            // 4️⃣ Clear user’s cart only if the order is from CART
            if (!singleProduct) {
                await api.delete( "/cart/");
            }
    
            // 5️⃣ Navigate to confirmation
            setTimeout(() => {
                setLoading(false);
                nav("/orders/confirmed");
            }, 2000);
    
        } catch (err) {
            console.error("Order failed:", err);
            dispatch({ type: "error", payLoad: "Order failed" });
            setLoading(false);
        }
    }
    
    async function PostRazorpayOrder() {
        // 1️⃣ Validate shipping form
        if (
            !state.fullName ||
            !state.address ||
            !state.phone ||
            !state.city ||
            !state.region ||
            !state.pin ||
            !state.country
        ) {
            dispatch({
                type: "error",
                payLoad: "Please fill your full address",
            });
            return;
        }
        setSpinner(true);
        
    
        try {
            // Prepare products like COD
            let productsToOrder;
            if (singleProduct) {
                productsToOrder = [
                    {
                        id: singleProduct.id,
                        cartQty: singleProduct.cartQty || 1,
                        price: singleProduct.price,
                    },
                ];
            } else {
                productsToOrder = userObject.map((item) => ({
                    id: item.product.id,
                    cartQty: item.cartQty,
                    price: item.product.price,
                }));
            }
    
            // 2️⃣ Create Razorpay order in backend
            const resp = await api.post(
                "/razorpay/orders/",
                {
                    products: productsToOrder,
                    shipping: {
                        fullname: state.fullName,
                        mainAddress: state.address,
                        phone: state.phone,
                        city: state.city,
                        region: state.region,
                        pin: state.pin,
                        country: state.country,
                    },
                }
            );
    
            console.log("Razorpay backend response:", resp.data);
    
            // 3️⃣ Open Razorpay popup
            const options = {
                key: resp.data.razorpay_key,
                amount: resp.data.amount,
                currency: resp.data.currency,
                order_id: resp.data.razorpay_order_id,
    
                name: "Your Store",
                description: "Order Payment",
    
                handler: async function (paymentResponse) {
                    console.log("Payment success:", paymentResponse);
                
                    // hide spinner if still active
                    setSpinner(false);
                
                    // verify payment
                    const verify = await api.post(
                        "/orders/razorpay/verify/",
                        {
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                        }
                    );
                
                    if (verify.data.status === "success") {
                
                        // show order placing loader
                        setLoading(true);
                
                        if (!singleProduct) {
                            await api.delete( "/cart/");
                        }
                
                        // small delay prevents UI flicker
                        setTimeout(() => {
                            nav("/orders/confirmed");
                        }, 500);
                
                    } else {
                        toast.error("Payment verification failed");
                        setLoading(false);
                        setSpinner(false);
                    }
                },
    
                prefill: {
                    name: state.fullName,
                    email: localStorage.getItem("email"),
                    contact: state.phone,
                },
    
                modal: {
                    ondismiss: async function () {
                        console.log("Payment popup closed by user");
                
                        // 👉 Only attempt cancel if order_id exists
                        if (resp?.data.razorpay_order_id) {
                            try {
                                await api.post(
                                    "/orders/razorpay/cancel/",
                                    { razorpay_order_id: resp.data.razorpay_order_id }
                                );
                            } catch (e) {
                                console.error("Cancel API failed:", e);
                            }
                        } else {
                            console.warn("No razorpay_order_id found. Cancel skipped.");
                        }
                
                        toast.error("Payment cancelled");
                
                        // 👉 Ensure spinner ALWAYS stops
                        setLoading(false);
                        setSpinner(false);
                    }
                }
                
            };
    
            const rzp = new window.Razorpay(options);
    
            // 🔥🔥 ADDED: Handle payment failure event
            rzp.on("payment.failed", async function (response) {
                console.log("Payment failed:", response);
    
                await api.post(
                    "/orders/razorpay/cancel/",
                    {
                        razorpay_order_id: resp.data.razorpay_order_id,
                    }
                ); // <-- ADDED
    
                toast.error("Payment failed");
                setLoading(false);
            });

            setSpinner(false);
    
            rzp.open();
    
        } catch (err) {
            console.error("Razorpay order error:", err);
            dispatch({ type: "error", payLoad: "Razorpay payment failed." });
            setLoading(false);
        }
    }
    
    



    //printing total logic

    const total = items.reduce((acc, val) => {
        const itemTotal = val.product.price * val.cartQty;
        return ((acc + itemTotal + (itemTotal * 0.10)))
    }, 0);

    const grandTotal = (total + shipping).toFixed(2);


    return (

        <div className="min-h-screen bg-gray-50">
            {spinner&&<div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>}

            {/* Navbar */}
            <Navbar />
            {loading && <div className=" fixed flex inset-0 z-[9999] justify-center items-center bg-white">
                {/* simple spinner */}
                <div className="flex flex-col items-center justify-center bg-gray-100 p-8 px-20 rounded-2xl shadow-lg">
                    {/* ⬅️ Grey div box with padding, rounded corners & shadow */}

                    {/* ✅ Animated Tick */}
                    <svg
                        className="h-20 w-20 text-green-600 mb-4" // ⬅️ Added margin-bottom for spacing
                        viewBox="0 0 72 72"
                    >
                        <circle
                            className="stroke-current text-green-600"
                            cx="36"
                            cy="36"
                            r="34"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="213"
                            strokeDashoffset="213"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="213"
                                to="0"
                                dur="0.6s"
                                fill="freeze"
                            />
                        </circle>
                        <path
                            className="stroke-current text-green-600"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="60"
                            strokeDashoffset="60"
                            d="M20 38l10 10 22-22"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="60"
                                to="0"
                                dur="0.4s"
                                begin="0.6s"
                                fill="freeze"
                            />
                        </path>
                    </svg>


                    <p className="text-lg font-semibold text-gray-700">
                        Order Placed
                    </p>
                </div>


            </div>}

            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto p-8">
                {/* Shipping Address */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Shipping Address
                    </h2>
                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="John Doe"
                                onChange={(e) => dispatch({
                                    type: 'get-name',
                                    payLoad: e.target.value
                                })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Street address"
                                onChange={(e) => dispatch({
                                    type: 'get-address',
                                    payLoad: e.target.value
                                })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Phone"
                                onChange={(e) => dispatch({
                                    type: 'get-phone',
                                    payLoad: e.target.value
                                })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="City"
                                    onChange={(e) => dispatch({
                                        type: 'get-city',
                                        payLoad: e.target.value
                                    })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="State"
                                    onChange={(e) => dispatch({
                                        type: 'get-state',
                                        payLoad: e.target.value
                                    })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    ZIP/Postal Code
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="12345"
                                    onChange={(e) => dispatch({
                                        type: 'get-pincode',
                                        payLoad: e.target.value
                                    })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Country
                                </label>
                                <select className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" value={state.country} onChange={(e) => dispatch({
                                    type: 'get-country',
                                    payLoad: e.target.value
                                })}>
                                    <option value={'united states'}>United States</option>
                                    <option value={'canada'}>Canada</option>
                                    <option value={'united Kingom'}>United Kingdom</option>
                                    <option value={'australia'}>Australia</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <p className='text-red-600 text-base text-center mt-2'>{state.error}</p>
                </div>

                {/* Payment Section */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Payment Method
                    </h2>

                    <div className="space-y-3 mt-6">
                        <p className="text-gray-600 text-sm font-semibold">Other Options</p>
                        <label className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition">
                            <input type="radio" name="payment" value='cod' checked={paymentType === "cod"} onChange={(e)=>setPaymentType(e.target.value)} />
                            <span>Cash on Delivery</span>
                        </label>
                        <label className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition">
                            <input type="radio" name="payment"   value='razorpay' checked={paymentType === "razorpay"} onChange={(e)=>setPaymentType(e.target.value)}/>
                            <span>UPI / Wallet</span>
                        </label>
                    </div>

                    <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition cursor-pointer"
                        onClick={() => {
                            if(paymentType=='cod'){
                                PostShippingDetails();
                            }else{
                                PostRazorpayOrder();
                            }
                        }}>
                        Place Order
                    </button>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-80 h-100 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Order Summary
                    </h2>

                    {/* Cart Items */}
                    <div className="space-y-4">

                        {items.map((val) => {
                            console.log(val);
                            return <div className="flex items-center justify-between" key={val.id}>
                                <div>{val.product.brand} : ({val.cartQty})</div>
                                <div></div>
                                <div>{val.product.price * val.cartQty}</div>
                            </div>
                        })}

                    </div>

                    {/* Divider */}
                    <hr className="my-4" />

                    {/* Price Details */}
                    <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$ {items.reduce((acc, val) => {
                                return acc + (val.product.price * val.cartQty)
                            }, 0)}</span>
                        </div>

                        <div className="flex justify-between ">
                            <span>Tax (10%)</span>
                            <span>{items.reduce((acc, val) => {
                                const itemTotal = val.product.price * val.cartQty;
                                return (acc + (itemTotal * 0.10))
                            }, 0).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${shipping}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>${grandTotal}</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 cursor-pointer"
                        onClick={() => nav('/cart')}>
                        Go to Cart
                    </button>

                </div>
            </div>


        </div>
    )
}

export default ShippingPage