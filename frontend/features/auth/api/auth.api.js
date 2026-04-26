import axios from "axios"

async function register({username,email,password}) {
    try {
        const response = await axios.post("http://localhost:3000/api/v1/users/register",
            {username,email,password}
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

async function login({username,password}) {
    try {
        const response = await axios.post("http://localhost:3000/api/v1/users/login",
            {username,password},
            {withCredentials: true} // for access to cookies
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

async function logout() {
    try {
        const response = await axios.post("http://localhost:3000/api/v1/users/logout",
            {},
            {withCredentials: true}
        )
    } catch (error) {
        console.log(error)
    }
}

async function getuser() {
    try {
        const response = await axios.get("http://localhost:3000/api/v1/users/getuser")
    } catch (error) {
        console.log(error)
    }
}

export {
    register,
    login,
    logout,
    getuser
}