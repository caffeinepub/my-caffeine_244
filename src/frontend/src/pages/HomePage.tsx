import { ListingCard } from "@/components/shared/ListingCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalListings } from "@/hooks/useLocalStore";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { POPULAR_LOCATIONS } from "@/utils/bangladeshData";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  MapPin,
  MessageCircle,
  Scale,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const featureIcons = [MessageCircle, ShieldCheck, Scale, FileText];
const featureColors = [
  "bg-emerald-50 text-emerald-700",
  "bg-blue-50 text-blue-700",
  "bg-purple-50 text-purple-700",
  "bg-amber-50 text-amber-700",
];
const statIcons = [MapPin, ShieldCheck, TrendingUp, Users];
const stepIcons = [Search, MessageCircle, ShieldCheck];
const stepColors = [
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-amber-50 text-amber-700 border-amber-200",
];

const testimonials = [
  {
    name: "রহিম মিয়া",
    location: "ঢাকা",
    text: "জমিবাজারের মাধ্যমে আমি কোনো দালাল ছাড়াই সরাসরি মালিকের কাছ থেকে জমি কিনতে পেরেছি। অসাধারণ সেবা!",
    initials: "রম",
    stars: 5,
  },
  {
    name: "করিম সাহেব",
    location: "চট্টগ্রাম",
    text: "আইনজীবীর সহায়তায় পুরো প্রক্রিয়াটি নিরাপদে সম্পন্ন হয়েছে। আমি সন্তুষ্ট।",
    initials: "কস",
    stars: 5,
  },
  {
    name: "সালমা বেগম",
    location: "রাজশাহী",
    text: "ডিজিটাল ডকুমেন্ট ভল্ট সুবিধা ব্যবহার করে আমার জমি দ্রুত বিক্রি হয়েছে।",
    initials: "সব",
    stars: 5,
  },
];

const pricingPlans = [
  {
    icon: "🆓",
    title: "বিনামূল্যে লিস্টিং",
    price: "৳০",
    period: "চিরকাল",
    desc: "বেসিক জমি তালিকাভুক্ত করুন",
    features: ["১টি জমির লিস্টিং", "ছবি আপলোড", "যোগাযোগ বাটন", "বেসিক পরিসংখ্যান"],
    highlight: false,
  },
  {
    icon: "⭐",
    title: "ফিচার্ড লিস্টিং",
    price: "৳৫০০",
    period: "প্রতি সপ্তাহ",
    desc: "প্রথম পাতায় আপনার জমি দেখান",
    features: [
      "প্রথম পাতায় অবস্থান",
      "Gold badge প্রদর্শন",
      "বেশি ভিজিটর",
      "অগ্রাধিকার সহায়তা",
    ],
    highlight: true,
  },
  {
    icon: "🛡️",
    title: "ভেরিফাইড ব্যাজ",
    price: "৳১,০০০",
    period: "এককালীন",
    desc: "NID ও দলিল যাচাই করে Trust Badge নিন",
    features: [
      "NID যাচাইকরণ",
      "দলিল যাচাই",
      "Trust Shield badge",
      "ক্রেতার আস্থা বৃদ্ধি",
    ],
    highlight: false,
  },
];

const locationIconMap: Record<string, string> = {
  ঢাকা: "🏙️",
  গাজীপুর: "🏭",
  নারায়ণগঞ্জ: "⚓",
  চট্টগ্রাম: "🚢",
  সিলেট: "🍃",
  কক্সবাজার: "🏖️",
  রাজশাহী: "🥭",
  খুলনা: "🦁",
};

