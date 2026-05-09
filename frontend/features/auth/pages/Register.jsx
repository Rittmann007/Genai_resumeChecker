import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { loading, handleregister } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  async function handlesubmit(e) {
    e.preventDefault();
    await handleregister({ username, email, password });
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
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>

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
                onChange={(e) => {
                  setusername(e.target.value);
                }}
                className="w-full rounded-lg px-4 py-3 outline-none border-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setemail(e.target.value);
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
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                className="w-full rounded-lg px-4 py-3 outline-none border-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg px-4 py-3 font-medium bg-red-600"
            >
              Register
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="text-red-600">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
