"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Globe,
  ChevronRight,
  Sparkles,
  Coins,
  Wallet,
  Cpu,
  Circle,
  Menu,
  X,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { tradeApi } from "@/app/lib/axiosinstance";

// Ethereum Icon Component
const EthereumIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#627EEA"
    />
    <path
      d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z"
      fill="white"
      fillOpacity="0.602"
    />
    <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white" />
    <path
      d="M12.3735 16.476V20.9963L18 13.212L12.3735 16.476Z"
      fill="white"
      fillOpacity="0.602"
    />
    <path
      d="M12.3735 20.9963V16.4753L6.75 13.212L12.3735 20.9963Z"
      fill="white"
    />
    <path
      d="M12.3735 15.4298L17.9963 12.1651L12.3735 9.65405V15.4298Z"
      fill="white"
      fillOpacity="0.2"
    />
    <path
      d="M6.75 12.1651L12.3735 15.4298V9.65405L6.75 12.1651Z"
      fill="white"
      fillOpacity="0.602"
    />
  </svg>
);

const BitcoinIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#F7931A"
    />
    <path
      d="M17.3077 10.2692C17.4615 8.11538 15.9231 7.03846 14.0769 6.92308L14.4231 4.84615L13.2692 4.61538L12.9231 6.46154H12L11.6538 4.61538L10.5 4.38462L10.8462 6.92308H9.57692L9.23077 4.84615L8.07692 4.61538L7.73077 6.46154H6.92308L6.57692 5.30769L5.42308 5.07692L5.76923 7.03846C5.76923 7.03846 6.92308 7.26923 6.92308 7.38462C6.92308 7.5 6.92308 8.07692 6.92308 8.07692L5.42308 8.30769L5.76923 9.46154L7.26923 9.23077L7.61538 11.0769H6.34615L6 12.2308L7.15385 12.4615L7.5 14.3077H6.23077L5.88462 15.4615L7.38462 15.6923L7.03846 17.7692L8.19231 18L8.53846 16.1538H9.46154L9.80769 18L10.9615 18.2308L10.6154 16.1538H11.8846L12.2308 18.2308L13.3846 18L13.7308 16.1538H14.5385L14.1923 18.2308L15.3462 18.4615L15.6923 16.3846C17.3077 16.1538 18.5769 15.1154 18.8077 13.2692C19.0385 11.5385 18.1154 10.6154 17.3077 10.2692ZM14.5385 13.3846C14.5385 14.7692 12.5769 15.2308 11.6538 15.4615L12.2308 12.9231C13.1538 12.6923 14.5385 12.4615 14.5385 13.3846ZM15.3462 10.8462C15.3462 11.8846 13.7308 12.2308 12.9231 12.4615L12.3462 9.92308C13.1538 9.69231 15.3462 9.57692 15.3462 10.8462Z"
      fill="white"
    />
  </svg>
);

interface InvestmentPlanResponse {
  id: string;
  name: string;
  daily_earning: string;
  roi: string;
  non_of_days: number;
  amount: string;
  abbr: string;
}

interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: string;
  dailyReturn: string;
  period: string;
  totalReturn: string;
  features: string[];
  color: string;
  popular: boolean;
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);

  const stats = [
    {
      value: "500K+",
      label: "Active Traders",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "$4.2B+",
      label: "Total Volume",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      value: "98.5%",
      label: "Success Rate",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    { value: "24/7", label: "Support", icon: <Zap className="w-5 h-5" /> },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description:
        "256-bit SSL encryption, cold storage, and multi-signature wallets keep your assets safe.",
      color: "from-blue-500 to-sky-500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Trades",
      description:
        "Execute trades in milliseconds with our advanced matching engine and low-latency infrastructure.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Analytics",
      description:
        "Real-time charts, technical indicators, and AI-powered trading signals.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Mining Investment",
      description:
        "Earn daily returns from crypto mining without technical expertise.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Professional Trader",
      avatar: "AJ",
      text: "Made over 200% returns in 6 months. The mining investments are incredible!",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Crypto Investor",
      avatar: "SC",
      text: "Security and ease of use are top-notch. Withdrew profits multiple times without issues.",
      rating: 5,
    },
    {
      name: "Marcus Rivera",
      role: "Day Trader",
      avatar: "MR",
      text: "Best trading platform I've used. The analytics tools gave me a real edge.",
      rating: 5,
    },
  ];

  const cryptocurrencies = [
    { name: "Bitcoin", symbol: "BTC", icon: <BitcoinIcon />, change: "+5.2%" },
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: <EthereumIcon />,
      change: "+3.8%",
    },
    {
      name: "USDT",
      symbol: "USDT",
      icon: <Circle className="w-6 h-6 text-green-500" />,
      change: "+0.1%",
    },
    {
      name: "BNB",
      symbol: "BNB",
      icon: <Cpu className="w-6 h-6 text-yellow-500" />,
      change: "+2.4%",
    },
  ];

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await tradeApi.get<{ data: InvestmentPlanResponse[] }>(
          "investment/"
        );
        const plans = response.data.map(
          (plan: InvestmentPlanResponse, index: number) => {
            const dailyEarning = parseFloat(plan.daily_earning);
            const roi = parseFloat(plan.roi);
            const period =
              plan.non_of_days ||
              (dailyEarning > 0 ? Math.round(roi / dailyEarning) : 0);
            const planName = plan.name.split(" ")[0]; // e.g., "Starter" from "Starter Plan"

            const colors = [
              "from-blue-500 to-cyan-500",
              "from-purple-500 to-pink-500",
              "from-amber-500 to-red-500",
            ];

            return {
              id: plan.id,
              name: plan.name,
              minAmount: `$${parseFloat(plan.amount).toLocaleString()}`,
              dailyReturn: `${dailyEarning}%`,
              period: `${period} Days`,
              totalReturn: `${roi}%`,
              features: [`${planName} Support`, "Daily Payouts", "Medium Risk"],
              color: colors[index % colors.length],
              popular: index === 1, // Make the second plan popular for styling
            };
          }
        );
        // We only want to show 3 plans on the landing page
        setInvestmentPlans(plans.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch investment plans:", error);
      }
    };

    fetchInvestments();
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowSuccess(true);
    setEmail("");

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInvestment = () => {
    document
      .getElementById("investment")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                TradeFlow
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToFeatures}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </button>
              <button
                onClick={scrollToInvestment}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Investment
              </button>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Support
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-200"
              >
                Launch Dashboard
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    scrollToFeatures();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToInvestment();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                >
                  Investment
                </button>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium py-2"
                >
                  Support
                </a>
                <a
                  href="/dashboard"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl text-center"
                >
                  Launch Dashboard
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">
                Join 500,000+ Successful Traders
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                Trade Smarter,
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Earn Consistently
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Professional-grade cryptocurrency trading platform with AI-powered
              insights, secure mining investments, and daily returns up to 4.8%.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-lg"
              >
                Start Trading Now
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </a>
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-lg"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 bg-gradient-to-b from-white to-blue-50/30"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TradeFlow?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need for successful crypto trading and investment
              in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="investment" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full mb-4">
              <Coins className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Passive Income
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Mining Investment Plans</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Earn daily returns from our state-of-the-art crypto mining
              facilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {investmentPlans.length > 0 &&
              investmentPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border-2 ${
                    plan.popular
                      ? "border-blue-300 shadow-xl"
                      : "border-gray-100"
                  } p-8 relative`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-bold rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className={`h-1 w-12 rounded-full bg-gradient-to-r ${plan.color}`}
                      ></div>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {plan.dailyReturn}
                    </div>
                    <div className="text-gray-500">Daily Returns</div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Min. Investment</span>
                      <span className="font-bold text-gray-900">
                        {plan.minAmount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Investment Period</span>
                      <span className="font-bold text-gray-900">
                        {plan.period}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Returns</span>
                      <span className="font-bold text-green-600">
                        {plan.totalReturn}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/dashboard"
                    className={`block w-full py-3 text-center font-bold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:shadow-lg hover:shadow-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See what our community says about their trading journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="text-gray-600 italic">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cryptocurrency Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-white mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Trade 100+ Cryptocurrencies
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Access major coins, altcoins, and trading pairs with deep
                  liquidity
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300"
                >
                  View All Markets
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  {cryptocurrencies.map((crypto, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl"
                    >
                      <div className="p-2 bg-white/10 rounded-lg">
                        {crypto.icon}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {crypto.symbol}
                        </div>
                        <div className="text-sm text-blue-200">
                          {crypto.name}
                        </div>
                      </div>
                      <div
                        className={`ml-auto px-3 py-1 rounded-lg text-sm font-bold ${
                          crypto.change.startsWith("+")
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {crypto.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-6">
              Start Your Trading Journey Today
            </h2>

            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of successful traders. Sign up now and get your
              first month of premium features free.
            </p>

            <div className="max-w-md mx-auto">
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Joining..." : "Get Started Free"}
                </button>
              </form>

              {showSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  🎉 Thanks! We&apos;ll send you an invitation soon.
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                By signing up, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TradeFlow</span>
              </div>
              <p className="text-gray-400">
                Professional cryptocurrency trading and investment platform.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mining
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Markets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 TradeFlow. All rights reserved.
              </div>

              <div className="flex items-center space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <a href="/dashboard" className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full shadow-2xl shadow-blue-400/50 flex items-center justify-center group-hover:shadow-3xl group-hover:shadow-blue-500/60 group-hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse-subtle">
          <Wallet className="w-7 h-7 text-white" />
        </div>

        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs font-medium py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Start Trading
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      </a>
    </div>
  );
}
