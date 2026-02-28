"use client"
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"

const Register = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/login"
  const [serverError, setserverError] = useState("")
  const {
    register: registerField, // rename to avoid conflict
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setserverError("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })


    const result1 = await res.json();

    if (!res.ok) {
      setserverError(result1.message || "Registration failed");
      return;
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setserverError("Login failed after registration");
      return;
    }

    router.replace(callbackUrl);



    router.push("/login")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff] px-4">

      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-xl rounded-2xl text-purple-900 py-10 px-6 sm:px-10 border border-purple-200">

        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-purple-600 text-center mt-2 text-sm sm:text-base">
          Join the secure URL shortener platform
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >

          {/* Name */}
          <div>
            <label className="text-purple-700 text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="h-12 w-full mt-2 px-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            <label className="text-purple-700 text-sm font-medium">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              className="h-12 w-full mt-2 px-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            <label className="text-purple-700 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="h-12 w-full mt-2 px-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            <p className="text-red-500 text-center text-sm">
              {serverError}
            </p>
          )}

          {/* Submit */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-12 w-1/2 rounded-lg cursor-pointer font-semibold text-lg transition-all duration-300
              ${isSubmitting
                  ? "bg-gray-400 text-white"
                  : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-purple-200"></div>
          <span className="px-3 text-sm text-purple-600">OR</span>
          <div className="grow h-px bg-purple-200"></div>
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <button
            className="h-12 w-1/2 cursor-pointer flex items-center justify-center gap-3 bg-white border border-purple-200 hover:bg-purple-50 transition font-semibold text-purple-800 rounded-lg shadow-sm"
            onClick={() => signIn("google", { callbackUrl: "/shorten" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.1 6.9l6.1 5C39.9 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.1-11.2-7.5l-6.5 5C9.6 39.6 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.1 6.9l6.1 5C39.9 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
            </svg>

            Continue with Google
          </button>
        </div>

        <p className="text-purple-600 text-center mt-6 text-sm">
          Already have an account?
          <Link
            href="/login"
            className="text-purple-800 font-semibold ml-2 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
