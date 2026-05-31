"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { getDashboardPathForRole, type User } from "@/lib/auth";

interface LoginResponse {
  token: string;
  user: User;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const data = await apiClient.post<LoginResponse>("/login", {
        email: username,
        password: password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push(getDashboardPathForRole(data.user.role));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[460px] rounded shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="text-center py-6 border-b border-[#fce4e4] bg-[#fffcfc]">
          <h1 className="text-xl font-medium text-[#34495e] mb-2">
            Login Admin Tel-U Cup
          </h1>
          <p className="text-[13px] text-[#c62828] font-semibold">
            (*Gunakan akun SSO)
          </p>
        </div>

        {/* Body */}
        <div className="p-8 pb-6 bg-white">
          <form id="login-form" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm text-center">
                {errorMsg}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[13px] text-[#95a5a6] mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username SSO"
                className="w-full border border-gray-200 rounded-[4px] px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-gray-300 placeholder:text-gray-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-[13px] text-[#95a5a6] mb-1.5">
                Password
              </label>
              <div className="flex border border-gray-200 rounded-[4px] focus-within:border-gray-300 overflow-hidden">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password SSO"
                  className="w-full px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none border-none placeholder:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="px-3.5 flex items-center justify-center bg-gray-50 border-l border-gray-200 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="py-5 border-t border-[#fce4e4] bg-[#fffcfc] flex justify-center">
          <button
            type="submit"
            form="login-form"
            disabled={isLoading}
            className="bg-[#b71c1c] hover:bg-[#9b1818] text-white text-[15px] font-medium py-2 px-10 rounded-[4px] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