export function HomePage() {
  const { settings } = useSiteSettings();
  const { listings: allListings } = useLocalListings();
  const featured = allListings.filter((l) => l.isFeatured);
  const featuredLoading = false;
  const navigate = useNavigate();

  const stats = settings.stats.map((s, i) => ({ ...s, icon: statIcons[i] }));
  const features = settings.features.map((f, i) => ({
    ...f,
    icon: featureIcons[i],
    color: featureColors[i],
  }));
  const howItWorksSteps = settings.howItWorksSteps.map((s, i) => ({
    ...s,
    icon: stepIcons[i],
    color: stepColors[i],
  }));

  const activeCount =
    allListings?.filter((l) => l.status === "active").length ?? 0;

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background photo — scale slightly on load for life */}
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bangladesh-land.dim_1400x700.jpg')",
          }}
        />
        {/* Layered directional overlay — preserves photo */}
        <div className="absolute inset-0 gradient-hero" />

        {/* Grain texture overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Gold accent orb — top right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-24 text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7"
          >
            <span className="inline-flex items-center gap-2 gold-badge text-sm font-semibold px-5 py-2 rounded-full shadow-gold">
              🏆 বাংলাদেশের প্রথম D2C ভূমি বাজার
            </span>
          </motion.div>

          {/* Main headline — stacked for visual drama */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-white leading-[1.1] mb-5 text-balance"
            style={{ fontSize: "clamp(2.4rem, 6.5vw, 4.5rem)" }}
          >
            <span
              className="text-gold"
              style={{
                textShadow: "0 0 40px oklch(0.72 0.16 78 / 0.45)",
              }}
            >
              {settings.heroTitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-lg md:text-xl text-white/75 mb-3 font-sans tracking-wide"
          >
            {settings.heroSubtitle}
          </motion.p>

          {activeCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="text-white/50 text-sm mb-8"
            >
              এই মুহূর্তে{" "}
              <span className="text-gold font-bold text-base">
                {activeCount}
              </span>{" "}
              টি জমি বিক্রয়ের জন্য উপলব্ধ
            </motion.p>
          )}
          {activeCount === 0 && <div className="mb-8" />}

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="flex justify-center"
          >
            <SearchBar variant="hero" />
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap"
          >
            {[
              { icon: "🛡️", label: "NID যাচাইকৃত বিক্রেতা" },
              { icon: "⚖️", label: "আইনজীবী সহায়তা" },
              { icon: "🔒", label: "নিরাপদ লেনদেন" },
            ].map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-1.5 text-white/55 text-xs"
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-primary-foreground/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center text-primary-foreground px-6 py-2"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-gold/70" />
                <div className="text-3xl md:text-4xl font-display font-bold text-gold leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-primary-foreground/55 tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED LISTINGS ===== */}
      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-label mb-2">বিশেষ অফার</div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-title text-2xl md:text-3xl"
            >
              বৈশিষ্ট্যময় জমি
            </motion.h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              আমাদের বাছাই করা সেরা অফারসমূহ
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" size="sm" className="gap-1.5">
              সব দেখুন <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {["a", "b", "c", "d"].map((k) => (
              <div
                key={k}
                className="rounded-xl overflow-hidden border border-border"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : featured && featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div
            data-ocid="listings.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>কোনো বৈশিষ্ট্যময় জমি নেই</p>
          </div>
        )}
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-secondary/50 py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="section-label justify-center mb-3">বৈশিষ্ট্যসমূহ</div>
            <h2 className="section-title text-2xl md:text-3xl mx-auto max-w-lg mb-3">
              কেন জমিবাজার বেছে নেবেন?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-balance">
              আমরা পুরো কেনাবেচার প্রক্রিয়াকে সহজ, নিরাপদ ও স্বচ্ছ করে তুলি
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="section-label justify-center mb-3">কার্যপ্রক্রিয়া</div>
            <h2 className="section-title text-2xl md:text-3xl mx-auto max-w-md mb-3">
              কীভাবে কাজ করে?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-balance">
              মাত্র তিনটি সহজ ধাপে আপনার স্বপ্নের জমি কিনুন বা বিক্রি করুন
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-amber-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {howItWorksSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 ${step.color}`}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground/50 mb-1 tracking-widest">
                    ধাপ {step.step}
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOP LOCATIONS ===== */}
      {settings.showPopularAreas && (
        <section className="bg-secondary/40 py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="section-label justify-center mb-3">এলাকা</div>
              <h2 className="section-title text-2xl md:text-3xl mx-auto max-w-md mb-3">
                জনপ্রিয় এলাকা
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-balance">
                সর্বাধিক অনুসন্ধানকৃত জেলা ও শহরসমূহ
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {POPULAR_LOCATIONS.map((loc, i) => (
                <motion.button
                  key={loc.district}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() =>
                    navigate({
                      to: "/listings",
                      search: {
                        division: loc.division,
                        district: loc.district,
                      },
                    })
                  }
                  data-ocid="home.location.button"
                  className="bg-white rounded-xl p-4 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 text-left group cursor-pointer"
                >
                  <div className="text-3xl mb-2">
                    {locationIconMap[loc.district] ?? "📍"}
                  </div>
                  <div className="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {loc.district}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {loc.division} বিভাগ
                  </div>
                  <div className="text-xs text-primary/70 mt-1 line-clamp-1">
                    {loc.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="section-label justify-center mb-3">
              গ্রাহকদের মতামত
            </div>
            <h2 className="section-title text-2xl md:text-3xl mx-auto max-w-lg mb-3">
              আমাদের সন্তুষ্ট গ্রাহকরা বলছেন
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-balance">
              হাজারো সফল লেনদেনের পেছনে রয়েছে আমাদের বিশ্বস্ত সেবা
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 border border-border shadow-card relative"
              >
                {/* Quote icon */}
                <div className="text-4xl text-primary/10 font-display absolute top-4 right-5 leading-none select-none">
                  "
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {["s1", "s2", "s3", "s4", "s5"]
                    .slice(0, t.stars)
                    .map((sk) => (
                      <Star
                        key={sk}
                        className="w-4 h-4 fill-gold text-gold"
                        style={{ color: "oklch(0.72 0.16 78)" }}
                      />
                    ))}
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed mb-5 relative z-10">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / SERVICES ===== */}
      <section className="bg-secondary/40 py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="section-label justify-center mb-3">মূল্য তালিকা</div>
            <h2 className="section-title text-2xl md:text-3xl mx-auto max-w-md mb-3">
              আমাদের সেবাসমূহ
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-balance">
              বিক্রেতার জন্য স্বচ্ছ মূল্য নির্ধারণ — কোনো লুকানো চার্জ নেই
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-6 border transition-shadow relative overflow-hidden ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground border-primary shadow-green"
                    : "bg-white border-border shadow-card hover:shadow-card-hover"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-3 right-3">
                    <Badge className="gold-badge text-xs px-2 py-0.5">
                      জনপ্রিয়
                    </Badge>
                  </div>
                )}
                <div className="text-3xl mb-3">{plan.icon}</div>
                <h3
                  className={`font-heading font-bold text-lg mb-1 ${plan.highlight ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {plan.title}
                </h3>
                <div className="mb-1">
                  <span
                    className={`text-2xl font-bold font-display ${plan.highlight ? "text-gold" : "text-primary"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-xs ml-1 ${plan.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                  >
                    / {plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm mb-4 ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {plan.desc}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <ShieldCheck
                        className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-gold" : "text-primary"}`}
                      />
                      <span
                        className={
                          plan.highlight
                            ? "text-primary-foreground/80"
                            : "text-foreground/80"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
              আজই আপনার জমি বিক্রি করুন
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto text-lg">
              বিনামূল্যে লিস্টিং করুন এবং সরাসরি লক্ষ লক্ষ ক্রেতার কাছে পৌঁছান
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/listings">
                <Button
                  size="lg"
                  className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold shadow-gold"
                >
                  জমি দেখুন
                </Button>
              </Link>
              <Link to="/lawyers">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  আইনজীবী খুঁজুন
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
