import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { adminContext } from '../../Context-API/adminContext';
import { toast } from 'react-toastify';
import api from '../../refreshFetch/api';
function EditFormModal({ onClose, EditProductId }) {
    let { setProducts } = useContext(adminContext);
    let [error,setError] = useState('')
    let[category,setCategory] = useState([])
    console.log(EditProductId);

    let [ProductData, setProductData] = useState({
        id: null,
        brand: "",
        image: null,
        model: "",
        category: null,
        frame_material: "",
        quantity: 0,
        Productstatus: "",
        in_stock:false,
        cartQty: 0,
        price: 0,
    })


    useEffect(() => {
        async function loadCategories() {
            const token = sessionStorage.getItem('access_token');
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
    
    // console.log(category);


    useEffect(()=>{

        async function ViewProductDetails(){
            const token = sessionStorage.getItem('access_token');
            try{
                const resp = await api.get(`/admin/products/edit/${EditProductId}`,{
                    withCredentials:true,
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                if(resp.status==200){
                    console.log(resp.data);
                    setProductData({
                                    id: resp.data.id,
                                    brand: resp.data.brand,
                                    image_url: resp.data.image,
                                    model: resp.data.model,
                                    category: resp.data.category,
                                    frame_material: resp.data.frame_material,
                                    quantity: resp.data.quantity,
                                    in_stock: resp.data.in_stock,
                                    // cartQty: resp.data.,
                                    price: resp.data.price,
                                });

                }
            }catch(err){
    
            }
        }

        ViewProductDetails()

    },[])

    async function PatchEdit() {
        const token = sessionStorage.getItem('access_token')
    const formData = new FormData();

    formData.append("brand", ProductData.brand);
    formData.append("model", ProductData.model);
    formData.append("frame_material", ProductData.frame_material);
    formData.append("quantity", ProductData.quantity);
    formData.append("in_stock", ProductData.in_stock);
    formData.append("price", ProductData.price); 
    formData.append("category", ProductData.category);


    // Only append if user uploaded a new image
    if (ProductData.image) {
        formData.append("image", ProductData.image);
    }   
        try{
            const resp = await api.patch(`/admin/products/edit/${ProductData.id}/`, formData,{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            if(resp.status==200){
                onClose(false);
                toast.warning('product edited');
            }
        }
        catch(err){
            if(err.reponse){
                const errData = err.response.data
                if(err.status === 400){
                    setError(errData.error)
                }
            }
        }

        
    }


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">

                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        ✖
                    </button>
                </div>

                {/* Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">

                    {/* Brand */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Brand</label>
                        <input
                            type="text"
                            placeholder="Enter brand name"
                            value={ProductData.brand}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => setProductData({ ...ProductData, brand: e.target.value })} />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Product Image</label>

                        {/* Show preview */}
                        {ProductData.image_url && (
                            <img 
                                src={ProductData.image_url} 
                                alt="Product" 
                                className="w-24 h-24 object-cover mb-2 rounded-md border"
                            />
                        )}

                        {/* File input */}
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            onChange={(e) =>
                                setProductData({
                                    ...ProductData,
                                    image: e.target.files[0] // store actual file
                                })
                            }
                        />
                    </div>


                    {/* Model */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Model</label>
                        <input
                            type="text"
                            placeholder="Enter model name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.model}
                            onChange={(e) => setProductData({ ...ProductData, model: e.target.value })} />
                    </div>

                    {/* Type */}
                    <div>
                    <select
                        value={ProductData.category || ""}
                        onChange={(e) =>
                            setProductData({ ...ProductData, category: e.target.value })
                        }
                        >
                        <option value="">Select category</option>
                        {category.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                            {cat.category}
                            </option>
                    ))}
                    </select>

                    </div>

                    {/* Frame Material */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Frame Material</label>
                        <input
                            type="text"
                            placeholder="Enter frame material"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.frame_material}
                            onChange={(e) => setProductData({ ...ProductData, frame_material: e.target.value })} />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Quantity</label>
                        <input
                            type="number"
                            placeholder="Enter quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.quantity}
                            onChange={(e) => setProductData({ ...ProductData, quantity: e.target.value })} />
                    </div>

                    {/* Product Status */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Product Status</label>

                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.in_stock ? "available" : "out-of-stock"}
                            onChange={(e) =>
                                setProductData({
                                    ...ProductData,
                                    in_stock: e.target.value === "available"
                                })
                            }
                        >
                            <option value="available">In-Stock</option>
                            <option value="out-of-stock">Stock-out</option>
                        </select>
                    </div>


                    {/* Cart Qty */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Cart Quantity</label>
                        <input
                            type="number"
                            placeholder="Enter cart quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.cartQty}
                            onChange={(e) => setProductData({ ...ProductData, cartQty: e.target.value })} />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Price ($)</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.price}
                            onChange={(e) => setProductData({ ...ProductData, price: e.target.value })} />
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                        onClick={() => onClose(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        onClick={() => PatchEdit()}>
                        Save Changes
                    </button>
                </div>
            </div>
            <div>{error}</div>
        </div>
    )
}

export default EditFormModal