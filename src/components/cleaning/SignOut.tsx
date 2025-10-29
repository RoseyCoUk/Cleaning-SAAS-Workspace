"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@/icons";

export const SignOut = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start the sign out process automatically
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleSignOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      // Clear any stored authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userSession");
      sessionStorage.clear();

      // Simulate API call to invalidate session
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to sign in page
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      // Still redirect even if there's an error
      router.push("/signin");
    }
  };

  const handleCancelSignOut = () => {
    router.back();
  };

  const handleSignOutNow = () => {
    setCountdown(0);
    handleSignOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Signing Out
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You are being signed out of CleanPro Services
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {!isSigningOut ? (
            <>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {countdown}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically signing out in {countdown} second{countdown !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSignOutNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Sign Out Now</span>
                </button>

                <button
                  onClick={handleCancelSignOut}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Stay Signed In
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Signing you out...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we securely sign you out
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p className="flex items-center gap-2">
                <CheckCircleIcon className="w-3 h-3" />
                Clearing session data
              </p>
              <p className="flex items-center gap-2">
                <CheckCircleIcon className="w-3 h-3" />
                Invalidating authentication tokens
              </p>
              <p className="flex items-center gap-2">
                <CheckCircleIcon className="w-3 h-3" />
                Securing your account
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thank you for using CleanPro Services!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Your session will be completely cleared for security
          </p>
        </div>
      </div>
    </div>
  );
};