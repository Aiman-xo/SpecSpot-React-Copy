import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';
export const adminContext = createContext();

function AdminContext({ children }) {
    let [products, setProducts] = useState([]);
    let [totalOrders, setTotalOrders] = useState([]);
    let [totalRevenue, setTotalRevenue] = useState(null);

    useEffect(() => {
        async function GetOrders() {
            const resp = await axios.get('https://specspot-db.onrender.com/users');
            const data = resp.data;
            // setOrders(data);

            const allOrders = data.flatMap((val) => (val.orders || []).map(order => ({
                ...order,
                userId: val.id,
                userName: val.name,
                userEmail: val.email
            })))
            // setOrders(allOrders);
            // setFilterOrders(allOrders);
            const totalRevenue = allOrders.reduce((acc, val) => {
                const orderTotal = (val.products || []).reduce((acc2, product) => acc2 + product.price * product.cartQty, 0)
                return acc + orderTotal
            }, 0);
            setTotalRevenue(totalRevenue);
            console.log(totalRevenue);
            setTotalOrders(allOrders);
            // console.log(data);
        }
        GetOrders();
    }, [])


    return (
        <adminContext.Provider value={{ setProducts, products, totalOrders, setTotalOrders, totalRevenue }}>
            {children}
        </adminContext.Provider>
    )
}

export default AdminContext