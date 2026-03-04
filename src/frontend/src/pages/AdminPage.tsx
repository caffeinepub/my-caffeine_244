import type { LandListing, Lawyer, NewsArticle } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useLocalLawyers,
  useLocalListings,
  useLocalNews,
  useLocalRegistrations,
} from "@/hooks/useLocalStore";
import type { RegisteredUser } from "@/hooks/useLocalStore";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { SiteSettings } from "@/hooks/useSiteSettings";
import {
  DIVISIONS as BD_DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
} from "@/utils/bangladeshData";
import {
  formatArea,
  formatBDT,
  getLandTypeLabel,
  getRoadAccessLabel,
  getStatusLabel,
} from "@/utils/format";

import type React from "react";

import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Building2,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  MapPin,
  Minus,
  Newspaper,
  Palette,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Ruler,
  Scale,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Admin credentials store (localStorage-backed) ──────────────────────────
const ADMIN_CREDS_KEY = "admin_credentials";
const DEFAULT_RESET_CODE = "JOMI2024";

function getAdminCredentials(): { username: string; password: string } {
  try {
    const stored = localStorage.getItem(ADMIN_CREDS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { username: "admin", password: "admin123" };
}

function saveAdminCredentials(username: string, password: string) {
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ username, password }));
}

// ─── Styled Form Section Divider ────────────────────────────────────────────
function FormSection({
  label,
  color = "oklch(0.55 0.14 240)",
}: {
  label: string;
  color?: string;
}) {
  return (
    <div className="col-span-2 flex items-center gap-3 mt-4 mb-1">
      <div
        className="w-1 h-5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color }}
      >
        {label}
      </span>
      <div
        className="h-px flex-1"
        style={{ background: `${color.replace(")", " / 0.15)")}` }}
      />
    </div>
  );
}

// ─── Styled Form Label ────────────────────────────────────────────────────
function FormLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label className="text-sm font-semibold text-foreground/80 mb-1 block">
      {children}
      {required && <span className="ml-0.5 text-rose-500 font-bold">*</span>}
    </Label>
  );
}

// ─── Dialog Form Header ────────────────────────────────────────────────────
function FormDialogHeader({
  title,
  icon: Icon,
  gradientFrom,
  gradientTo,
}: {
  title: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <div
      className="relative -mx-6 -mt-6 mb-6 px-6 pt-6 pb-5 overflow-hidden rounded-t-2xl"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
      }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20"
        style={{ background: "white" }}
      />
      <div className="flex items-center gap-3 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(1 0 0 / 0.18)" }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <DialogTitle className="text-white text-lg font-bold leading-tight">
            {title}
          </DialogTitle>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(1 0 0 / 0.65)" }}
          >
            সকল তথ্য সঠিকভাবে পূরণ করুন
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dialog Form Shell (entry animation wrapper) ──────────────────────────
function FormDialogShell({
  children,
  title,
  icon: Icon,
  gradientFrom,
  gradientTo,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <FormDialogHeader
        title={title}
        icon={Icon}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
      />
      {children}
    </motion.div>
  );
}

