import React, { useEffect, useState } from 'react'
import { CreativeCommons, Donut, Radar } from 'lucide-react';
import { Link } from 'react-router';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { Login } from '../lib/api';

const LoginPage = React.memo(() => {

  const [loginData, setloginData ] = useState({
    email: localStorage.getItem('loginEmail') || "",
    password: localStorage.getItem('loginPassword') || "",
  });


  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('loginFormData');
    if (savedData) {
      setloginData(JSON.parse(savedData));
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(loginData));
  }, [loginData]);

  const queryClient = useQueryClient();

  const { mutate, isPending , error} = useMutation({
    mutationFn: Login,
    onSuccess: () => {
      localStorage.removeItem('loginEmail');
      localStorage.removeItem('loginPassword');
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handlelogin = (e) => {
    e.preventDefault();
    mutate(loginData);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginData(prev => {
      const newData = { ...prev, [name]: value };
      localStorage.setItem(`login${name.charAt(0).toUpperCase() + name.slice(1)}`, value);
      return newData;
    });
  };
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' >
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden '>

        {/* Login Form Sections */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2 '>
            <Radar className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Flockly
            </span>
          </div>

          {/* Error  */}

          {error && (
            <div className='alert alert-error mb-4'>
              <span className=''>{error.response.data.message}</span>
            </div>
          )}

          {/* login form */}

          <div className='w-full'>
            <form onSubmit={handlelogin}>
              <div className='space-y-4'>
                {/* welcome data  */}

                <div className=''>
                  <h2 className='text-xl font-semibold'>Welcome Back to Flockly</h2>
                  <p className='text-sm opacity-70'>Spin in to your Account to continue your language journey</p>
                </div>

                {/* Left Side  */}

                <div className='flex flex-col gap-3'>

                  {/* Email */}

                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text mb-2'>Email</span>
                    </label>
                    <input type="text"
                    name='email'
                      value={loginData.email}
                      onChange={handleChange}
                      placeholder='hello@example.com'
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  {/* Password*/}

                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text mb-2'>Password</span>
                    </label>
                    <input type="password"
                    name='password'
                      value={loginData.password}
                      onChange={handleChange}
                      placeholder='******'
                      className='input input-bordered w-full'
                      required
                    />
                  </div>

                  {/* Submit button */}

                  <div>
                    <button className="btn btn-primary w-full hover:opacity-70 transition-all text-white duration-300 ease-in-out" disabled={isPending} type="submit">
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Loading...
                        </>
                      ) :
                        ("Sign In")}
                    </button>

                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary hover:underline">
                        Sign Up
                      </Link>
                    </p>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - Right SIDE */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8 ">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="./Chat bot-bro.png" className="h-full w-full" alt="" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold ">Connect with Flockly your Language partners worldwide</h2>
              <p className="opacity-70">Practice Conversation , Make friends , and improve your language skills togather</p>
            </div>
          </div>

        </div>
      </div>
    </div>

  )
})

export default LoginPage