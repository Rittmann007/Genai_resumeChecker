import axios from "axios"

async function register({username,email,password}) {
    try {
        const response = await axios.post("https://genai-resumechecker-backend.onrender.com/api/v1/users/register",
            {username,email,password}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function login({email,password}) {
    try {
        const response = await axios.post("https://genai-resumechecker-backend.onrender.com/api/v1/users/login",
            {email,password},
            {withCredentials: true} // for access to cookies
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function logout() {
    try {
        const response = await axios.post("https://genai-resumechecker-backend.onrender.com/api/v1/users/logout",{},
            {withCredentials: true}
        )
    } catch (error) {
        throw error
    }
}

async function getuser() {
    try {
        const response = await axios.get("https://genai-resumechecker-backend.onrender.com/api/v1/users/getuser",
            {withCredentials: true}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function otpSubmit({otp,email}) {
    try {
        const response = await axios.post("https://genai-resumechecker-backend.onrender.com/api/v1/users/verify-email",
            {otp,email},
            {withCredentials: true}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export {
    register,
    login,
    logout,
    getuser,
    otpSubmit
}