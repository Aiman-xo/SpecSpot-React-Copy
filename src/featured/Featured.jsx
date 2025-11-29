import React, { useContext, useEffect, useState } from 'react'
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import '../mystyle.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
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
            const resp = await axios.get('https://specspot-db.onrender.com/products');
            const data1 = await resp.data;
            setData(data1);
        }
        products()
    }, [])



    //add to cart function


    async function AddtoCart(val, ID) {

        let userId = localStorage.getItem("userId");
        if (!userId) {
            // alert('please log in first!')
            toast.warning('please login first..')
            navigate('/login')
            return
        }
        const UserData = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
        const data = await UserData.data;

        if (data.cart.find(item => item.id === ID)) {
            // alert(`${val.brand} already in the cart`)
            toast.error(`${val.brand} is already in the cart`)
        }
        else {
            let userId = localStorage.getItem("userId");
            console.log('user', userId)
            if (userId) {

                await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
                    cart: [...data.cart, val]

                })
                setCartLength(data.cart.length + 1)

            }
            // else {

            //     alert('please log in first!')
            //     navigate('/login')
            //     return

            // }
            // alert(`${val.brand} added to cart`)
            toast.success(`${val.brand} added to the cart`)

        }





    }







    async function wishlist(val, ID) {
        // const isLiked = liked[val.id] || false;
        // setLiked(pre => {
        //     return {
        //         ...pre,
        //         [val.id]: !pre[val.id]
        //     }
        // })


        const isLiked = wishlist1.some(item => item.id === ID);


        if (!isLiked) {

            const userId = localStorage.getItem("userId")
            if (!userId) {
                // alert('please log in first!')
                toast.warning('please login first..')
                navigate('/login')
                return
            }

            const resp = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
            const data = await resp.data;

            if (data.wishlist.find((item) => item.id === ID)) {
                // alert(`${val.brand} already in wishlist`)
                toast.error(`${val.brand} is already in the wishlist`)
            }
            else {
                const updatedWishlist = [...data.wishlist, val]
                await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
                    wishlist: updatedWishlist
                });
                // alert(`${val.brand} is one of your liking`)
                setWishlist(updatedWishlist);
                setWishlistLength(data.wishlist.length + 1)

            }



        }
        else {
            const userID = localStorage.getItem("userId");

            const resp = await axios.get(`https://specspot-db.onrender.com/users/${userID}`);
            const data = await resp.data;

            const newFiltered = data.wishlist.filter((val) => {
                return val.id !== ID
            })

            await axios.patch(`https://specspot-db.onrender.com/users/${userID}`, {
                wishlist: newFiltered
            })
            setWishlist(newFiltered)
            setWishlistLength(data.wishlist.length - 1)

            // alert(`${val.brand} removed from wishlist`)
        }


    }
    return (



        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-6">
            {data.slice(0, 4).map((val) => {
                const isLiked = wishlist1.some((item) => item.id === val.id);

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
                                    className={`text-xs px-2 py-0.5 rounded ${val.Productstatus === "available"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {val.Productstatus}
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