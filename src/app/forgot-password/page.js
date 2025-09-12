"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/utils/loader";
import { validateEmail } from "@/utils/validation";
import { forgotPassword } from "@/Api/AllApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }
    setErrors({ email: "" });
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("If the email exists, a reset link was sent.");
      router.push("/login");
    } catch (e) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 overflow-hidden">
      <div className="relative w-full max-w-md p-10 bg-white rounded-3xl shadow-md flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Enter your email to receive a reset link.
        </p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70"
          >
            {loading ? <Loader /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
