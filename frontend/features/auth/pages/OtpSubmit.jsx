import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-toastify";

function OtpSubmit() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { loading, handleOtpSubmit } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      if (error) setError(null);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    setError(null);

    try {
      await handleOtpSubmit({ otp, email });
      navigate("/");
    } catch (error) {
      setError("OTP verification failed");
    }
  }

  if (!email) {
    return (
      <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
            <p className="text-red-400">
              Email not found. Please register again.
            </p>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="w-full mt-4 rounded-lg px-4 py-3 font-medium bg-red-600 hover:bg-red-700 transition"
          >
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-400">Verifying OTP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold">Verify Email</h1>
            <p className="text-gray-400 text-sm">
              Enter the OTP sent to {email}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium">
                Enter OTP (6 digits)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                className="w-full rounded-lg px-4 py-3 outline-none border-2 bg-[#1f1f1f] border-gray-600 text-center text-2xl tracking-widest font-semibold"
              />
              <p className="text-xs text-gray-400">
                OTP is valid for 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6 || loading}
              className={`w-full rounded-lg px-4 py-3 font-medium transition ${
                otp.length === 6
                  ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="space-y-2 text-center">
            <p className="text-gray-400">Didn't receive the OTP?</p>
            <button
              onClick={() => navigate("/register")}
              className="text-red-600 hover:text-red-500 transition font-medium"
            >
              Register Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpSubmit;