"use client"

import { useForm } from "react-hook-form";
import { useRouter,useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {signIn} from "next-auth/react"
const Login = () => {
  const router=useRouter()
  const searchParams=useSearchParams()
  const callbackUrl=searchParams.get("callbackUrl") || "/shorten"
  const [serverError, setserverError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();


  const onSubmit = async (data) =>{
    setserverError("")
    
 

const result = await signIn("credentials",{
  email:data.email,
  password:data.password,
  redirect:false
})
if(result?.error){
  setserverError("Invalid email or password")
}

router.replace(callbackUrl);

    
  }
  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-700 px-4">
    <div className="flex flex-col rounded-lg text-white w-full max-w-md sm:max-w-lg md:max-w-xl bg-slate-800 py-10">
      
      <h1 className="text-3xl font-bold text-center">Login Here</h1>
      <p className="text-gray-400 text-center mt-2">
        You can login to your account
      </p>

      {serverError && (
        <p className="text-red-400 text-center mt-4">{serverError}</p>
      )}

      <div className="mt-8 px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email */}
          <div>
            <p className="text-gray-500">Email</p>
            <input
              type="text"
              placeholder="Enter your email"
              className="border-2 h-12 w-full text-black border-black rounded-lg mt-2 px-4"
              {...register("email", {
                required: { value: true, message: "Field can't be empty" },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <p className="text-gray-500">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              className="border-2 h-12 w-full text-black border-black rounded-lg mt-2 px-4"
              {...register("password", {
                required: { value: true, message: "Field can't be empty" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-12 w-full sm:w-1/2 rounded-lg font-bold text-lg
                ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-800 text-white"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Login"}
            </button>
          </div>
        </form>
      </div>

      {/* Google */}
      <div className="flex justify-center mt-6">
        <button
          className="h-12 w-64 bg-red-500 font-bold rounded-lg"
          onClick={() => signIn("google", { callbackUrl: "/shorten" })}
        >
          Continue with Google
        </button>
      </div>

      <p className="text-blue-500 text-center mt-6">
        <Link href="/register">New user? Register here</Link>
      </p>
    </div>
  </div>
);

};

export default Login;
