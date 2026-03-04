import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { LogIn, LogOut, MapPin, Menu, ShieldCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "হোম", ocid: "nav.home.link" },
  { to: "/listings", label: "জমি খুঁজুন", ocid: "nav.listings.link" },
  { to: "/compare", label: "তুলনা করুন", ocid: "nav.compare.link" },
  { to: "/lawyers", label: "আইনজীবী", ocid: "nav.lawyers.link" },
  { to: "/news", label: "সংবাদ", ocid: "nav.news.link" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
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

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              className={
                isAuthenticated
                  ? ""
                  : "bg-primary hover:bg-primary/90 shadow-green"
              }
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  লগইন হচ্ছে...
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-1.5" />
                  লগআউট
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1.5" />
                  লগইন করুন
                </>
              )}
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
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  variant={isAuthenticated ? "outline" : "default"}
                  className="w-full"
                >
                  {isLoggingIn
                    ? "লগইন হচ্ছে..."
                    : isAuthenticated
                      ? "লগআউট"
                      : "লগইন করুন"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
