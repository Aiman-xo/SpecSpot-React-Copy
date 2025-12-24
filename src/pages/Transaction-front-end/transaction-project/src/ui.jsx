import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './UI-components/modal'
import Balance from './UI-components/balance'

function Ui() {
  const token = localStorage.getItem('access_token')
  if(!token){
    alert('please login first!')
    nav('/login')
  }
 
  let nav = useNavigate()
  let [showDeposit,setShowDeposit] = useState(false);
  let [showBalance,setShowBalance] = useState(false);

  let [transaction,setTransaction] = useState({
    reciever_username:'',
    amount:0,
    error:''
  })
  async function Logout(){
    try{
      
      const response = await axios.post('http://127.0.0.1:8000/api/v1/logout/',{},{
        withCredentials:true
      })
      if (response.status == 200 ){
        localStorage.removeItem('access_token')
        alert('logout successful! come again later!')
        nav('/login')
      }
    }catch(err){
      console.log(err);
      alert (`logout failed because of \n
        ${err.message}`)
    }
    
  }



  async function Transact(){
    const token = localStorage.getItem('access_token')
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/v1/transact/',{
        username:transaction.reciever_username,
        amount:transaction.amount
      },
    {withCredentials:true,
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status == 200){
      alert(`amount of ${transaction.amount} successfully debited`)
      setTransaction({
        reciever_username: "",
        amount: "",
        error: ""
      });
    }
    }
    catch(err){
      if (err.response){
        const errData = err.response.data
        if(err.response.status == 400){
          setTransaction({
            ...transaction,
            error:errData.error
          })
        }
        else if(err.response.status == 412){
          setTransaction({
            ...transaction,
            error:errData.error
          })
        }
      }
    }
  }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">

  {/* Deposit Button */}
  <button
    className="absolute top-6 left-6 flex items-center gap-2 px-5 py-2 
               bg-green-500 text-white rounded-lg shadow-md 
               hover:bg-green-600 transition active:scale-95"
    onClick={() => setShowDeposit(true)}
  >
    <span>Deposit</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>

  <button className="absolute top-25 left-6 flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" 
    onClick={()=>setShowBalance(true)}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5v7.5H2.25zM4.5 8.25V6A2.25 2.25 0 016.75 3.75h10.5A2.25 2.25 0 0119.5 6v2.25" />
  </svg>
  Show Balance
</button>


  {/* Logout Button */}
  <button
    className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2 
               bg-red-500 text-white rounded-lg shadow 
               hover:bg-red-600 transition"
    onClick={Logout}
  >
    <span>Logout</span>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-4 4h.01M9 9h.01" />
    </svg>
  </button>

  {/* Main Card */}
  <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
      Send Money
    </h2>

    <div className="mb-4">
      <label className="text-gray-700 font-medium block mb-1">
        Receiver Username
      </label>
      <input
        type="text"
        placeholder="Enter username"
        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        onChange={(e) =>
          setTransaction({ ...transaction, reciever_username: e.target.value })
        }
      />
    </div>

    <div className="mb-6">
      <label className="text-gray-700 font-medium block mb-1">Amount</label>
      <input
        type="number"
        placeholder="Enter amount"
        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        onChange={(e) =>
          setTransaction({ ...transaction, amount: e.target.value })
        }
      />
    </div>

    <button
      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      onClick={Transact}
    >
      Send Money
    </button>

    <div className="text-center font-bold my-3">
      <h5 className="text-red-500">{transaction.error}</h5>
    </div>
  </div>

  {/* View All Transactions Button (Centered Below Card) */}
  <button
    className="mt-6 w-full max-w-md flex items-center justify-center gap-2 
               py-3 px-4 bg-gray-800 text-white 
               rounded-lg font-semibold
               hover:bg-gray-900 transition active:scale-95 shadow-md"
               onClick={()=>nav('/history')}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" 
            d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    View All Transactions
  </button>

  {/* Deposit Modal */}
  {showDeposit &&<Modal onclose = {()=>setShowDeposit(false)}/> }
  {showBalance && <Balance onclose = {()=>setShowBalance(false)}/>}

</div>


  
  
  )
}

export default Ui