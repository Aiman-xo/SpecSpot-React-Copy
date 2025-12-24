import React, { useContext, useEffect, useState } from 'react'
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import '../mystyle.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
// import { authFetch } from '../refreshFetch/authFetch';
import api from '../refreshFetch/api';
import { searchContext } from '../Context-API/context';

function Featured() {
    let [data, setData] = useState([]);
    let navigate = useNavigate();
    let [wishlist1, setWishlist] = useState([]);
    const { cartlength, setCartLength, setWishlistLength } = useContext(searchContext);
    // let {id}=useParams()

    // let [liked, setLiked] = useState({});

    useEffect(() => {
        async function products() {
            const resp = await axios.get('https://specspot.duckdns.org/api/v1/products/');
            const data1 = await resp.data;
            setData(data1);
        }
        products()
    }, [])



    //add to cart function


    async function AddtoCart(product) {
    const access = sessionStorage.getItem("access_token");

    if (!access) {
        toast.warning("Please login first");
        navigate("/login");
        return;
    }

    try {
        const resp = await api.post(
            "/cart/",
            {
                product_id: product.id,
                cartQty: 1
            }
        );

        if (resp.message === "exists") {
            toast.info(`${product.brand} is already in your cart`);
        } else {
            toast.success(`${product.brand} added to cart`);
            setCartLength(prev => prev + 1); // Update navbar badge
        }

    } catch (error) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add item to cart");
    }
}








    async function wishlist(product, ID) {
        const access = sessionStorage.getItem("access_token");
    
        if (!access) {
            toast.warning("Please login first");
            navigate("/login");
            return;
        }
    
        // Check if already in wishlist (client-side)
        const isLiked = wishlist1.some(item => item.product.id === ID);
    
        try {
            if (!isLiked) {
                // --------------------------
                // ADD TO WISHLIST
                // --------------------------
                const resp = await api.post(
                    "/wishlist/",
                    { product_id: ID }
                );
    
                if (resp.message === "already_exists") {
                    toast.info(`${product.brand} is already in your wishlist`);
                    return;
                }
    
                else {
                    toast.success(`${product.brand} added to wishlist`);
    
                    // update UI
                    setWishlist(prev => [...prev, { product }]);
                    setWishlistLength(prev => prev + 1);
                }
            } 
            
            else {
                // --------------------------
                // REMOVE FROM WISHLIST
                // --------------------------
                await api.delete(
                    `/wishlist/${ID}/`
                );
    
                toast.error(`${product.brand} removed from wishlist`);
    
                // update UI
                setWishlist(prev =>
                    prev.filter(item => item.product.id !== ID)
                );
                setWishlistLength(prev => prev - 1);
            }
    
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Something went wrong");
        }
    }
    return (



        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-6">
            {data.slice(0, 4).map((val) => {
                const isLiked = wishlist1.some((item) => item.product.id === val.id);

                return (
                    <div
                        key={val.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                        {/* Product Image */}
                        <div className="relative flex justify-center bg-gray-50 p-4">
                            <Link to={`/induvidual/${val.id}`}>
                                <img
                                    src={val.image}
                                    alt={val.model}
                                    className="w-32 h-32 object-contain"
                                />
                            </Link>

                            {/* Wishlist Button */}
                            <button
                                onClick={() => wishlist(val, val.id)}
                                className="absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition cursor-pointer"
                            >
                                {isLiked ? (
                                    <HeartSolid className="h-5 w-5 text-red-500" />
                                ) : (
                                    <HeartOutline className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>

                        {/* Product Content */}
                        <div className="px-4 py-3 flex flex-col flex-grow">
                            {/* Brand + Status */}
                            <div className="flex justify-between items-center mb-1">
                                    <p className="font-bold text-lg">{val.brand}</p>

                                    <span
                                        className={`text-xs px-2 py-0.5 rounded ${
                                            val.in_stock
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                        {val.in_stock ? "Available" : "Out of Stock"}
                                    </span>
                                </div>

                            {/* Model */}
                            <p className="text-gray-600 text-sm mb-2">{val.model}</p>

                            {/* Price */}
                            <p className="text-green-600 font-semibold mb-3">${val.price}</p>

                            {/* Action Buttons */}
                            <div className="mt-auto">
                                {val.Productstatus === "out-of-stock" ? (
                                    <button
                                        className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-60"
                                        disabled
                                    >
                                        out-of-stock
                                    </button>
                                ) : (
                                    <button
                                        className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-400 transition cursor-pointer"
                                        onClick={() => AddtoCart(val, val.id)}
                                    >
                                        Add to cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

    )
}

export default Featured