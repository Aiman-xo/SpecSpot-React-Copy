import React, { useEffect, useReducer, useState, useContext } from 'react'
import { adminContext } from '../../Context-API/adminContext';
import {
    Package,
    Tags,
    Layers,
    DollarSign,
    Box,
    FileText,
    Image as ImageIcon,
    PlusCircle,
    X,
} from "lucide-react";
import axios from 'axios';
import { data } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../refreshFetch/api';

function reducerFun(prev, action) {
    switch (action.type) {


        case 'get-brand':
            return {
                ...prev,
                brand: action.payLoad

            }

        case 'get-model':
            return {
                ...prev,
                model: action.payLoad
            }
        case 'get-category':
            return {
                ...prev,
                category: action.payLoad
            }

        case 'get-frame':
            return {
                ...prev,
                frame: action.payLoad
            }

        case 'get-price':
            return {
                ...prev,
                price: action.payLoad
            }

        case 'get-stock':
            return {
                ...prev,
                stock: action.payLoad
            }
        case 'get-image':
            return {
                ...prev,
                image: action.payLoad
            }

        case 'reset-form':
            return {
                brand: '',
                model: '',
                category: '',
                frame: '',
                price: '',
                stock: '',
                image: ''
            };

    }
}
function FormModal({ onClose, Edit }) {

    let [state, dispatch] = useReducer(reducerFun, {});
    let [error, setError] = useState('');
    let[category,setCategory]=useState([])
    const { setProducts, products } = useContext(adminContext);
    const token = sessionStorage.getItem('access_token');

    useEffect(() => {
        async function loadCategories() {
            try {
                const resp = await api.get("/admin/category/action/",{
                    withCredentials:true,
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                setCategory(resp.data);
            } catch (err) {
                console.error("Category fetch error:", err);
            }
        }
        loadCategories();
    }, []);

    console.log(category);



    async function InsertNewProduct() {


        if (state.brand && state.image && state.model && state.category && state.frame && state.stock && state.price !== '') {
            // await axios.get('https://specspot-db.onrender.com/products');

        const formData = new FormData();
        formData.append("brand", state.brand);
        formData.append("model", state.model);
        formData.append("category", state.category);   // ID of category
        formData.append("frame_material", state.frame);
        formData.append("quantity", state.stock);
        formData.append("price", state.price);
        formData.append("image", state.image); 
        formData.append("in_stock",true); 

            const resp = await api.post('/admin/products/add/', 
                formData,{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setProducts(pre => [...pre, resp.data])
            onClose(false)
            toast.success('Product added successfully!');

            dispatch({
                type: 'reset-form',
            })
        }
        else {
            setError('Fill the columns!')
        }
        // onClose(false)

    }
    return (



        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                    {/* Product Name */}
                    

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Brand Name
                        </label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Brand name"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={state.brand}
                                onChange={(e) => dispatch({
                                    type: 'get-brand',
                                    payLoad: e.target.value
                                })} />
                        </div>
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Model
                        </label>
                        <div className="relative">
                            <Tags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Model name"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={state.model}
                                onChange={(e) => dispatch({
                                    type: 'get-model',
                                    payLoad: e.target.value
                                })} />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Category
                        </label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <select
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                value={state.category}
                                onChange={(e) =>
                                    dispatch({
                                        type: "get-category",
                                        payLoad: e.target.value
                                    })
                                }
                            >
                                <option value="">-- Select Category --</option>
                                {category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Frame Material
                        </label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Frame Material"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={state.frame}
                                onChange={(e) => dispatch({
                                    type: 'get-frame',
                                    payLoad: e.target.value
                                })} />
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Price ($)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                placeholder="Enter price"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={state.price}
                                onChange={(e) => dispatch({
                                    type: 'get-price',
                                    payLoad: Number(e.target.value)
                                })} />
                        </div>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">
                            Stock Quantity
                        </label>
                        <div className="relative">
                            <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                placeholder="Enter stock quantity"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={state.stock}
                                onChange={(e) => dispatch({
                                    type: 'get-stock',
                                    payLoad: Number(e.target.value)
                                })} />
                        </div>
                    </div>

                    {/* Description (full width)

                    {/* Image URL */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-gray-700 font-medium">
                            Upload Image
                        </label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                                onChange={(e) => dispatch({
                                    type: "get-image",
                                    payLoad: e.target.files[0]   // <-- store actual file object
                                })}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="button"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 cursor-pointer"
                            onClick={() => InsertNewProduct()}>
                            <PlusCircle className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>


                </form>
                <div className='flex justify-center mb-6'>
                    <p className='text-red-500'>{error}</p>
                </div>
            </div>

        </div>
    );
}


export default FormModal