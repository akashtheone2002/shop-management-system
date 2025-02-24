"use client";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useAlert } from "@/context/AlertContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { showAlert } = useAlert();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  // Password validation function
  const validatePassword = (password: string) => {
    return password.length >= 6 ? '' : 'Password must be at least 6 characters long';
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
    } else {
      setErrors({ email: '', password: '' });

      const response = await fetch(`/api/user/login?username=${email}&password=${password}`);
      if (response.ok) {
        console.log("Successfully logged in");
        showAlert("Successfully logged in", "success");
        redirect('/home');
      } else {
        showAlert("Failed to login", "error");
        console.log('An error occurred');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 px-6 pt-6">
      {/* Left Section - Login Form */}
      <div className="flex-1 flex items-start justify-center mt-24">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-gray-200 p-8 ml-8">
          <div className="flex items-center">
            <Image src="/logoOnlineShopping.png" alt="Logo" width={170} height={100} />
            <h2 className="text-xl font-bold text-gray-900 ml-4">Sign in to your account</h2>
          </div>
          <form className="space-y-4 mt-4" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* <a href="#" className="text-sm text-indigo-600 hover:underline">
                  Forgot password?
                </a> */}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Separate SVG */}
      <div className="hidden lg:flex flex-1 items-start justify-center">
        <Image
          src="/Flea-market.svg" // Replace with your actual SVG path
          alt="Login Illustration"
          width={700}
          height={700}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Login;
