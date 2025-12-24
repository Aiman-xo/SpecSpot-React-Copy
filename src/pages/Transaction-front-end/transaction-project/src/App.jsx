import { useState } from 'react'
import Ui from './ui'
import Register from './register'
import Login from './login'
import Transactions from './transactions'
import {BrowserRouter,Route,Link,Routes} from "react-router-dom"
import './App.css'

function App() {
  

  return (
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<Ui/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/history' element={<Transactions/>}></Route>
    </Routes>

    </BrowserRouter>
  )
}

export default App
