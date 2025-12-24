import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    let nav = useNavigate()
    let [state,setState] = useState({
        username:'',
        password:'',
        error:''
    })
    console.log(state);

    async function LoginUser(e){
        e.preventDefault()

        if (!state.username || !state.password){
            setState({
                ...state,
                error:'please enter the username and password'
            })
            return
        }

        try{
            
            const response = await axios.post('http://127.0.0.1:8000/api/v1/user-login/',{
                username:state.username,
                password:state.password
            },
            { withCredentials: true } )
            const {access_token} = response.data
            if (response.status==200 || response.status == 202){
                localStorage.setItem('access_token',access_token)
    
                alert('login successful! welcome😊')
                nav('/')
            }
        }catch(err){
            console.error('login error',err)

            if (err.response){
                const errorData = err.response.data

                if (err.response.status == 400){
                    setState({
                        ...state,
                        error:errorData.error
                    })
                }
                else if(err.response.status == 403){
                    setState({
                        ...state,
                        error:errorData.detail
                    })
                }
            }else{
                setState({
                    ...state,
                    error:'Network error, Try Again!'
                })
            }
        }

    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Enter username"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>setState({
            ...state,
            username:e.target.value
          })}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>setState({
            ...state,
            password:e.target.value
          })}
        />

        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={LoginUser}
        >
          Login
        </button>

        <div className='text-center font-bold my-3'>
            <h5 className='text-red-500'>{state.error}</h5>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link to={'/register'} className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  </div>
  )
}

export default Login