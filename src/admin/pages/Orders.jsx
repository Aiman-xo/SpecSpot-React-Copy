import React, { useEffect, useState, useContext } from 'react'
import { Eye, Edit, Trash2, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import axios from 'axios';
import OrderDetails from '../Modals/OrderDetails';
import { adminContext } from '../../Context-API/adminContext';
import Api from '../api/api';

function Orders() {
    let [orders, setOrders] = useState([]);
    let [orderdetails, setOrderDetails] = useState(false);
    let [orderObject, setOrderObject] = useState(null);
    let [flag, setFlag] = useState(false);
    let [filterStatus, setFilterStatus] = useState('');
    let [filterOrders1, setFilterOrders] = useState([]);
    let [errorForFiltering, setErrorForFiltering] = useState('');
    let { users1 } = Api();
    // let { setTotalOrders } = useContext(adminContext);

    // let [statusBox, setStatusBox] = useState(false);
    // let [statusOrderId, setStatusOrderId] = useState(null);
    useEffect(() => {
        async function GetOrders() {
            const resp = await axios.get(users1);
            const data = resp.data;
            // setOrders(data);

            const allOrders = data.flatMap((val) => (val.orders || []).map(order => ({
                ...order,
                userId: val.id,
                userName: val.name,
                userEmail: val.email
            })))
            setOrders(allOrders);
            setFilterOrders(allOrders);
            // setTotalOrders(allOrders);
            // console.log(data);
        }
        GetOrders();
    }, [flag])

    function ShowOrderDetails(getOrderObject1) {
        setOrderDetails(true);
        setOrderObject(getOrderObject1);

    }

    async function ChangeStatus(orderId, userId, value) {
        const resp = await axios.get(`${users1}/${userId}`);
        const data = await resp.data;
        console.log(data.orders);

        const newStatus = data.orders.map((val) => {
            return val.id == orderId ? { ...val, orderStatus: value } : val
        })
        // console.log(newStatus);

        await axios.patch(`${users1}/${userId}`, {
            orders: newStatus
        });
        setFlag(pre => !pre);

    }

    const NumberofShippedOrders = orders.filter((val) => val.orderStatus === "shipped");
    // console.log(NumberofShippedOrders.length);

    const NumberofDeliveredOrders = orders.filter((val) => val.orderStatus === "delivered");
    const NumberofCancelledOrders = orders.filter((val) => val.orderStatus === "cancelled");
    const NumberofPendingOrders = orders.filter((val) => val.orderStatus === "pending");


    function filterOrders(filterStatus) {
        setFilterStatus(filterStatus)
        if (filterStatus === "all") {
            setErrorForFiltering('')
            setFilterOrders(orders)
        } else {
            setErrorForFiltering('')
            const filtered = orders.filter((val) => val.orderStatus === filterStatus);

            setFilterOrders(filtered);

            if (filtered.length === 0) {
                setErrorForFiltering('No Orders!')
            }
        }




    }

    console.log(orderObject);

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
                                <h2 className="text-2xl font-semibold">{orders.length}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <Truck className="text-blue-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Shipped Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofShippedOrders.length}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Delivered Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofDeliveredOrders.length}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <XCircle className="text-red-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Cancelled Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofCancelledOrders.length}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <Clock className="text-yellow-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-500">Pending Orders</p>
                                <h2 className="text-2xl font-semibold">{NumberofPendingOrders.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="flex justify-center items-center h-10 mb-10">
                    <select
                        className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 text-sm font-medium shadow-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                        onChange={(e) => filterOrders(e.target.value)}
                        value={filterStatus}>
                        <option value="all" >all Status</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>


                {/* Orders List */}

                {
                    filterOrders1.sort((a, b) => new Date(b.date) - new Date(a.date)).map((val) => {
                        return <div className="grid gap-6 mb-7" key={val.id}>
                            {/* Order Card 1 */}
                            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order #{val.id} <span className="text-sm text-gray-500">{val.userName}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{val.date}</p>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${val.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : val.orderStatus === "shipped" ? "bg-blue-100 text-blue-700" :
                                        val.orderStatus === "delivered" ? "bg-green-100 text-green-700" : val.orderStatus === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                                        {val.orderStatus}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <Eye className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => ShowOrderDetails(val)} />
                                    </button>

                                    {/* <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer" onClick={() => showStatusBox(val.id)}>
                                        <Edit className="w-5 h-5 text-blue-600" />
                                    </button> */}
                                    {/* <button className="p-2 rounded-full hover:bg-red-100 cursor-pointer">
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button> */}

                                    <select
                                        defaultValue={val.status || ''}
                                        onChange={(e) => ChangeStatus(val.id, val.userId, e.target.value)}

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

                }

                <div className='text-center text-red-700 text-base font-[verdana]'><p>{errorForFiltering}</p></div>


            </div>


        </div>
    )
}

export default Orders