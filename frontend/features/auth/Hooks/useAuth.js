import { useContext } from "react";
import { Authcontext } from "../Auth.stateContext.jsx";
import { login, logout, register } from "../api/auth.api";

// custom hook for user and loading state handling
export default function useAuth() {
  const context = useContext(Authcontext);
  const { user, setuser, loading, setloading } = context;

  async function handleregister({ username, email, password }) {
    setloading(true);
    try {
      const response = await register({ username, email, password });
      setuser(response.data);
    } catch (error) {
    } finally {
      setloading(false);
    }
  }
  async function handlelogin({ username, password }) {
    setloading(true);
    try {
      const response = await login({ username, password });
      setuser(response.data);
    } catch (error) {
    } finally {
      setloading(false);
    }
  }
  async function handlelogout() {
    setloading(true);
    try {
      const response = await logout();
      setuser(null);
    } catch (error) {
    } finally {
      setloading(false);
    }
  }

  return { user, loading, handleregister, handlelogin, handlelogout };
}
