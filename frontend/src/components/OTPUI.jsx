import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { toast,Toaster } from "react-hot-toast";

const OTPUI = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(10);

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResendOtp = () => {
    setTimer(10); // Reset timer
    toast.success("OTP Resent Successfully!", {
      position: "top-right",
      duration: 3000,
    });  
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-blue-100">
      <Toaster/>
      <div className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg p-8">
        <div>
          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
            OTP Verification
          </h2>

          {/* Form */}
          <form>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
              />
            </div>

            {/* Timer and Resend Link */}
            <div className="flex justify-between items-END mb-6">
              <p className="text-sm text-gray-600">
                Resend OTP in{" "}
                <span className="font-medium text-blue-500">{timer}s</span>
              </p>
              {timer === 0 && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-200"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPUI;
