import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveRegistration } from "@/hooks/useLocalStore";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Phone,
  User,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Role = "seller" | "buyer" | null;

interface ProfileForm {
  name: string;
  phone: string;
  email: string;
  location: string;
}

const features = [
  "দালাল ছাড়া সরাসরি কেনাবেচা",
  "১০,০০০+ যাচাইকৃত জমির লিস্টিং",
  "আইনি সহায়তা ও চেকলিস্ট",
  "নিরাপদ ডকুমেন্ট ভল্ট",
  "অফার নেগোশিয়েশন পোর্টাল",
];

const stats = [
  { value: "৫০,০০০+", label: "নিবন্ধিত ব্যবহারকারী" },
  { value: "১০,০০০+", label: "সক্রিয় লিস্টিং" },
  { value: "৬৪টি", label: "জেলায় উপস্থিতি" },
];

export function RegisterPage() {
  const [step, setStep] = useState<"role" | "form" | "success">("role");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    email: "",
    location: "",
  });
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep("form");
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProfileForm> = {};
    if (!form.name.trim()) newErrors.name = "পূর্ণ নাম আবশ্যক";
    if (!form.phone.trim()) newErrors.phone = "মোবাইল নম্বর আবশ্যক";
    else if (
      !/^(?:\+88)?01[3-9]\d{8}$/.test(form.phone.trim().replace(/\s/g, ""))
    )
      newErrors.phone = "সঠিক বাংলাদেশি মোবাইল নম্বর দিন";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const role = selectedRole ?? "buyer";
    const registeredAt = new Date().toISOString();
    localStorage.setItem("jomibazar_user_role", role);
    localStorage.setItem(
      "jomibazar_profile",
      JSON.stringify({ ...form, role, registeredAt }),
    );
    // Save to admin-visible registrations store
    saveRegistration({
      id: `reg-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      role,
      registeredAt,
    });
    setIsSubmitting(false);
    setStep("success");
    toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
  };

  const handleInput = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Branding Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.18 0.09 155) 0%, oklch(0.13 0.07 160) 40%, oklch(0.22 0.10 148) 100%)",
        }}
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
            style={{ background: "oklch(0.55 0.14 155)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{
              duration: 9,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
            style={{ background: "oklch(0.72 0.16 78)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{
              duration: 11,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-1/2 -left-10 w-60 h-60 rounded-full"
            style={{ background: "oklch(0.45 0.13 150)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "oklch(0.72 0.16 78)" }}
            >
              <MapPin
                className="w-6 h-6"
                style={{ color: "oklch(0.12 0.04 80)" }}
              />
            </div>
            <div>
              <div
                className="text-2xl font-bold tracking-tight"
                style={{
                  color: "oklch(0.97 0.01 120)",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                }}
              >
                জমিবাজার
              </div>
              <div
                className="text-xs"
                style={{ color: "oklch(0.72 0.05 155)" }}
              >
                বাংলাদেশের D2C ভূমি বাজার
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h2
              className="text-3xl xl:text-4xl font-extrabold leading-tight mb-4"
              style={{
                color: "oklch(0.97 0.01 120)",
                fontFamily: "Bricolage Grotesque, sans-serif",
              }}
            >
              দালাল মুক্ত জমির
              <br />
              <span style={{ color: "oklch(0.72 0.16 78)" }}>
                কেনাবেচা শুরু করুন
              </span>
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.72 0.05 155)" }}
            >
              সরাসরি মালিকের সাথে যোগাযোগ করুন। কোনো মধ্যস্থতাকারী নেই, কোনো লুকানো চার্জ
              নেই।
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-10">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.72 0.16 78 / 0.25)" }}
                >
                  <CheckCircle2
                    className="w-3 h-3"
                    style={{ color: "oklch(0.72 0.16 78)" }}
                  />
                </div>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.82 0.04 155)" }}
                >
                  {f}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div
            className="mt-auto grid grid-cols-3 gap-4 pt-8 border-t"
            style={{ borderColor: "oklch(0.32 0.07 155)" }}
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: "oklch(0.72 0.16 78)" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.6 0.04 155)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              জমিবাজার
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Step: Role Selection ── */}
            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header */}
                <div
                  className="rounded-2xl p-6 mb-6 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.32 0.11 155), oklch(0.24 0.09 158))",
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <UserPlus className="w-6 h-6 opacity-80" />
                    <span className="text-sm font-semibold opacity-80 uppercase tracking-widest">
                      নতুন অ্যাকাউন্ট
                    </span>
                  </div>
                  <h1
                    className="text-2xl font-extrabold leading-tight"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    আপনি কি হিসেবে যোগ দিতে চান?
                  </h1>
                  <p className="text-sm mt-1 opacity-70">আপনার ভূমিকা বেছে নিন</p>
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Seller Card */}
                  <motion.button
                    type="button"
                    onClick={() => handleRoleSelect("seller")}
                    data-ocid="register.seller.card"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative text-left rounded-2xl border-2 p-6 transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{
                      borderColor: "oklch(var(--border))",
                      background: "white",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.32 0.11 155 / 0.04), oklch(0.72 0.16 78 / 0.03))",
                      }}
                    />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.32 0.11 155 / 0.12), oklch(0.32 0.11 155 / 0.06))",
                      }}
                    >
                      <Building2
                        className="w-6 h-6"
                        style={{ color: "oklch(0.32 0.11 155)" }}
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">
                      বিক্রয়দাতা
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      জমি বিক্রি করতে চান — লিস্টিং তৈরি করুন ও সরাসরি ক্রেতার সাথে কথা
                      বলুন
                    </p>
                    <div
                      className="mt-4 text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                      style={{ color: "oklch(0.32 0.11 155)" }}
                    >
                      Seller
                      <span>→</span>
                    </div>
                  </motion.button>

                  {/* Buyer Card */}
                  <motion.button
                    type="button"
                    onClick={() => handleRoleSelect("buyer")}
                    data-ocid="register.buyer.card"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative text-left rounded-2xl border-2 p-6 transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{
                      borderColor: "oklch(var(--border))",
                      background: "white",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.16 78 / 0.05), oklch(0.55 0.18 85 / 0.03))",
                      }}
                    />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.16 78 / 0.15), oklch(0.72 0.16 78 / 0.07))",
                      }}
                    >
                      <Home
                        className="w-6 h-6"
                        style={{ color: "oklch(0.62 0.16 78)" }}
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">
                      ক্রয়গ্রহিতা
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      জমি কিনতে চান — হাজারো লিস্টিং ব্রাউজ করুন ও মালিকের সাথে সরাসরি কথা
                      বলুন
                    </p>
                    <div
                      className="mt-4 text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                      style={{ color: "oklch(0.62 0.16 78)" }}
                    >
                      Buyer
                      <span>→</span>
                    </div>
                  </motion.button>
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                  ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                  <Link
                    to="/"
                    className="text-primary font-semibold hover:underline"
                  >
                    হোমপেজে যান
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── Step: Profile Form ── */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header */}
                <div
                  className="rounded-2xl p-6 mb-6 text-white"
                  style={{
                    background:
                      selectedRole === "seller"
                        ? "linear-gradient(135deg, oklch(0.32 0.11 155), oklch(0.24 0.09 158))"
                        : "linear-gradient(135deg, oklch(0.55 0.14 78), oklch(0.45 0.12 82))",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setStep("role");
                      setErrors({});
                    }}
                    data-ocid="register.back_button"
                    className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 mb-3 transition-opacity"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    পিছনে যান
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    {selectedRole === "seller" ? (
                      <Building2 className="w-6 h-6 opacity-80" />
                    ) : (
                      <Home className="w-6 h-6 opacity-80" />
                    )}
                    <span className="text-sm font-semibold opacity-80 uppercase tracking-widest">
                      {selectedRole === "seller" ? "বিক্রয়দাতা" : "ক্রয়গ্রহিতা"}
                    </span>
                  </div>
                  <h1
                    className="text-2xl font-extrabold leading-tight"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    আপনার তথ্য দিন
                  </h1>
                  <p className="text-sm mt-1 opacity-70">
                    মাত্র কয়েক সেকেন্ডে রেজিস্ট্রেশন সম্পন্ন করুন
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  data-ocid="register.form"
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name" className="text-sm font-medium">
                      পূর্ণ নাম <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                        value={form.name}
                        onChange={(e) => handleInput("name", e.target.value)}
                        className={`pl-10 h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        data-ocid="register.name.input"
                      />
                    </div>
                    {errors.name && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="register.name.error_state"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-phone" className="text-sm font-medium">
                      মোবাইল নম্বর <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-phone"
                        placeholder="01XXXXXXXXX"
                        value={form.phone}
                        onChange={(e) => handleInput("phone", e.target.value)}
                        className={`pl-10 h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        data-ocid="register.phone.input"
                      />
                    </div>
                    {errors.phone && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="register.phone.error_state"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-sm font-medium">
                      ইমেইল{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (ঐচ্ছিক)
                      </span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={(e) => handleInput("email", e.target.value)}
                        className="pl-10 h-11"
                        data-ocid="register.email.input"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-location"
                      className="text-sm font-medium"
                    >
                      ঠিকানা / এলাকা{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        (ঐচ্ছিক)
                      </span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-location"
                        placeholder="যেমন: ঢাকা, মিরপুর"
                        value={form.location}
                        onChange={(e) =>
                          handleInput("location", e.target.value)
                        }
                        className="pl-10 h-11"
                        data-ocid="register.location.input"
                      />
                    </div>
                  </div>

                  {/* Terms notice */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    রেজিস্ট্রেশন করে আপনি আমাদের{" "}
                    <span className="text-primary cursor-pointer hover:underline">
                      শর্তাবলী
                    </span>{" "}
                    এবং{" "}
                    <span className="text-primary cursor-pointer hover:underline">
                      গোপনীয়তা নীতি
                    </span>
                    তে সম্মত হচ্ছেন।
                  </p>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-semibold gap-2"
                    data-ocid="register.submit_button"
                    style={{
                      background:
                        selectedRole === "seller"
                          ? "linear-gradient(135deg, oklch(0.32 0.11 155), oklch(0.28 0.10 158))"
                          : "linear-gradient(135deg, oklch(0.55 0.14 78), oklch(0.48 0.12 82))",
                      border: "none",
                      color: "white",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        প্রক্রিয়াধীন...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        রেজিস্ট্রেশন সম্পন্ন করুন
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step: Success ── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="text-center py-4"
                data-ocid="register.success_state"
              >
                {/* Green circle check */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.32 0.11 155 / 0.12), oklch(0.55 0.14 155 / 0.08))",
                  }}
                >
                  <CheckCircle2
                    className="w-12 h-12"
                    style={{ color: "oklch(0.45 0.14 155)" }}
                  />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl font-extrabold mb-2"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  অভিনন্দন! 🎉
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-muted-foreground mb-2"
                >
                  আপনার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে।
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  className="text-sm font-semibold mb-8"
                  style={{ color: "oklch(0.32 0.11 155)" }}
                >
                  আপনি {selectedRole === "seller" ? "বিক্রয়দাতা" : "ক্রয়গ্রহিতা"}{" "}
                  হিসেবে যোগ দিয়েছেন
                </motion.p>

                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl border p-4 text-left mb-6"
                  style={{ background: "oklch(0.98 0.005 120)" }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    প্রোফাইল সারসংক্ষেপ
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">নাম</span>
                      <span className="font-semibold">{form.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">মোবাইল</span>
                      <span className="font-semibold">{form.phone}</span>
                    </div>
                    {form.email && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ইমেইল</span>
                        <span className="font-semibold">{form.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ভূমিকা</span>
                      <span
                        className="font-semibold"
                        style={{ color: "oklch(0.32 0.11 155)" }}
                      >
                        {selectedRole === "seller" ? "বিক্রয়দাতা" : "ক্রয়গ্রহিতা"}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    asChild
                    className="w-full h-12 text-base font-semibold gap-2"
                    data-ocid="register.home.button"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.32 0.11 155), oklch(0.28 0.10 158))",
                      border: "none",
                      color: "white",
                    }}
                  >
                    <Link to="/">
                      <Home className="w-5 h-5" />
                      হোমপেজে যান
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
