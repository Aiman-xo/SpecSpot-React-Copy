import React, { useContext, useEffect, useMemo } from 'react'
import Navbar from '../Reusables/navbar'
import axios from 'axios'
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom';
import '../mystyle.css'
import { toast } from "react-toastify";
// import { data } from 'react-router-dom';
import { searchContext } from '../Context-API/context';

function Products() {

    let [products, setProducts] = useState([]);
    let [details, setDetails] = useState(products);
    // let [liked, setLiked] = useState({});
    let [notfound, setNotfound] = useState('');
    let [wishlist1, setWishlist] = useState([]);
    const { search, focus, setCart, setFlag, cartlength, setCartLength, setWishlistLength } = useContext(searchContext);
    const { user } = useContext(searchContext);
    let navigate = useNavigate();
    // const { addtocart, setAddtocart } = useContext(searchContext);


    // useEffect(() => {

    //     if (search.trim() === '') {
    //         setDetails(products);
    //         setNotfound('');
    //     }
    //     else {
    //         setNotfound('');
    //         const searchArr = products.filter((val) => {
    //             return val.brand.toLowerCase().includes(search.toLowerCase())
    //         })
    //         setDetails(searchArr)

    //         if (searchArr.length === 0) {

    //             setNotfound('No Products Found!')
    //         }
    //     }


    // }, [search])

    useEffect(() => {
        async function ProductList() {
            const resp = await axios.get('https://specspot-db.onrender.com/products');
            const data = await resp.data;
            setProducts(data);
            setDetails(data)

            const userId = localStorage.getItem("userId")
            if (!userId) {
                // alert('please log in first!')
                // navigate('/login')
                return
            }
            const wish = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
            const wishData = wish.data;
            setWishlist(wishData.wishlist);


        }
        ProductList();
    }, [])

    function Filter(filterValue) {
        if (filterValue === null) {
            setDetails(products);
        }
        else {
            const filteredOne = products.filter((val) => {
                return val.type === filterValue
            })
            setDetails(filteredOne);
            // console.log(filteredOne);
        }

    }

    function AmountFilter(productType) {
        const amountFilter = products.filter((val) => {
            if (productType === 'budget') {
                return val.price < 200
            }
            else {
                return val.price > 200
            }

        })
        setDetails(amountFilter)
    }




    async function AddtoCart(val, ID) {

        let userId = localStorage.getItem("userId");
        if (!userId) {
            toast.warning('please login first..')
            navigate('/login')
            return;
        }
        const UserData = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
        const data = await UserData.data;

        if (data.cart.find(item => item.id === ID)) {
            // alert(`${val.brand} already in the cart`)
            toast.error(`${val.brand} is already in the cart`);
        }
        else {
            let userId = localStorage.getItem("userId");
            console.log('user', userId)
            if (userId) {

                await axios.patch(`https://specspot-db.onrender.com/users/${userId}`, {
                    cart: [...data.cart, val]


                })
                setFlag(pre => !pre);
                setCartLength(data.cart.length + 1);


            }

            // alert(`${val.brand} added to cart`)
            toast.success(`${val.brand} added to the cart`);

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
                setWishlistLength(data.wishlist.length + 1);

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
        <div >
            <Navbar />
            {
                !focus && (<Link ><img src="https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-mavericks.png"
                    alt="" className='cursor-pointer hover:scale-101 transition-transform duration-500' /></Link>)
            }


            <div className=''>
                <h2 className='text-center mt-4 font-bold text-xl font-[verdana] text-gray-600'>Our Products</h2>
            </div>

            <div className='flex justify-start'>
                <h4 className='ms-6 mt-6  text-base font-[verdana] text-gray-900'>Filter your search:</h4>
            </div>

            <div className='flex flex-wrap justify-center gap-3 mt-5'>
                <button className='bg-gray-200 me-4 p-5 rounded-xl text-sm font-[verdana] cursor-pointer hover:bg-gray-300 hover:text-gray-700' onClick={() => {

                    Filter('sunglass');
                }}>Sunglasses</button>
                <button className='bg-gray-200 me-4 p-5 rounded-xl text-sm font-[verdana] cursor-pointer hover:bg-gray-300 hover:text-gray-700' onClick={() => {
                    Filter('transparent');
                }}>Transparent</button>
                <button className='bg-gray-200 me-4 p-5 rounded-xl text-sm font-[verdana] cursor-pointer hover:bg-gray-300 hover:text-gray-700' onClick={() => AmountFilter('budget')}>Under 200</button>
                <button className='bg-gray-200 me-4 p-5 rounded-xl text-sm font-[verdana] cursor-pointer hover:bg-gray-300 hover:text-gray-700' onClick={() => AmountFilter('expensive')}>Above 200 </button>
                <button className='bg-gray-200 me-4 p-5 rounded-xl text-sm font-[verdana] cursor-pointer hover:bg-gray-300 hover:text-gray-700' onClick={() => Filter('normal')}>Normal</button>
                <button className='bg-gray-200 me-4 p-5 rounded-xl text-sm font-[verdana] cursor-pointer hover:bg-gray-300 hover:text-gray-700' onClick={() => {
                    Filter(null)
                }}>Show all</button>
            </div>

            <div className='flex justify-start'>
                <h4 className='ms-6 mt-6  text-base font-[verdana] text-gray-900'>Find the product you love:</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mt-6">
                {details.map((val) => {
                    const isLiked = wishlist1.some((item) => item.id === val.id);

                    return (
                        <div
                            key={val.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative flex justify-center bg-gray-50 p-4">
                                <Link to={`/induvidual/${val.id}`}>
                                    <img
                                        src={val.image}
                                        alt={val.model}
                                        className="w-36 h-36 object-contain"
                                    />
                                </Link>

                                {/* Wishlist button top-right */}
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

                            {/* Content */}
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

                                {/* Action buttons */}
                                <div className="mt-auto">
                                    {val.Productstatus === "out-of-stock" ? (
                                        <button
                                            className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm cursor-not-allowed opacity-70"
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



            {/* <div className='grid grid-cols-2 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto mt-4 '>

                {
                    details.map((val) => {
                        // const isLiked = liked[val.id] || false;
                        const isLiked = wishlist1.some(item => item.id === val.id);

                        return <div key={val.id}>
                            <div className='card  ' >
                                <div className='flex justify-center'>
                                    <Link to={`/induvidual/${val.id}`}><img src={val.image} alt="" className='w-40 mt-3' /></Link>
                                </div>
                                <div className='flex justify-start ms-5'>
                                    <div >
                                        <div className='flex justify-between'><p className='font-bold text-xl '>{val.brand}</p><p className={` text-xs h-5 mt-2 rounded-sm me-1 px-1  font-medium ${val.Productstatus === "Active"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                            }`}>{val.Productstatus}</p></div>
                                        <p className='mb-1'>{val.model}</p>
                                        <p className='text-green-500 '>{`$ ${val.price}`}</p>
                                        {val.Productstatus === "Inactive" ? (<button className='bg-red-500 px-3 py-1 rounded text-xs cursor-pointer cursor-not-allowed opacity-70'
                                            disabled> Inactive</button>) : (<button className='bg-yellow-500 px-3 py-1 rounded text-xs cursor-pointer hover:bg-yellow-400'
                                                onClick={() => AddtoCart(val, val.id)}>Add to cart</button>)}

                                        <button
                                            onClick={() => wishlist(val, val.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 transition ms-13 cursor-pointer"
                                        >
                                            {isLiked ? (
                                                <HeartSolid className="h-6 w-6 text-red-500" />
                                            ) : (
                                                <HeartOutline className="h-6 w-6 text-gray-500" />
                                            )}
                                        </button>

                                    </div>
                                </div>

                            </div>
                        </div>

                    })
                }

            </div> */}


            <div className='w-auto h-60 flex  items-center justify-center text-[17px] font-[verdana] text-red-400'>
                <div>
                    <h1>{notfound}</h1>
                </div>

            </div>

        </div>
    )
}

export default Products