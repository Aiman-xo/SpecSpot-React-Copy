import React from 'react'
import axios from 'axios'
import { useState } from 'react'

function Modal({showDeposit,onclose}) {
    // let [showDeposit,setShowDeposit] = useState(false);
    let [deposit,setDeposit] = useState({
        amount:0,
        error:''
      })


      
  async function Deposit(e){
    e.preventDefault()
    const token = localStorage.getItem('access_token')
    if(!deposit.amount || deposit.amount ==''){
      setDeposit({
        ...deposit,
        error:'please enter the amount'
    })
    return
    }
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/v1/deposit/',{
        amount:deposit.amount
      },{withCredentials:true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (response.status==200){
        alert(`amount of ${deposit.amount} deposited successfully `)
        onclose()
      }

    }
    catch(err){
      console.log(err.message);
      if (err.response){
        const errData = err.response.data
        if(err.response.status == 400){
          setDeposit({
            ...deposit,
            error:errData.error
          })
        }
      }
    }
    
  }
  return (
    
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
    
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl relative">
    
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center 
                         bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full text-sm transition"
              onClick={onclose}
            >
              ×
            </button>
    
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Deposit Amount</h2>
    
            <form onSubmit={Deposit}>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}
              />
    
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                type="submit"
              >
                Deposit
              </button>
    
              <div className="text-center font-bold my-3">
                <h5 className="text-red-500">{deposit.error}</h5>
              </div>
            </form>
    
          </div>
        </div>
      
  )
}

export default Modal