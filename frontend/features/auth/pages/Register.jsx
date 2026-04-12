import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
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
