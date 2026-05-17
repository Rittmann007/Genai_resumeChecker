import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../Hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { loading, handlelogin, error, seterror } = useAuth();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  async function handlesubmit(e) {
    e.preventDefault();
      await handlelogin({ username, password });
      navigate("/");
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handlesubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                  if (error) {
                    seterror(null);
                  }
                }}
                className="w-full rounded-lg px-4 py-3 outline-none border-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  if (error) {
                    seterror(null);
                  }
                }}
                className="w-full rounded-lg px-4 py-3 outline-none border-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg px-4 py-3 font-medium bg-red-600 hover:bg-red-700 transition"
            >
              Login
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link to={"/register"} className="text-red-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
