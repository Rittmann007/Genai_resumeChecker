import { useContext,useState,useEffect } from "react";
import { Authcontext } from "../Auth.stateContext.jsx";
import { getuser, login, logout, register } from "../api/auth.api";

// custom hook for user and loading state handling
export default function useAuth() {
  const context = useContext(Authcontext);
  const { user, setuser, loading, setloading } = context;
  const [error, seterror] = useState(null)

  async function handleregister({ username, email, password }) {
    setloading(true);
    seterror(null)
    try {
      const response = await register({ username, email, password });
      setuser(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message||"Registration failed"
      seterror(errorMessage)
      throw error
    } finally {
      setloading(false);
    }
  }
  async function handlelogin({ username, password }) {
    setloading(true);
    seterror(null)
    try {
      const response = await login({ username, password });
      setuser(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message||"login failed"
      seterror(errorMessage)
      throw error
    } finally {
      setloading(false);
    }
  }
  async function handlelogout() {
    setloading(true);
    seterror(null)
    try {
      const response = await logout();
      setuser(null);
    } catch (error) {
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    async function getandsetuser() {
      try {
        const response = await getuser();
        setuser(response.data);
      } catch (error) {
      } finally {
        setloading(false);
      }
    }
    getandsetuser();
  }, []);

  return { user, loading, handleregister, handlelogin, handlelogout,error,seterror };
}
