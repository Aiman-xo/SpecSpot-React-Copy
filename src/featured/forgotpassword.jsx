import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../refreshFetch/api'

function Forgotpassword({onclose}) {
    let [showemail,setEmail]=useState({email:'',error:''})
    let [showotp,setShowOtp] = useState(false)
    let [getotp,setOtp]=useState({
        otp:'',
        error:''
    });
    let nav = useNavigate()
    
    async function GenerateOTP(){
        try{
            const response = await axios.post('https://specspot.duckdns.org/api/v1/forget-password/',{
                email:showemail.email
            })
            if (response.status==200){
                setShowOtp(true)
                setEmail({
                    email:'',
                    error:''
                })
                toast.success('OTP send successfully!')
                localStorage.setItem('reset_session',response.data.reset_session)
            }
        }
        catch(err){
            if(err.response){
                const errData = err.response.data
                if (err.response.status==400){
                    setEmail({
                        ...showemail,
                        error:errData.error
                    })
                }
            }
        }

    }

    async function VerifyOtp(){
        const reset_session = localStorage.getItem('reset_session');
        try{
            const response = await axios.post('https://specspot.duckdns.org/api/v1/verify-otp/',{
                reset_session:reset_session,
                otp:getotp.otp
            })

            if(response.status == 200){
                toast.success('otp verified!');
                setOtp({
                    otp:'',
                    error:''
                })
                nav('/reset-password')
            }
        }
        catch(err){
            if(err.response){
               const errData = err.response.data

               if(err.response.status==400){
                    setOtp({
                        ...getotp,
                        error:errData.error
                    })
               }
            }
        }
    }

  return (
    
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
    <div className="relative bg-white w-80 rounded-xl p-6 shadow-lg">
  
     
      <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl" onClick={onclose}>
        &times;
      </button>
  
      <h2 className="text-xl font-semibold text-center mb-4">Enter Email</h2>
  
      <input
        type="email"
        placeholder="Enter your email"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e)=>setEmail({
            ...showemail,
            email:e.target.value
        })}
      />
  
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer" onClick={GenerateOTP}>
        Generate OTP
      </button>

      <div className="text-center font-bold my-3">
      <h5 className="text-red-500">{showemail.error}</h5>
    </div>
    </div>



    {showotp&&<div class="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
        <div class="relative bg-white w-80 rounded-xl p-6 shadow-lg">

            <button
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            onClick={()=>setShowOtp(false)}
            >
            &times;
            </button>

        <h2 class="text-xl font-semibold text-center mb-4">Enter OTP</h2>

        <input
        type="text"
        maxLength="6"
        placeholder="------"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e)=>setOtp({
            ...getotp,
            otp:e.target.value

        })}
        />

        <button
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer" onClick={VerifyOtp}>
        Verify OTP
        </button>

        <div className="text-center font-bold my-3">
      <h5 className="text-red-500">{getotp.error}</h5>
    </div>
        </div>
    </div>}

  </div>
  

  )
}

export default Forgotpassword