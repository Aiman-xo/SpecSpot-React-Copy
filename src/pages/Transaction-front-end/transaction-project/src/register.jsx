import React, { useReducer, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function redFun(prev,action){
  switch (action.type){
    case 'get-username':
      return{
        ...prev,
        error:"",
        username:action.payload
      }
    
    case 'get-password':
      return{
        ...prev,
        error:"",
        password:action.payload
      }
    
    case 'get-confirm-password':
      return{
        ...prev,
        error:"",
        confirm_password:action.payload
      }

    case 'inp-error':
      return{
        ...prev,
        error:action.payload
      }
      default:
        return prev
  }


}

function Register() {
  let [state,dispatch] = useReducer(redFun,{
    error:"",
    username:"",
    password:"",
    confirm_password:""
  })
  let nav = useNavigate()
  console.log(state);


  async function RegisterUser(){
    if (!state.username || !state.password || !state.confirm_password){
      dispatch({
        type:'inp-error',
        payload:'all fields must be filled!'
      })
      return
    }

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/v1/user-register/',{
        username :state.username,
        password:state.password,
        confirm_password:state.confirm_password
      })
      if(response.status == 201){
        alert('registration successful')
        nav('/login')
      }
    }
    catch(error){
      if (error.response){
        const errorData = error.response.data

        if(error.response.status==400){
          if(errorData.username){
              dispatch({
                type:'inp-error',
                payload:errorData.username[0]
              })
          }else if (errorData.password) {
            dispatch({
                type: 'inp-error',
                payload: errorData.password[0]
            });
        } else if (errorData.confirm_password) {
            dispatch({
                type: 'inp-error',
                payload: errorData.confirm_password[0]
            });
        } else if (errorData.non_field_errors) {
            dispatch({
                type: 'inp-error',
                payload: errorData.non_field_errors[0]
            });
        } else {
            dispatch({
                type: 'inp-error',
                payload: 'Please check your input fields'
            });
        }
      }else {
        dispatch({
            type: 'inp-error',
            payload: 'Registration failed. Please try again.'
        });
    }
        
      }
      else {
        dispatch({
            type: 'inp-error',
            payload: 'Network error. Please check your connection.'
        });
    }
    }



  }


  function validateAndSubmit() {
    // dispatch({ type: 'inp-error' });

    // Basic frontend validation
    if (!state.username || !state.password || !state.confirm_password) {
        dispatch({
            type: 'inp-error',
            payload: 'All fields must be filled'
        });
        return;
    }

    if (state.password !== state.confirm_password) {
        dispatch({
            type: 'inp-error',
            payload: 'Passwords must match'
        });
        return;
    }

    if (state.password.length < 3) {
        dispatch({
            type: 'inp-error',
            payload: 'Password must be at least 3 characters long'
        });
        return;
    }

    // If all validations pass, call the API
    RegisterUser();
}
  return (
  
  <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
    <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-8">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create an account
      </h1>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a username"
            className="block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            aria-label="username"
            onChange={(e) =>
              dispatch({
                type: "get-username",
                payload: e.target.value,
              })
            }
            value={state.username}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            aria-label="password"
            onChange={(e)=>dispatch({
              type:'get-password',
              payload:e.target.value
            })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use 8 or more characters with a mix of letters and numbers.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className="block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            aria-label="confirm-password"
            onChange={(e)=>dispatch({
              type:'get-confirm-password',
              payload:e.target.value
            })}
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            onClick={validateAndSubmit}
          >
            Create account
          </button>

          <div className='text-center font-bold my-3'>
            <h5 className='text-red-500'>{state.error}</h5>
          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={'/login'} className="text-indigo-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>


  )
}

export default Register