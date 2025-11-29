import React, { useEffect, useState } from 'react'

import Navbar from '../Reusables/navbar'
import { Link } from 'react-router-dom'
import Featured from '../featured/Featured'
import Review from '../featured/review'
import Footer from '../featured/footer'


function Home() {
    let [init, setInit] = useState(false);
    useEffect(() => {

        const hasSeen = localStorage.getItem("hasSeen");
        if (!hasSeen) {
            setTimeout(() => {
                setInit(true);
            }, 1000)

            localStorage.setItem("hasSeen", "true")
        }

    }, [])

    return (
        <div>
            <Navbar />

            {init && <div className="fixed inset-0  bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-auto">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
                        Server Loading Notice
                    </h2>

                    <p className="text-gray-600 text-center mb-6">
                        Our JSON server is hosted on Render, and it takes approximately 50-55 seconds to load the initial data. Please be patient while we fetch all the products.
                    </p>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setInit(false)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 cursor-pointer"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            </div>}

            <Link to={'/products'}><img src="https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-celebs-style-260625.png"
                alt="" className='cursor-pointer hover:scale-101 transition-transform duration-500' /></Link>
            <div className='flex justify-center mt-4 font-bold text-xl font-[verdana] text-gray-600'>
                <i><h1>Featured Ones</h1></i>
            </div>

            <Featured />
            <div className='flex justify-center mt-10 font-bold text-xl font-[verdana] text-gray-600'>
                <i><h1>Reviews</h1></i>
            </div>
            <Review />

            <Link to={'/products'}><img src="https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-hustlr.png"
                alt="" className='cursor-pointer mt-10' /></Link>

            <Footer />


        </div>
    )









}

export default Home