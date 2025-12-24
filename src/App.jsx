// import './App.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rgister from "./pages/Rgister"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Cart from "./pages/cart"
import Wishlist from "./pages/Wishlist"
import Induvidual from "./featured/Induvidual"
import Placedorders from "./pages/placedorders";
import ShippingPage from "./pages/orderpage";
import Profile from "./featured/profile";
import Notfound from "./pageNotFound/Notfound";
import AdminInterface from "./admin/AdminInterface";
import Resetpassword from "./featured/resetpassword";
//admin imports
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import ManageProducts from "./admin/pages/ManageProducts";
import Orders from "./admin/pages/Orders";
//Routes
import UserRoute from "./userRoute/UserRoute";
import AdminRoute from "./userRoute/AdminRoute";
//context
import Context from "./Context-API/context"
import AdminContext from "./Context-API/adminContext";

import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {


  return (
    <>

      <Context>
        <AdminContext>


          {/* <Rgister /> */}

          <BrowserRouter>

            <Routes>

              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Rgister />}></Route>
              <Route path="/reset-password" element={<Resetpassword/>}></Route>

              <Route path="/" element={<Home />}></Route>
              <Route path="/products" element={<Products />}></Route>
              <Route path="/induvidual/:id" element={<Induvidual />}></Route>
              <Route element={<UserRoute />}>
                <Route path="/cart" element={<Cart />}></Route>
                <Route path="/wishlist" element={<Wishlist />}></Route>

                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/orders" element={<ShippingPage />}></Route>
                <Route path="/orders/confirmed" element={<Placedorders />}></Route>
              </Route>


              <Route path="*" element={<Notfound />}></Route>

              {/*admin routes*/}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminInterface />}>
                  <Route index element={<Dashboard />}></Route>
                  <Route path="users" element={<Users />}></Route>
                  <Route path="manage" element={<ManageProducts />}></Route>
                  <Route path="checkorders" element={<Orders />}></Route>
                </Route>
              </Route>



            </Routes>
          </BrowserRouter>
        </AdminContext>

      </Context>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName="bg-gray-900 text-white rounded-xl shadow-lg p-4"
        bodyClassName="font-semibold text-sm"
      />


    </>
  )
}

export default App


