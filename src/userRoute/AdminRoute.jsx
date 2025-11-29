import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
    // let [admin, setAdmin] = useState([]);
    const adminId = localStorage.getItem("adminId");
    const getRole = localStorage.getItem("role");

    // useEffect(() => {
    //     console.log(admin);
    // }, [admin])

    if (getRole === "admin" && adminId) {
        return <Outlet />
    }
    else {
        return <Navigate to={'/'} />
    }

}

export default AdminRoute