import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Protected from '../features/auth/components/Protected'
import Home from '../features/Interview/Pages/Home'
import Interview from '../features/Interview/Pages/Interview'
import ReportsHistory from '../features/Interview/Pages/ReportsHistory'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpSubmit from '../features/auth/pages/OtpSubmit'

function App() {

  return (
   <>
   <Routes>
        <Route path='/' element={<Protected><Home/></Protected>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/verify-otp' element={<OtpSubmit/>}></Route>
        <Route path='/interview/:interviewID' element={<Protected><Interview/></Protected>}></Route>
        <Route path='/interview/history' element={<Protected><ReportsHistory/></Protected>}></Route>
      </Routes>
      {/* for error alerts */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"/>
   </>
  )
}

export default App
