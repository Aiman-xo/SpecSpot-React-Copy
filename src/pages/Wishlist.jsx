import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Reusables/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { authFetch } from '../refreshFetch/authFetch';
import { searchContext } from '../Context-API/context';
import api from '../refreshFetch/api';

function Wishlist() {
    let [loading, setLoading] = useState(false);
    let nav = useNavigate()
    let {setWishlistLength,Wishlength,setCartLength} =useContext(searchContext)


    const userId = localStorage.getItem("userId")

    let [wishlistItem, setWishlistItem] = useState([]);
    // const { setCartLength, setWishlistLength } = useContext(searchContext);

    useEffect(() => {
        setLoading(true);

        async function getWishlist() {
            try {
                const data = await api.get(
                    "/wishlist/"
                );
                // console.log(data);

                // data is an array of wishlist items
                setWishlistItem(data.data);
            } catch (error) {
                console.error("Failed to load wishlist", error);
                toast.error("Please login first");
                nav("/login");
            } finally {
                setLoading(false);
            }
        }
        console.log(wishlistItem);
        getWishlist();
    }, []);
    useEffect(() => {
        console.log("Wishlist item updated:", wishlistItem);
    }, [wishlistItem]);

    async function RemoveWishlist(productId, brand) {
        const access = sessionStorage.getItem("access_token");
    
        if (!access) {
            toast.warning("Please login first");
            navigate("/login");
            return;
        }
    
        try {
            // Backend DELETE request
            await api.delete(
                `/wishlist/${productId}/`
            );
    
            // Update UI state
            setWishlistItem(prev =>
                prev.filter(item => item.product.id !== productId)
            );
    
            setWishlistLength(prev => prev - 1);
    
            toast.error(`${brand} removed from wishlist`);
    
        } catch (error) {
            console.error("Wishlist delete error:", error);
            toast.error("Failed to remove item");
        }
    }
    
    async function AddtoCart(product) {

        const access = sessionStorage.getItem("access_token");
    
        if (!access) {
            toast.warning("Please login first");
            navigate("/login");
            return;
        }
    
        try {
            // Matches your Django CartView.post()
            const resp = await api.post(
                "/cart/",
                {
                    product_id: product.product.id,
                    cartQty: 1
                }
            );
            if (resp.message === "exists") {
                toast.info(`${product.product.brand} is already in your cart`);
            } 
    
            else {
                toast.success(`${product.product.brand} added to cart`);
                setCartLength(prev => prev + 1);  // update badge
            }
            
            // OPTIONAL: update cart count in UI
            // setCartLength(prev => prev + 1);
    
        } catch (error) {
            toast.error("Could not add item to cart");
            console.error(error);
        }
    }
    return (
        <div>
            <Navbar />
            {loading && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white">
                    {/* Heartbeat animation */}
                    <div className="mb-6">
                        <svg
                            className="w-20 h-20 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            style={{
                                animation: 'heartbeat 1.5s ease-in-out infinite'
                            }}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    {/* Loading text */}
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Your Wishlist</h3>

                    </div>

                    <style jsx>{`
            @keyframes heartbeat {
                0% { 
                    transform: scale(1);
                }
                14% { 
                    transform: scale(1.2);
                }
                28% { 
                    transform: scale(1);
                }
                42% { 
                    transform: scale(1.2);
                }
                70% { 
                    transform: scale(1);
                }
            }
        `}</style>
                </div>
            )}
            <div className=''>
                <h2 className='text-center mt-4 font-bold text-xl font-[verdana] text-gray-600'>Wishlist:</h2>
            </div>



            {

                wishlistItem.length === 0 ?
                    <div className="flex flex-col justify-center items-center mt-20">
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
                            <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
                        </div>
                    </div>
                    :
                    <div className="bg-gray-50 min-h-screen py-8 px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                                <p className="text-gray-600">{wishlistItem.length} item{wishlistItem.length > 1 ? 's' : ''} saved for later</p>
                            </div>

                            <div className="space-y-4">
                                {wishlistItem.map((val) => {
                                    return (
                                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200" key={val.id}>
                                            <div className="flex flex-col md:flex-row">
                                                {/* Product Image */}
                                                <div className="md:w-1/3 p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                                    <Link to={`/induvidual/${val.product.id}`} className="block">
                                                        <img
                                                            src={val.product.image}
                                                            alt={val.product.model}
                                                            className="w-48 h-auto object-contain transition-transform duration-300 hover:scale-105"
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Product Details */}
                                                <div className="md:w-2/3 p-8 flex flex-col justify-between">
                                                    <div>
                                                        <Link to={`/induvidual/${val.product.id}`}>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                                                                {val.product.brand}
                                                            </h3>
                                                        </Link>

                                                        <div className="flex flex-wrap gap-4 mb-4">
                                                            <div className="bg-gray-100 rounded-lg px-3 py-1">
                                                                <span className="text-sm text-gray-600">Model: </span>
                                                                <span className="text-sm font-semibold text-gray-800">{val.product.model}</span>
                                                            </div>
                                                            <div className="bg-gray-100 rounded-lg px-3 py-1">
                                                                <span className="text-sm text-gray-600">Type: </span>
                                                                <span className="text-sm font-semibold text-gray-800">{val.product.category_name}</span>
                                                            </div>
                                                            <div className="bg-gray-100 rounded-lg px-3 py-1">
                                                                <span className="text-sm text-gray-600">Frame: </span>
                                                                <span className="text-sm font-semibold text-gray-800">{val.product.frame_material}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-6">
                                                            <span className="text-3xl font-bold text-green-600">$ {val.product.price}</span>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <button
                                                            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
                                                            onClick={() => AddtoCart(val, val.id, val.brand)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13h10" />
                                                                <circle cx="9" cy="20" r="1" />
                                                                <circle cx="20" cy="20" r="1" />
                                                            </svg>
                                                            Add to Cart
                                                        </button>

                                                        <button
                                                            className="sm:w-auto bg-red-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
                                                            onClick={() => RemoveWishlist(val.product.id, val.product.brand)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Remove from Wishlist
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>}


        </div>
    )
}

export default Wishlist