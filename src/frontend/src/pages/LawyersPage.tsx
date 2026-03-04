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
import { useGetAllLawyers } from "@/hooks/useQueries";
import { formatBDT } from "@/utils/format";
import {
  CheckCircle,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Search,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function LawyersPage() {
  const { data: lawyers, isLoading } = useGetAllLawyers();
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [specFilter, setSpecFilter] = useState("all");

  const specializations = [
    ...new Set(lawyers?.map((l) => l.specialization) ?? []),
  ];

  const filtered = (lawyers ?? []).filter((l) => {
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
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          আইনজীবী ডিরেক্টরি
        </h1>
        <p className="text-muted-foreground">
          বিশেষজ্ঞ ভূমি আইনজীবীর সাথে সরাসরি যোগাযোগ করুন
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="নাম বা বিশেষজ্ঞতা খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={availabilityFilter}
          onValueChange={setAvailabilityFilter}
        >
          <SelectTrigger className="w-44">
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
            <SelectTrigger className="w-52">
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
          {filtered.map((lawyer, i) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Scale className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-foreground leading-snug">
                    {lawyer.name}
                  </h3>
                  <p className="text-sm text-primary mt-0.5 font-medium">
                    {lawyer.specialization}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{lawyer.location}</span>
                  </div>
                </div>
              </div>

              {/* Availability badge */}
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
                  <div className="text-xs text-muted-foreground">পরামর্শ ফি</div>
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
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Scale className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">কোনো আইনজীবী পাওয়া যায়নি</p>
          <p className="text-sm mt-2">ফিল্টার পরিবর্তন করুন</p>
        </div>
      )}
    </div>
  );
}
