"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  LogOut,
  Wallet,
  ArrowUpCircle,
  BarChart3,
  X,
  Bell,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Home,
  DollarSign,
  Clock,
  Shield,
  Settings,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Battery,
  Activity,
  Coins,
  Hash,
  Layers,
  Sparkles,
  Download,
  User,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { tradeApi } from "@/app/lib/axiosinstance";
import { useRouter } from "next/navigation";

const EthereumIcon = () => (
  <svg
    className="w-8 h-8"
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
    className="w-8 h-8"
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

interface Customer {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  photo: string | null;
  account_balance: string;
  date_joined: string;
  last_login: string | null;
}

interface InvestmentPlan {
  name: string;
  abbr: string;
  daily_earning: number;
  roi: number;
  non_of_days: number;
  hash_rate: number;
}

interface InvestmentApiResponse {
  id: string;
  name: string;
  abbr: string;
  daily_earning: string;
  roi: string;
  non_of_days: number;
  amount: string;
  hash_rate: string;
  profit_return: string;
}

interface CustomerInvestment {
  id: string;
  amount: string;
  earnings: string | null;
  is_active: boolean;
  created_at: string;
  investment: InvestmentPlan;
}

interface ActiveInvestment extends CustomerInvestment {
  startDate: Date;
  daysActive: number;
}

interface Transaction {
  id: string;
  amount: string;
  status: string;
  created_at: string;
  transaction_id: string;
  address_wallet: string | null;
}

interface Deposit extends Transaction {
  currency: string;
  date: string;
  txHash: string;
  network: string;
  createdAt: string;
}

interface Withdrawal extends Transaction {
  currency: string;
  date: string;
  address: string;
  txHash: string;
  createdAt: string;
}

interface Notification {
  id: number;
  pair?: string;
  type:
    | "BUY"
    | "SELL"
    | "INVEST_SUCCESS"
    | "EXPORT_SUCCESS"
    | "EARNINGS_EXPORT";
  price?: string;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
}

interface CustomerData {
  customer: Customer;
  deposite: Transaction[];
  withdrawal: Transaction[];
  customer_investment: CustomerInvestment[];
  prestige_wealth_address: { wallet_address: string };
}

interface DepositInstructions {
  currency: string;
  amount: string | number;
  address?: string;
  network: string;
}

interface WithdrawInstructions {
  currency: string;
  amount: number;
  address: string;
  status: string;
}

interface InvestInstructions {
  coin: string;
  amount: string | number;
  dailyEarnings: string;
  period: string;
  estimatedTotal: string;
}

interface Trade {
  id: number;
  pair: string;
  type: string;
  amount: number;
  entry: string;
  pnl: number;
}

interface MiningCoin {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  dailyEarning: number;
  dailyEarnings: string;
  investmentPeriod: string;
  minInvestment: number;
  maxInvestment: number;
  roi: number;
  roiPercentage: string;
  hashRate: string;
  profitReturn: number;
  totalInvestors: number;
  non_of_days: number;
  abbr: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showInvest, setShowInvest] = useState(false);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showInvestForm, setShowInvestForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedInvestCoin, setSelectedInvestCoin] =
    useState<MiningCoin | null>(null);
  const [tradeType, setTradeType] = useState("BUY");
  const [copied, setCopied] = useState(false);
  const [depositInstructions, setDepositInstructions] =
    useState<DepositInstructions | null>(null);
  const [withdrawInstructions, setWithdrawInstructions] =
    useState<WithdrawInstructions | null>(null);
  const [investInstructions, setInvestInstructions] =
    useState<InvestInstructions | null>(null);
  const tvContainer = useRef<HTMLDivElement>(null);
  const [investError, setInvestError] = useState("");
  const [miningCoins, setMiningCoins] = useState<MiningCoin[]>([]);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingInvestId, setProcessingInvestId] = useState<string | null>(
    null
  );
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [activeInvestments, setActiveInvestments] = useState<
    ActiveInvestment[]
  >([]);
  const [loadingCustomerData, setLoadingCustomerData] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  const cryptoWallets: Record<
    string,
    { address: string; network: string; qrCode: string }
  > = {
    USDT: {
      address: "TBA1Lh3aJ...RtFDBTTRdBM",
      network: "TRC20",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TBA1Lh3aJ...RtFDBTTRdBM",
    },
    BTC: {
      address: "bc1qxy2kg...m09w73a7h",
      network: "Bitcoin",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kg...m09w73a7h",
    },
    ETH: {
      address: "0x71C7656E...391f3752a9",
      network: "ERC20",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x71C7656E...391f3752a9",
    },
  };

  useEffect(() => {
    const nextView = sessionStorage.getItem("nextView");
    if (nextView) {
      if (nextView === "deposits") {
        setShowDeposit(true);
        setShowWithdraw(false);
        setShowInvest(false);
      }
      if (nextView === "investments") {
        // This will be handled by the main view to show the active investments sidebar
        resetToTrading();
      }
      // You can add more views here later, like 'withdrawals'

      // Clear the item so it doesn't trigger on subsequent reloads
      sessionStorage.removeItem("nextView");
    }
  }, []);

  const fetchCustomerData = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/accounts/login");
        return;
      }

      const response = await tradeApi.get<CustomerData>("customer/account/");
      console.log("Customer API Response:", response); // Debug log
      setCustomerData(response); // Set the response directly to state

      if (response?.customer?.account_balance) {
        const balance = parseFloat(response.customer.account_balance);
        setAccountBalance(balance);
      }

      if (response?.customer_investment) {
        const activeInvests = response.customer_investment
          .filter((inv) => inv.is_active)
          .map((inv) => ({
            ...inv,
            startDate: new Date(inv.created_at),
            daysActive: Math.floor(
              (new Date().getTime() - new Date(inv.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          }));
        setActiveInvestments(activeInvests);

        const earningsTotal = response.customer_investment.reduce(
          (sum, inv) => {
            return sum + parseFloat(inv.earnings || "0");
          },
          0
        );

        const investedTotal = response.customer_investment.reduce(
          (sum, inv) => {
            return sum + parseFloat(inv.amount || "0");
          },
          0
        );

        setTotalEarnings(earningsTotal);
        setTotalInvested(investedTotal);
      }

      if (response?.deposite) {
        console.log("Deposits from API:", response.deposite); // Debug log
        setDeposits(
          response.deposite.map((dep) => ({
            ...dep,
            currency: "USDT",
            status: dep.status === "success" ? "completed" : dep.status,
            date: new Date(dep.created_at).toISOString().split("T")[0],
            txHash: dep.transaction_id,
            network: "TRC20",
            createdAt: dep.created_at,
          }))
        );
      }

      if (response?.withdrawal) {
        console.log("Withdrawals from API:", response.withdrawal); // Debug log
        setWithdrawals(
          response.withdrawal.map((wd) => ({
            ...wd,
            currency: "USDT",
            status: wd.status === "success" ? "completed" : wd.status,
            date: new Date(wd.created_at).toISOString().split("T")[0],
            address: wd.address_wallet || "N/A",
            txHash: wd.transaction_id,
            createdAt: wd.created_at,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      // If fetching data fails (e.g. invalid token), redirect to login
      router.push("/accounts/login");
    } finally {
      setLoadingCustomerData(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  useEffect(() => {
    const fetchInvestments = async () => {
      setIsLoading(true);
      try {
        const response = await tradeApi.get<
          InvestmentApiResponse[] | { data: InvestmentApiResponse[] }
        >("investment/");
        console.log("Investments API Response:", response); // Debug log

        // Check if response is an array or has a data property
        const plansData = Array.isArray(response)
          ? response
          : (response as { data: InvestmentApiResponse[] }).data;

        const plans = plansData.map((plan) => {
          const dailyEarning = parseFloat(plan.daily_earning);
          const roi = parseFloat(plan.roi);
          const period =
            plan.non_of_days ||
            (dailyEarning > 0 ? Math.round(roi / dailyEarning) : 0);

          const icons: Record<string, React.ReactNode> = {
            BTC: <BitcoinIcon />,
            ETH: <EthereumIcon />,
            LTC: <Hash className="w-8 h-8" />,
            XRP: <Coins className="w-8 h-8" />,
            ADA: <Layers className="w-8 h-8" />,
            SOL: <Activity className="w-8 h-8" />,
            DOT: <Cpu className="w-8 h-8" />,
            BNB: <Battery className="w-8 h-8" />,
          };

          const colors: Record<string, string> = {
            BTC: "from-amber-500 to-orange-500",
            ETH: "from-purple-500 to-indigo-500",
            LTC: "from-blue-400 to-cyan-500",
            XRP: "from-gray-600 to-gray-800",
            ADA: "from-emerald-500 to-teal-500",
            SOL: "from-pink-500 to-rose-500",
            DOT: "from-red-500 to-pink-500",
            BNB: "from-yellow-500 to-amber-500",
          };

          const bgColors: Record<string, string> = {
            BTC: "bg-amber-50",
            ETH: "bg-purple-50",
            LTC: "bg-blue-50",
            XRP: "bg-gray-50",
            ADA: "bg-emerald-50",
            SOL: "bg-pink-50",
            DOT: "bg-red-50",
            BNB: "bg-yellow-50",
          };

          const borderColors: Record<string, string> = {
            BTC: "border-amber-100",
            ETH: "border-purple-100",
            LTC: "border-blue-100",
            XRP: "border-gray-100",
            ADA: "border-emerald-100",
            SOL: "border-pink-100",
            DOT: "border-red-100",
            BNB: "border-yellow-100",
          };

          const coinSymbol = plan.abbr?.split("-")[0] || "DEFAULT";

          return {
            id: plan.id,
            name: plan.name,
            symbol: plan.abbr,
            icon: icons[coinSymbol] || <Coins className="w-8 h-8" />,
            color: colors[coinSymbol] || "from-gray-500 to-gray-700",
            bgColor: bgColors[coinSymbol] || "bg-gray-50",
            borderColor: borderColors[coinSymbol] || "border-gray-100",
            dailyEarning: dailyEarning,
            dailyEarnings: `${dailyEarning}%`,
            investmentPeriod: `${period} days`,
            minInvestment: parseFloat(plan.amount),
            maxInvestment: parseFloat(plan.amount) * 10,
            roi: roi,
            roiPercentage: `${roi}%`,
            hashRate: `${plan.hash_rate} TH/s`,
            profitReturn: parseFloat(plan.profit_return) || 0,
            totalInvestors: Math.floor(Math.random() * 1500) + 200,
            non_of_days: period,
            abbr: plan.abbr,
          };
        });
        setMiningCoins(plans);
      } catch (error) {
        console.error("Failed to fetch investment plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  useEffect(() => {
    if (!tvContainer.current) return;
    tvContainer.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: selectedPair,
          interval: "1",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          container_id: "tv_chart_container",
        });
      } catch {
        if (tvContainer.current) {
          tvContainer.current.innerHTML =
            '<div class="flex items-center justify-center h-full text-sm text-gray-500">Unable to load TradingView chart.</div>';
        }
      }
    };
    tvContainer.current.appendChild(script);
    return () => {
      try {
        script.remove();
      } catch {}
    };
  }, [selectedPair]);

  function playSound() {
    try {
      const audio = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3"
      );
      audio.play().catch((e) => console.error("Error playing sound:", e));
    } catch {}
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const sig: Notification = {
        id: Date.now(),
        pair: selectedPair,
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        price: (20000 + Math.random() * 3000).toFixed(2),
      };
      setNotifications((prev) => [sig, ...prev].slice(0, 5));
      if (userInteracted) playSound();
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== sig.id));
      }, 6000);
    }, 7000);

    return () => clearInterval(interval);
  }, [selectedPair, userInteracted]);

  function submitTrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const type = form.get("type")?.toString() || "BUY";
    const amount = parseFloat(form.get("amount")?.toString() || "0");
    const entryPrice = (20000 + Math.random() * 500).toFixed(2);

    setActiveTrades((prev) => [
      {
        id: Date.now(),
        pair: selectedPair,
        type,
        amount,
        entry: entryPrice,
        pnl: 0,
      },
      ...prev,
    ]);

    setShowTradeModal(false);
  }

  useEffect(() => {
    const int = setInterval(() => {
      setActiveTrades((prev) =>
        prev.map((t) => ({
          ...t,
          pnl: Number(((Math.random() - 0.5) * 50).toFixed(2)),
        }))
      );
    }, 1500);
    return () => clearInterval(int);
  }, []);

  function closeTrade(id: number) {
    setActiveTrades((prev) => prev.filter((t) => t.id !== id));
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  const showDepositInstructions = (deposit: Deposit) => {
    setDepositInstructions({
      currency: deposit.currency,
      amount: deposit.amount,
      address: customerData?.prestige_wealth_address?.wallet_address, // Use the address from the specific deposit
      network: deposit.network,
    });
    setShowDepositForm(false);
  };

  async function submitDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    setDepositLoading(true);
    setDepositError("");

    try {
      const depositData = {
        amount: depositAmount,
      };

      const response = await tradeApi.post("deposit/", depositData);

      if (response) {
        // Assuming the response contains the deposit details including the address
        setDepositInstructions({
          currency: selectedCrypto, // Currently hardcoded to BTC
          amount: parseFloat((response as { amount: string }).amount),
          address: customerData?.prestige_wealth_address?.wallet_address,
          network: cryptoWallets[selectedCrypto].network, // Assuming network is static for now
        });
        setShowDepositForm(false);
        setDepositAmount("");
        // Optionally, refresh customer data to show the pending deposit
        fetchCustomerData();
      }
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "An unexpected error occurred.";
      setDepositError(errorMessage);
    } finally {
      setDepositLoading(false);
    }
  }

  function submitWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || !withdrawAddress)
      return;

    const newWithdrawal = {
      id: Date.now().toString(),
      amount: withdrawAmount,
      currency: selectedCrypto,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      address: withdrawAddress,
      txHash: `0x${Math.random().toString(16).slice(2)}...${Math.random()
        .toString(16)
        .slice(2)}`,
      created_at: new Date().toISOString(),
      transaction_id: `tx_${Date.now()}`,
      address_wallet: withdrawAddress,
      createdAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);
    setWithdrawInstructions({
      currency: selectedCrypto,
      amount: parseFloat(withdrawAmount),
      address: withdrawAddress,
      status: "pending",
    });
    setShowWithdrawForm(false);
    setWithdrawAmount("");
    setWithdrawAddress("");
  }

  async function submitInvest(coin: MiningCoin, amount: string) {
    if (!coin || !amount || parseFloat(amount) <= 0) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/accounts/login");
      return;
    }

    setProcessingInvestId(coin.id);
    setInvestError("");

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        throw new Error("User not found. Please log in again.");
      }
      const user = JSON.parse(userString);
      const customerId = user.id;

      const investAmount = amount.toString();

      const investmentData = {
        amount: investAmount,
        customer: customerId,
        investment: coin.id,
      };

      const response = await tradeApi.post(
        "create/customer/investment/",
        investmentData
      );

      if (response) {
        resetToTrading();

        const successNotification: Notification = {
          id: Date.now(),
          type: "INVEST_SUCCESS",
          title: "Investment Successful!",
          message: `Your ${investAmount} USD investment in ${coin.name} is active.`,
        };
        setNotifications((prev) => [successNotification, ...prev].slice(0, 5));
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== successNotification.id)
          );
        }, 6000);

        playSound();

        sessionStorage.setItem("nextView", "investments");
        window.location.reload();
      }
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "An unexpected error occurred.";
      setInvestError(errorMessage);
      setTimeout(() => setInvestError(""), 5000);
    } finally {
      setProcessingInvestId(null);
    }
  }

  function handleDepositClick() {
    setSidebarOpen(false);
    setShowDeposit(true);
    setShowWithdraw(false);
    setShowInvest(false);
  }

  function handleWithdrawClick() {
    setSidebarOpen(false);
    setShowWithdraw(true);
    setShowDeposit(false);
    setShowInvest(false);
  }

  function handleInvestClick() {
    setSidebarOpen(false);
    setShowInvest(true);
    setShowDeposit(false);
    setShowWithdraw(false);
  }

  function resetToTrading() {
    setShowDeposit(false);
    setShowWithdraw(false);
    setShowInvest(false);
    setShowDepositForm(false);
    setShowWithdrawForm(false);
    setShowInvestForm(false);
    setDepositInstructions(null);
    setWithdrawInstructions(null);
    setInvestInstructions(null);
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/accounts/login");
  };

  const handleExportInvestments = () => {
    if (activeInvestments.length === 0) return;

    const headers = [
      "Investment ID",
      "Amount (USD)",
      "Earnings (USD)",
      "Status",
      "Start Date",
      "Days Active",
    ];
    const csvData = activeInvestments.map((inv) => [
      inv.id,
      inv.amount,
      inv.earnings,
      inv.is_active ? "Active" : "Inactive",
      new Date(inv.created_at).toLocaleDateString(),
      Math.floor(
        (new Date().getTime() - new Date(inv.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-investments-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    const successNotification: Notification = {
      id: Date.now(),
      type: "EXPORT_SUCCESS",
      title: "Export Successful",
      message: `Exported ${activeInvestments.length} investments to CSV`,
    };
    setNotifications((prev) => [successNotification, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== successNotification.id)
      );
    }, 6000);
  };

  const handleExportBalance = () => {
    const balanceData = {
      account_balance: accountBalance,
      total_invested: totalInvested,
      total_earnings: totalEarnings,
      active_investments: activeInvestments.length,
      export_date: new Date().toISOString(),
    };

    const jsonContent = JSON.stringify(balanceData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `account-balance-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    const successNotification: Notification = {
      id: Date.now(),
      type: "EXPORT_SUCCESS",
      title: "Balance Exported",
      message: `Account balance data exported successfully`,
    };
    setNotifications((prev) => [successNotification, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== successNotification.id)
      );
    }, 6000);
  };

  const handleExportEarnings = (investment: ActiveInvestment) => {
    const earningsData = {
      investment_id: investment.id,
      investment_name: investment.investment.name,
      amount: parseFloat(investment.amount),
      current_earnings: parseFloat(investment.earnings || "0"),
      daily_earning_rate: parseFloat(
        String(investment.investment.daily_earning)
      ),
      roi: parseFloat(String(investment.investment.roi)),
      period: investment.investment.non_of_days,
      hash_rate: investment.investment.hash_rate,
      start_date: investment.created_at,
      days_active: Math.floor(
        (new Date().getTime() - new Date(investment.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      export_date: new Date().toISOString(),
    };

    const successNotification: Notification = {
      id: Date.now(),
      type: "EARNINGS_EXPORT",
      title: "Earnings Export Ready",
      message: `Earnings for ${investment.investment.name} prepared for export`,
      data: earningsData,
    };

    setNotifications((prev) => [successNotification, ...prev].slice(0, 5));

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== successNotification.id)
      );
    }, 6000);
  };

  const viewInvestmentDetails = (investment: ActiveInvestment) => {
    const plan = investment.investment;
    alert(
      `Investment Details:\n\nName: ${plan.name}\nAmount: $${
        investment.amount
      }\nDaily Earnings: ${plan.daily_earning}%\nROI: ${plan.roi}%\nPeriod: ${
        plan.non_of_days
      } days\nHash Rate: ${
        plan.hash_rate
      } TH/s\nCurrent Earnings: $${parseFloat(
        investment.earnings || "0"
      ).toFixed(2)}`
    );
  };

  const getDisplayName = () => {
    if (customerData?.customer?.username) {
      return customerData.customer.username;
    }
    if (customerData?.customer?.first_name) {
      return `${customerData.customer.first_name} ${
        customerData.customer.last_name || ""
      }`.trim();
    }
    return customerData?.customer?.phone_number || "User";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 overflow-hidden relative"
      onClick={() => !userInteracted && setUserInteracted(true)}
    >
      {loadingCustomerData && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading account data...</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative z-40 top-0 left-0 h-full w-80 bg-gradient-to-b from-white to-blue-50/30 backdrop-blur-sm p-6 flex flex-col shadow-2xl border-r border-blue-100 transition-all duration-500 ease-out transform
          ${
            sidebarOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full md:translate-x-0 shadow-xl"
          }
        `}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 text-white font-bold rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                TradeFlow
              </h1>
              <p className="text-xs text-gray-500">Professional Trading</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 p-5 mb-8 text-white shadow-lg shadow-blue-200">
          <div className="absolute -right-10 -top-10 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-white/10 rounded-full"></div>

          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
              {customerData?.customer?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={customerData.customer.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">{getDisplayName()}</p>
              <p className="text-sm opacity-90 flex items-center">
                {customerData?.customer?.email ? (
                  <>
                    <Mail className="w-3 h-3 mr-1" />
                    {customerData.customer.email}
                  </>
                ) : customerData?.customer?.phone_number ? (
                  <>
                    <Phone className="w-3 h-3 mr-1" />
                    {customerData.customer.phone_number}
                  </>
                ) : (
                  "Professional Trader"
                )}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs opacity-80">
                  {customerData?.customer?.last_login
                    ? `Active since ${formatDate(
                        customerData.customer.date_joined
                      )}`
                    : "Online"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Account Balance</p>
                <p className="text-2xl font-bold mt-1">
                  $
                  {accountBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <button
                onClick={handleExportBalance}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                title="Export Balance"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs opacity-80">Total Invested</p>
                <p className="font-semibold text-sm">
                  ${totalInvested.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-80">Total Earnings</p>
                <p className="font-semibold text-green-300 text-sm">
                  +${totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {customerData?.customer?.first_name && (
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span>
                      {customerData.customer.first_name}{" "}
                      {customerData.customer.last_name || ""}
                    </span>
                  </div>
                )}
                {customerData?.customer?.date_joined && (
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(customerData.customer.date_joined)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Trading
          </h3>

          <button
            onClick={() => {
              resetToTrading();
              setShowTradeModal(true);
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-sky-400 rounded-lg shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">New Trade</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>

          <button
            onClick={handleDepositClick}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg shadow-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">Deposit</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>

          <button
            onClick={handleWithdrawClick}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg shadow-sm">
                <ArrowUpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">Withdraw</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
          </button>

          <button
            onClick={handleInvestClick}
            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg shadow-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700">Invest</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </button>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Account
            </h3>

            <button className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 w-full">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 active:bg-red-100 text-red-600 transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Secure Trading
              </p>
              <p className="text-xs text-gray-500">256-bit SSL Encryption</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 active:scale-95"
              >
                <Menu className="w-6 h-6 text-blue-600" />
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center shadow">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Welcome back</p>
                  <p className="font-semibold text-gray-800">
                    {getDisplayName()}
                  </p>
                  {customerData?.customer?.email && (
                    <p className="text-xs text-gray-500">
                      {customerData.customer.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => {
                    resetToTrading();
                    setShowTradeModal(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Open Trade
                </button>

                <button className="p-2.5 hover:bg-blue-50 rounded-xl transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">
                  Account Balance
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  $
                  {accountBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  <p className="text-xs text-green-600 font-medium">
                    +${totalEarnings.toFixed(2)} earned
                  </p>
                  <button
                    onClick={handleExportBalance}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Export Balance"
                  >
                    <Download className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {!showDeposit && !showWithdraw && !showInvest && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="font-semibold text-gray-700 text-sm">
                  Trading Pair:
                </label>
                <select
                  className="px-4 py-2.5 bg-white border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium cursor-pointer"
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                >
                  <option value="BTCUSDT" className="py-2">
                    BTC/USDT
                  </option>
                  <option value="ETHUSDT" className="py-2">
                    ETH/USDT
                  </option>
                  <option value="BNBUSDT" className="py-2">
                    BNB/USDT
                  </option>
                  <option value="XRPUSDT" className="py-2">
                    XRP/USDT
                  </option>
                  <option value="SOLUSDT" className="py-2">
                    SOL/USDT
                  </option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Live</span>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </header>

        {!showDeposit && !showWithdraw && !showInvest ? (
          <div className="flex-1 relative p-6 overflow-auto">
            {activeInvestments.length > 0 && (
              <div className="lg:absolute lg:top-6 lg:right-6 lg:z-30 lg:w-96 animate-fade-in mb-6 lg:mb-0">
                <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-blue-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                      Active Investments ({activeInvestments.length})
                    </h3>
                    <button
                      onClick={handleExportInvestments}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export All</span>
                    </button>
                  </div>
                  <div className="max-h-80 overflow-auto p-2">
                    {activeInvestments.map((investment) => {
                      const plan = investment.investment;
                      const dailyEarning = parseFloat(
                        String(plan.daily_earning)
                      );
                      const roi = parseFloat(String(plan.roi));
                      const period =
                        plan.non_of_days ||
                        (dailyEarning > 0 ? Math.round(roi / dailyEarning) : 0);
                      const amount = parseFloat(investment.amount);

                      const getIcon = () => {
                        const abbr = plan.abbr?.toUpperCase() || "";
                        if (abbr.includes("BTC")) return <BitcoinIcon />;
                        if (abbr.includes("ETH")) return <EthereumIcon />;
                        if (abbr.includes("BNB"))
                          return <Battery className="w-4 h-4" />;
                        if (abbr.includes("XRP"))
                          return <Coins className="w-4 h-4" />;
                        if (abbr.includes("ADA"))
                          return <Layers className="w-4 h-4" />;
                        if (abbr.includes("SOL"))
                          return <Activity className="w-4 h-4" />;
                        if (abbr.includes("DOT"))
                          return <Cpu className="w-4 h-4" />;
                        if (abbr.includes("LTC"))
                          return <Hash className="w-4 h-4" />;
                        return <Coins className="w-4 h-4" />;
                      };

                      const createdDate = new Date(investment.created_at);
                      const daysActive = Math.floor(
                        (new Date().getTime() - createdDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      const remainingDays = Math.max(0, period - daysActive);
                      const dailyEarningAmount = (amount * dailyEarning) / 100;

                      return (
                        <div
                          key={investment.id}
                          className="p-3 hover:bg-purple-50/50 rounded-xl transition-colors group border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg">
                                {getIcon()}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900">
                                  {plan.name}
                                </span>
                                <div className="text-xs text-gray-500">
                                  {plan.abbr} • Started:{" "}
                                  {formatDate(investment.created_at)}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded ${
                                investment.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {investment.is_active ? "Active" : "Completed"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-gray-500 text-xs">
                                Amount
                              </div>
                              <div className="font-bold text-gray-900">
                                ${amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-gray-500 text-xs">
                                Daily Earnings
                              </div>
                              <div className="font-bold text-green-600">
                                +${dailyEarningAmount.toFixed(2)}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-gray-500 text-xs">ROI</div>
                              <div className="font-bold text-gray-900">
                                {roi}%
                              </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-gray-500 text-xs">
                                Period
                              </div>
                              <div className="font-bold text-gray-900">
                                {period} days
                              </div>
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                Progress: {daysActive} / {period} days
                              </span>
                              <span>{remainingDays} days remaining</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (daysActive / period) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                            <div>
                              <div className="text-xs text-gray-500">
                                Current Earnings
                              </div>
                              <div className="font-bold text-green-600">
                                +$
                                {parseFloat(investment.earnings || "0").toFixed(
                                  2
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleExportEarnings(investment)}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-sky-400 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-1"
                                title="Export Earnings"
                              >
                                <Download className="w-3 h-3" />
                                <span>Export</span>
                              </button>
                              <button
                                onClick={() =>
                                  viewInvestmentDetails(investment)
                                }
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
                                title="View Details"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        Total Active Investments:
                      </span>
                      <span className="font-bold text-gray-900">
                        {activeInvestments.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Invested:</span>
                      <span className="font-bold text-gray-900">
                        ${totalInvested.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">
                        Total Current Earnings:
                      </span>
                      <span className="font-bold text-green-600">
                        +${totalEarnings.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="h-[calc(100vh-180px)] bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div
                id="tv_chart_container"
                ref={tvContainer}
                className="w-full h-full"
              ></div>
            </div>

            {notifications.length > 0 && (
              <div className="absolute top-6 left-6 space-y-3 z-30 animate-fade-in">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white p-4 rounded-xl shadow-2xl border border-blue-100 w-80 animate-slide-in-right"
                  >
                    {n.type === "INVEST_SUCCESS" ? (
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-purple-100">
                            <Check className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {n.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {n.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : n.type === "EXPORT_SUCCESS" ? (
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-green-100">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {n.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {n.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : n.type === "EARNINGS_EXPORT" ? (
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Download className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {n.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {n.message}
                            </div>
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  const blob = new Blob(
                                    [JSON.stringify(n.data || {}, null, 2)],
                                    { type: "application/json" }
                                  );
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = `earnings-${
                                    (n.data as { investment_id?: string })
                                      ?.investment_id || "unknown"
                                  }-${
                                    new Date().toISOString().split("T")[0]
                                  }.json`;
                                  a.click();
                                  window.URL.revokeObjectURL(url);

                                  setNotifications((p) =>
                                    p.filter((x) => x.id !== n.id)
                                  );
                                }}
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-sky-400 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                              >
                                Download JSON
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              n.type === "BUY" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {n.type === "BUY" ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">
                              Trading Signal
                            </div>
                            <div className="font-bold text-gray-900">
                              {n.pair} — {n.type}
                            </div>
                            <div className="text-sm text-gray-600">
                              @ ${n.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setNotifications((p) => p.filter((x) => x.id !== n.id))
                      }
                      className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTrades.length > 0 && (
              <div className="absolute left-6 bottom-6 z-30 w-96 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
                    <h3 className="font-bold text-gray-800 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Active Trades ({activeTrades.length})
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-auto p-2">
                    {activeTrades.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 hover:bg-blue-50/50 rounded-xl transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                t.type === "BUY"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {t.type}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {t.pair}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Entry:{" "}
                            <span className="font-medium">${t.entry}</span> |
                            Size:{" "}
                            <span className="font-medium">{t.amount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`text-right font-mono font-bold ${
                              t.pnl >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                          </div>
                          <button
                            onClick={() => closeTrade(t.id)}
                            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : showDeposit ? (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Deposit Funds
                        </h2>
                        <p className="text-gray-500">
                          Add funds to your trading account
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Current Balance:{" "}
                          <span className="font-bold">
                            ${accountBalance.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={resetToTrading}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Back to Trading
                      </button>
                      <button
                        onClick={() => setShowDepositForm(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Make Deposit
                      </button>
                    </div>
                  </div>
                </div>

                {depositInstructions ? (
                  <div className="p-6 animate-fade-in">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Check className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Deposit Instructions
                            </h3>
                            <p className="text-gray-600">
                              Follow these steps to complete your deposit
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-5 border border-emerald-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                              Step 1: Copy Wallet Address
                            </h4>
                            <div className="mb-4">
                              <p className="text-sm text-gray-500 mb-2">
                                Send exactly:
                              </p>
                              <div className="text-2xl font-bold text-gray-900">
                                {depositInstructions.amount}{" "}
                                {depositInstructions.currency}
                              </div>
                            </div>
                            <div className="mb-4">
                              <p className="text-sm text-gray-500 mb-2">
                                Network:
                              </p>
                              <div className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {depositInstructions.network}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">
                                Wallet Address:
                              </p>
                              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                                <code className="font-mono text-gray-900 truncate">
                                  {depositInstructions.address}
                                </code>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      depositInstructions.address || ""
                                    )
                                  }
                                  className="ml-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                                >
                                  {copied ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-5 border border-emerald-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <ExternalLink className="w-5 h-5 mr-2 text-emerald-600" />
                              Step 2: Send Crypto
                            </h4>
                            <p className="text-gray-600 mb-4">
                              Send exactly{" "}
                              <span className="font-bold">
                                {depositInstructions.amount}{" "}
                                {depositInstructions.currency}
                              </span>{" "}
                              to the address above using the{" "}
                              <span className="font-bold">
                                {depositInstructions.network}
                              </span>{" "}
                              network.
                            </p>
                            <div className="text-center">
                              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                                    depositInstructions.address || ""
                                  }`}
                                  alt="QR Code"
                                  className="w-full h-full"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-3">
                                Scan QR code with your wallet
                              </p>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                              <Shield className="w-5 h-5 mr-2 text-blue-600" />
                              Important Notes
                            </h4>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Send only {depositInstructions.currency} on
                                  the {depositInstructions.network} network
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Your account will be credited automatically
                                  after 3 network confirmations
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Contact support if your account is not
                                  credited within 24 hours
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Do not send from exchange wallets directly
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setDepositInstructions(null);
                                setShowDepositForm(true);
                              }}
                              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                              New Deposit
                            </button>
                            <button
                              onClick={() => {
                                sessionStorage.setItem("nextView", "deposits");
                                window.location.reload();
                              }}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              View Deposit History
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : showDepositForm ? (
                  <div className="p-6 animate-fade-in">
                    <div className="max-w-md mx-auto">
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Make a Deposit
                        </h3>
                        <p className="text-gray-500">
                          Select cryptocurrency and enter amount
                        </p>
                      </div>

                      {depositError && (
                        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-center">
                          <p className="text-sm text-red-700 font-medium">
                            {depositError}
                          </p>
                        </div>
                      )}

                      <form onSubmit={submitDeposit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Cryptocurrency
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {["BTC"].map((crypto) => (
                              <button
                                type="button"
                                key={crypto}
                                onClick={() => setSelectedCrypto(crypto)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                  selectedCrypto === crypto
                                    ? "border-emerald-500 bg-emerald-50"
                                    : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="text-center">
                                  <div className="font-bold text-gray-900">
                                    {crypto}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {cryptoWallets[crypto].network}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount to Deposit
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.000001"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full px-4 py-4 text-lg border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                              required
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                              {selectedCrypto}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-500">
                              Minimum: 10 {selectedCrypto}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDepositAmount("100")}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Use 100 {selectedCrypto}
                            </button>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">
                              You will send:
                            </span>
                            <span className="font-bold text-gray-900">
                              {depositAmount || "0"} {selectedCrypto}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Network:</span>
                            <span className="font-medium text-gray-900">
                              {cryptoWallets[selectedCrypto].network}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowDepositForm(false)}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={
                              !depositAmount || parseFloat(depositAmount) < 10
                            }
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {depositLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span>Processing...</span>
                              </div>
                            ) : (
                              "Continue to Payment"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-6 border-b border-blue-100">
                      <h3 className="text-lg font-bold text-gray-900">
                        Deposit History
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Total Deposits: $
                        {deposits
                          .reduce(
                            (sum, dep) => sum + parseFloat(dep.amount || "0"),
                            0
                          )
                          .toFixed(2)}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Currency
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Wallet Address
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {deposits.map((deposit) => (
                            <tr
                              key={deposit.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="font-bold text-gray-900">
                                  {parseFloat(deposit.amount).toLocaleString()}{" "}
                                  {deposit.currency}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center">
                                  <div
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                      deposit.currency === "USDT"
                                        ? "bg-green-500"
                                        : deposit.currency === "BTC"
                                        ? "bg-amber-500"
                                        : "bg-purple-500"
                                    }`}
                                  ></div>
                                  <span className="font-medium">
                                    {deposit.currency}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    deposit.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : deposit.status === "success"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {deposit.status.charAt(0).toUpperCase() +
                                    deposit.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {deposit.date}
                              </td>
                              <td className="py-4 px-6">
                                <button
                                  onClick={() =>
                                    showDepositInstructions(deposit)
                                  }
                                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                                >
                                  {deposit.status !== "completed" ? (
                                    "View Instructions"
                                  ) : (
                                    <span className="text-sm">Completed</span>
                                  )}
                                </button>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm text-gray-500 font-mono truncate max-w-[120px]">
                                    {deposit.txHash}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(deposit.txHash)
                                    }
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm text-gray-500 font-mono truncate max-w-[120px]">
                                    {customerData?.prestige_wealth_address
                                      ?.wallet_address || "N/A"}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        customerData?.prestige_wealth_address
                                          ?.wallet_address || ""
                                      )
                                    }
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Copy Address"
                                  >
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {deposits.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet className="w-10 h-10 text-gray-400" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">
                            No Deposits Yet
                          </h4>
                          <p className="text-gray-500 mb-6">
                            Start by making your first deposit
                          </p>
                          <button
                            onClick={() => setShowDepositForm(true)}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Make First Deposit
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : showWithdraw ? (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl">
                        <ArrowUpCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Withdraw Funds
                        </h2>
                        <p className="text-gray-500">
                          Withdraw funds from your trading account
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Available Balance:{" "}
                          <span className="font-bold">
                            ${accountBalance.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={resetToTrading}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Back to Trading
                      </button>
                      <button
                        onClick={() => setShowWithdrawForm(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Withdraw Funds
                      </button>
                    </div>
                  </div>
                </div>

                {withdrawInstructions ? (
                  <div className="p-6 animate-fade-in">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Check className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Withdrawal Submitted
                            </h3>
                            <p className="text-gray-600">
                              Your withdrawal request has been received
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-5 border border-amber-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <DollarSign className="w-5 h-5 mr-2 text-amber-600" />
                              Withdrawal Details
                            </h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Amount:</span>
                                <span className="text-xl font-bold text-gray-900">
                                  {withdrawInstructions.amount}{" "}
                                  {withdrawInstructions.currency}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  To Address:
                                </span>
                                <code className="font-mono text-gray-900 text-sm truncate max-w-[200px]">
                                  {withdrawInstructions.address}
                                </code>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status:</span>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                                  Processing
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                              <Clock className="w-5 h-5 mr-2 text-blue-600" />
                              Processing Time
                            </h4>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt=2 mr-3"></div>
                                <span>
                                  Withdrawals are processed within 24 to 48
                                  hours
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  You will receive a confirmation email when
                                  funds are sent
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Network fees will be deducted from the
                                  withdrawal amount
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Contact support if you don&apos;t receive
                                  funds within 48 hours
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setWithdrawInstructions(null);
                                setShowWithdrawForm(true);
                              }}
                              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                              New Withdrawal
                            </button>
                            <button
                              onClick={() => setWithdrawInstructions(null)}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              View Withdrawal History
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : showWithdrawForm ? (
                  <div className="p-6 animate-fade-in">
                    <div className="max-w-md mx-auto">
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Withdraw Funds
                        </h3>
                        <p className="text-gray-500">
                          Enter amount and wallet address
                        </p>
                      </div>

                      <form onSubmit={submitWithdraw} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Cryptocurrency
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {["USDT", "BTC", "ETH"].map((crypto) => (
                              <button
                                type="button"
                                key={crypto}
                                onClick={() => setSelectedCrypto(crypto)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                  selectedCrypto === crypto
                                    ? "border-amber-500 bg-amber-50"
                                    : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="text-center">
                                  <div className="font-bold text-gray-900">
                                    {crypto}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {cryptoWallets[crypto].network}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount to Withdraw
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.000001"
                              value={withdrawAmount}
                              onChange={(e) =>
                                setWithdrawAmount(e.target.value)
                              }
                              placeholder="0.00"
                              className="w-full px-4 py-4 text-lg border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                              required
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                              {selectedCrypto}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-500">
                              Available: {accountBalance.toLocaleString()}{" "}
                              {selectedCrypto}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setWithdrawAmount(
                                  (accountBalance / 2).toString()
                                )
                              }
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Use 50%
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wallet Address
                          </label>
                          <textarea
                            value={withdrawAddress}
                            onChange={(e) => setWithdrawAddress(e.target.value)}
                            placeholder="Paste your wallet address here..."
                            rows={3}
                            className="w-full px-4 py-3 text-sm border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-mono resize-none"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Make sure this address supports {selectedCrypto} on
                            the {cryptoWallets[selectedCrypto].network} network
                          </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">
                              You will receive:
                            </span>
                            <span className="font-bold text-gray-900">
                              {withdrawAmount || "0"} {selectedCrypto}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Network Fee:</span>
                            <span className="font-medium text-gray-900">
                              ~2 {selectedCrypto}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-gray-600">
                              Processing Time:
                            </span>
                            <span className="font-medium text-gray-900">
                              24-48 hours
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowWithdrawForm(false)}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={
                              !withdrawAmount ||
                              parseFloat(withdrawAmount) < 10 ||
                              !withdrawAddress
                            }
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            Submit Withdrawal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-6 border-b border-blue-100">
                      <h3 className="text-lg font-bold text-gray-900">
                        Withdrawal History
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Total Withdrawn: $
                        {withdrawals
                          .reduce(
                            (sum, wd) => sum + parseFloat(wd.amount || "0"),
                            0
                          )
                          .toFixed(2)}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Currency
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Address
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {withdrawals.map((withdrawal) => (
                            <tr
                              key={withdrawal.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="font-bold text-gray-900">
                                  {withdrawal.amount.toLocaleString()}{" "}
                                  {withdrawal.currency}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center">
                                  <div
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                      withdrawal.currency === "USDT"
                                        ? "bg-green-500"
                                        : withdrawal.currency === "BTC"
                                        ? "bg-amber-500"
                                        : "bg-purple-500"
                                    }`}
                                  ></div>
                                  <span className="font-medium">
                                    {withdrawal.currency}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    withdrawal.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : withdrawal.status === "success"
                                      ? "bg-green-100 text-green-700"
                                      : withdrawal.status === "processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {withdrawal.status.charAt(0).toUpperCase() +
                                    withdrawal.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {withdrawal.date}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm text-gray-500 font-mono truncate max-w-[120px]">
                                    {withdrawal.address}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(withdrawal.address)
                                    }
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {withdrawals.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowUpCircle className="w-10 h-10 text-amber-500" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">
                            No Withdrawals Yet
                          </h4>
                          <p className="text-gray-500 mb-6">
                            Start by making your first withdrawal
                          </p>
                          <button
                            onClick={() => setShowWithdrawForm(true)}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Make First Withdrawal
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Mining Investment
                        </h2>
                        <p className="text-gray-500">
                          Invest in crypto mining for daily returns
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Current Balance:{" "}
                          <span className="font-bold">
                            ${accountBalance.toFixed(2)}
                          </span>{" "}
                          | Active Investments:{" "}
                          <span className="font-bold text-green-600">
                            {activeInvestments.length}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={resetToTrading}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Back to Trading
                      </button>
                    </div>
                  </div>
                </div>

                {investError && (
                  <div className="p-4 my-4 bg-red-50 border border-red-200 rounded-xl text-center">
                    <p className="text-sm text-red-700 font-medium">
                      {investError}
                    </p>
                  </div>
                )}

                {investInstructions ? (
                  <div className="p-6 animate-fade-in">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Check className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Investment Confirmed!
                            </h3>
                            <p className="text-gray-600">
                              Your mining investment has been activated
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-5 border border-purple-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <Coins className="w-5 h-5 mr-2 text-purple-600" />
                              Investment Details
                            </h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Mining Coin:
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                  {investInstructions.coin}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Investment Amount:
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                  ${investInstructions.amount}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Daily Earnings:
                                </span>
                                <span className="text-xl font-bold text-green-600">
                                  {investInstructions.dailyEarnings}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Investment Period:
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                  {investInstructions.period}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Estimated Total Return:
                                </span>
                                <span className="text-xl font-bold text-green-600">
                                  ${investInstructions.estimatedTotal}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                              <Clock className="w-5 h-5 mr-2 text-blue-600" />
                              Important Information
                            </h4>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Earnings are calculated daily and credited to
                                  your account every 24 hours
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Minimum investment period is required to
                                  receive full returns
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  You can reinvest earnings at any time
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                <span>
                                  Contact support for early withdrawal requests
                                  (fees may apply)
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setInvestInstructions(null);
                              }}
                              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                              View All Mining Plans
                            </button>
                            <button
                              onClick={() => {
                                setInvestInstructions(null);
                                setShowInvestForm(false);
                              }}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Make Another Investment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : showInvestForm ? (
                  <div className="p-6 animate-fade-in">
                    <div className="max-w-md mx-auto">
                      <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`p-2 rounded-lg ${selectedInvestCoin?.bgColor}`}
                          >
                            {selectedInvestCoin?.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              Invest in {selectedInvestCoin?.name}
                            </h3>
                            <p className="text-gray-500">
                              Enter investment amount
                            </p>
                          </div>
                        </div>
                      </div>

                      {investError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                          <p className="text-sm text-red-700 font-medium">
                            {investError}
                          </p>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-xl p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Daily Earnings
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                {selectedInvestCoin?.dailyEarnings}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Period</p>
                              <p className="text-lg font-bold text-gray-900">
                                {selectedInvestCoin?.investmentPeriod}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Min Investment
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                ${selectedInvestCoin?.minInvestment}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Max Investment
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                ${selectedInvestCoin?.maxInvestment}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Investment Amount (USD)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min={selectedInvestCoin?.minInvestment}
                              max={selectedInvestCoin?.maxInvestment}
                              step="1"
                              value={investAmount}
                              onChange={(e) => setInvestAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="w-full px-4 py-4 text-lg border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                              USD
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-500">
                              Min: ${selectedInvestCoin?.minInvestment}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setInvestAmount(
                                  selectedInvestCoin?.minInvestment.toString() ||
                                    "0"
                                )
                              }
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Use Minimum
                            </button>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">
                                Daily Earnings:
                              </span>
                              <span className="font-bold text-green-600">
                                $
                                {(
                                  (parseFloat(investAmount || "0") *
                                    (selectedInvestCoin?.dailyEarning || 0)) /
                                  100
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">
                                Total Return:
                              </span>
                              <span className="font-bold text-green-600">
                                $
                                {(
                                  parseFloat(investAmount || "0") *
                                  ((selectedInvestCoin?.roi || 0) / 100)
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">ROI:</span>
                              <span className="font-bold text-green-600">
                                {selectedInvestCoin?.roiPercentage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowInvestForm(false)}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() =>
                              selectedInvestCoin &&
                              submitInvest(selectedInvestCoin, investAmount)
                            }
                            disabled={
                              !investAmount ||
                              parseFloat(investAmount) <
                                (selectedInvestCoin?.minInvestment || 0) ||
                              parseFloat(investAmount) >
                                (selectedInvestCoin?.maxInvestment || 0)
                            }
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                          >
                            {processingInvestId === selectedInvestCoin?.id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              "Confirm Investment"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-6 border-b border-blue-100">
                      <h3 className="text-lg font-bold text-gray-900">
                        Mining Investment Plans
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Choose from different mining coins with varying returns
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading
                          ? Array.from({ length: 8 }).map((_, index) => (
                              <div
                                key={index}
                                className="rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 animate-pulse"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                  <div className="text-right">
                                    <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                                  </div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-3 mb-6">
                                  <div className="h-5 bg-gray-200 rounded"></div>
                                  <div className="h-5 bg-gray-200 rounded"></div>
                                  <div className="h-5 bg-gray-200 rounded"></div>
                                  <div className="h-5 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                              </div>
                            ))
                          : miningCoins.map((coin) => (
                              <div
                                key={coin.id}
                                className={`rounded-2xl border-2 ${coin.borderColor} ${coin.bgColor} p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                                onClick={() => {
                                  setSelectedInvestCoin(coin);
                                  setInvestAmount(
                                    coin.minInvestment.toString()
                                  );
                                  setShowInvestForm(true);
                                }}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${coin.color} text-white`}
                                  >
                                    {coin.icon}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                      Investors
                                    </div>
                                    <div className="font-bold text-gray-900">
                                      {coin.totalInvestors.toLocaleString()}
                                    </div>
                                  </div>
                                </div>

                                <h4 className="font-bold text-gray-900 text-lg mb-2">
                                  {coin.name}
                                </h4>
                                <div className="text-sm text-gray-500 mb-4">
                                  {coin.symbol}
                                </div>

                                <div className="space-y-3 mb-6">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Daily Earnings
                                    </span>
                                    <span className="font-bold text-green-600">
                                      {coin.dailyEarnings}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Period
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      {coin.investmentPeriod}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Min Investment
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      ${coin.minInvestment}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">ROI</span>
                                    <span className="font-bold text-green-600">
                                      {coin.roiPercentage}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Hash Rate
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      {coin.hashRate}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    submitInvest(
                                      coin,
                                      coin.minInvestment.toString()
                                    );
                                  }}
                                  disabled={processingInvestId === coin.id}
                                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                  {processingInvestId === coin.id ? (
                                    <>
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                      <span>Processing...</span>
                                    </>
                                  ) : (
                                    "Invest Now"
                                  )}
                                </button>
                              </div>
                            ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            resetToTrading();
            setShowTradeModal(true);
          }}
          className="fixed bottom-6 right-6 z-50 md:hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full shadow-2xl shadow-blue-400/50 flex flex-col items-center justify-center group-hover:shadow-3xl group-hover:shadow-blue-500/60 group-hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse-subtle">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="4" x2="12" y2="15" />
              <polyline points="8 11 12 15 16 11" />
              <path
                d="M4 12 C4 16, 8 20, 12 20 C16 20, 20 16, 20 12"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M8 12 C8 14, 10 16, 12 16 C14 16, 16 14, 16 12"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
            </svg>

            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs font-medium py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Open New Trade
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </button>

        {showTradeModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowTradeModal(false)}
            />
            <form
              onSubmit={submitTrade}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in z-70"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-sky-400 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Open New Trade
                      </h3>
                      <p className="text-sm text-gray-500">
                        Trade {selectedPair}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTradeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Pair
                  </label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-xl font-semibold text-gray-900 flex items-center justify-between">
                    <span>{selectedPair.replace("USDT", "/USDT")}</span>
                    <div className="px-3 py-1 bg-white rounded-lg text-sm shadow-sm">
                      Live
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTradeType("BUY")}
                      className="p-4 border-2 border-green-200 bg-green-50 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-700">BUY</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType("SELL")}
                      className="p-4 border-2 border-red-200 bg-red-50 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <span className="font-bold text-red-700">SELL</span>
                      </div>
                    </button>
                  </div>
                  <input type="hidden" name="type" value={tradeType} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USDT)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <input
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">
                      Available: ${accountBalance.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Use Max
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTradeModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Confirm Trade
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
