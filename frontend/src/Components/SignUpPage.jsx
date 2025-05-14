import React, { useEffect, useState } from "react";
import { Radar } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Signup } from "../lib/api";

const SignUpPage = React.memo(() => {
  // Initialize state with localStorage values
  const [signupData, setSignupData] = useState(() => {
    const savedData = localStorage.getItem('signupFormData');
    return savedData ? JSON.parse(savedData) : {
      fullName: "",
      email: "",
      password: "",
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('signupFormData', JSON.stringify(signupData));
  }, [signupData]);

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: Signup,
    onSuccess: () => {
      // Only clear data after successful submission
      localStorage.removeItem('signupFormData');
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(signupData);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-[75rem] mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Radar className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Flockly
            </span>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 alert alert-error">
              <span className="text-white">{error.response?.data?.message || "Signup failed"}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p className="text-sm opacity-70">
                  Join Flockly and start your language learning adventure!
                </p>
              </div>

              <div className="space-y-3">
                {/* Full Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@gmail.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Terms and Conditions */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm" required />
                    <span className="text-xs leading-tight">
                      I agree to the{" "}
                      <span className="text-primary hover:underline">terms of service</span> and{" "}
                      <span className="text-primary hover:underline">privacy policy</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-primary w-full hover:opacity-70 transition-all text-white duration-300 ease-in-out"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading...
                  </>
                ) : "Create Account"}
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="./Chat bot-amico.png" className="h-full w-full" alt="Language learning" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with Flockly your Language partners worldwide</h2>
              <p className="opacity-70">Practice Conversation, Make friends, and improve your language skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SignUpPage;