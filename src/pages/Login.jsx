import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import Forgotpassword from '../featured/forgotpassword';
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
                password: action.payLoad
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
        case 'clear-error':
            return {
                ...prev,
                error: ''
            }
        default:
            return prev;
    }
}

function Login() {
    let nav = useNavigate();
    let { user, setUser } = useContext(searchContext);
    let [showforgot,setShowForgot] = useState(false);

    // Remove the unnecessary GetCred useEffect - you don't need to pre-fetch login data
    // useEffect(() => {
    //     const token = sessionStorage.getItem("access_token");
    //     if (!token) {
    //         toast.error('please login first')
    //     }
    // }, [])

    let [state, dispatch] = useReducer(reducFun, { 
        error: '', 
        email: '', 
        password: '' 
    });

    async function Validate(e) {
        e.preventDefault(); // Prevent default form behavior
        
        dispatch({ type: 'clear-error' });

        if (!state.email || !state.password) {
            dispatch({
                type: 'inp-error',
                payLoad: 'All fields must be filled'
            })
            return;
        }

        try {
            // Make POST request to login endpoint with correct field names
            const response = await axios.post('https://specspot.duckdns.org/api/v1/user/login/', {
                email: state.email,
                password: state.password  
            },{withCredentials:true});

            const { data, user: userData, access_token } = response.data;

            if (response.status === 200 || response.status === 202) {

                // Store access token in session storage
                sessionStorage.setItem('access_token', access_token);

                // Store user info in localStorage
                localStorage.setItem("userId", userData.id);
                localStorage.setItem("role", userData.is_staff ? "admin" : "user");
                localStorage.setItem("status", userData.is_active);
                // localStorage.setItem("userName", userData.name);

                setUser(userData.id);

                // Show success message
                toast.success(data || 'Login successful!');

                // Redirect based on role and status
                if (userData.is_staff) {
                    localStorage.setItem("adminId", userData.id);
                    nav('/admin');
                } else if (userData.is_staff === false) {
                    nav('/');
                } else {
                    toast.error('Your account is not active!');
                    // Clear storage if account is not active
                    sessionStorage.removeItem('access_token');
                    localStorage.removeItem("userId");
                    localStorage.removeItem("role");
                    localStorage.removeItem("status");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("adminId");
                }
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                const errorData = error.response.data;
            
                if (error.response.status === 401) {
                    dispatch({
                        type: "inp-error",
                        payLoad: errorData.error || "Unauthorized"
                    });
                    return;
                }
            
                if (error.response.status === 400) {
                    dispatch({
                        type: "inp-error",
                        payLoad: errorData.error || "Please fill all fields"
                    });
                    return;
                }
            
                if (error.response.status === 403) {
                    dispatch({
                        type: "inp-error",
                        payLoad: errorData.detail || "Invalid credentials"
                    });
                    return;
                }
            
                dispatch({
                    type: "inp-error",
                    payLoad: errorData.error || errorData.detail || "Login failed"
                });
            }
            
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4'>

            

            <div className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100'>
                <div className='flex justify-end'>
                    <button 
                        className='gap-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer' 
                        onClick={() => nav('/')}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='text-center mb-6'>
                    <i>
                        <h1 className='text-3xl font-bold text-gray-400'>
                            <span className='font-[verdana]'>S</span>pec
                            <span className='text-yellow-400 font-[verdana]'>S</span>pot
                        </h1>
                    </i>
                </div>
                <div className='text-center mb-8'>
                    <p className='text-gray-400 text-xs'>Welcome to the SpecSpot squad!</p>
                </div>

                <form onSubmit={Validate} className='space-y-6'>
                    <div className='relative'>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                            onChange={(e) => dispatch({
                                type: 'email',
                                payLoad: e.target.value
                            })}
                            value={state.email}
                            required
                        />
                    </div>

                    <div className='relative'>
                        <input
                            type="password"
                            placeholder='Enter your password'
                            className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                            onChange={(e) => dispatch({
                                type: 'pass',
                                payLoad: e.target.value
                            })}
                            value={state.password}
                            required
                        />
                    </div>

                    <div className='pt-4'>
                        <button
                            type="submit"
                            className='w-full bg-gradient-to-r bg-green-700 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none cursor-pointer active:bg-red-500 active:scale-95'
                        >
                            Log In
                        </button>
                        <div className='text-center font-bold my-3'>
                            <h5 className='text-red-500'>{state.error}</h5>
                        </div>
                    </div>
                </form>

                <div className='text-center mt-6'>
                    <p className='text-gray-600'>Didn't have an account?
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium ml-1'>
                            <Link to={'/register'}>Sign Up</Link>
                        </span>
                    </p>
                    <p>
                        <Link onClick={()=>setShowForgot(true)} className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
                            forgot password ?
                        </Link>
                    </p>

                    {showforgot&&<Forgotpassword onclose={()=>setShowForgot(false)}/>}

                </div>
            </div>
        </div>
    )
}

export default Login