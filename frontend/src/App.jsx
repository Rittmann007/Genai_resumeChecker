import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Protected from '../features/auth/components/Protected'

function App() {

  return (
   <>
   <Routes>
        <Route path='/' element={<Protected><h1> Home </h1></Protected>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
      </Routes>
   </>
  )
}

export default App
