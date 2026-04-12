import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'

function App() {

  return (
   <>
   <Routes>
        <Route path='/' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
      </Routes>
   </>
  )
}

export default App
