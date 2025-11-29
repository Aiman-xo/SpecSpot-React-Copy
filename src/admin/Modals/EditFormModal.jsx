import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { adminContext } from '../../Context-API/adminContext';
import { toast } from 'react-toastify';
function EditFormModal({ onClose, EditProduct }) {
    let { setProducts } = useContext(adminContext);
    console.log(EditProduct);

    let [ProductData, setProductData] = useState({
        id: null,
        brand: "",
        image: "",
        model: "",
        type: "",
        frame_material: "",
        quantity: 0,
        Productstatus: "",
        cartQty: 0,
        price: 0,
    })

    useEffect(() => {
        if (EditProduct) {
            setProductData({
                id: EditProduct.id,
                brand: EditProduct.brand,
                image: EditProduct.image,
                model: EditProduct.model,
                type: EditProduct.type,
                frame_material: EditProduct.frame_material,
                quantity: EditProduct.quantity,
                Productstatus: EditProduct.Productstatus,
                cartQty: EditProduct.cartQty,
                price: EditProduct.price,
            });
        }
    }, [EditProduct])

    async function PatchEdit() {
        const resp = await axios.patch(`https://specspot-db.onrender.com/products/${ProductData.id}`, ProductData);

        setProducts((pre) => pre.map((val) => {
            return val.id === resp.data.id ? resp.data : val
        }))
        onClose(false);
        toast.warning('product edited');
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
                        <label className="block mb-1 text-gray-700 font-medium">Image URL</label>
                        <input
                            type="text"
                            placeholder="Enter image URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.image}
                            onChange={(e) => setProductData({ ...ProductData, image: e.target.value })} />
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Model</label>
                        <input
                            type="text"
                            placeholder="Enter model name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={EditProduct.model}
                            onChange={(e) => setProductData({ ...ProductData, model: e.target.value })} />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Type</label>
                        <input
                            type="text"
                            placeholder="Enter type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.type}
                            onChange={(e) => setProductData({ ...ProductData, type: e.target.value })} />
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
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={ProductData.Productstatus}
                            onChange={(e) => setProductData({ ...ProductData, Productstatus: e.target.value })}>
                            <option value="available">Active</option>
                            <option value="out-of-stock">Inactive</option>

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
        </div>
    )
}

export default EditFormModal