import { ListingCard } from "@/components/shared/ListingCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllListings, useGetFeaturedListings } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { label: "সক্রিয় জমি", value: "৫০০+", icon: MapPin },
  { label: "যাচাইকৃত বিক্রেতা", value: "২০০+", icon: ShieldCheck },
  { label: "সফল লেনদেন", value: "১৫০+", icon: TrendingUp },
  { label: "নিবন্ধিত ব্যবহারকারী", value: "১,০০০+", icon: Users },
];

const features = [
  {
    icon: MessageCircle,
    title: "সরাসরি যোগাযোগ",
    desc: "দালাল ছাড়া সরাসরি মালিকের সাথে কথা বলুন",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: ShieldCheck,
    title: "যাচাইকৃত বিক্রেতা",
    desc: "NID ও দলিল যাচাই করা Trust Badge বিক্রেতা",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Scale,
    title: "আইনজীবী সহায়তা",
    desc: "বিশেষজ্ঞ ভূমি আইনজীবীর সাথে সরাসরি পরামর্শ",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: FileText,
    title: "ডিজিটাল ভল্ট",
    desc: "এনক্রিপ্টেড নিরাপদ কাগজপত্র সংরক্ষণ",
    color: "bg-amber-50 text-amber-700",
  },
];

export function HomePage() {
  const { data: featured, isLoading: featuredLoading } =
    useGetFeaturedListings();
  const { data: allListings } = useGetAllListings();

  const activeCount =
    allListings?.filter((l) => l.status === "active").length ?? 0;

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bangladesh-land.dim_1400x700.jpg')",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />

        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge className="gold-badge text-sm font-semibold px-4 py-1.5">
              🏆 বাংলাদেশের প্রথম D2C ভূমি বাজার
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight"
          >
            সরাসরি মালিকের সাথে <span className="text-gold">কথা বলুন</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-10 font-sans"
          >
            কোনো দালাল নেই • কোনো লুকানো ফি নেই
          </motion.p>

          {/* Active listings counter */}
          {activeCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-sm mb-6"
            >
              এই মুহূর্তে{" "}
              <span className="text-gold font-bold text-lg">{activeCount}</span>{" "}
              টি জমি বিক্রয়ের জন্য উপলব্ধ
            </motion.p>
          )}

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <SearchBar variant="hero" />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-primary py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-primary-foreground"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-gold opacity-80" />
                <div className="text-2xl md:text-3xl font-display font-bold text-gold">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED LISTINGS ===== */}
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-heading font-bold text-foreground"
            >
              বৈশিষ্ট্যময় জমি
            </motion.h2>
            <p className="text-muted-foreground mt-1">
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
      <section className="bg-secondary/50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
              কেন জমিবাজার বেছে নেবেন?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
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
