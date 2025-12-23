"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
  Shield,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Coins,
  BarChart3,
  Wallet,
  Users,
} from "lucide-react";
import Link from "next/link";
import { authApi, AxiosError } from "@/app/lib/axiosinstance";

interface LoginToken {
  token?: string;
  access_token?: string;
  access?: string;
  jwt?: string;
}

interface User {
  id: string;
  // Add other user properties as needed
}

interface LoginResponse {
  tokens?: LoginToken[];
  user?: User;
  token?: string;
  access_token?: string;
}

interface RegisterResponse {
  id?: string;
  success?: boolean;
  message?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Format phone number to only allow numbers and limit to 10 digits
  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("Form submitted. isLogin:", isLogin, "phone:", phoneNumber);

    // Validation
    if (!phoneNumber || !password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (phoneNumber.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // LOGIN: POST to /api/v1/accounts/login-user-phone/?phone=phone
        const loginData = {
          phone: phoneNumber,
          password: password,
        };

        console.log("Attempting login with data:", loginData);

        const response = await authApi.post<LoginResponse>(
          `login-user-phone/?phone=phone`,
          loginData
        );

        console.log("Login API response:", response);

        // Extract token from the response - based on your API structure
        if (response.tokens && response.tokens.length > 0) {
          // Assuming the token is the first item in the tokens array
          const token =
            response.tokens[0].token || response.tokens[0].access_token;

          if (token) {
            // Save token to localStorage
            localStorage.setItem("access_token", token);
            console.log(
              "Access token saved to localStorage:",
              token.substring(0, 20) + "..."
            );

            // Save user info
            if (response.user) {
              localStorage.setItem("user", JSON.stringify(response.user));
              console.log("User info saved:", response.user);
            }

            // Save the entire tokens array if needed
            localStorage.setItem("tokens", JSON.stringify(response.tokens));

            setSuccess("Login successful! Redirecting to dashboard...");

            // Immediately redirect to dashboard
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          } else {
            // If token is in a different format in the array
            const tokenObject = response.tokens[0];
            console.log("Token object structure:", tokenObject);

            // Try to find the token in the object
            const foundToken =
              tokenObject.access ||
              tokenObject.access_token ||
              tokenObject.token ||
              tokenObject.jwt;

            if (foundToken) {
              localStorage.setItem("access_token", foundToken);
              console.log(
                "Access token saved (alternative format):",
                foundToken.substring(0, 20) + "..."
              );

              if (response.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
              }

              setSuccess("Login successful! Redirecting to dashboard...");
              setTimeout(() => {
                router.push("/dashboard");
              }, 1000);
            } else {
              throw new Error("Could not find token in tokens array");
            }
          }
        } else if (response.token) {
          // Handle token directly in response
          localStorage.setItem("access_token", response.token);
          console.log(
            "Access token saved (direct):",
            response.token.substring(0, 20) + "..."
          );

          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
          }

          setSuccess("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else if (response.access_token) {
          // Handle access_token directly in response
          localStorage.setItem("access_token", response.access_token);
          console.log(
            "Access token saved (access_token):",
            response.access_token.substring(0, 20) + "..."
          );

          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
          }

          setSuccess("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          console.error(
            "No access token found in response. Response:",
            response
          );
          throw new Error(
            "No access token found in response. Check console for response structure."
          );
        }
      } else {
        // REGISTER: POST to /api/v1/accounts/create-user/
        const registerData = {
          phone_number: phoneNumber,
          password: password,
        };

        console.log("Attempting registration with data:", registerData);

        const response = await authApi.post<RegisterResponse>(
          "create-user/",
          registerData
        );

        console.log("Registration API response:", response);

        if (response.id || response.success || response.message) {
          setSuccess(
            "Account created successfully! Please login with your new credentials."
          );

          // Clear form and switch to login
          setTimeout(() => {
            setIsLogin(true);
            setPhoneNumber("");
            setPassword("");
            setConfirmPassword("");
          }, 2000);
        } else {
          throw new Error(
            "Registration completed but no confirmation received"
          );
        }
      }
    } catch (err) {
      console.error("Full auth error:", err);
      const error = err as AxiosError<{
        message?: string;
        detail?: string;
        error?: string;
      }>;

      // Extract error message
      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        console.log("Error response details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          config: error.response.config,
        });

        if (error.response.status === 404) {
          errorMessage = "Endpoint not found. Please check the server URL.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid request. Please check your credentials.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        if (error.response.data) {
          const errorData = error.response.data;

          if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats and benefits data
  const cryptoStats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: "500K+",
      label: "Active Traders",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      value: "$4.2B+",
      label: "Total Volume",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      value: "98.5%",
      label: "Success Rate",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      value: "256-bit",
      label: "Security",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Daily mining returns up to 4.8%",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Advanced trading analytics",
    },
    { icon: <Coins className="w-5 h-5" />, text: "100+ cryptocurrencies" },
    { icon: <Shield className="w-5 h-5" />, text: "Bank-level security" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                TradeFlow
              </h1>
              <p className="text-xs text-gray-500">Professional Trading</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="px-4 py-2 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-200px)] gap-12">
          {/* Left Column - Auth Form */}
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl mb-4">
                  {isLogin ? (
                    <Lock className="w-8 h-8 text-white" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-600">
                  {isLogin
                    ? "Sign in to your trading account"
                    : "Start your trading journey today"}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-red-700 text-sm block mb-1">
                        {error}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-green-700 text-sm block mb-1">
                        {success}
                      </span>
                      <span className="text-green-600 text-xs">
                        Token saved to localStorage
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="000 000 0000"
                      className="w-full pl-12 pr-4 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your 10-digit phone number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-4 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    <>
                      {isLogin ? "Sign In to Dashboard" : "Create Account"}
                      <ArrowRight className="inline ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setSuccess("");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isLogin
                      ? "Don't have an account? Create one"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </form>

              {/* Debug info for token */}
              {isLogin &&
                typeof window !== "undefined" &&
                localStorage.getItem("access_token") && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Token present:{" "}
                      {localStorage.getItem("access_token")?.substring(0, 20)}
                      ...
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="w-full max-w-lg">
            <div className="space-y-8">
              {/* Stats */}
              <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cryptoStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex p-2 bg-blue-50 rounded-lg text-blue-600 mb-2">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    Why Choose TradeFlow?
                  </h3>
                </div>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        {benefit.icon}
                      </div>
                      <span className="text-blue-50">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      Secure & Trusted
                    </h4>
                    <p className="text-emerald-100 text-sm">
                      Your security is our top priority
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 TradeFlow. Secure cryptocurrency trading platform.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