// ─── Admin Login ────────────────────────────────────────────────────────────
type LoginView = "login" | "forgot" | "reset_success";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<LoginView>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot password state
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const resetAttempts = useRef(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await new Promise((r) => setTimeout(r, 400));
    const creds = getAdminCredentials();
    if (username === creds.username && password === creds.password) {
      onLogin();
    } else {
      toast.error("ভুল ইউজারনেম বা পাসওয়ার্ড");
    }
    setIsLoggingIn(false);
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetAttempts.current >= 5) {
      toast.error("অনেকবার চেষ্টা হয়েছে। পেজ রিফ্রেশ করুন।");
      return;
    }
    if (resetCode.trim() !== DEFAULT_RESET_CODE) {
      resetAttempts.current += 1;
      toast.error(`ভুল রিসেট কোড। বাকি চেষ্টা: ${5 - resetAttempts.current}`);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড মিলছে না");
      return;
    }
    setIsResetting(true);
    await new Promise((r) => setTimeout(r, 500));
    const creds = getAdminCredentials();
    saveAdminCredentials(creds.username, newPassword);
    setIsResetting(false);
    setView("reset_success");
    toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে");
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "নিরাপদ যাচাইকরণ",
      desc: "পাসওয়ার্ড দিয়ে সুরক্ষিত অ্যাক্সেস",
      iconBg: "oklch(0.35 0.12 155 / 0.30)",
      iconColor: "oklch(0.82 0.18 78)",
    },
    {
      icon: MapPin,
      title: "লিস্টিং পরিচালনা",
      desc: "সকল জমির বিজ্ঞাপন সরাসরি নিয়ন্ত্রণ",
      iconBg: "oklch(0.35 0.12 240 / 0.25)",
      iconColor: "oklch(0.75 0.16 200)",
    },
    {
      icon: Scale,
      title: "আইনি তথ্য ব্যবস্থাপনা",
      desc: "আইনজীবী ও নথিপত্র সম্পূর্ণ নিয়ন্ত্রণ",
      iconBg: "oklch(0.35 0.12 300 / 0.25)",
      iconColor: "oklch(0.78 0.14 290)",
    },
  ];

  const adminCapabilities = [
    "জমির লিস্টিং পরিচালনা",
    "আইনজীবী ব্যবস্থাপনা",
    "সংবাদ প্রকাশনা",
  ];

  const platformStats = [
    { label: "১০,০০০+ জমির তালিকা", icon: MapPin },
    { label: "৫০০+ যাচাইকৃত বিক্রেতা", icon: ShieldCheck },
    { label: "৬৪ জেলায় সেবা", icon: Star },
  ];

  const avatarColors = [
    "oklch(0.65 0.16 78)",
    "oklch(0.60 0.14 155)",
    "oklch(0.55 0.14 280)",
  ];
  const avatarInitials = ["রা", "সা", "মো"];

  return (
    <div className="min-h-screen flex">
      {/* ── Left Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.16 0.10 155) 0%, oklch(0.12 0.08 165) 45%, oklch(0.18 0.12 145) 100%)",
        }}
      >
        {/* Animated blob 1 */}
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
          style={{ background: "oklch(0.55 0.16 155 / 0.10)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.16, 0.1] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        {/* Animated blob 2 */}
        <motion.div
          className="absolute top-1/3 -left-16 w-64 h-64 rounded-full"
          style={{ background: "oklch(0.65 0.18 78 / 0.08)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        {/* Animated blob 3 */}
        <motion.div
          className="absolute -bottom-16 right-12 w-80 h-80 rounded-full"
          style={{ background: "oklch(0.55 0.14 280 / 0.09)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.09, 0.13, 0.09] }}
          transition={{
            duration: 11,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.85 0.18 78 / 0.6), transparent)",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.18 78 / 0.25) 0%, oklch(0.55 0.14 155 / 0.30) 100%)",
                border: "1px solid oklch(1 0 0 / 0.12)",
              }}
            >
              <MapPin
                className="w-7 h-7"
                style={{ color: "oklch(0.85 0.20 78)" }}
              />
            </div>
            <div>
              <span
                className="text-2xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', system-ui",
                  color: "oklch(0.97 0.01 120)",
                }}
              >
                জমিবাজার
              </span>
              <div
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "oklch(0.85 0.18 78 / 0.85)" }}
              >
                Bangladesh Land Marketplace
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tagline + Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <h2
            className="text-3xl xl:text-4xl font-extrabold leading-tight mb-3"
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui",
              color: "oklch(0.97 0.01 120)",
            }}
          >
            বাংলাদেশের সেরা
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.85 0.20 78), oklch(0.82 0.18 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ডিজিটাল জমি
            </span>
            <br />
            মার্কেটপ্লেস
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "oklch(1 0 0 / 0.50)" }}
          >
            সরাসরি মালিকের সাথে কেনাবেচা — দালাল ছাড়া, ঝামেলা ছাড়া
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: f.iconBg,
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.iconColor }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.95 0.01 120)" }}
                  >
                    {f.title}
                  </div>
                  <div
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: "oklch(1 0 0 / 0.42)" }}
                  >
                    {f.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {avatarInitials.map((init, i) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-sm"
                  style={{
                    background: avatarColors[i],
                    borderColor: "oklch(0.16 0.10 155)",
                    color: "white",
                  }}
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-xs" style={{ color: "oklch(1 0 0 / 0.45)" }}>
              ১,২০০+ সক্রিয় ব্যবহারকারী বিশ্বাস করেন
            </span>
          </motion.div>
        </motion.div>

        {/* Platform stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 mt-8"
        >
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: "oklch(1 0 0 / 0.05)",
              border: "1px solid oklch(1 0 0 / 0.08)",
            }}
          >
            <div className="flex flex-wrap gap-2">
              {platformStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "oklch(1 0 0 / 0.07)",
                    color: "oklch(0.88 0.06 120)",
                    border: "1px solid oklch(1 0 0 / 0.10)",
                  }}
                >
                  <stat.icon
                    className="w-3 h-3"
                    style={{ color: "oklch(0.85 0.18 78)" }}
                  />
                  {stat.label}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs" style={{ color: "oklch(1 0 0 / 0.28)" }}>
            © {new Date().getFullYear()} জমিবাজার। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </motion.div>
      </div>

      {/* ── Right Login Panel ── */}
      <div
        className="flex-1 flex items-center justify-center p-6 sm:p-10"
        style={{ background: "oklch(0.98 0.005 120)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.16 155), oklch(0.38 0.14 160))",
              }}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-extrabold"
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui",
                color: "oklch(0.22 0.08 155)",
              }}
            >
              জমিবাজার
            </span>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "oklch(1 0 0)",
              border: "1px solid oklch(0.91 0.02 240)",
              boxShadow:
                "0 24px 64px -12px oklch(0.45 0.16 155 / 0.12), 0 4px 16px oklch(0 0 0 / 0.06)",
            }}
          >
            {/* Card top accent bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.45 0.16 155), oklch(0.65 0.18 78), oklch(0.55 0.14 300))",
              }}
            />

            <div className="p-8 sm:p-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 }}
                className="mb-6"
              >
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full"
                  style={{
                    background:
                      view === "forgot" || view === "reset_success"
                        ? "linear-gradient(135deg, oklch(0.55 0.16 78 / 0.10), oklch(0.65 0.14 78 / 0.06))"
                        : "linear-gradient(135deg, oklch(0.45 0.16 155 / 0.10), oklch(0.55 0.14 155 / 0.06))",
                    border:
                      view === "forgot" || view === "reset_success"
                        ? "1px solid oklch(0.55 0.16 78 / 0.22)"
                        : "1px solid oklch(0.45 0.16 155 / 0.22)",
                    color:
                      view === "forgot" || view === "reset_success"
                        ? "oklch(0.42 0.14 78)"
                        : "oklch(0.38 0.14 155)",
                  }}
                >
                  {view === "forgot" || view === "reset_success" ? (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      পাসওয়ার্ড রিসেট
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      অ্যাডমিন পোর্টাল
                    </>
                  )}
                </span>
              </motion.div>

              {/* Heading */}
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="mb-6"
              >
                {view === "login" && (
                  <>
                    <h1
                      className="text-3xl font-extrabold mb-2"
                      style={{
                        fontFamily: "'Bricolage Grotesque', system-ui",
                        color: "oklch(0.16 0.06 155)",
                      }}
                    >
                      স্বাগতম,{" "}
                      <span
                        style={{
                          background:
                            "linear-gradient(90deg, oklch(0.45 0.16 155), oklch(0.42 0.14 185))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        অ্যাডমিন
                      </span>
                    </h1>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.52 0.04 240)" }}
                    >
                      অ্যাডমিন প্যানেল পরিচালনার জন্য আপনার পরিচয় যাচাই করুন
                    </p>
                  </>
                )}
                {view === "forgot" && (
                  <>
                    <h1
                      className="text-3xl font-extrabold mb-2"
                      style={{
                        fontFamily: "'Bricolage Grotesque', system-ui",
                        color: "oklch(0.16 0.06 155)",
                      }}
                    >
                      পাসওয়ার্ড{" "}
                      <span
                        style={{
                          background:
                            "linear-gradient(90deg, oklch(0.52 0.16 78), oklch(0.45 0.14 68))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        রিসেট
                      </span>
                    </h1>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.52 0.04 240)" }}
                    >
                      রিসেট কোড ব্যবহার করে নতুন পাসওয়ার্ড সেট করুন
                    </p>
                  </>
                )}
                {view === "reset_success" && (
                  <>
                    <h1
                      className="text-3xl font-extrabold mb-2"
                      style={{
                        fontFamily: "'Bricolage Grotesque', system-ui",
                        color: "oklch(0.16 0.06 155)",
                      }}
                    >
                      সফলভাবে{" "}
                      <span
                        style={{
                          background:
                            "linear-gradient(90deg, oklch(0.45 0.16 155), oklch(0.42 0.14 185))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        সম্পন্ন
                      </span>
                    </h1>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.52 0.04 240)" }}
                    >
                      আপনার পাসওয়ার্ড পরিবর্তন হয়ে গেছে
                    </p>
                  </>
                )}
              </motion.div>

              {/* Admin capabilities checklist - only on login view */}
              {view === "login" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="mb-6 rounded-2xl p-4 space-y-2.5"
                  style={{
                    background: "oklch(0.97 0.01 155)",
                    border: "1px solid oklch(0.92 0.04 155)",
                  }}
                >
                  {adminCapabilities.map((cap, i) => (
                    <motion.div
                      key={cap}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.22 + i * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.45 0.16 155), oklch(0.52 0.14 155))",
                        }}
                      >
                        <Check
                          className="w-2.5 h-2.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.30 0.08 155)" }}
                      >
                        {cap}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ─── Login Form ─── */}
              {view === "login" && (
                <motion.form
                  key="login-form"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="admin-username"
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.28 0.06 155)" }}
                    >
                      ইউজারনেম
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Users
                          className="w-4 h-4"
                          style={{ color: "oklch(0.60 0.06 240)" }}
                        />
                      </span>
                      <input
                        id="admin-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ইউজারনেম লিখুন"
                        autoComplete="username"
                        required
                        data-ocid="admin.login.username.input"
                        className="w-full h-12 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all"
                        style={{
                          borderColor: "oklch(0.88 0.04 240)",
                          background: "oklch(0.98 0.005 240)",
                          color: "oklch(0.20 0.06 240)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "oklch(0.45 0.16 155)";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 3px oklch(0.45 0.16 155 / 0.15)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "oklch(0.88 0.04 240)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="admin-password"
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.28 0.06 155)" }}
                      >
                        পাসওয়ার্ড
                      </Label>
                      <button
                        type="button"
                        onClick={() => setView("forgot")}
                        className="text-xs font-medium transition-colors hover:underline"
                        style={{ color: "oklch(0.45 0.16 155)" }}
                        data-ocid="admin.login.forgot_password.button"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <LockKeyhole
                          className="w-4 h-4"
                          style={{ color: "oklch(0.60 0.06 240)" }}
                        />
                      </span>
                      <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড লিখুন"
                        autoComplete="current-password"
                        required
                        data-ocid="admin.login.password.input"
                        className="w-full h-12 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all"
                        style={{
                          borderColor: "oklch(0.88 0.04 240)",
                          background: "oklch(0.98 0.005 240)",
                          color: "oklch(0.20 0.06 240)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "oklch(0.45 0.16 155)";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 3px oklch(0.45 0.16 155 / 0.15)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "oklch(0.88 0.04 240)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-black/5"
                        tabIndex={-1}
                        data-ocid="admin.login.toggle_password.button"
                      >
                        {showPassword ? (
                          <EyeOff
                            className="w-4 h-4"
                            style={{ color: "oklch(0.60 0.06 240)" }}
                          />
                        ) : (
                          <Eye
                            className="w-4 h-4"
                            style={{ color: "oklch(0.60 0.06 240)" }}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    size="lg"
                    className="w-full h-14 text-base font-bold text-white shadow-lg transition-all duration-300 group relative overflow-hidden rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.42 0.16 155) 0%, oklch(0.36 0.14 165) 100%)",
                      boxShadow:
                        "0 8px 24px oklch(0.42 0.16 155 / 0.35), 0 2px 8px oklch(0.42 0.16 155 / 0.2)",
                    }}
                    data-ocid="admin.login.submit_button"
                  >
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.15) 50%, transparent 70%)",
                      }}
                    />
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2 relative z-10">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        যাচাই করা হচ্ছে...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative z-10">
                        <ShieldCheck className="w-5 h-5" />
                        লগইন করুন
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}

              {/* ─── Forgot Password Form ─── */}
              {view === "forgot" && (
                <motion.div
                  key="forgot-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Reset code info box */}
                  <div
                    className="rounded-xl p-4 mb-5 flex gap-3"
                    style={{
                      background: "oklch(0.96 0.03 78)",
                      border: "1px solid oklch(0.88 0.08 78)",
                      borderLeft: "4px solid oklch(0.65 0.18 78)",
                    }}
                  >
                    <AlertTriangle
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: "oklch(0.55 0.16 78)" }}
                    />
                    <div>
                      <p
                        className="text-xs font-bold mb-0.5"
                        style={{ color: "oklch(0.38 0.12 78)" }}
                      >
                        রিসেট কোড প্রয়োজন
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "oklch(0.45 0.08 78)" }}
                      >
                        আপনার রিসেট কোড দিয়ে নতুন পাসওয়ার্ড সেট করুন।
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleForgotReset} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.28 0.06 155)" }}
                      >
                        রিসেট কোড
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <KeyRound
                            className="w-4 h-4"
                            style={{ color: "oklch(0.60 0.06 240)" }}
                          />
                        </span>
                        <input
                          type="text"
                          value={resetCode}
                          onChange={(e) =>
                            setResetCode(e.target.value.toUpperCase())
                          }
                          placeholder="রিসেট কোড লিখুন"
                          required
                          data-ocid="admin.forgot.reset_code.input"
                          className="w-full h-12 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all font-mono tracking-widest"
                          style={{
                            borderColor: "oklch(0.88 0.04 240)",
                            background: "oklch(0.98 0.005 240)",
                            color: "oklch(0.20 0.06 240)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.55 0.16 78)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px oklch(0.55 0.16 78 / 0.15)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.88 0.04 240)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.28 0.06 155)" }}
                      >
                        নতুন পাসওয়ার্ড
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <LockKeyhole
                            className="w-4 h-4"
                            style={{ color: "oklch(0.60 0.06 240)" }}
                          />
                        </span>
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                          required
                          minLength={6}
                          data-ocid="admin.forgot.new_password.input"
                          className="w-full h-12 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all"
                          style={{
                            borderColor: "oklch(0.88 0.04 240)",
                            background: "oklch(0.98 0.005 240)",
                            color: "oklch(0.20 0.06 240)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.45 0.16 155)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px oklch(0.45 0.16 155 / 0.15)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.88 0.04 240)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5"
                          tabIndex={-1}
                        >
                          {showNewPw ? (
                            <EyeOff
                              className="w-4 h-4"
                              style={{ color: "oklch(0.60 0.06 240)" }}
                            />
                          ) : (
                            <Eye
                              className="w-4 h-4"
                              style={{ color: "oklch(0.60 0.06 240)" }}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.28 0.06 155)" }}
                      >
                        পাসওয়ার্ড নিশ্চিত করুন
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <LockKeyhole
                            className="w-4 h-4"
                            style={{ color: "oklch(0.60 0.06 240)" }}
                          />
                        </span>
                        <input
                          type={showConfirmPw ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                          required
                          data-ocid="admin.forgot.confirm_password.input"
                          className="w-full h-12 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all"
                          style={{
                            borderColor:
                              confirmPassword && confirmPassword !== newPassword
                                ? "oklch(0.55 0.18 27)"
                                : "oklch(0.88 0.04 240)",
                            background: "oklch(0.98 0.005 240)",
                            color: "oklch(0.20 0.06 240)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                              "oklch(0.45 0.16 155)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px oklch(0.45 0.16 155 / 0.15)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              confirmPassword && confirmPassword !== newPassword
                                ? "oklch(0.55 0.18 27)"
                                : "oklch(0.88 0.04 240)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5"
                          tabIndex={-1}
                        >
                          {showConfirmPw ? (
                            <EyeOff
                              className="w-4 h-4"
                              style={{ color: "oklch(0.60 0.06 240)" }}
                            />
                          ) : (
                            <Eye
                              className="w-4 h-4"
                              style={{ color: "oklch(0.60 0.06 240)" }}
                            />
                          )}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p
                          className="text-xs"
                          style={{ color: "oklch(0.50 0.16 27)" }}
                        >
                          পাসওয়ার্ড মিলছে না
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setView("login");
                          setResetCode("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="flex-1 h-12 rounded-xl font-semibold"
                        data-ocid="admin.forgot.back.button"
                      >
                        ← ফিরে যান
                      </Button>
                      <Button
                        type="submit"
                        disabled={isResetting}
                        className="flex-1 h-12 rounded-xl font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.42 0.16 155) 0%, oklch(0.36 0.14 165) 100%)",
                        }}
                        data-ocid="admin.forgot.submit_button"
                      >
                        {isResetting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            পরিবর্তন হচ্ছে...
                          </>
                        ) : (
                          "পাসওয়ার্ড পরিবর্তন করুন"
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ─── Reset Success ─── */}
              {view === "reset_success" && (
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.45 0.16 155), oklch(0.55 0.14 155))",
                    }}
                  >
                    <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "oklch(0.22 0.08 155)" }}
                  >
                    পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "oklch(0.52 0.04 240)" }}
                  >
                    এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।
                  </p>
                  <Button
                    onClick={() => {
                      setView("login");
                      setPassword("");
                    }}
                    className="w-full h-12 rounded-xl font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.42 0.16 155) 0%, oklch(0.36 0.14 165) 100%)",
                    }}
                    data-ocid="admin.reset_success.login.button"
                  >
                    লগইন পেজে যান
                  </Button>
                </motion.div>
              )}

              {/* Social proof */}
              {view === "login" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42 }}
                  className="mt-4 flex items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-1.5">
                    <Users
                      className="w-3 h-3"
                      style={{ color: "oklch(0.62 0.04 240)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.56 0.04 240)" }}
                    >
                      ১,২০০+ সক্রিয় ব্যবহারকারী
                    </p>
                  </div>
                  <div
                    className="w-px h-3"
                    style={{ background: "oklch(0.88 0.02 240)" }}
                  />
                  <div className="flex items-center gap-1.5">
                    <LockKeyhole
                      className="w-3 h-3"
                      style={{ color: "oklch(0.62 0.04 240)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.56 0.04 240)" }}
                    >
                      256-bit এনক্রিপশন
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Back to homepage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "oklch(0.52 0.06 240)" }}
            >
              ← হোমপেজে ফিরুন
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ===== LISTINGS MANAGEMENT =====
function ListingsManagement() {
  const { listings, create, update, remove, toggleFeatured } =
    useLocalListings();
  const [isSaving, setIsSaving] = useState(false);
  const [editListing, setEditListing] = useState<LandListing | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyListing: LandListing = {
    id: `listing-${Date.now()}`,
    title: "",
    description: "",
    division: "ঢাকা",
    district: "",
    upazila: "",
    address: "",
    area: 0,
    price: BigInt(0),
    pricePerDecimal: BigInt(0),
    landType: "vita",
    roadAccess: "paved",
    roadWidth: "",
    orientation: "",
    isFeatured: false,
    isVerified: false,
    verifiedBadge: "",
    sellerId: "admin",
    sellerName: "",
    sellerPhone: "",
    sellerWhatsapp: "",
    status: "active",
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  };

  const [form, setForm] = useState<LandListing>(emptyListing);

  // Cascading location dropdowns
  const adminAvailableDistricts = form.division
    ? getDistrictsForDivision(form.division)
    : [];
  const adminAvailableUpazilas = form.district
    ? getUpazilasForDistrict(form.district)
    : [];

  const openCreate = () => {
    setForm({
      ...emptyListing,
      id: `listing-${Date.now()}`,
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    });
    setEditListing(null);
    setShowForm(true);
  };

  const openEdit = (l: LandListing) => {
    setForm(l);
    setEditListing(l);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.district) {
      toast.error("শিরোনাম ও জেলা আবশ্যক");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      if (editListing) {
        update({ ...form, updatedAt: BigInt(Date.now() * 1_000_000) });
        toast.success("আপডেট হয়েছে");
      } else {
        create(form);
        toast.success("নতুন লিস্টিং যোগ করা হয়েছে");
      }
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`সংরক্ষণ ব্যর্থ: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    remove(id);
    toast.success("মুছে ফেলা হয়েছে");
  };

  return (
    <div>
      {/* Quick Add Banner */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.025 240) 0%, oklch(0.99 0.008 240) 100%)",
          border: "1px solid oklch(0.88 0.06 240)",
          borderLeft: "4px solid oklch(0.52 0.16 240)",
        }}
        data-ocid="admin.listings.quick_add.panel"
      >
        <div
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10"
          style={{ background: "oklch(0.52 0.16 240)" }}
        />
        <div className="flex items-center gap-4 flex-1 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.16 240), oklch(0.45 0.14 250))",
            }}
          >
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-foreground">জমির লিস্টিং যোগ করুন</h4>
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.52 0.16 240 / 0.12)",
                  color: "oklch(0.38 0.14 240)",
                  border: "1px solid oklch(0.52 0.16 240 / 0.22)",
                }}
              >
                {listings.length} টি আছে
              </motion.span>
            </div>
            <p className="text-xs text-muted-foreground">
              জমির শিরোনাম, অবস্থান, মূল্য, বিক্রেতার তথ্য এবং জমির বিবরণ যোগ করুন
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 shrink-0 rounded-xl font-bold shadow-md relative z-10"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.16 240), oklch(0.45 0.14 250))",
            color: "white",
          }}
          data-ocid="admin.listings.quick_add.primary_button"
        >
          <Plus className="w-4 h-4" />
          নতুন লিস্টিং যোগ করুন
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">
          লিস্টিং ব্যবস্থাপনা ({listings.length})
        </h3>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
        <Table data-ocid="admin.listings.table">
          <TableHeader>
            <TableRow>
              <TableHead>শিরোনাম</TableHead>
              <TableHead>অবস্থান</TableHead>
              <TableHead>মূল্য</TableHead>
              <TableHead>ধরন</TableHead>
              <TableHead>অবস্থা</TableHead>
              <TableHead>বৈশিষ্ট্য</TableHead>
              <TableHead>ক্রিয়া</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((l, i) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium text-sm max-w-xs">
                  <span className="line-clamp-1">{l.title}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {l.district}
                </TableCell>
                <TableCell className="text-sm font-semibold text-primary">
                  {formatBDT(l.price)}
                </TableCell>
                <TableCell className="text-sm">
                  {getLandTypeLabel(l.landType)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={l.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {getStatusLabel(l.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    data-ocid={`admin.listing.featured.toggle.${i + 1}`}
                    checked={l.isFeatured}
                    onCheckedChange={() => toggleFeatured(l.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.listing.edit_button.${i + 1}`}
                      onClick={() => openEdit(l)}
                      className="h-8 px-2.5 gap-1.5 text-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" /> এডিট
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.listing.delete_button.${i + 1}`}
                      onClick={() => handleDelete(l.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Listing Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl"
          data-ocid="admin.listings.dialog"
        >
          <FormDialogShell
            title={editListing ? "লিস্টিং সম্পাদনা" : "নতুন লিস্টিং যোগ করুন"}
            icon={MapPin}
            gradientFrom="oklch(0.48 0.16 240)"
            gradientTo="oklch(0.40 0.14 255)"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormSection label="মূল তথ্য" color="oklch(0.52 0.16 240)" />

              <div className="col-span-2 space-y-1.5">
                <FormLabel required>শিরোনাম</FormLabel>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="জমির শিরোনাম লিখুন"
                  className="h-11 rounded-xl border-border/70 focus-visible:ring-blue-500/30 focus-visible:border-blue-400"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <FormLabel>বিবরণ</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="resize-none rounded-xl border-border/70 focus-visible:ring-blue-500/30 focus-visible:border-blue-400"
                  placeholder="জমির বিস্তারিত বিবরণ লিখুন"
                />
              </div>

              <FormSection label="অবস্থান" color="oklch(0.52 0.16 240)" />

              <div className="space-y-1.5">
                <FormLabel required>বিভাগ</FormLabel>
                <Select
                  value={form.division}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      division: v,
                      district: "",
                      upazila: "",
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl border-border/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BD_DIVISIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <FormLabel required>জেলা</FormLabel>
                <Select
                  value={form.district}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, district: v, upazila: "" }))
                  }
                  disabled={adminAvailableDistricts.length === 0}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border/70">
                    <SelectValue placeholder="জেলা বেছে নিন" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminAvailableDistricts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <FormLabel>উপজেলা</FormLabel>
                <Select
                  value={form.upazila}
                  onValueChange={(v) => setForm((p) => ({ ...p, upazila: v }))}
                  disabled={adminAvailableUpazilas.length === 0}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border/70">
                    <SelectValue placeholder="উপজেলা বেছে নিন" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminAvailableUpazilas.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <FormLabel>ঠিকানা</FormLabel>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="সম্পূর্ণ ঠিকানা"
                />
              </div>

              <FormSection label="মূল্য ও পরিমাণ" color="oklch(0.52 0.16 240)" />

              <div className="space-y-1.5">
                <FormLabel>আয়তন (শতাংশ)</FormLabel>
                <Input
                  type="number"
                  value={form.area}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, area: Number(e.target.value) }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="যেমন: ১০"
                />
              </div>
              <div className="space-y-1.5">
                <FormLabel>মোট মূল্য (টাকা)</FormLabel>
                <Input
                  type="number"
                  value={Number(form.price)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      price: BigInt(Math.round(Number(e.target.value))),
                      pricePerDecimal:
                        p.area > 0
                          ? BigInt(Math.round(Number(e.target.value) / p.area))
                          : BigInt(0),
                    }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="যেমন: 5000000"
                />
              </div>

              <FormSection label="জমির বিবরণ" color="oklch(0.52 0.16 240)" />

              <div className="space-y-1.5">
                <FormLabel>জমির ধরন</FormLabel>
                <Select
                  value={form.landType}
                  onValueChange={(v) => setForm((p) => ({ ...p, landType: v }))}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vita">ভিটা</SelectItem>
                    <SelectItem value="nala">নালা</SelectItem>
                    <SelectItem value="samatal">সমতল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <FormLabel>রাস্তার ধরন</FormLabel>
                <Select
                  value={form.roadAccess}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, roadAccess: v }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl border-border/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paved">পিচ ঢালাই</SelectItem>
                    <SelectItem value="brick">ইটের রাস্তা</SelectItem>
                    <SelectItem value="none">রাস্তা নেই</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <FormLabel>রাস্তার প্রশস্ততা</FormLabel>
                <Input
                  value={form.roadWidth}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, roadWidth: e.target.value }))
                  }
                  placeholder="যেমন: ১৬ ফুট"
                  className="h-11 rounded-xl border-border/70"
                />
              </div>

              <FormSection label="বিক্রেতার তথ্য" color="oklch(0.52 0.16 240)" />

              <div className="space-y-1.5">
                <FormLabel>বিক্রেতার নাম</FormLabel>
                <Input
                  value={form.sellerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sellerName: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="বিক্রেতার পুরো নাম"
                />
              </div>
              <div className="space-y-1.5">
                <FormLabel>বিক্রেতার ফোন</FormLabel>
                <Input
                  value={form.sellerPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sellerPhone: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="০১XXXXXXXXX"
                />
              </div>

              <FormSection label="সেটিংস" color="oklch(0.52 0.16 240)" />

              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "oklch(0.97 0.01 240)",
                  border: "1px solid oklch(0.92 0.04 240)",
                }}
              >
                <div>
                  <div className="text-sm font-semibold text-foreground/80">
                    যাচাইকৃত
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Trust badge দেখাবে
                  </div>
                </div>
                <Switch
                  checked={form.isVerified}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isVerified: v }))
                  }
                />
              </div>
              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "oklch(0.97 0.01 240)",
                  border: "1px solid oklch(0.92 0.04 240)",
                }}
              >
                <div>
                  <div className="text-sm font-semibold text-foreground/80">
                    বৈশিষ্ট্যময়
                  </div>
                  <div className="text-xs text-muted-foreground">
                    হোমপেজে দেখাবে
                  </div>
                </div>
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isFeatured: v }))
                  }
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-xl h-11 px-6"
                data-ocid="admin.cancel_button"
              >
                বাতিল
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl h-11 px-8 font-bold text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.48 0.16 240), oklch(0.40 0.14 255))",
                }}
                data-ocid="admin.save_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  "সংরক্ষণ করুন"
                )}
              </Button>
            </DialogFooter>
          </FormDialogShell>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== LAWYERS MANAGEMENT =====
function LawyersManagement() {
  const { lawyers, create, update, remove } = useLocalLawyers();
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editLawyer, setEditLawyer] = useState<Lawyer | null>(null);

  const emptyLawyer: Lawyer = {
    id: `lawyer-${Date.now()}`,
    name: "",
    specialization: "",
    phone: "",
    email: "",
    location: "",
    consultationFee: BigInt(0),
    description: "",
    isAvailable: true,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  };
  const [form, setForm] = useState<Lawyer>(emptyLawyer);

  const openCreate = () => {
    setForm({
      ...emptyLawyer,
      id: `lawyer-${Date.now()}`,
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    });
    setEditLawyer(null);
    setShowForm(true);
  };

  const openEdit = (l: Lawyer) => {
    setForm(l);
    setEditLawyer(l);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error("নাম ও ফোন আবশ্যক");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      if (editLawyer) {
        update({ ...form, updatedAt: BigInt(Date.now() * 1_000_000) });
        toast.success("আপডেট হয়েছে");
      } else {
        create(form);
        toast.success("আইনজীবী যোগ করা হয়েছে");
      }
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`সংরক্ষণ ব্যর্থ: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Quick Add Banner */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.97 0.02 300) 0%, oklch(0.99 0.008 300) 100%)",
          border: "1px solid oklch(0.90 0.05 300)",
          borderLeft: "4px solid oklch(0.55 0.14 300)",
        }}
        data-ocid="admin.lawyers.quick_add.panel"
      >
        <div
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10"
          style={{ background: "oklch(0.55 0.14 300)" }}
        />
        <div className="flex items-center gap-4 flex-1 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.15 300), oklch(0.45 0.13 310))",
            }}
          >
            <Scale className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-foreground">আইনজীবী যোগ করুন</h4>
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.52 0.15 300 / 0.12)",
                  color: "oklch(0.38 0.12 300)",
                  border: "1px solid oklch(0.52 0.15 300 / 0.22)",
                }}
              >
                {lawyers.length} জন আছেন
              </motion.span>
            </div>
            <p className="text-xs text-muted-foreground">
              আইনজীবীর নাম, বিশেষজ্ঞতা, যোগাযোগ এবং পরামর্শ ফি যোগ করুন
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 shrink-0 rounded-xl font-bold shadow-md relative z-10"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.15 300), oklch(0.45 0.13 310))",
            color: "white",
          }}
          data-ocid="admin.lawyers.quick_add.primary_button"
        >
          <Plus className="w-4 h-4" />
          নতুন আইনজীবী যোগ করুন
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">
          আইনজীবী ব্যবস্থাপনা ({lawyers.length})
        </h3>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
        <Table data-ocid="admin.lawyers.table">
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>বিশেষজ্ঞতা</TableHead>
              <TableHead>ফোন</TableHead>
              <TableHead>ফি</TableHead>
              <TableHead>উপলব্ধ</TableHead>
              <TableHead>ক্রিয়া</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lawyers.map((l, i) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium text-sm">{l.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {l.specialization}
                </TableCell>
                <TableCell className="text-sm">{l.phone}</TableCell>
                <TableCell className="text-sm font-semibold text-primary">
                  {formatBDT(l.consultationFee)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs ${l.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"}`}
                  >
                    {l.isAvailable ? "হ্যাঁ" : "না"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.lawyer.edit_button.${i + 1}`}
                      onClick={() => openEdit(l)}
                      className="h-8 px-2.5 gap-1.5 text-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" /> এডিট
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        remove(l.id);
                        toast.success("মুছে ফেলা হয়েছে");
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl"
          data-ocid="admin.lawyers.dialog"
        >
          <FormDialogShell
            title={editLawyer ? "আইনজীবী সম্পাদনা" : "নতুন আইনজীবী যোগ করুন"}
            icon={Scale}
            gradientFrom="oklch(0.48 0.15 300)"
            gradientTo="oklch(0.40 0.13 315)"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormSection label="ব্যক্তিগত তথ্য" color="oklch(0.52 0.15 300)" />

              <div className="col-span-2 space-y-1.5">
                <FormLabel required>নাম</FormLabel>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="আইনজীবীর পুরো নাম"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <FormLabel>বিশেষজ্ঞতা</FormLabel>
                <Input
                  value={form.specialization}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, specialization: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="যেমন: ভূমি আইন, দলিল"
                />
              </div>

              <FormSection label="যোগাযোগ" color="oklch(0.52 0.15 300)" />

              <div className="space-y-1.5">
                <FormLabel required>ফোন</FormLabel>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="০১XXXXXXXXX"
                />
              </div>
              <div className="space-y-1.5">
                <FormLabel>ইমেইল</FormLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="email@example.com"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <FormLabel>অবস্থান</FormLabel>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="চেম্বার ঠিকানা"
                />
              </div>

              <FormSection label="পেশাদার তথ্য" color="oklch(0.52 0.15 300)" />

              <div className="space-y-1.5">
                <FormLabel>পরামর্শ ফি (টাকা)</FormLabel>
                <Input
                  type="number"
                  value={Number(form.consultationFee)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      consultationFee: BigInt(
                        Math.round(Number(e.target.value)),
                      ),
                    }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="পরামর্শ ফি"
                />
              </div>
              <div
                className="flex items-center justify-between p-3 rounded-xl self-end"
                style={{
                  background: "oklch(0.97 0.01 300)",
                  border: "1px solid oklch(0.92 0.04 300)",
                }}
              >
                <div>
                  <div className="text-sm font-semibold text-foreground/80">
                    উপলব্ধ
                  </div>
                  <div className="text-xs text-muted-foreground">
                    এখন পরামর্শ দিতে পারবেন
                  </div>
                </div>
                <Switch
                  checked={form.isAvailable}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isAvailable: v }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <FormLabel>বিবরণ</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="resize-none rounded-xl border-border/70"
                  placeholder="আইনজীবী সম্পর্কে সংক্ষিপ্ত বিবরণ"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-xl h-11 px-6"
                data-ocid="admin.lawyers.cancel_button"
              >
                বাতিল
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl h-11 px-8 font-bold text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.48 0.15 300), oklch(0.40 0.13 315))",
                }}
                data-ocid="admin.lawyers.save_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  "সংরক্ষণ করুন"
                )}
              </Button>
            </DialogFooter>
          </FormDialogShell>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== NEWS MANAGEMENT =====
function NewsManagement() {
  const { news, create, update, remove } = useLocalNews();
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editArticle, setEditArticle] = useState<NewsArticle | null>(null);

  const emptyArticle: NewsArticle = {
    id: `news-${Date.now()}`,
    title: "",
    content: "",
    category: "আইন",
    isPublished: false,
    publishedAt: BigInt(Date.now() * 1_000_000),
    author: "",
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  };
  const [form, setForm] = useState<NewsArticle>(emptyArticle);

  const openCreate = () => {
    setForm({
      ...emptyArticle,
      id: `news-${Date.now()}`,
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    });
    setEditArticle(null);
    setShowForm(true);
  };

  const openEdit = (a: NewsArticle) => {
    setForm(a);
    setEditArticle(a);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("শিরোনাম ও বিষয়বস্তু আবশ্যক");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      if (editArticle) {
        update({ ...form, updatedAt: BigInt(Date.now() * 1_000_000) });
        toast.success("আপডেট হয়েছে");
      } else {
        create(form);
        toast.success("সংবাদ প্রকাশিত হয়েছে");
      }
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`সংরক্ষণ ব্যর্থ: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Quick Add Banner */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.98 0.03 78) 0%, oklch(0.99 0.01 78) 100%)",
          border: "1px solid oklch(0.92 0.06 78)",
          borderLeft: "4px solid oklch(0.65 0.18 78)",
        }}
        data-ocid="admin.news.quick_add.panel"
      >
        <div
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10"
          style={{ background: "oklch(0.65 0.18 78)" }}
        />
        <div className="flex items-center gap-4 flex-1 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.18 78), oklch(0.55 0.16 68))",
            }}
          >
            <Newspaper className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-foreground">সংবাদ প্রকাশ করুন</h4>
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.62 0.18 78 / 0.12)",
                  color: "oklch(0.45 0.14 78)",
                  border: "1px solid oklch(0.62 0.18 78 / 0.22)",
                }}
              >
                {news.length} টি আছে
              </motion.span>
            </div>
            <p className="text-xs text-muted-foreground">
              জমি সংক্রান্ত আইন, বাজারদর, সরকারি প্রজ্ঞাপন ও সর্বশেষ সংবাদ প্রকাশ করুন
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 shrink-0 rounded-xl font-bold shadow-md relative z-10"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.60 0.18 78), oklch(0.52 0.16 68))",
            color: "white",
          }}
          data-ocid="admin.news.quick_add.primary_button"
        >
          <Plus className="w-4 h-4" />
          নতুন সংবাদ যোগ করুন
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">
          সংবাদ ব্যবস্থাপনা ({news.length})
        </h3>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
        <Table data-ocid="admin.news.table">
          <TableHeader>
            <TableRow>
              <TableHead>শিরোনাম</TableHead>
              <TableHead>বিভাগ</TableHead>
              <TableHead>লেখক</TableHead>
              <TableHead>প্রকাশিত</TableHead>
              <TableHead>ক্রিয়া</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((a, i) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-sm max-w-xs">
                  <span className="line-clamp-1">{a.title}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {a.category}
                </TableCell>
                <TableCell className="text-sm">{a.author}</TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs ${a.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                  >
                    {a.isPublished ? "হ্যাঁ" : "না"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.news.edit_button.${i + 1}`}
                      onClick={() => openEdit(a)}
                      className="h-8 px-2.5 gap-1.5 text-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" /> এডিট
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        remove(a.id);
                        toast.success("মুছে ফেলা হয়েছে");
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl"
          data-ocid="admin.news.dialog"
        >
          <FormDialogShell
            title={editArticle ? "সংবাদ সম্পাদনা" : "নতুন সংবাদ প্রকাশ করুন"}
            icon={Newspaper}
            gradientFrom="oklch(0.56 0.18 78)"
            gradientTo="oklch(0.48 0.16 68)"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormSection label="বিষয়বস্তু" color="oklch(0.62 0.18 78)" />

              <div className="col-span-2 space-y-1.5">
                <FormLabel required>শিরোনাম</FormLabel>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="সংবাদের শিরোনাম লিখুন"
                />
              </div>
              <div className="space-y-1.5">
                <FormLabel>বিভাগ</FormLabel>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="আইন">আইন</SelectItem>
                    <SelectItem value="বাজারদর">বাজারদর</SelectItem>
                    <SelectItem value="সরকারি প্রজ্ঞাপন">সরকারি প্রজ্ঞাপন</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <FormLabel>লেখক</FormLabel>
                <Input
                  value={form.author}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, author: e.target.value }))
                  }
                  className="h-11 rounded-xl border-border/70"
                  placeholder="লেখকের নাম"
                />
              </div>

              <FormSection label="প্রকাশনা" color="oklch(0.62 0.18 78)" />

              <div className="col-span-2 space-y-1.5">
                <FormLabel required>বিষয়বস্তু</FormLabel>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                  rows={8}
                  className="resize-none rounded-xl border-border/70"
                  placeholder="সংবাদের বিস্তারিত বিষয়বস্তু লিখুন..."
                  data-ocid="admin.news.editor"
                />
              </div>
              <div
                className="col-span-2 flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: "oklch(0.98 0.02 78)",
                  border: "1px solid oklch(0.92 0.06 78)",
                }}
              >
                <div>
                  <div className="text-sm font-bold text-foreground/80">
                    এখনই প্রকাশ করুন
                  </div>
                  <div className="text-xs text-muted-foreground">
                    চালু করলে হোমপেজের নিউজফিডে দেখাবে
                  </div>
                </div>
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      isPublished: v,
                      publishedAt: v
                        ? BigInt(Date.now() * 1_000_000)
                        : p.publishedAt,
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-xl h-11 px-6"
                data-ocid="admin.news.cancel_button"
              >
                বাতিল
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl h-11 px-8 font-bold text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.56 0.18 78), oklch(0.48 0.16 68))",
                }}
                data-ocid="admin.news.save_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  "সংরক্ষণ করুন"
                )}
              </Button>
            </DialogFooter>
          </FormDialogShell>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== SITE SETTINGS MANAGEMENT =====
function SiteSettingsManagement() {
  const { settings, updateSettings, resetToDefaults } = useSiteSettings();
  // Stable keys for fixed-size array items (these arrays never change length)
  const STAT_KEYS = [
    "stat-active",
    "stat-verified",
    "stat-transactions",
    "stat-users",
  ] as const;
  const FEATURE_KEYS = [
    "feat-contact",
    "feat-verified",
    "feat-legal",
    "feat-vault",
  ] as const;
  const STEP_KEYS = ["step-01", "step-02", "step-03"] as const;

  const [local, setLocal] = useState<SiteSettings>(() => ({
    ...settings,
    stats: settings.stats.map((s) => ({ ...s })),
    features: settings.features.map((f) => ({ ...f })),
    howItWorksSteps: settings.howItWorksSteps.map((s) => ({ ...s })),
  }));

  const handleSave = () => {
    updateSettings(local);
    toast.success("সাইট সেটিংস সংরক্ষিত হয়েছে");
  };

  const handleReset = () => {
    resetToDefaults();
    toast.success("ডিফল্ট সেটিংস পুনরুদ্ধার হয়েছে");
  };

  return (
    <div className="space-y-6">
      {/* Live preview notice */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-xl p-4"
        style={{
          background: "oklch(0.96 0.02 280)",
          border: "1px solid oklch(0.88 0.06 280)",
          borderLeft: "4px solid oklch(0.50 0.16 280)",
        }}
      >
        <Eye
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: "oklch(0.50 0.16 280)" }}
        />
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.30 0.12 280)" }}
          >
            লাইভ প্রিভিউ
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.42 0.08 280)" }}
          >
            পরিবর্তনগুলি সংরক্ষণ করলে হোমপেজে তাৎক্ষণিকভাবে প্রতিফলিত হবে।
          </p>
        </div>
      </motion.div>

      {/* Section 1: Hero */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.98 0.005 280)",
          border: "1px solid oklch(0.92 0.04 280)",
        }}
      >
        <FormSection label="হিরো সেকশন" color="oklch(0.50 0.16 280)" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <FormLabel>সাইটের ট্যাগলাইন</FormLabel>
            <Input
              value={local.siteTagline}
              onChange={(e) =>
                setLocal((p) => ({ ...p, siteTagline: e.target.value }))
              }
              className="h-11 rounded-xl border-border/70"
              placeholder="সাইটের ট্যাগলাইন"
              data-ocid="admin.settings.tagline.input"
            />
          </div>
          <div className="space-y-1.5">
            <FormLabel>হিরো শিরোনাম</FormLabel>
            <Input
              value={local.heroTitle}
              onChange={(e) =>
                setLocal((p) => ({ ...p, heroTitle: e.target.value }))
              }
              className="h-11 rounded-xl border-border/70"
              placeholder="হিরো শিরোনাম"
              data-ocid="admin.settings.hero_title.input"
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <FormLabel>হিরো সাবটাইটেল</FormLabel>
            <Textarea
              value={local.heroSubtitle}
              onChange={(e) =>
                setLocal((p) => ({ ...p, heroSubtitle: e.target.value }))
              }
              rows={3}
              className="resize-none rounded-xl border-border/70"
              placeholder="হিরো সাবটাইটেল..."
              data-ocid="admin.settings.hero_subtitle.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <FormLabel>CTA বাটনের লেখা</FormLabel>
            <Input
              value={local.heroCtaText}
              onChange={(e) =>
                setLocal((p) => ({ ...p, heroCtaText: e.target.value }))
              }
              className="h-11 rounded-xl border-border/70"
              placeholder="CTA বাটনের লেখা"
              data-ocid="admin.settings.hero_cta.input"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Stats */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.98 0.005 240)",
          border: "1px solid oklch(0.92 0.04 240)",
        }}
      >
        <FormSection label="পরিসংখ্যান (৪টি)" color="oklch(0.52 0.16 240)" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {local.stats.map((stat, idx) => (
            <div
              key={STAT_KEYS[idx]}
              className="rounded-xl p-3 space-y-2"
              style={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.91 0.03 240)",
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "oklch(0.52 0.16 240)" }}
              >
                পরিসংখ্যান {idx + 1}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    সংখ্যা/মান
                  </Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => {
                      const updated = local.stats.map((s, i) =>
                        i === idx ? { ...s, value: e.target.value } : s,
                      );
                      setLocal((p) => ({ ...p, stats: updated }));
                    }}
                    className="h-9 rounded-lg text-sm border-border/70"
                    placeholder="যেমন: ৫০০+"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">লেবেল</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => {
                      const updated = local.stats.map((s, i) =>
                        i === idx ? { ...s, label: e.target.value } : s,
                      );
                      setLocal((p) => ({ ...p, stats: updated }));
                    }}
                    className="h-9 rounded-lg text-sm border-border/70"
                    placeholder="যেমন: সক্রিয় জমি"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Features */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.98 0.005 300)",
          border: "1px solid oklch(0.92 0.04 300)",
        }}
      >
        <FormSection label="ফিচার কার্ড (৪টি)" color="oklch(0.52 0.15 300)" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {local.features.map((feat, idx) => (
            <div
              key={FEATURE_KEYS[idx]}
              className="rounded-xl p-3 space-y-2"
              style={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.91 0.03 300)",
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "oklch(0.52 0.15 300)" }}
              >
                ফিচার {idx + 1}
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    শিরোনাম
                  </Label>
                  <Input
                    value={feat.title}
                    onChange={(e) => {
                      const updated = local.features.map((f, i) =>
                        i === idx ? { ...f, title: e.target.value } : f,
                      );
                      setLocal((p) => ({ ...p, features: updated }));
                    }}
                    className="h-9 rounded-lg text-sm border-border/70"
                    placeholder="ফিচারের শিরোনাম"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">বিবরণ</Label>
                  <Input
                    value={feat.desc}
                    onChange={(e) => {
                      const updated = local.features.map((f, i) =>
                        i === idx ? { ...f, desc: e.target.value } : f,
                      );
                      setLocal((p) => ({ ...p, features: updated }));
                    }}
                    className="h-9 rounded-lg text-sm border-border/70"
                    placeholder="ফিচারের বিবরণ"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: How it works */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.98 0.005 155)",
          border: "1px solid oklch(0.92 0.04 155)",
        }}
      >
        <FormSection label="কীভাবে কাজ করে (৩ ধাপ)" color="oklch(0.55 0.16 155)" />

        <div className="grid grid-cols-1 gap-4 pt-2">
          {local.howItWorksSteps.map((step, idx) => (
            <div
              key={STEP_KEYS[idx]}
              className="rounded-xl p-3 space-y-2"
              style={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.91 0.03 155)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "oklch(0.55 0.16 155)" }}
                >
                  ধাপ {step.step}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    শিরোনাম
                  </Label>
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const updated = local.howItWorksSteps.map((s, i) =>
                        i === idx ? { ...s, title: e.target.value } : s,
                      );
                      setLocal((p) => ({ ...p, howItWorksSteps: updated }));
                    }}
                    className="h-9 rounded-lg text-sm border-border/70"
                    placeholder="ধাপের শিরোনাম"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">বিবরণ</Label>
                  <Input
                    value={step.desc}
                    onChange={(e) => {
                      const updated = local.howItWorksSteps.map((s, i) =>
                        i === idx ? { ...s, desc: e.target.value } : s,
                      );
                      setLocal((p) => ({ ...p, howItWorksSteps: updated }));
                    }}
                    className="h-9 rounded-lg text-sm border-border/70"
                    placeholder="ধাপের বিবরণ"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Other */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.98 0.01 78)",
          border: "1px solid oklch(0.92 0.06 78)",
        }}
      >
        <FormSection label="অন্যান্য" color="oklch(0.62 0.18 78)" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "oklch(1 0 0)",
              border: "1px solid oklch(0.91 0.05 78)",
            }}
          >
            <div>
              <div className="text-sm font-semibold text-foreground/80">
                জনপ্রিয় এলাকা সেকশন দেখান
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                হোমপেজে "জনপ্রিয় এলাকা" গ্রিড দেখাবে
              </div>
            </div>
            <Switch
              checked={local.showPopularAreas}
              onCheckedChange={(v) =>
                setLocal((p) => ({ ...p, showPopularAreas: v }))
              }
              data-ocid="admin.settings.popular_areas.switch"
            />
          </div>

          <div className="space-y-1.5">
            <FormLabel>ফুটার কপিরাইট লেখা</FormLabel>
            <Input
              value={local.footerCopyright}
              onChange={(e) =>
                setLocal((p) => ({ ...p, footerCopyright: e.target.value }))
              }
              className="h-11 rounded-xl border-border/70"
              placeholder="জমিবাজার। সর্বস্বত্ব সংরক্ষিত।"
              data-ocid="admin.settings.footer_copyright.input"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2 rounded-xl h-11 font-medium"
          data-ocid="admin.settings.reset.button"
        >
          <RotateCcw className="w-4 h-4" />
          ডিফল্টে ফিরুন
        </Button>
        <Button
          onClick={handleSave}
          className="gap-2 rounded-xl h-11 font-bold text-white shadow-md flex-1 sm:flex-none sm:px-8"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.46 0.16 280) 0%, oklch(0.38 0.14 295) 100%)",
            boxShadow: "0 4px 16px oklch(0.46 0.16 280 / 0.30)",
          }}
          data-ocid="admin.settings.save.submit_button"
        >
          <Palette className="w-4 h-4" />
          সেটিংস সংরক্ষণ করুন
        </Button>
      </div>
    </div>
  );
}

// ===== ACCOUNT / CHANGE PASSWORD MANAGEMENT =====
function AccountManagement() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const creds = getAdminCredentials();
    if (currentPw !== creds.password) {
      toast.error("বর্তমান পাসওয়ার্ড সঠিক নয়");
      return;
    }
    if (newPw.length < 6) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("নতুন পাসওয়ার্ড মিলছে না");
      return;
    }
    if (newPw === currentPw) {
      toast.error("নতুন পাসওয়ার্ড আগেরটির মতো হতে পারবে না");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    saveAdminCredentials(creds.username, newPw);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setIsSaving(false);
    toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে");
  };

  const inputStyle = {
    borderColor: "oklch(0.88 0.04 240)",
    background: "oklch(0.98 0.005 240)",
    color: "oklch(0.20 0.06 240)",
  };
  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "oklch(0.45 0.16 155)";
    e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.45 0.16 155 / 0.15)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "oklch(0.88 0.04 240)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="max-w-lg">
      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.97 0.02 155) 0%, oklch(0.99 0.01 155) 100%)",
          border: "1px solid oklch(0.90 0.05 155)",
          borderLeft: "4px solid oklch(0.45 0.16 155)",
        }}
      >
        <div
          className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-10"
          style={{ background: "oklch(0.45 0.16 155)" }}
        />
        <div className="flex items-start gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.16 155), oklch(0.38 0.14 165))",
            }}
          >
            <LockKeyhole className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4
              className="font-bold text-sm mb-0.5"
              style={{ color: "oklch(0.22 0.08 155)" }}
            >
              পাসওয়ার্ড পরিবর্তন
            </h4>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "oklch(0.45 0.08 155)" }}
            >
              নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড পরিবর্তন করুন। ডিফল্ট রিসেট কোড:{" "}
              <strong>JOMI2024</strong>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Change password form */}
      <motion.form
        onSubmit={handleChangePassword}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-5"
      >
        <FormSection label="বর্তমান পাসওয়ার্ড" color="oklch(0.52 0.16 240)" />

        <div className="space-y-1.5">
          <FormLabel required>বর্তমান পাসওয়ার্ড</FormLabel>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <LockKeyhole
                className="w-4 h-4"
                style={{ color: "oklch(0.60 0.06 240)" }}
              />
            </span>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড লিখুন"
              required
              data-ocid="admin.account.current_password.input"
              className="w-full h-12 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5"
              tabIndex={-1}
            >
              {showCurrent ? (
                <EyeOff
                  className="w-4 h-4"
                  style={{ color: "oklch(0.60 0.06 240)" }}
                />
              ) : (
                <Eye
                  className="w-4 h-4"
                  style={{ color: "oklch(0.60 0.06 240)" }}
                />
              )}
            </button>
          </div>
        </div>

        <FormSection label="নতুন পাসওয়ার্ড" color="oklch(0.45 0.16 155)" />

        <div className="space-y-1.5">
          <FormLabel required>নতুন পাসওয়ার্ড</FormLabel>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <KeyRound
                className="w-4 h-4"
                style={{ color: "oklch(0.60 0.06 240)" }}
              />
            </span>
            <input
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
              required
              minLength={6}
              data-ocid="admin.account.new_password.input"
              className="w-full h-12 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5"
              tabIndex={-1}
            >
              {showNew ? (
                <EyeOff
                  className="w-4 h-4"
                  style={{ color: "oklch(0.60 0.06 240)" }}
                />
              ) : (
                <Eye
                  className="w-4 h-4"
                  style={{ color: "oklch(0.60 0.06 240)" }}
                />
              )}
            </button>
          </div>
          {/* Password strength hint */}
          {newPw.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {(["s1", "s2", "s3", "s4"] as const).map((key, i) => (
                <div
                  key={key}
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{
                    background:
                      i < Math.min(Math.floor(newPw.length / 3), 4)
                        ? newPw.length < 6
                          ? "oklch(0.55 0.18 27)"
                          : newPw.length < 10
                            ? "oklch(0.65 0.18 78)"
                            : "oklch(0.55 0.16 155)"
                        : "oklch(0.92 0.02 240)",
                  }}
                />
              ))}
              <span
                className="text-xs"
                style={{ color: "oklch(0.55 0.04 240)" }}
              >
                {newPw.length < 6
                  ? "দুর্বল"
                  : newPw.length < 10
                    ? "মাঝারি"
                    : "শক্তিশালী"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <FormLabel required>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <LockKeyhole
                className="w-4 h-4"
                style={{ color: "oklch(0.60 0.06 240)" }}
              />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="পাসওয়ার্ড পুনরায় লিখুন"
              required
              data-ocid="admin.account.confirm_password.input"
              className="w-full h-12 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all"
              style={{
                ...inputStyle,
                borderColor:
                  confirmPw && confirmPw !== newPw
                    ? "oklch(0.55 0.18 27)"
                    : confirmPw && confirmPw === newPw
                      ? "oklch(0.55 0.16 155)"
                      : "oklch(0.88 0.04 240)",
              }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff
                  className="w-4 h-4"
                  style={{ color: "oklch(0.60 0.06 240)" }}
                />
              ) : (
                <Eye
                  className="w-4 h-4"
                  style={{ color: "oklch(0.60 0.06 240)" }}
                />
              )}
            </button>
          </div>
          {confirmPw && confirmPw !== newPw && (
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: "oklch(0.50 0.16 27)" }}
            >
              <AlertTriangle className="w-3 h-3" /> পাসওয়ার্ড মিলছে না
            </p>
          )}
          {confirmPw && confirmPw === newPw && newPw.length >= 6 && (
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: "oklch(0.45 0.16 155)" }}
            >
              <Check className="w-3 h-3" strokeWidth={3} /> পাসওয়ার্ড মিলেছে
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full h-12 rounded-xl font-bold text-white shadow-md mt-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.16 155) 0%, oklch(0.36 0.14 165) 100%)",
            boxShadow: "0 4px 16px oklch(0.42 0.16 155 / 0.30)",
          }}
          data-ocid="admin.account.change_password.submit_button"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              পরিবর্তন হচ্ছে...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" />
              পাসওয়ার্ড পরিবর্তন করুন
            </>
          )}
        </Button>
      </motion.form>
    </div>
  );
}

export function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const { listings } = useLocalListings();
  const { lawyers } = useLocalLawyers();
  const { news } = useLocalNews();
  const { registrations } = useLocalRegistrations();
  const [activeTab, setActiveTab] = useState("listings");

  if (!isAdminLoggedIn)
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;

  const profileInitials = "AD";

  const dashStats = [
    {
      label: "মোট লিস্টিং",
      value: listings.length,
      icon: MapPin,
      color: "bg-blue-50 text-blue-700",
      borderColor: "oklch(0.55 0.14 240)",
    },
    {
      label: "আইনজীবী",
      value: lawyers.length,
      icon: Scale,
      color: "bg-purple-50 text-purple-700",
      borderColor: "oklch(0.55 0.14 300)",
    },
    {
      label: "সংবাদ",
      value: news.length,
      icon: Newspaper,
      color: "bg-amber-50 text-amber-700",
      borderColor: "oklch(0.65 0.18 78)",
    },
    {
      label: "প্রকাশিত সংবাদ",
      value: news.filter((n) => n.isPublished).length,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
      borderColor: "oklch(0.55 0.16 155)",
    },
    {
      label: "নিবন্ধিত ব্যবহারকারী",
      value: registrations.length,
      icon: UserCheck,
      color: "bg-teal-50 text-teal-700",
      borderColor: "oklch(0.55 0.14 185)",
    },
  ];

  return (
    <div>
      {/* ── Gradient Admin Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 155) 0%, oklch(0.28 0.1 155) 50%, oklch(0.24 0.09 165) 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Decorative circle */}
        <div
          className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: "oklch(0.88 0.16 78)" }}
        />

        <div className="relative z-10 container max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-1.5 mb-2"
            style={{ color: "oklch(1 0 0 / 0.40)" }}
          >
            <Home className="w-3 h-3" />
            <span className="text-xs">হোম</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-xs" style={{ color: "oklch(1 0 0 / 0.65)" }}>
              অ্যাডমিন প্যানেল
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(1 0 0 / 0.12)" }}
              >
                <ShieldCheck
                  className="w-5 h-5"
                  style={{ color: "oklch(0.88 0.16 78)" }}
                />
              </div>
              <div>
                <h1
                  className="text-xl font-extrabold leading-tight"
                  style={{
                    fontFamily: "'Bricolage Grotesque', system-ui",
                    color: "oklch(0.97 0.01 120)",
                  }}
                >
                  অ্যাডমিন প্যানেল
                </h1>
                <p className="text-xs" style={{ color: "oklch(1 0 0 / 0.5)" }}>
                  জমিবাজার ব্যবস্থাপনা কেন্দ্র
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Session active badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "oklch(0.45 0.16 155 / 0.2)",
                  color: "oklch(0.75 0.15 155)",
                  border: "1px solid oklch(0.45 0.16 155 / 0.3)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.70 0.18 155)" }}
                />
                সেশন সক্রিয়
              </div>

              {/* Identity badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "oklch(1 0 0 / 0.08)" }}
              >
                {/* Profile avatar with initials */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "oklch(0.88 0.16 78 / 0.25)",
                    color: "oklch(0.88 0.16 78)",
                    border: "1px solid oklch(0.88 0.16 78 / 0.3)",
                  }}
                >
                  {profileInitials}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(1 0 0 / 0.65)" }}
                >
                  admin
                </span>
              </div>

              {/* Logout button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdminLoggedIn(false)}
                data-ocid="admin.header.logout_button"
                className="gap-1.5 text-xs border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
                style={{
                  color: "oklch(1 0 0 / 0.75)",
                  background: "oklch(1 0 0 / 0.06)",
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                লগআউট
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Section sub-header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground">
            সকল লিস্টিং, আইনজীবী এবং সংবাদ এখান থেকে পরিচালনা করুন
          </p>
        </motion.div>

        {/* Dashboard stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {dashStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-border p-4 shadow-card overflow-hidden relative"
              style={{ borderTop: `3px solid ${stat.borderColor}` }}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-heading font-bold text-foreground">
                  {stat.value}
                </div>
                <TrendingUp className="w-3.5 h-3.5 mb-1.5 text-emerald-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">দ্রুত কাজ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("listings")}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
              data-ocid="admin.quickaction.listings.button"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  জমির লিস্টিং
                </div>
                <div className="text-xs text-muted-foreground">
                  নতুন জমি যোগ করুন
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lawyers")}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group"
              data-ocid="admin.quickaction.lawyers.button"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Scale className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  আইনজীবী
                </div>
                <div className="text-xs text-muted-foreground">
                  নতুন আইনজীবী যোগ করুন
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("news")}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white hover:border-amber-300 hover:bg-amber-50/50 transition-all text-left group"
              data-ocid="admin.quickaction.news.button"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <Newspaper className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">সংবাদ</div>
                <div className="text-xs text-muted-foreground">
                  নতুন সংবাদ প্রকাশ করুন
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("registrations")}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left group"
              data-ocid="admin.quickaction.registrations.button"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <UserCheck className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  রেজিস্ট্রেশন
                </div>
                <div className="text-xs text-muted-foreground">
                  {registrations.length} জন নিবন্ধিত
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Management tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger
              value="listings"
              data-ocid="admin.listings.tab"
              className="gap-1.5"
            >
              <MapPin className="w-4 h-4" /> লিস্টিং
            </TabsTrigger>
            <TabsTrigger
              value="lawyers"
              data-ocid="admin.lawyers.tab"
              className="gap-1.5"
            >
              <Scale className="w-4 h-4" /> আইনজীবী
            </TabsTrigger>
            <TabsTrigger
              value="news"
              data-ocid="admin.news.tab"
              className="gap-1.5"
            >
              <Newspaper className="w-4 h-4" /> সংবাদ
            </TabsTrigger>
            <TabsTrigger
              value="compare"
              data-ocid="admin.compare.tab"
              className="gap-1.5"
            >
              <BarChart2 className="w-4 h-4" /> তুলনা করুন
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              data-ocid="admin.settings.tab"
              className="gap-1.5"
            >
              <Palette className="w-4 h-4" /> সাইট সেটিংস
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              data-ocid="admin.registrations.tab"
              className="gap-1.5"
            >
              <UserCheck className="w-4 h-4" /> রেজিস্ট্রেশন
              {registrations.length > 0 && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: "oklch(0.55 0.14 185 / 0.15)",
                    color: "oklch(0.40 0.12 185)",
                  }}
                >
                  {registrations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="account"
              data-ocid="admin.account.tab"
              className="gap-1.5"
            >
              <Settings className="w-4 h-4" /> অ্যাকাউন্ট
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <ListingsManagement />
          </TabsContent>
          <TabsContent value="lawyers">
            <LawyersManagement />
          </TabsContent>
          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>
          <TabsContent value="compare">
            <CompareManagement />
          </TabsContent>
          <TabsContent value="registrations">
            <RegistrationsManagement />
          </TabsContent>
          <TabsContent value="settings">
            <SiteSettingsManagement />
          </TabsContent>
          <TabsContent value="account">
            <AccountManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ===== REGISTRATIONS MANAGEMENT =====
function RegistrationsManagement() {
  const { registrations, removeRegistration } = useLocalRegistrations();
  const [filterRole, setFilterRole] = useState<"all" | "seller" | "buyer">(
    "all",
  );
  const [search, setSearch] = useState("");

  const filtered = registrations.filter((r) => {
    const matchRole = filterRole === "all" || r.role === filterRole;
    const matchSearch =
      search === "" ||
      r.name.includes(search) ||
      r.phone.includes(search) ||
      r.email.includes(search) ||
      r.location.includes(search);
    return matchRole && matchSearch;
  });

  const sellerCount = registrations.filter((r) => r.role === "seller").length;
  const buyerCount = registrations.filter((r) => r.role === "buyer").length;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      {/* Header banner */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.025 185) 0%, oklch(0.99 0.008 185) 100%)",
          border: "1px solid oklch(0.88 0.06 185)",
          borderLeft: "4px solid oklch(0.52 0.14 185)",
        }}
        data-ocid="admin.registrations.panel"
      >
        <div
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10"
          style={{ background: "oklch(0.52 0.14 185)" }}
        />
        <div className="flex items-center gap-4 flex-1 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.14 185), oklch(0.43 0.12 195))",
            }}
          >
            <UserCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-foreground">নিবন্ধিত ব্যবহারকারী</h4>
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.50 0.14 185 / 0.12)",
                  color: "oklch(0.35 0.10 185)",
                  border: "1px solid oklch(0.50 0.14 185 / 0.22)",
                }}
              >
                {registrations.length} জন
              </motion.span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" /> বিক্রয়দাতা: {sellerCount}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Home className="w-3 h-3" /> ক্রয়গ্রহিতা: {buyerCount}
              </span>
            </div>
          </div>
        </div>

        {/* Registration page link */}
        <Link
          to="/register"
          className="shrink-0 relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white shadow-md transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.50 0.14 185), oklch(0.43 0.12 195))",
          }}
          data-ocid="admin.registrations.register_link"
        >
          <ArrowRight className="w-4 h-4" />
          রেজিস্ট্রেশন পেজ
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-2">
          {(
            [
              { val: "all", label: "সবাই" },
              { val: "seller", label: "বিক্রয়দাতা" },
              { val: "buyer", label: "ক্রয়গ্রহিতা" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setFilterRole(opt.val)}
              data-ocid={`admin.registrations.filter.${opt.val}.button`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{
                background:
                  filterRole === opt.val
                    ? "oklch(0.50 0.14 185)"
                    : "oklch(1 0 0)",
                color:
                  filterRole === opt.val ? "white" : "oklch(0.45 0.04 240)",
                borderColor:
                  filterRole === opt.val
                    ? "oklch(0.50 0.14 185)"
                    : "oklch(0.88 0.04 240)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="নাম, ফোন বা এলাকা দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="admin.registrations.search.input"
          className="flex-1 h-9 px-3 rounded-lg border text-sm outline-none transition-all"
          style={{
            borderColor: "oklch(0.88 0.04 240)",
            background: "oklch(0.98 0.005 240)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "oklch(0.50 0.14 185)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px oklch(0.50 0.14 185 / 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "oklch(0.88 0.04 240)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
        {filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="admin.registrations.empty_state"
          >
            <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-15" />
            <p className="font-medium">
              {registrations.length === 0
                ? "এখনো কোনো রেজিস্ট্রেশন নেই"
                : "কোনো ফলাফল পাওয়া যায়নি"}
            </p>
            {registrations.length === 0 && (
              <p className="text-sm mt-1">
                ব্যবহারকারীরা রেজিস্ট্রেশন করলে এখানে দেখাবে।
              </p>
            )}
          </div>
        ) : (
          <Table data-ocid="admin.registrations.table">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>নাম</TableHead>
                <TableHead>ভূমিকা</TableHead>
                <TableHead>মোবাইল</TableHead>
                <TableHead>ইমেইল</TableHead>
                <TableHead>এলাকা</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead>ক্রিয়া</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, i) => (
                <TableRow
                  key={r.id}
                  data-ocid={`admin.registrations.row.${i + 1}`}
                >
                  <TableCell className="text-muted-foreground text-sm">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background:
                            r.role === "seller"
                              ? "oklch(0.32 0.11 155 / 0.12)"
                              : "oklch(0.72 0.16 78 / 0.12)",
                          color:
                            r.role === "seller"
                              ? "oklch(0.32 0.11 155)"
                              : "oklch(0.55 0.14 78)",
                        }}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{r.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-xs font-semibold"
                      style={{
                        background:
                          r.role === "seller"
                            ? "oklch(0.32 0.11 155 / 0.10)"
                            : "oklch(0.72 0.16 78 / 0.10)",
                        color:
                          r.role === "seller"
                            ? "oklch(0.28 0.10 155)"
                            : "oklch(0.50 0.14 78)",
                        border:
                          r.role === "seller"
                            ? "1px solid oklch(0.32 0.11 155 / 0.20)"
                            : "1px solid oklch(0.72 0.16 78 / 0.20)",
                      }}
                    >
                      {r.role === "seller" ? (
                        <>
                          <Building2 className="w-3 h-3 inline mr-1" />
                          বিক্রয়দাতা
                        </>
                      ) : (
                        <>
                          <Home className="w-3 h-3 inline mr-1" />
                          ক্রয়গ্রহিতা
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {r.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.email || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.location || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(r.registeredAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        removeRegistration(r.id);
                        toast.success("মুছে ফেলা হয়েছে");
                      }}
                      data-ocid={`admin.registrations.delete_button.${i + 1}`}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

// ===== COMPARE MANAGEMENT =====
function CompareManagement() {
  const { listings } = useLocalListings();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedListings = listings.filter((l) => selectedIds.includes(l.id));
  const filteredListings = listings.filter(
    (l) =>
      !selectedIds.includes(l.id) &&
      (searchQuery === "" ||
        l.title.includes(searchQuery) ||
        l.district.includes(searchQuery) ||
        l.upazila.includes(searchQuery) ||
        l.division.includes(searchQuery)),
  );

  const addListing = (id: string) => {
    if (selectedIds.length < 3) {
      setSelectedIds((prev) => [...prev, id]);
      setSearchQuery("");
    } else {
      toast.error("সর্বোচ্চ ৩টি জমি তুলনা করা যাবে");
    }
  };

  const removeListing = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const compareFields: {
    label: string;
    render: (l: import("@/backend.d").LandListing) => React.ReactNode;
    isNumeric?: boolean;
    getValue?: (l: import("@/backend.d").LandListing) => number;
  }[] = [
    {
      label: "মূল্য (টাকা)",
      render: (l) => formatBDT(l.price),
      isNumeric: true,
      getValue: (l) => Number(l.price),
    },
    {
      label: "শতাংশ প্রতি দাম",
      render: (l) => formatBDT(l.pricePerDecimal),
      isNumeric: true,
      getValue: (l) => Number(l.pricePerDecimal),
    },
    {
      label: "আয়তন",
      render: (l) => formatArea(l.area),
      isNumeric: true,
      getValue: (l) => l.area,
    },
    { label: "জমির ধরন", render: (l) => getLandTypeLabel(l.landType) },
    { label: "রাস্তার সংযোগ", render: (l) => getRoadAccessLabel(l.roadAccess) },
    { label: "রাস্তার প্রশস্ততা", render: (l) => l.roadWidth || "—" },
    { label: "দিকনির্দেশনা", render: (l) => l.orientation || "—" },
    { label: "বিভাগ", render: (l) => l.division },
    { label: "জেলা", render: (l) => l.district },
    { label: "উপজেলা", render: (l) => l.upazila || "—" },
    {
      label: "যাচাই",
      render: (l) =>
        l.isVerified ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Check className="w-3 h-3" /> যাচাইকৃত
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">যাচাই হয়নি</span>
        ),
    },
    {
      label: "বৈশিষ্ট্যময়",
      render: (l) =>
        l.isFeatured ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Star className="w-3 h-3 fill-current" /> হ্যাঁ
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">না</span>
        ),
    },
    {
      label: "অবস্থা",
      render: (l) => getStatusLabel(l.status),
    },
  ];

  const maxPrices = selectedListings.reduce<Record<string, number>>(
    (acc, l) => {
      acc.price = Math.max(acc.price ?? 0, Number(l.price));
      acc.pricePerDec = Math.max(
        acc.pricePerDec ?? 0,
        Number(l.pricePerDecimal),
      );
      acc.area = Math.max(acc.area ?? 0, l.area);
      return acc;
    },
    {},
  );

  return (
    <div>
      {/* Header banner */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.025 300) 0%, oklch(0.99 0.008 300) 100%)",
          border: "1px solid oklch(0.88 0.06 300)",
          borderLeft: "4px solid oklch(0.52 0.14 300)",
        }}
        data-ocid="admin.compare.panel"
      >
        <div
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10"
          style={{ background: "oklch(0.52 0.14 300)" }}
        />
        <div className="flex items-center gap-4 flex-1 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.14 300), oklch(0.45 0.12 310))",
            }}
          >
            <BarChart2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-foreground">তুলনা সরঞ্জাম</h4>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.52 0.14 300 / 0.12)",
                  color: "oklch(0.38 0.12 300)",
                  border: "1px solid oklch(0.52 0.14 300 / 0.22)",
                }}
              >
                {selectedIds.length}/3 নির্বাচিত
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              সর্বোচ্চ ৩টি জমির তথ্য পাশাপাশি তুলনা করুন
            </p>
          </div>
        </div>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="shrink-0 text-xs font-medium px-4 py-2 rounded-xl border transition-all relative z-10"
            style={{
              borderColor: "oklch(0.52 0.14 300 / 0.30)",
              color: "oklch(0.38 0.12 300)",
              background: "oklch(0.52 0.14 300 / 0.06)",
            }}
            data-ocid="admin.compare.clear.button"
          >
            <X className="w-3.5 h-3.5 inline mr-1" />
            সব মুছুন
          </button>
        )}
      </div>

      {/* Search & Add */}
      {selectedIds.length < 3 && (
        <div
          className="bg-white border border-border rounded-xl p-5 mb-6 shadow-card"
          data-ocid="admin.compare.search.panel"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
            <Plus
              className="w-4 h-4"
              style={{ color: "oklch(0.52 0.14 300)" }}
            />
            তুলনার জন্য জমি যোগ করুন ({selectedIds.length}/3)
          </h3>
          <input
            type="text"
            placeholder="জমির নাম, জেলা বা উপজেলা দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-ocid="admin.compare.search.input"
            className="w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all mb-3"
            style={{
              borderColor: "oklch(0.88 0.04 240)",
              background: "oklch(0.98 0.005 240)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.52 0.14 300)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px oklch(0.52 0.14 300 / 0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.88 0.04 240)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {listings.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="admin.compare.empty_state"
            >
              <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">
                কোনো লিস্টিং নেই। প্রথমে লিস্টিং ট্যাব থেকে জমি যোগ করুন।
              </p>
            </div>
          ) : (
            <div className="max-h-52 overflow-y-auto space-y-1.5">
              {(searchQuery
                ? filteredListings
                : listings.filter((l) => !selectedIds.includes(l.id))
              )
                .slice(0, 10)
                .map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => addListing(l.id)}
                    data-ocid="admin.compare.add.button"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-purple-300 hover:bg-purple-50/40 transition-all text-left text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                        style={{ background: "oklch(0.95 0.02 300)" }}
                      >
                        {l.landType === "vita"
                          ? "🏡"
                          : l.landType === "nala"
                            ? "💧"
                            : "🌾"}
                      </div>
                      <div>
                        <div className="font-medium text-foreground line-clamp-1">
                          {l.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {l.district} · {formatBDT(l.price)}
                        </div>
                      </div>
                    </div>
                    <Plus
                      className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "oklch(0.52 0.14 300)" }}
                    />
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Comparison Table */}
      {selectedListings.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground bg-white rounded-xl border border-border"
          data-ocid="admin.compare.table.empty_state"
        >
          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-15" />
          <p className="text-lg font-medium">কোনো জমি নির্বাচন করা হয়নি</p>
          <p className="text-sm mt-2">উপরে জমি খুঁজে তুলনার জন্য যোগ করুন</p>
        </div>
      ) : (
        <div
          className="bg-white rounded-xl border border-border shadow-card overflow-hidden"
          data-ocid="admin.compare.table"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[600px] p-4">
              {/* Header row — listing cards */}
              <div
                className="grid gap-3 mb-4"
                style={{
                  gridTemplateColumns: `180px repeat(${selectedListings.length}, 1fr)`,
                }}
              >
                <div />
                {selectedListings.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-xl border border-border p-3 relative"
                    style={{ borderTop: "3px solid oklch(0.52 0.14 300)" }}
                  >
                    <button
                      type="button"
                      onClick={() => removeListing(l.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                      data-ocid="admin.compare.remove.button"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-16 bg-gradient-to-br from-purple-50 to-purple-100/40 rounded-lg mb-2 flex items-center justify-center text-3xl">
                      {l.landType === "vita"
                        ? "🏡"
                        : l.landType === "nala"
                          ? "💧"
                          : "🌾"}
                    </div>
                    <h3 className="font-bold text-foreground text-xs leading-snug mb-1 line-clamp-2 pr-4">
                      {l.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {l.district}
                    </div>
                    <div
                      className="mt-1.5 text-sm font-bold"
                      style={{ color: "oklch(0.38 0.14 240)" }}
                    >
                      {formatBDT(l.price)}
                    </div>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 3 - selectedIds.length }).map((_, i) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: slot
                    key={`empty-${i}`}
                    type="button"
                    onClick={() => {}}
                    className="border-2 border-dashed border-border rounded-xl h-40 flex items-center justify-center text-muted-foreground cursor-pointer hover:border-purple-300 hover:text-purple-400 transition-colors"
                    data-ocid="admin.compare.empty_slot.button"
                  >
                    <div className="text-center">
                      <Plus className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">জমি যোগ করুন</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Price progress bar */}
              <div
                className="grid gap-3 mb-1 pb-2 border-b border-border"
                style={{
                  gridTemplateColumns: `180px repeat(${selectedListings.length}, 1fr)`,
                }}
              >
                <div className="flex items-center text-xs font-semibold text-muted-foreground gap-1">
                  <Ruler className="w-3.5 h-3.5" /> মূল্য তুলনা বার
                </div>
                {selectedListings.map((l) => (
                  <div key={l.id} className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width:
                            maxPrices.price > 0
                              ? `${(Number(l.price) / maxPrices.price) * 100}%`
                              : "0%",
                          background:
                            "linear-gradient(90deg, oklch(0.52 0.14 300), oklch(0.45 0.12 310))",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right shrink-0">
                      {maxPrices.price > 0
                        ? `${Math.round((Number(l.price) / maxPrices.price) * 100)}%`
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {compareFields.map((field, rowIdx) => (
                <div
                  key={field.label}
                  className={`grid gap-3 py-2.5 border-b border-border/60 last:border-0 rounded-lg px-1.5 ${
                    rowIdx % 2 === 0 ? "bg-muted/20" : ""
                  }`}
                  style={{
                    gridTemplateColumns: `180px repeat(${selectedListings.length}, 1fr)`,
                  }}
                >
                  <div className="flex items-center text-xs font-semibold text-muted-foreground">
                    {field.label}
                  </div>
                  {selectedListings.map((l) => {
                    const isMin =
                      field.isNumeric &&
                      field.getValue &&
                      selectedListings.length > 1 &&
                      field.getValue(l) ===
                        Math.min(...selectedListings.map(field.getValue!));
                    return (
                      <div
                        key={l.id}
                        className={`text-sm flex items-center gap-1 ${
                          isMin
                            ? "text-emerald-600 font-semibold"
                            : "text-foreground"
                        }`}
                      >
                        {isMin && (
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        {field.render(l)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Summary footer */}
          {selectedListings.length > 1 && (
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{
                background: "oklch(0.97 0.01 300)",
                borderTop: "1px solid oklch(0.91 0.04 300)",
              }}
            >
              <Check
                className="w-4 h-4"
                style={{ color: "oklch(0.52 0.14 300)" }}
              />
              <span className="text-xs text-muted-foreground">
                সবুজ রঙে চিহ্নিত মান সর্বনিম্ন মূল্য বা সর্বোচ্চ আয়তন নির্দেশ করছে
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
