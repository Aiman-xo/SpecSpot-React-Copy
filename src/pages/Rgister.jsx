import React, { useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

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
                confirm_password: action.payLoad  // Changed to match backend
            }
        case 'error':
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

function Register() {
    let nav = useNavigate();
    let [state, dispatch] = useReducer(reducFun, {
        name: '',
        email: '',
        password: '',
        confirm_password: '', // Changed from confirmPass
        error: ''
    });

    async function registerUser() {
        try {
            const response = await axios.post('https://specspot.duckdns.org/api/v1/user/register/', {
                name: state.name,
                email: state.email,
                password: state.password,
                confirm_password: state.confirm_password, // Match backend field name
                // Remove unnecessary fields - backend will handle these automatically
            });

            if (response.status === 201) {
                toast.success('Registration successful! Please login.');
                nav('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);

            if (error.response) {
                const errorData = error.response.data;

                // Handle validation errors from backend
                if (error.response.status === 400) {
                    // Check for specific field errors
                    if (errorData.email) {
                        dispatch({
                            type: 'error',
                            payLoad: errorData.email[0]
                        });
                    } else if (errorData.password) {
                        dispatch({
                            type: 'error',
                            payLoad: errorData.password[0]
                        });
                    } else if (errorData.confirm_password) {
                        dispatch({
                            type: 'error',
                            payLoad: errorData.confirm_password[0]
                        });
                    } else if (errorData.non_field_errors) {
                        dispatch({
                            type: 'error',
                            payLoad: errorData.non_field_errors[0]
                        });
                    } else {
                        dispatch({
                            type: 'error',
                            payLoad: 'Please check your input fields'
                        });
                    }
                } else {
                    dispatch({
                        type: 'error',
                        payLoad: 'Registration failed. Please try again.'
                    });
                }
            } else {
                dispatch({
                    type: 'error',
                    payLoad: 'Network error. Please check your connection.'
                });
            }
        }
    }

    function validateAndSubmit() {
        dispatch({ type: 'clear-error' });

        // Basic frontend validation
        if (!state.name || !state.email || !state.password || !state.confirm_password) {
            dispatch({
                type: 'error',
                payLoad: 'All fields must be filled'
            });
            return;
        }

        if (state.password !== state.confirm_password) {
            dispatch({
                type: 'error',
                payLoad: 'Passwords must match'
            });
            return;
        }

        if (state.password.length < 3) {
            dispatch({
                type: 'error',
                payLoad: 'Password must be at least 3 characters long'
            });
            return;
        }

        // If all validations pass, call the API
        registerUser();
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4'>
            <div className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100'>
                <div className='text-center mb-6'>
                    <i>
                        <h1 className='text-3xl font-bold text-gray-400'>
                            <span className='font-[verdana]'>S</span>pec
                            <span className='text-yellow-400 font-[verdana]'>S</span>pot
                        </h1>
                    </i>
                </div>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-gray-700 mb-2 font-arial'>Create Account</h2>
                    <p className='text-gray-400 text-xs'>Welcome to the SpecSpot squad!</p>
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
                            })}
                            value={state.name}
                        />
                    </div>

                    <div className='relative'>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                            onChange={(e) => dispatch({
                                type: 'get-email',
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
                                type: 'get-password',
                                payLoad: e.target.value
                            })}
                            value={state.password}
                        />
                    </div>

                    <div className='relative'>
                        <input
                            type="password"
                            placeholder='Confirm your password'
                            className='w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 hover:bg-gray-100'
                            onChange={(e) => dispatch({
                                type: 'confirm-pass',
                                payLoad: e.target.value
                            })}
                            value={state.confirm_password}
                        />
                    </div>

                    <div className='pt-4'>
                        <button
                            className='w-full bg-gradient-to-r bg-orange-500  hover:from-orange-600 hover:to-orange-700 
                        text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all 
                        duration-200 focus:outline-none cursor-pointer active:bg-red-500 active:scale-95'
                            onClick={validateAndSubmit}
                        >
                            Register
                        </button>
                        <div className='text-center font-bold my-3'>
                            <h5 className='text-red-500'>{state.error}</h5>
                        </div>
                    </div>
                </div>

                <div className='text-center mt-6'>
                    <p className='text-gray-600'>Already have an account?
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium ml-1'>
                            <Link to={'/login'}>Log in</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register