"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/utils/loader";
import { validatePassword } from "@/utils/validation";
import { resetPassword } from "@/Api/AllApi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    setEmail(params.get("email") || "");
    setToken(params.get("token") || "");
  }, [params]);

  const submit = async (e) => {
    e.preventDefault();
    const passErr = validatePassword(password);
    const confErr = password !== confirm ? "Passwords do not match" : "";
    if (passErr || confErr) {
      setErrors({ password: passErr || "", confirm: confErr || "" });
      return;
    }
    setErrors({ password: "", confirm: "" });
    setLoading(true);
    try {
      await resetPassword({ token, email, password });
      toast.success("Password updated. Please login.");
      // Ensure session is cleared so first time also goes to login, not dashboard
      try {
        logout();
        return; // logout handles redirect
      } catch {}
      // Fallback if logout isn't available for some reason
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}
      router.replace("/login");
    } catch (e) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 overflow-hidden">
      <div className="relative w-full max-w-md p-10 bg-white rounded-3xl shadow-md flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Set a new password for your admin account.
        </p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input with Eye */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12 ${
                  errors.confirm ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>
            {errors.confirm && (
              <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70"
          >
            {loading ? <Loader /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
