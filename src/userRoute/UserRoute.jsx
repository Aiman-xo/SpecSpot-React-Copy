import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function UserRoute() {
    // let [state, setState] = useState([]);
    // let userId = localStorage.getItem("userId");
    // useEffect(() => {
    //     async function Getuser() {
    //         const resp = await axios.get(`http://localhost:3000/users/${userId}`);
    //         const data = await resp.data;
    //         setState(data)

    //     }
    //     Getuser()
    // }, [])


    const role = localStorage.getItem("role");
    const status = localStorage.getItem("status");
    if (role === "user" && status === "Active") {
        return <Outlet />
    } else {
        return <Navigate to={'/'} />
    }

}

export default UserRoute