import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchContext } from '../Context-API/context';
// import { User } from "lucide-react"
import axios from 'axios';
import { toast } from 'react-toastify';



function Navbar() {
    let [isMenuOpen, setIsMenuOpen] = useState(false);
    let { search, setSearch, setFocus, focus, flag, cartlength, setCartLength, wishlistLength, setWishlistLength } = useContext(searchContext);
    // let [cartlength, setCartlength] = useState([]);
    // let [wishlength, setWishLength] = useState([]);
    let [products, setProducts] = useState([]);
    let [details, setDetails] = useState([]);
    let [showlogin, setShowLogin] = useState(false);

    let [notfound, setNotfound] = useState('');
    let nav = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setShowLogin(true);
            return
        }
        async function getCartLength() {
            const resp = await axios.get(`https://specspot-db.onrender.com/users/${userId}`);
            const data = resp.data;
            setCartLength(data.cart.length)
            setWishlistLength(data.wishlist.length)
            // setCartlength(data.cart);
            // setWishLength(data.wishlist);
        }
        getCartLength()
    })

    function LogOut() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            // alert("please login first");
            toast.warning('please login first')
            nav('/login')
        }
        else {
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            toast.error('logging out...')
            nav('/')
            setCartLength(0);
            setWishlistLength(0);

        }

    }

    function LgCheckforWishlist() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            // alert("please login first");
            toast.warning('please login first')
            nav('/login')
        }
        else {
            nav('/wishlist')
        }
    }

    function LgCheckforProfile() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            // alert("please login first");
            toast.warning('please login first')
            nav('/login')
        }
        else {
            nav('/profile')
        }
    }

    function LgCheckforCart() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            // alert("please login first");
            toast.warning('please login first')
            nav('/login')
        }
        else {
            nav('/cart')
        }
    }

    //search option
    useEffect(() => {
        async function Getproducts() {
            const resp = await axios.get('https://specspot-db.onrender.com/products');
            const data = resp.data;
            setProducts(data);
        }
        Getproducts()
    }, [])

    useEffect(() => {


        if (search.trim() === '') {

        }
        else {
            setNotfound('');
            const searchArr = products.filter((val) => {
                return val.brand.toLowerCase().includes(search.toLowerCase())
            })
            setDetails(searchArr)

            if (searchArr.length === 0) {

                setNotfound('No Products Found!')
            }
        }




    }, [search])

    function checkAdmin() {
        const adminId = localStorage.getItem("adminId");
        if (adminId) {
            nav('/admin')
        } else {
            nav('/login')
        }
    }


    return (

        <>
            <nav className="bg-white shadow-md sticky top-0 z-50 relative">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                    {/* Brand Logo/Name */}
                    <div className="flex items-center">
                        <Link to={'/'} className="text-2xl font-bold text-blue-600">
                            <i>
                                <h1 className="text-xl sm:text-3xl font-bold text-gray-400">
                                    <span className="font-[verdana]">S</span>pec
                                    <span className="text-yellow-400 font-[verdana]">S</span>pot
                                </h1>
                            </i>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for glasses, brands..."
                                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setSearch(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => {
                                    setFocus(false)
                                }, 300)} />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 hidden md:flex"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                    </div>


                    <div className='flex items-center space-x-7'>
                        <Link to={'/'} className="text-gray-700 hover:text-blue-600 hidden sm:inline-block">
                            Home
                        </Link>
                        <Link to={'/products'} className="text-gray-700 hover:text-blue-600 hidden sm:inline-block">
                            Product
                        </Link>
                        {showlogin && <button onClick={() => checkAdmin()} className="text-gray-700 hover:bg-green-600 hidden sm:inline-block bg-green-500 rounded px-3 py-1 text-white cursor-pointer">
                            Login
                        </button>}
                    </div>



                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-3">
                            <button

                                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-gray-200 transition cursor-pointer"
                                onClick={LgCheckforProfile}>
                                {/* User Icon (Proper SVG) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-gray-700 hover:text-gray-600 hidden sm:inline-block">Profile</span>
                            </button>
                        </div>
                        {/* Wishlist */}
                        <button className="text-gray-700 hover:text-blue-600 relative cursor-pointer" onClick={LgCheckforWishlist} title='wishlist'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistLength}
                            </span>
                        </button>

                        {/* Cart */}
                        <button className="text-gray-700 hover:text-blue-600 relative cursor-pointer" onClick={LgCheckforCart} title='cart'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartlength}
                            </span>
                        </button>

                        {/* Logout (Desktop Only) */}
                        <button className="text-gray-700 hover:text-blue-600 hidden sm:inline-block cursor-pointer" onClick={LogOut} title='Logout'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>

                        {/* Hamburger Menu (Mobile Only) */}
                        <button
                            className="sm:hidden text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="sm:hidden bg-white shadow-md mt-2 rounded-lg p-4">
                        <Link to={'/'} className="block py-2 text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to={'/products'} className="block py-2 text-gray-700 hover:text-blue-600">
                            Product
                        </Link>
                        <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
                            Profile
                        </Link>
                        {showlogin && <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                            Login
                        </Link>}
                        {/* Logout in Mobile Menu */}
                        <button className="block py-2 text-red-700 hover:text-blue-600" onClick={LogOut}>
                            Logout
                        </button>
                    </div>
                )}


            </nav>
            <div className='absolute bg-gray-200 text-black fixed z-999 left-33 sm:left-90 w-35 sm:w-80 rounded'>
                {focus && search.length > 0 &&
                    details.map((val) => {
                        return <Link to={`/induvidual/${val.id}`} onClick={() => {
                            setSearch('')
                            setFocus(false)

                        }} key={val.id}>
                            <div className='p-3 hover:bg-gray-500 hover:text-white hover:rounded' >{
                            }
                                {val.brand}


                            </div></Link>
                    })
                }
            </div>

        </>
    )
}

export default Navbar