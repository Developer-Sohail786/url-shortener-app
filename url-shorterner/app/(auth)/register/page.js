"use client"
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
 const router=useRouter()
 const [serverError, setserverError] = useState("")
  const {
    register: registerField, // rename to avoid conflict
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) =>{
    setserverError("")
    const res= await fetch("api/auth/register",{
           method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result=await res.json()
    if(!res.ok){
        setserverError(result.message || "Registration failed")
        return
    }

    
    
    router.push("/login")
  }
return (
    <div className="min-h-screen flex items-center justify-center bg-slate-700 px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-slate-800 rounded-lg text-white py-10">
        
        <h1 className="text-3xl font-bold text-center">Register Here</h1>
        <p className="text-gray-400 text-center mt-2">
          Create your new account here
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 px-6 space-y-4"
        >
          {/* Name */}
          <div>
            <p className="text-gray-500">Name</p>
            <input
              type="text"
              placeholder="Enter your name"
              className="border-2 h-12 w-full text-black border-black rounded-lg mt-2 px-4"
              {...registerField("name", {
                required: "Field can't be empty",
                minLength: { value: 3, message: "Minimum length is 3 characters" },
                maxLength: { value: 20, message: "Maximum length is 20 characters" },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-500">Email</p>
            <input
              type="text"
              placeholder="Enter your email"
              className="border-2 h-12 w-full text-black border-black rounded-lg mt-2 px-4"
              {...registerField("email", {
                required: "Field can't be empty",
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
              {...registerField("password", {
                required: "Field can't be empty",
                minLength: { value: 8, message: "Minimum length is 8 characters" },
                maxLength: { value: 16, message: "Maximum length is 16 characters" },
                validate: (value) => {
                  if (!/[a-z]/.test(value)) return "Lowercase letter required";
                  if (!/[A-Z]/.test(value)) return "Uppercase letter required";
                  if (!/\d/.test(value)) return "Number required";
                  if (!/[@$!%*?&]/.test(value))
                    return "Special character required (@$!%*?&)";
                  return true;
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-400 text-center">{serverError}</p>
          )}

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-12 w-full sm:w-1/2 rounded-lg font-bold text-lg mt-4
                ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-800 text-white"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>

        {/* Google */}
        <div className="flex justify-center mt-6">
          <button
            className="h-12 w-64 bg-red-500 font-bold rounded-lg"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Continue with Google
          </button>
        </div>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?
          <Link href="/login" className="text-blue-500 ml-2 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
