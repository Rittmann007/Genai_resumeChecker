import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Authprovider} from "../features/auth/Auth.stateContext.jsx"
import { InterviewProvider } from '../features/Interview/Interview.stateContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Authprovider>
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </Authprovider>
    </BrowserRouter>
  </StrictMode>,
)
