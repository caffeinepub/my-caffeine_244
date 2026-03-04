import { useSiteSettings } from "@/hooks/useSiteSettings";
import { DIVISIONS } from "@/utils/bangladeshData";
import { Link } from "@tanstack/react-router";
import { Facebook, Heart, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "jomibajar",
  );

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Divisions quick links */}
      <div className="border-b border-primary-foreground/10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs text-primary-foreground/60">
            <span className="text-primary-foreground/40 font-semibold mr-1 shrink-0">
              বিভাগ:
            </span>
            {DIVISIONS.map((div, i) => (
              <span key={div} className="flex items-center gap-1">
                <Link
                  to="/listings"
                  search={{ division: div }}
                  data-ocid="footer.division.link"
                  className="hover:text-gold transition-colors"
                >
                  {div}
                </Link>
                {i < DIVISIONS.length - 1 && (
                  <span className="text-primary-foreground/20">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <span className="font-heading font-bold text-2xl">জমিবাজার</span>
            </div>
            <p className="text-primary-foreground/70 text-sm max-w-xs leading-relaxed mb-4">
              বাংলাদেশের প্রথম D2C ভূমি বাজার। সরাসরি মালিকের সাথে কথা বলুন, কোনো দালাল নেই।
            </p>
            <div className="flex items-center gap-1 text-xs text-primary-foreground/50 mb-4">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>ঢাকা, বাংলাদেশ</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <a
                href="tel:01700000000"
                className="flex items-center gap-1 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                হেল্পলাইন
              </a>
              <a
                href="mailto:info@jomibajar.bd"
                className="flex items-center gap-1 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                ইমেইল
              </a>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-gold">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/listings"
                  className="hover:text-gold transition-colors"
                >
                  জমি খুঁজুন
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="hover:text-gold transition-colors"
                >
                  জমি তুলনা করুন
                </Link>
              </li>
              <li>
                <Link
                  to="/lawyers"
                  className="hover:text-gold transition-colors"
                >
                  আইনজীবী খুঁজুন
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-gold transition-colors">
                  ভূমি সংবাদ
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-gold">তথ্য</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  কীভাবে কাজ করে
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  বিক্রেতা গাইড
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  ক্রেতা গাইড
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  আইনি সহায়তা
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  গোপনীয়তা নীতি
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>
            © {year} {settings.footerCopyright}
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-red-400 inline fill-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
