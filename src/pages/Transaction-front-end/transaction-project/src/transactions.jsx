import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Transactions() {
    let [transactions,setTransactions] = useState([])
    let [page,setPage]=useState(1);
    let [hasNext,setHasNext]=useState(1);
    let nav=useNavigate()

    useEffect(()=>{
        const token = localStorage.getItem('access_token')

        if (!token){
            alert('please login!')
            nav('/login')
        }

        async function GetTransactionHistory(){
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/history?page=${page}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setTransactions(response.data.result)
            console.log(transactions);
    
            if (response.status==200){
                setHasNext(response.data.has_next)
            }
    
        }
        GetTransactionHistory()
    },[page])

  return (
    <div className="min-h-screen bg-gray-100 p-6">

    {/* ==== Header Section ==== */}
    <div className="flex items-center justify-between mb-8">
      
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
        Transactions
      </h1>
  
      {/* Home Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition" onClick={()=>nav('/')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
        </svg>
        Home
      </button>
  
    </div>
  
    {/* ==== Grid of Transaction Cards ==== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  
      {transactions.map((val, index) => (
        <div key={index} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition ">
  
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Transaction Summary
          </h2>
  
          <div className="space-y-3">
  
            {/* Sender */}
            <div className="rounded-md p-3 shadow-sm bg-gray-50">
              <p className="text-xs text-gray-500">Sender</p>
              <p className="font-semibold text-gray-800">Id : {val.sender_id}</p>
              <p className="text-gray-700">name : {val.sender}</p>
            </div>
  
            {/* Receiver */}
            <div className="rounded-md p-3 shadow-sm bg-gray-50">
              <p className="text-xs text-gray-500">Receiver</p>
              <p className="font-semibold text-gray-800">Id : {val.reciever_id}</p>
              <p className="text-gray-700">name : {val.reciever}</p>
            </div>
  
            {/* Amount + Date */}
            <div className="flex justify-between items-center  pt-4 mt-3">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-green-600 font-bold text-xl">₹{val.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium text-gray-800">{val.transaction_date}</p>
              </div>
            </div>
  
          </div>
        </div>
      ))}
  
    </div>
  
    {/* ==== Pagination Section ==== */}
    <div className="flex items-center justify-center gap-6 mt-10">
  
      <button
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 1}
        className={`px-6 py-2 rounded-lg font-semibold shadow transition 
          ${page === 1 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        Previous
      </button>
  
      <span className="text-xl font-bold text-gray-800">{page}</span>
  
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!hasNext}
        className={`px-6 py-2 rounded-lg font-semibold shadow transition 
          ${!hasNext 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        Next
      </button>
  
    </div>
  
  </div>
  
  )
}

export default Transactions