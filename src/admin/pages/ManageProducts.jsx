import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import { Pencil, Trash, Check, X, Plus, Package, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import FormModal from '../Modals/FormModal';
import { adminContext } from '../../Context-API/adminContext';
import EditFormModal from '../Modals/EditFormModal';
import { toast } from 'react-toastify';
import Api from '../api/api';


function ManageProducts() {
    // let [products, setProducts] = useState([]);
    const { setProducts, products } = useContext(adminContext);
    let [searchValue, setSearchValue] = useState("");
    let [notfound, setNotfound] = useState('');
    let [flag, setFlag] = useState(false);
    let [form, setForm] = useState(false);
    let [selectEdit, setSelectEdit] = useState(null);
    let [editform, setEditForm] = useState(false);
    let [showDeleteModal, setshowDeleteModal] = useState(false);
    let [deleteId, setDeleteId] = useState();
    let [numTotalProducts, setNumTotalProducts] = useState(0);
    let [currentPage, setCurrentPage] = useState(1);
    let { products1, users } = Api();


    let itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const slicedPage = products.slice(startIndex, endIndex);

    useEffect(() => {
        async function GetProducts() {
            const resp = await axios.get(products1);
            const data = resp.data;
            setProducts(data);
            setNumTotalProducts(data.length);

            setNotfound('');
            if (searchValue.trim() !== '') {

                const filtered = data.filter((val) => {
                    return (val.brand.toLowerCase().includes(searchValue.toLowerCase()) ||
                        val.id == Number(searchValue)
                    )



                })
                setProducts(filtered);

                if (filtered.length === 0) {
                    setNotfound('No Products Availabe!')
                }
            }


        }
        GetProducts()
    }, [flag, searchValue]);


    async function StatusInactive(ProductId) {
        await axios.get(`${products1}/${ProductId}`);


        await axios.patch(`${products1}/${ProductId}`, {
            Productstatus: "out-of-stock"
        })
        setFlag(pre => !pre)

    }

    async function StatusActive(ProductId) {
        await axios.get(`${products1}/${ProductId}`);


        await axios.patch(`${products1}/${ProductId}`, {
            Productstatus: "available"
        })
        setFlag(pre => !pre)

    }

    async function DeleteProduct(ProductId) {
        setshowDeleteModal(false)
        await axios.get(`${products1}/${ProductId}`);


        await axios.delete(`${products1}/${ProductId}`)
        setFlag(pre => !pre)
        toast.error('Product Deleted');

    }


    function FormEditing(productObject) {
        setSelectEdit(productObject);
        setEditForm(true);

    }

    function DeleteConfirmation(deleteId) {
        setshowDeleteModal(true);
        setDeleteId(deleteId);

    }
    // console.log(selectEdit);
    return (
        <div className='  rounded-xl'>
            {form && <FormModal onClose={setForm} />}
            {editform && <EditFormModal onClose={setEditForm} EditProduct={selectEdit} />}

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
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-shadow"
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium cursor-pointer"
                                    onClick={() => setForm(true)}
                                >
                                    <Plus size={18} />
                                    Add Products
                                </button>
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
                                    {slicedPage.map((product) => (
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
                                                    {product.type}
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
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${product.Productstatus === "available"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {product.Productstatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                                        onClick={() => FormEditing(product)}
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

                                                    {product.Productstatus === "available" ? (
                                                        <button
                                                            className="inline-flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-lg hover:bg-orange-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                                            onClick={() => StatusInactive(product.id)}
                                                            title="Deactivate"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                                            onClick={() => StatusActive(product.id)}
                                                            title="Activate"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
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

                    <div className="flex items-center justify-center space-x-4 mt-8">

                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                            onClick={() => setCurrentPage(pre => Math.max(pre - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>
                        <span className="px-3 py-1 border border-gray-300 rounded font-bold opacity-100">
                            {currentPage}
                        </span>

                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                            onClick={() => setCurrentPage(pre => Math.min(pre + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>
                    </div>

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