import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Protected from '../features/auth/components/Protected'
import Home from '../features/Interview/Pages/Home'
import Interview from '../features/Interview/Pages/Interview'

function App() {

  return (
   <>
   <Routes>
        <Route path='/' element={<Protected><Home/></Protected>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/interview/:interviewID' element={<Protected><Interview/></Protected>}></Route>
      </Routes>
   </>
  )
}

export default App
