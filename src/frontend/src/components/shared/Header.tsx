import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  ExternalLink,
  FileSearch,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "হোম", ocid: "nav.home.link" },
  { to: "/listings", label: "জমি খুঁজুন", ocid: "nav.listings.link" },
  { to: "/compare", label: "তুলনা করুন", ocid: "nav.compare.link" },
  { to: "/lawyers", label: "আইনজীবী", ocid: "nav.lawyers.link" },
  { to: "/news", label: "সংবাদ", ocid: "nav.news.link" },
];

const khatianMenuItems = [
  {
    label: "খতিয়ান অনুসন্ধান",
    href: "https://dlrms.land.gov.bd/",
    icon: FileSearch,
    desc: "অনলাইনে খতিয়ান যাচাই করুন",
  },
  {
    label: "ডিজিটাল ভূমি রেকর্ড",
    href: "https://dlrms.land.gov.bd/",
    icon: BookOpen,
    desc: "ডিজিটাল ভূমি রেকর্ড ম্যানেজমেন্ট সিস্টেম",
  },
  {
    label: "পর্চা অনুসন্ধান",
    href: "https://dlrms.land.gov.bd/",
    icon: Search,
    desc: "CS, SA, BS পর্চা অনুসন্ধান করুন",
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [khatianOpen, setKhatianOpen] = useState(false);
  const [mobileKhatianOpen, setMobileKhatianOpen] = useState(false);
  const location = useLocation();
  const { data: isAdmin } = useIsAdmin();

  const [announcementVisible, setAnnouncementVisible] = useState(true);

  return (
    <header className="sticky top-0 z-50 shadow-xs">
      {/* Announcement bar */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="text-xs font-medium py-2 px-4 flex items-center justify-center gap-2 relative"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.14 155) 0%, oklch(0.45 0.12 150) 50%, oklch(0.60 0.16 78) 100%)",
                color: "white",
              }}
            >
              <span className="hidden sm:inline">
                🏆 বাংলাদেশের প্রথম D2C ভূমি বাজার — দালাল মুক্ত, সরাসরি মালিক
              </span>
              <span className="sm:hidden">🏆 দালাল মুক্ত ভূমি বাজার</span>
              <button
                type="button"
                onClick={() => setAnnouncementVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-white/20 transition-colors"
                aria-label="বন্ধ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-green">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl text-primary tracking-tight">
                  জমিবাজার
                </span>
                <div className="text-[10px] text-muted-foreground leading-none font-sans">
                  বাংলাদেশের D2C ভূমি বাজার
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-ocid={link.ocid}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Khatian Dropdown */}
              <div className="relative" data-ocid="nav.khatian.dropdown_menu">
                <button
                  type="button"
                  data-ocid="nav.khatian.toggle"
                  onClick={() => setKhatianOpen(!khatianOpen)}
                  onBlur={() => setTimeout(() => setKhatianOpen(false), 150)}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    khatianOpen
                      ? "bg-amber-50 text-amber-700"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <FileSearch className="w-4 h-4" />
                  খতিয়ান অনুসন্ধান
                  <svg
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${khatianOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {khatianOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <div
                          className="px-3 py-2 mb-1 text-[10px] font-semibold uppercase tracking-widest"
                          style={{ color: "oklch(0.55 0.14 155)" }}
                        >
                          সরকারি ভূমি সেবা
                        </div>
                        {khatianMenuItems.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ocid="nav.khatian.link"
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-amber-50 group transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: "oklch(0.96 0.04 78)" }}
                            >
                              <item.icon
                                className="w-4 h-4"
                                style={{ color: "oklch(0.55 0.14 78)" }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground group-hover:text-amber-700 flex items-center gap-1">
                                {item.label}
                                <ExternalLink className="w-3 h-3 opacity-50" />
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {item.desc}
                              </div>
                            </div>
                          </a>
                        ))}
                        <div className="mt-2 pt-2 border-t border-border px-3 pb-1">
                          <a
                            href="https://dlrms.land.gov.bd/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ocid="nav.khatian.portal_link"
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold transition-colors text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.55 0.14 78), oklch(0.50 0.12 65))",
                            }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            DLRMS পোর্টালে যান
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  data-ocid="nav.admin.link"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    location.pathname.startsWith("/admin")
                      ? "bg-gold/20 text-gold-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  অ্যাডমিন
                </Link>
              )}
            </nav>

            {/* Register Button */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="gap-1.5 font-semibold shadow-sm"
                data-ocid="header.register_button"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.32 0.11 155), oklch(0.28 0.10 158))",
                  border: "none",
                  color: "white",
                }}
              >
                <Link to="/register">
                  <UserPlus className="w-4 h-4" />
                  রেজিস্ট্রেশন করুন
                </Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="মেনু"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-white overflow-hidden"
            >
              <div className="container px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      data-ocid={link.ocid}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {/* Mobile Khatian Menu */}
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    type="button"
                    data-ocid="nav.khatian.toggle"
                    onClick={() => setMobileKhatianOpen(!mobileKhatianOpen)}
                    className="w-full px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileSearch className="w-4 h-4" />
                      খতিয়ান অনুসন্ধান
                    </span>
                    <svg
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileKhatianOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {mobileKhatianOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 mt-1 flex flex-col gap-1"
                      >
                        {khatianMenuItems.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ocid="nav.khatian.link"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground/80 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0 text-amber-600" />
                            <span>{item.label}</span>
                            <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                          </a>
                        ))}
                        <a
                          href="https://dlrms.land.gov.bd/"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="nav.khatian.portal_link"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-2 mx-3 mb-2 mt-1 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.55 0.14 78), oklch(0.50 0.12 65))",
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          DLRMS পোর্টালে যান
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    data-ocid="nav.admin.link"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-md text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    অ্যাডমিন প্যানেল
                  </Link>
                )}
                <div className="pt-2 border-t border-border mt-1">
                  <Button
                    asChild
                    className="w-full gap-2 font-semibold"
                    data-ocid="header.register_button"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.32 0.11 155), oklch(0.28 0.10 158))",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link to="/register">
                      <UserPlus className="w-4 h-4" />
                      রেজিস্ট্রেশন করুন
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
