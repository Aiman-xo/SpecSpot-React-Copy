import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import { Pencil, Trash, Check, X, Plus, Package, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import FormModal from '../Modals/FormModal';
import { adminContext } from '../../Context-API/adminContext';
import EditFormModal from '../Modals/EditFormModal';
import CategoryModal from '../Modals/CategoryModal';
import { toast } from 'react-toastify';
import Api from '../api/api';
import api from '../../refreshFetch/api';
import { useNavigate } from 'react-router-dom';


function ManageProducts() {
    // let [products, setProducts] = useState([]);
    const { setProducts, products ,setDashboardTotalProducts} = useContext(adminContext);
    let [searchValue, setSearchValue] = useState("");
    let [notfound, setNotfound] = useState('');
    let [flag, setFlag] = useState(false);
    let [form, setForm] = useState(false);
    let [categoryform, setCategoryForm] = useState(false);
    let [selectEdit, setSelectEdit] = useState(null);
    let [editform, setEditForm] = useState(false);
    let [showDeleteModal, setshowDeleteModal] = useState(false);
    let [deleteId, setDeleteId] = useState();
    let [numTotalProducts, setNumTotalProducts] = useState(0);
    let [currentPage, setCurrentPage] = useState(1);
    let { products1, users } = Api();
    let nav =useNavigate()

    const totalPages = Math.ceil(numTotalProducts / 5);

    
    

    useEffect(() => {
        async function GetProducts() {
            try {
                const token = sessionStorage.getItem("access_token");
    
                const resp = await api.get(`${products1}?page=${currentPage}&search=${searchValue}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
    
                const data = resp.data;
    
                setProducts(data.results);      // products only for this page
                setNumTotalProducts(data.count); // total count from backend

                if (data.count === 0) {
                    setNotfound("No products found!");
                } else {
                    setNotfound("");
                }
    
            } catch (err) {
                if (err.response?.status === 401) {
                    sessionStorage.removeItem("access_token");
                    nav("/login");
                }else{

                    console.error("Get Products Error:", err);
                }
            }
        }
    
        GetProducts();
    }, [currentPage, flag,searchValue]);
    setDashboardTotalProducts(numTotalProducts);


    
    async function DeleteProduct(ProductId) {
        const token = sessionStorage.getItem('access_token')
        setshowDeleteModal(false)

        const resp = await api.delete(`/admin/products/delete/${ProductId}/`,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setFlag(pre => !pre)
        if (resp.status==200){
            toast.error('Product Deleted');

        }

    }


    function FormEditing(productId) {
        setSelectEdit(productId);
        setEditForm(true);

    }

    function DeleteConfirmation(deleteId) {
        setshowDeleteModal(true);
        setDeleteId(deleteId);

    }
    return (
        <div className='  rounded-xl'>
            {form && <FormModal onClose={setForm} />}
            {editform && <EditFormModal onClose={setEditForm} EditProductId={selectEdit} />}
            {categoryform&& <CategoryModal  onClose={setCategoryForm}/>}

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header and Stats Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Products List</h1>
                                    <p className="text-gray-600">Welcome back! What's the New Change.</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Products</p>
                                        <h3 className="text-2xl font-semibold text-gray-900 mt-1">{numTotalProducts}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="mb-8">
                        <div className="bg-gray-50 rounded-lg p-10">

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full">

                                {/* LEFT → Search Bar */}
                                <div className="w-full sm:w-1/2 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg shadow-sm
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                                    focus:shadow-md transition-shadow"
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* RIGHT → Buttons stacked vertically */}
                                <div className="flex flex-col gap-3 items-end">

                                    <button
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg
                                                hover:bg-blue-700 shadow-md hover:shadow-lg transition-all
                                                font-medium cursor-pointer"
                                        onClick={() => setForm(true)}
                                    >
                                        <Plus size={18} />
                                        Add Products
                                    </button>

                                    <button
                                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg
                                                hover:bg-green-700 shadow-md hover:shadow-lg transition-all
                                                font-medium cursor-pointer"
                                        onClick={() => setCategoryForm(true)}
                                    >
                                        <Plus size={18} />
                                        Add Category
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>




                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Price ($)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{product.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{product.brand}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={product.image}
                                                    alt={product.brand}
                                                    className="w-20 h-12 rounded-lg object-cover shadow-sm"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-gray-100 text-gray-800 shadow-sm">
                                                    {product.category_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                ${product.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${product.quantity > 10
                                                    ? 'text-green-600'
                                                    : product.quantity > 0
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                                    }`}>
                                                    {product.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${product.in_stock
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {product.in_stock ? 'Available':'out-of-stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                                        onClick={() => FormEditing(product.id)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                                        onClick={() => DeleteConfirmation(product.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='flex items-center justify-center space-x-4'>

                    </div>

                    {!notfound&&<div className="flex items-center justify-center space-x-4 mt-8">

                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 shadow-md transition font-medium cursor-pointer"
                            onClick={() => setCurrentPage((pre) => Math.max(pre - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>

                        <span className="px-3 py-1 border border-gray-300 rounded font-bold">
                            Page {currentPage} / {totalPages}
                        </span>

                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition font-medium cursor-pointer"
                            onClick={() => setCurrentPage((pre) => Math.min(pre + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>}


                    {/* Not Found Message */}
                    {notfound && (
                        <div className='flex justify-center mt-8'>
                            <div className="bg-red-50 rounded-lg p-4 shadow-md">
                                <p className="text-red-600 text-center font-medium">{notfound}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
                        <h2 className="text-base  mb-4">
                            Are you sure you want to delete the product?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => DeleteProduct(deleteId)}
                                className="bg-red-500 text-white px-4 py-1 rounded-lg cursor-pointer hover:bg-red-600"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setshowDeleteModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ManageProducts