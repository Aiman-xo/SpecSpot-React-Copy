import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { data } from 'react-router-dom'

function Balance({onclose}) {
    const token = localStorage.getItem('access_token')
    let [balance,setBalance] = useState({amount:0,username:'',error:''})

    useEffect(()=>{

        async function GetBalance(){
            try{
    
                const response = await axios.get('http://127.0.0.1:8000/api/v1/balance/',{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                if (response.status==200){
                    setBalance({
                        ...balance,
                        amount:response.data.result,
                        username:response.data.username
                    })
                }
                console.log(balance);
            }
            catch(err){
                if (err.response){
                    console.log(err);
                }
            }
            
        }
        GetBalance()
    },[])


  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm relative">

        {/* Username */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Welcome, <span className="text-blue-600">{balance.username}</span>
        </h2>

        {/* Balance Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center shadow">
          <p className="text-sm text-gray-500">Current Balance</p>
          <p className="text-4xl font-extrabold text-gray-900 mt-2">
            ₹{balance.amount}
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
          onClick={onclose}>
            Close
          </button>
        </div>

      </div>

    </div>
  )
}

export default Balance