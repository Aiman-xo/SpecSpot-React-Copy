import React from 'react'
import { Link } from 'react-router-dom';

function Notfound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white text-center">
            {/* Illustration */}
            <div className="relative">
                <div className="text-[10rem] font-extrabold text-blue-600 animate-bounce">
                    404
                </div>
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500">
                    Lost in space...
                </span>
            </div>

            {/* Text */}
            <h2 className="mt-10 text-3xl font-semibold text-gray-800">
                Page Not Found
            </h2>
            <p className="mt-2 text-gray-500 max-w-md">
                The page you’re looking for doesn’t exist, or has been moved somewhere
                else. Don’t worry, we’ll get you back on track.
            </p>

            {/* Button */}
            <Link
                to={'/'}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
                Take Me Home
            </Link>
        </div>
    );
}

export default Notfound