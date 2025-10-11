"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setCookie, decodeToken } from "@/app/lib/auth";
import { login } from "@/actions/user";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoginCard() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const [icNumber, setIcNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(icNumber, password);

      if (!response) {
        setError("Login error.");
        toast({ title: t.loginFailed, description: t.loginFailedDesc, variant: "destructive" });
        return;
      }

      setToken(response.token);
      const decodedToken = await decodeToken(response.token);
      if (decodedToken.role) {
        setRole(decodedToken.role.toString());
        setUserId(decodedToken.nameid);
      }

      setLoginSuccess(true);
      toast({ title: t.loginSuccess, description: t.loginSuccessDesc });
    } catch (err: any) {
      console.error("Login error:", err);
  setError("An error occurred during login. Please try again.");
      toast({ title: t.loginFailed, description: t.loginFailedDesc, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loginSuccess && role) {
      setCookie("session", token);
      setCookie("roles", role);
      setCookie("userId", userId);

      const redirectTimeout = setTimeout(() => {
        if (role === "User") {
          router.push("/dashboard");
        }
        // Commented out other role redirects per request
        // else if (role === "Police") router.push("/police");
        // else if (role === "Admin") router.push("/admin");
      }, 2000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [loginSuccess, role, token, userId, router]);

  return (
    <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl max-w-md mx-auto w-full">
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <svg viewBox="0 0 100 120" className="w-24 h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="40" r="35" stroke="#1a2470" strokeWidth="2" fill="none" />
            <circle cx="50" cy="40" r="30" stroke="#1a2470" strokeWidth="1.5" fill="none" />
            <path d="M50 15 L55 25 L50 30 L45 25 Z" fill="#1a2470" />
            <circle cx="50" cy="40" r="15" fill="#1a2470" />
            <text x="50" y="95" textAnchor="middle" fill="#1a2470" fontSize="8" fontWeight="bold">
              Police E-Reporting Demo
            </text>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#1a2470]">e-Reporting</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="ic-number" className="text-sm font-medium text-gray-700">
            {t.icNumber || 'IC Number'}
          </Label>
          <Input
            id="ic-number"
            type="text"
            placeholder=""
            value={icNumber}
            onChange={(e) => setIcNumber(e.target.value)}
            className="w-full border-gray-300 focus:border-[#1a2470] focus:ring-[#1a2470]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            {t.password || 'Password'}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 border-gray-300 focus:border-[#1a2470] focus:ring-[#1a2470]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-[#2563eb] hover:underline">
              {t.forgotPassword || 'Forgot password'}
            </Link>
          </div>
        </div>

  {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1a2470] hover:bg-[#0f1654] text-white py-6 text-base font-medium flex justify-center items-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          {t.signIn || 'Sign In'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          {t.firstTimeUser || 'First time user?'}{" "}
          <Link href="/register" className="text-[#2563eb] hover:underline font-medium">
            {t.signUp || 'Sign Up'}
          </Link>
        </p>
      </form>
    </div>
  );
}
