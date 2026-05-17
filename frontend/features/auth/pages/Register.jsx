import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { loading, handleregister, error, seterror } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, seterrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      newErrors.username = "Username is required";
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      newErrors.username = "Username must be 3-30 characters";
    }

    // Email validation
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    seterrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handlesubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await handleregister({ 
        username: username.trim(), 
        email: email.trim(), 
        password 
      });
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
                  if (errors.username) {
                    seterrors({ ...errors, username: "" });
                  }
                  if (error) {
                    seterror(null);
                  }
                }}
                className={`w-full rounded-lg px-4 py-3 outline-none border-2 bg-[#1f1f1f] ${
                  errors.username ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.username && (
                <p className="text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                  if (errors.email) {
                    seterrors({ ...errors, email: "" });
                  }
                  if (error) {
                    seterror(null);
                  }
                }}
                className={`w-full rounded-lg px-4 py-3 outline-none border-2 bg-[#1f1f1f] ${
                  errors.email ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
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
                  if (errors.password) {
                    seterrors({ ...errors, password: "" });
                  }
                  if (error) {
                    seterror(null);
                  }
                }}
                className={`w-full rounded-lg px-4 py-3 outline-none border-2 bg-[#1f1f1f] ${
                  errors.password ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg px-4 py-3 font-medium bg-red-600 hover:bg-red-700 transition"
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
