import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalLawyers } from "@/hooks/useLocalStore";
import { formatBDT } from "@/utils/format";
import {
  Award,
  CheckCircle,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// Simulated experience years for demo
const EXPERIENCE_YEARS = [12, 8, 15, 10, 7, 18, 9, 14, 11, 6];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

function StarRating({ count, filled }: { count: number; filled: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_KEYS.slice(0, count).map((k, i) => (
        <Star
          key={k}
          className={`w-3.5 h-3.5 ${i < filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function LawyersPage() {
  const { lawyers } = useLocalLawyers();
  const isLoading = false;
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [specFilter, setSpecFilter] = useState("all");

  const specializations = [...new Set(lawyers.map((l) => l.specialization))];

  const filtered = lawyers.filter((l) => {
    const matchSearch =
      !search ||
      l.name.includes(search) ||
      l.specialization.includes(search) ||
      l.location.includes(search);
    const matchAvail =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "available"
          ? l.isAvailable
          : !l.isAvailable;
    const matchSpec =
      specFilter === "all" ? true : l.specialization === specFilter;
    return matchSearch && matchAvail && matchSpec;
  });

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <section className="bg-primary/5 border-b border-border py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <Badge className="gold-badge text-xs px-2 py-0.5">
                  বিশেষজ্ঞ পরামর্শ
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                আইনজীবী ডিরেক্টরি
              </h1>
              <p className="text-muted-foreground">
                বিশেষজ্ঞ ভূমি আইনজীবীর সাথে সরাসরি যোগাযোগ করুন
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-3xl font-display font-bold text-primary">
                {lawyers?.length ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                নিবন্ধিত আইনজীবী
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="নাম বা বিশেষজ্ঞতা খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="lawyers.search_input"
            />
          </div>
          <Select
            value={availabilityFilter}
            onValueChange={setAvailabilityFilter}
          >
            <SelectTrigger
              className="w-44"
              data-ocid="lawyers.availability.select"
            >
              <SelectValue placeholder="পাওয়ার যোগ্যতা" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব</SelectItem>
              <SelectItem value="available">উপলব্ধ</SelectItem>
              <SelectItem value="unavailable">অনুপলব্ধ</SelectItem>
            </SelectContent>
          </Select>
          {specializations.length > 0 && (
            <Select value={specFilter} onValueChange={setSpecFilter}>
              <SelectTrigger className="w-52" data-ocid="lawyers.spec.select">
                <SelectValue placeholder="বিশেষজ্ঞতা" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব বিশেষজ্ঞতা</SelectItem>
                {specializations.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Lawyers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="bg-white rounded-xl border border-border p-5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lawyer, i) => {
              const expYears = EXPERIENCE_YEARS[i % EXPERIENCE_YEARS.length];
              const starCount = lawyer.isAvailable ? 5 : 4;

              return (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  data-ocid={`lawyers.item.${i + 1}`}
                  className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                >
                  {/* Top strip */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/50" />

                  <div className="p-5">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar with initials */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/10 flex items-center justify-center shrink-0 relative">
                        <span className="font-heading font-bold text-primary text-lg">
                          {lawyer.name.charAt(0)}
                        </span>
                        {lawyer.isAvailable && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-foreground leading-snug">
                          {lawyer.name}
                        </h3>
                        <p className="text-sm text-primary mt-0.5 font-medium">
                          {lawyer.specialization}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{lawyer.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ratings & experience */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <StarRating count={5} filled={starCount} />
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {starCount === 5 ? "৫.০" : "৪.০"}/৫
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-medium">
                        <Award className="w-3 h-3" />
                        {expYears}+ বছর
                      </div>
                    </div>

                    {/* Availability + fee */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        className={`text-xs flex items-center gap-1 ${
                          lawyer.isAvailable
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {lawyer.isAvailable ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> উপলব্ধ
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> অনুপলব্ধ
                          </>
                        )}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">
                          {formatBDT(lawyer.consultationFee)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          পরামর্শ ফি
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {lawyer.description}
                    </p>

                    {/* Contact buttons */}
                    <div className="flex gap-2">
                      <a href={`tel:${lawyer.phone}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1.5 text-xs"
                          disabled={!lawyer.isAvailable}
                          data-ocid={`lawyers.call.button.${i + 1}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          কল করুন
                        </Button>
                      </a>
                      <a
                        href={`https://wa.me/88${lawyer.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          className="w-full gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                          disabled={!lawyer.isAvailable}
                          data-ocid={`lawyers.whatsapp.button.${i + 1}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div
            data-ocid="lawyers.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <Scale className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">কোনো আইনজীবী পাওয়া যায়নি</p>
            <p className="text-sm mt-2">ফিল্টার পরিবর্তন করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}
