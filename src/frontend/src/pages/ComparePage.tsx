import type { LandListing } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalListings } from "@/hooks/useLocalStore";
import {
  formatArea,
  formatBDT,
  getLandTypeLabel,
  getRoadAccessLabel,
} from "@/utils/format";
import {
  Check,
  DollarSign,
  MapPin,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { listings } = useLocalListings();
  const isLoading = false;

  const selectedListings = listings.filter((l) => selectedIds.includes(l.id));

  const filteredListings =
    listings.filter(
      (l) =>
        !selectedIds.includes(l.id) &&
        (l.title.includes(searchQuery) ||
          l.district.includes(searchQuery) ||
          l.upazila.includes(searchQuery) ||
          l.division.includes(searchQuery)),
    ) ?? [];

  const addListing = (id: string) => {
    if (selectedIds.length < 3) {
      setSelectedIds((prev) => [...prev, id]);
      setSearchQuery("");
    }
  };

  const removeListing = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const compareFields: {
    label: string;
    render: (l: LandListing) => string | React.ReactNode;
    isNumeric?: boolean;
    getValue?: (l: LandListing) => number;
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
    { label: "রাস্তার প্রশস্ততা", render: (l) => l.roadWidth || "অজানা" },
    { label: "দিকনির্দেশনা", render: (l) => l.orientation || "অজানা" },
    { label: "বিভাগ", render: (l) => l.division },
    { label: "জেলা", render: (l) => l.district },
    {
      label: "যাচাই",
      render: (l) =>
        l.isVerified ? (
          <Badge className="verified-badge text-xs flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" /> যাচাইকৃত
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">যাচাই হয়নি</span>
        ),
    },
    {
      label: "বৈশিষ্ট্যময়",
      render: (l) =>
        l.isFeatured ? (
          <Badge className="gold-badge text-xs flex items-center gap-1 w-fit">
            <Star className="w-3 h-3 fill-current" /> হ্যাঁ
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">না</span>
        ),
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
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          জমি তুলনা করুন
        </h1>
        <p className="text-muted-foreground">সর্বোচ্চ ৩টি জমি পাশাপাশি তুলনা করুন</p>
      </motion.div>

      {/* Add listing section */}
      {selectedIds.length < 3 && (
        <div className="mb-8 bg-white border border-border rounded-xl p-5 shadow-card">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            জমি যোগ করুন ({selectedIds.length}/3)
          </h3>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="জমির নাম বা এলাকা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              data-ocid="compare.listing.select"
            />
          </div>
          {searchQuery && (
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {isLoading ? (
                ["a", "b", "c"].map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))
              ) : filteredListings.length > 0 ? (
                filteredListings.slice(0, 8).map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => addListing(l.id)}
                    data-ocid="compare.add.button"
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary transition-colors text-left text-sm"
                  >
                    <div>
                      <span className="font-medium">{l.title}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {l.district} • {formatBDT(l.price)}
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-primary shrink-0" />
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  কোনো জমি পাওয়া যায়নি
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {selectedListings.length === 0 ? (
        <div
          data-ocid="compare.table"
          className="text-center py-20 text-muted-foreground"
        >
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">কোনো জমি নির্বাচন করা হয়নি</p>
          <p className="text-sm mt-2">উপরে জমি খুঁজে তুলনার জন্য যোগ করুন</p>
        </div>
      ) : (
        <div data-ocid="compare.table" className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header row */}
            <div
              className="grid gap-4 mb-4"
              style={{
                gridTemplateColumns: `200px repeat(${selectedListings.length}, 1fr)`,
              }}
            >
              <div />
              {selectedListings.map((l) => (
                <div
                  key={l.id}
                  className="bg-white border border-border rounded-xl p-4 shadow-card relative"
                >
                  <button
                    type="button"
                    onClick={() => removeListing(l.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-3 flex items-center justify-center text-4xl">
                    {l.landType === "vita"
                      ? "🏡"
                      : l.landType === "nala"
                        ? "💧"
                        : "🌾"}
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-sm leading-snug mb-1 line-clamp-2">
                    {l.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {l.district}
                  </div>
                  <div className="mt-2 text-lg font-bold text-primary">
                    {formatBDT(l.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price bars */}
            <div
              className="grid gap-4 mb-1"
              style={{
                gridTemplateColumns: `200px repeat(${selectedListings.length}, 1fr)`,
              }}
            >
              <div className="flex items-center text-xs font-semibold text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-1" /> মূল্য তুলনা
              </div>
              {selectedListings.map((l) => (
                <div key={l.id} className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width:
                          maxPrices.price > 0
                            ? `${(Number(l.price) / maxPrices.price) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            {compareFields.map((field, rowIdx) => (
              <div
                key={field.label}
                className={`grid gap-4 py-3 border-b border-border last:border-0 ${
                  rowIdx % 2 === 0 ? "bg-secondary/20" : ""
                } rounded-lg px-2`}
                style={{
                  gridTemplateColumns: `200px repeat(${selectedListings.length}, 1fr)`,
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
                      {isMin && <Check className="w-3.5 h-3.5" />}
                      {field.render(l)}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Add more slots */}
            {selectedIds.length < 3 && (
              <div
                className="grid gap-4 mt-4"
                style={{
                  gridTemplateColumns: `200px repeat(${selectedListings.length}, 1fr)`,
                }}
              >
                <div />
                {["slot1", "slot2", "slot3"]
                  .slice(0, 3 - selectedIds.length)
                  .map((k) => (
                    <button
                      type="button"
                      key={k}
                      className="border-2 border-dashed border-border rounded-xl h-40 flex items-center justify-center text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors w-full"
                      onClick={() => setSearchQuery(" ")}
                    >
                      <div className="text-center">
                        <Plus className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">জমি যোগ করুন</span>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
