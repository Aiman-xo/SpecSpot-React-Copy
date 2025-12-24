import React, { useEffect, useState, useContext } from 'react'
import { Eye, Edit, Trash2, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import axios from 'axios';
import OrderDetails from '../Modals/OrderDetails';
import { adminContext } from '../../Context-API/adminContext';
import Api from '../api/api';
import api from '../../refreshFetch/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Orders() {
    let [orders, setOrders] = useState([]);
    let [orderdetails, setOrderDetails] = useState(false);
    let [orderObject, setOrderObject] = useState(null);
    let[total_orders,setTotalOrders] = useState();
    let[status_count,setStatusCount] = useState([]);
    let[page,setPage]=useState(1);
    const [hasNext, setHasNext] = useState(false);
    let[total_pages,setTotalPages]=useState();
    let [flag, setFlag] = useState(false);
    let [filterStatus, setFilterStatus] = useState('');
    let { users1 } = Api();
    let { setDashboardTotalOrders } = useContext(adminContext);
    let nav = useNavigate()

    // let [statusBox, setStatusBox] = useState(false);
    // let [statusOrderId, setStatusOrderId] = useState(null);


    useEffect(() => {
        async function GetOrders() {
            try {
                const token = sessionStorage.getItem("access_token");
                if(!token){
                    nav('/login')
                }
    
                const url =
                    filterStatus === "all" || !filterStatus
                        ? `/admin/orders/?page=${page}`
                        : `/admin/orders/?order_status=${filterStatus}&page=${page}`;
    
                const resp = await api.get(url, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setOrders(resp.data.result);
                setStatusCount(resp.data.count);
                setTotalOrders(resp.data.total_orders);
                setHasNext(resp.data.has_next);
                setTotalPages(resp.data.total_pages) ;
            } catch (err) {
                if (err.response?.status === 401) {
                    sessionStorage.removeItem("access_token");
                    nav("/login");
                }else{

                    console.error("Order fetch error:", err);
                }
            }
        }
    
        GetOrders();
    }, [flag, filterStatus,page]);
    setDashboardTotalOrders(total_orders);

    function ShowOrderDetails(getOrderObject1) {
        setOrderDetails(true);
        setOrderObject(getOrderObject1);

    }

    function handleFilterChange(e) {
        setFilterStatus(e.target.value);
        setPage(1);
    }

    async function ChangeStatus(orderId, value) {
        const token = sessionStorage.getItem("access_token");
        try{

            const resp = await api.patch(`/admin/orders/status/${orderId}/`, {
                order_status: value
            },{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            if (resp.status==200){
                toast.warning(resp.data.message)
                setFlag(pre => !pre);
            }
        }
        catch(err){
            if(err.response){
                const errData = err.response.data

                if(err.status==400){
                    toast.error(errData.error)
                }
            }
        }


    }

    const statusCountMap = status_count.reduce((acc, { order_status, count }) => {
        acc[order_status] = count;
        return acc;
      }, {});
      console.log(statusCountMap);

    const NumberofShippedOrders = statusCountMap.shipped??0;

    const NumberofDeliveredOrders = statusCountMap.delivered??0;
    const NumberofCancelledOrders = statusCountMap.cancelled??0;
    const NumberofPendingOrders = statusCountMap.pending??0;

    return (
        <div>
            {orderdetails && <OrderDetails onClose={setOrderDetails} OrderObj={orderObject} />}
            <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                        🛒 Orders Dashboard
                    </h1>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <Package className="text-yellow-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Total orders</p>
                                <h2 className="text-2xl font-semibold">{total_orders}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <Truck className="text-blue-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Shipped Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofShippedOrders}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Delivered Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofDeliveredOrders}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <XCircle className="text-red-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Cancelled Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofCancelledOrders}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <Clock className="text-yellow-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Pending Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofPendingOrders}</h2>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="flex justify-center items-center h-10 mb-10">
                    <select
                        className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 text-sm font-medium shadow-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                        onChange={handleFilterChange}
                        value={filterStatus}>
                        <option value="all" >all Status</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>


                {/* Orders List */}

                {orders.length === 0 ? (
                        <div className="text-center mt-20 text-gray-500 text-lg">
                            No orders found
                        </div>
                    ) :(

                    orders.map((val) => {
                        return <div className="grid gap-6 mb-7" key={val.id}>
                            {/* Order Card 1 */}
                            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order #{val.id} <span className="text-sm text-gray-500">{val.shipping.fullname}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{val.created_at}</p>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${val.order_status === "pending" ? "bg-yellow-100 text-yellow-700" : val.order_status === "shipped" ? "bg-blue-100 text-blue-700" :
                                        val.order_status === "delivered" ? "bg-green-100 text-green-700" : val.order_status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                                        {val.order_status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <Eye className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => ShowOrderDetails(val)} />
                                    </button>

                                    <select
                                        defaultValue={val.order_status || ''}
                                        onChange={(e) => ChangeStatus(val.id, e.target.value)} 

                                        className="
                                        px-4 py-2 
                                        rounded-full 
                                        border-2 border-gray-200 
                                        bg-white 
                                        text-sm font-medium 
                                        text-gray-700 
                                        shadow-sm 
                                        transition-all duration-200 
                                        hover:border-blue-400 
                                        
                                        cursor-pointer
                                      "
                                    >
                                        <option value="" disabled>
                                            Select status
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>


                                </div>


                            </div>


                        </div>

                    })
                )

                }


{orders.length !== 0 && (
                <div className="flex items-center justify-between mt-8 px-4">
                    {/* Previous */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className={`px-5 py-2 rounded-full font-medium transition 
                            ${page === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                            }`}
                    >
                        ← Previous
                    </button>

                    {/* Page info */}
                    <span className="text-sm font-medium text-gray-600">
                        Page <span className="text-gray-800">{page}</span>/<span className="text-gray-800">{total_pages}</span>
                    </span>

                    {/* Next */}
                    <button
                        disabled={!hasNext}
                        onClick={() => setPage(p => p + 1)}
                        className={`px-5 py-2 rounded-full font-medium transition
                            ${!hasNext
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                            }`}
                    >
                        Next →
                    </button>
                </div>
            )}


            </div>

           




        </div>
    )
}

export default Orders