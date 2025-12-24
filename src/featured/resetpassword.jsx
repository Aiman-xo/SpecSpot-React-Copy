import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function Resetpassword() {
    let nav=useNavigate()
    let [newPassword,setNewPassword] = useState({
        new_password:'',
        confirm_password:'',
        error:''
    })
    const reset_session = localStorage.getItem('reset_session');
    async function ResetPassword(){
        try{
            const response = await axios.post('https://specspot.duckdns.org/api/v1/reset-password/',{
                reset_session:reset_session,
                password:newPassword.new_password,
                confirm_password:newPassword.confirm_password
            })

            if(response.status===200){
                toast.success('saved changes!')
                setNewPassword({
                    new_password:'',
                    confirm_password:'',
                    error:''
                })
                nav('/login')
            }
        }
        catch(err){
            if (err.response && err.response.status === 400) {
                const errData = err.response.data
            
                let errorMessage = ''
            
                if (errData.confirm_password) {
                  errorMessage = errData.confirm_password[0]
                } else if (errData.password) {
                  errorMessage = errData.password[0]
                } else if (errData.non_field_errors) {
                  errorMessage = errData.non_field_errors[0]
                }
            
                setNewPassword({
                  ...newPassword,
                  error: errorMessage
                })
            }
        }
    }
  return (
    <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-80 bg-white p-6 rounded-xl shadow-lg">
      
      <h2 className="text-xl font-semibold text-center mb-4">
        New Password
      </h2>
  
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword.new_password}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) =>
          setNewPassword({
            ...newPassword,
            new_password: e.target.value
          })
        }
      />
  
      <input
        type="password"
        placeholder="Confirm new password"
        value={newPassword.confirm_password}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) =>
          setNewPassword({
            ...newPassword,
            confirm_password: e.target.value
          })
        }
      />
  
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        onClick={ResetPassword}
      >
        Save
      </button>
  
    <p className="text-red-500 text-sm mt-3">{newPassword.error}</p>
    </div>
  </div>
  


  )
}

export default Resetpassword