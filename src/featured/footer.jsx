import React from 'react'

function Footer() {
    return (
        <div>
            <footer className="bg-gray-900 text-white p-30">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    {/* Brand */}
                    <div className="mb-4 md:mb-0 text-lg font-semibold">
                        <i><h1 className='text-3xl font-bold text-gray-400'>
                            <span className='font-[verdana]'>S</span>pec<span className='text-yellow-400 font-[verdana]'>S</span>pot</h1></i>
                    </div>

                    {/* Links */}
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="#" className="hover:text-gray-400">Home</a>
                        <a href="#" className="hover:text-gray-400">Shop</a>
                        <a href="#" className="hover:text-gray-400">Contact</a>
                        <a href="#" className="hover:text-gray-400">About</a>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-gray-400">
                        © 2025 SpecSpot. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer