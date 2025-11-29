import React, { createContext, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login';
import axios from 'axios'

// export const RegisterContext = createContext();

function reducFun(prev, action) {
    switch (action.type) {
        case 'get-name':
            return {
                ...prev,
                error: "",
                name: action.payLoad
            }
        case 'get-email':
            return {
                ...prev,
                error: '',
                email: action.payLoad
            }
        case 'get-password':
            return {
                ...prev,
                error: '',
                password: action.payLoad
            }
        case 'confirm-pass':
            return {
                ...prev,
                error: '',
                confirmPass: action.payLoad
            }
        case 'error':
            return {
                ...prev,
                error: action.payLoad
            }
        case 'pass-error':
            return {
                ...prev,
                error: action.payLoad
            }
        case 'email-type-error':
            return {
                ...prev,
                error: action.payLoad
            }
    }
}

function Rgister() {
    let nav = useNavigate();
    let [state, dispatch] = useReducer(reducFun, {});

    // let [err, setErr] = useState('');

    async function GetUser() {
        await axios.post('https://specspot-db.onrender.com/users', {
            name: state.name,
            email: state.email,
            password: state.password,
            confirmPass: state.confirmPass,
            role: 'user',
            status: "Active",
            signupDate: new Date().toLocaleDateString(),
            cart: [],
            wishlist: [],
            orders: []
        })
    }

    function Switch() {
        state.error = ''
        if (state.name && state.email && state.password && state.confirmPass !== '') {


            if (state.password !== state.confirmPass) {

                dispatch({
                    type: 'pass-error',
                    payLoad: 'Password must be same'
                })
            }
            else {
                GetUser()
                nav('/login')
            }


        }
        else {
            dispatch({
                type: 'error',
                payLoad: 'Input must be Filled'
            })
        }




    }
    return (

        <>
            {/* <RegisterContext.Provider value={{ email1: state.email, password1: state.password }}>
                <Login />
            </RegisterContext.Provider> */}


            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4'>


                <div className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100'>

                    <div className='text-center mb-6'>
                        <i><h1 className='text-3xl font-bold text-gray-400'><span className='font-[verdana]'>S</span>pec<span className='text-yellow-400 font-[verdana]'>S</span>pot</h1></i>
                    </div>
                    <div className='text-center mb-8'>
                        <h2 className='text-3xl font-bold text-gray-700 mb-2 font-arial'>Create Account</h2>
                        <p className='text-gray-400 text-xs'>Welcome to the SpesSpot squad!</p>
                    </div>

                    <div className='space-y-6'>
                        <div className='relative'>
                            <input
                                type="text"
                                placeholder='Enter your name'
                                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                                onChange={(e) => dispatch({
                                    type: 'get-name',
                                    payLoad: e.target.value
                                })} />
                        </div>

                        <div className='relative'>
                            <input
                                type="email"
                                placeholder='Enter your email'
                                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                                onChange={(e) => dispatch({
                                    type: 'get-email',
                                    payLoad: e.target.value
                                })} required />
                        </div>

                        <div className='relative'>
                            <input
                                type="password"
                                placeholder='Enter your password'
                                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                                onChange={(e) => dispatch({
                                    type: 'get-password',
                                    payLoad: e.target.value
                                })} />
                        </div>

                        <div className='relative'>
                            <input
                                type="password"
                                placeholder='Confirm your password'
                                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                                onChange={(e) => dispatch({
                                    type: 'confirm-pass',
                                    payLoad: e.target.value
                                })} />
                        </div>

                        <div className='pt-4'>
                            <button className='w-full bg-gradient-to-r bg-orange-500  hover:from-orange-600 hover:to-orange-700 
                        text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all 
                        duration-200 focus:outline-none   cursor-pointer active:bg-red-500 active:scale-95' onClick={Switch}>
                                Register
                            </button>
                            <div className='text-center font-bold my-3'><h5 className='text-red-500'>{state.error}</h5></div>

                        </div>
                    </div>

                    <div className='text-center mt-6'>
                        <p className='text-gray-600'>Already have an account?
                            <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium ml-1'><Link to={'/login'}>Log in</Link></span>
                        </p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Rgister