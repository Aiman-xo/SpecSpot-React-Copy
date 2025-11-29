import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { RegisterContext } from './Rgister'
import { useContext } from 'react'
import { searchContext } from '../Context-API/context';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

function reducFun(prev, action) {
    switch (action.type) {
        case 'email':
            return {
                ...prev,
                error: '',
                email: action.payLoad
            }
        case 'pass':
            return {
                ...prev,
                error: '',
                pass: action.payLoad
            }
        case 'email-error':
            return {
                ...prev,

                error: action.payLoad
            }
        case 'pass-error':
            return {
                ...prev,

                error: action.payLoad
            }
        case 'inp-error':
            return {
                ...prev,

                error: action.payLoad
            }
    }
}

function Login() {
    let nav = useNavigate();
    let [cred, setCred] = useState([]);
    let { user, setUser } = useContext(searchContext);
    // let { email1, password1 } = useContext(RegisterContext);
    useEffect(() => {
        async function GetCred() {
            const resp = await axios.get('https://specspot-db.onrender.com/users');
            const data = await resp.data;
            setCred(data);
        }
        GetCred();
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            // toast.info('you are already logged In')
            nav('/')
        }
    }, [])

    let [state, dispatch] = useReducer(reducFun, { error: '' });
    console.log(cred);
    function Validate() {
        cred.map((val) => {

            if (state.email && state.pass !== '') {
                if (val.email !== state.email) {
                    dispatch({
                        type: 'email-error',
                        payLoad: 'check your email'
                    })
                }
                else if (val.password !== state.pass) {
                    dispatch({
                        type: 'pass-error',
                        payLoad: 'Password didnt match'
                    })
                }
                else {

                    const user1 = cred.find((user) => user.email === state.email && user.password === state.pass);
                    // console.log(user1.id);
                    if (user1.role === "user" && user1.status === "Active") {
                        localStorage.setItem("userId", user1.id);
                        localStorage.setItem("role", user1.role);
                        localStorage.setItem("status", user1.status)

                        setUser(user1.id);
                        nav('/')
                    } else if (user1.role === "admin") {
                        localStorage.setItem("adminId", user1.id);
                        localStorage.setItem("role", user1.role);


                        nav('/admin')
                    } else {
                        toast.error('you are blocked by admin!!');
                    }


                }
            }
            else {
                dispatch({
                    type: 'inp-error',
                    payLoad: 'Input must be filled'
                })
            }

        })

    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4'>


            <div className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100'>
                <div className='flex justify-end'>
                    <button className='gap-2 px-2 py-1  bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer' onClick={() => nav('/')}>
                        <X size={20} />
                    </button>

                </div>

                <div className='text-center mb-6'>
                    <i><h1 className='text-3xl font-bold text-gray-400'><span className='font-[verdana]'>S</span>pec<span className='text-yellow-400 font-[verdana]'>S</span>pot</h1></i>
                </div>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-700 mb-2 font-arial'></h2>
                    <p className='text-gray-400 text-xs'>Welcome to the SpecSpot squad!</p>
                </div>

                <div className='space-y-6'>


                    <div className='relative'>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                            onChange={(e) => dispatch({
                                type: 'email',
                                payLoad: e.target.value
                            })} />
                    </div>

                    <div className='relative'>
                        <input
                            type="password"
                            placeholder='Enter your password'
                            className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                            onChange={(e) => dispatch({
                                type: 'pass',
                                payLoad: e.target.value
                            })} />
                    </div>



                    <div className='pt-4'>
                        <button className='w-full bg-gradient-to-r bg-green-700  hover:from-green-600 hover:to-green-700 
                    text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all 
                    duration-200 focus:outline-none   cursor-pointer active:bg-red-500 active:scale-95' onClick={Validate}>
                            Log In
                        </button>
                        <div className='text-center font-bold my-3'><h5 className='text-red-500'>{state.error}</h5></div>
                    </div>
                </div>

                <div className='text-center mt-6'>
                    <p className='text-gray-600'>Didn't have an account?
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium ml-1'><Link to={'/register'}>Sign Up</Link></span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login