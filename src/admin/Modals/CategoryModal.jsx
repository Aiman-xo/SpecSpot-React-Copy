import React, { useState } from 'react'
import { X } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../refreshFetch/api';

function CategoryModal({onClose}) {
    const token = sessionStorage.getItem('access_token')
    let[category,setCategory]=useState('')
    let[error,setError]=useState('')

    

        async function AddCategory(){
            try{
                const resp = await api.post('/admin/category/action/',{
                    category:category
                },{
                    withCredentials:true,
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                if (resp.status==200){
                    toast.success('added category successfully!')
                    setCategory("");   // Clear input
                    setError(""); 
                }
            }
            catch(err){
                if(err.response){
                    const errData = err.response.data
                    if(err.response.status==400){
                        setError(errData.error)
                    }
                }
            }
        }
        
    
    


  return (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-80 p-6 relative">
        
        {/* Close button */}
        <button 
            onClick={()=>onClose(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
            <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
            Add Category
        </h2>

        <form className="space-y-4">
            <input
                type="text"
                placeholder="Enter category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e)=>setCategory(e.target.value)}
                
                // onChange={(e) => setCategory(e.target.value)}
                required
            />

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium 
                           hover:bg-blue-700 transition-all cursor-pointer"
                           onClick={AddCategory}
            >
                Add Category
            </button>
        </form>
        <div>{error}</div>
    </div>
</div>
  )
}

export default CategoryModal