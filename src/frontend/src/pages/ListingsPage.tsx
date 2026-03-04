import type { LandListing } from "@/backend.d";
import { ListingCard } from "@/components/shared/ListingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useLocalListings } from "@/hooks/useLocalStore";
import {
  ALL_DISTRICTS,
  DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
} from "@/utils/bangladeshData";
import { useSearch } from "@tanstack/react-router";
import { Filter, MapPin, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const LAND_TYPES = [
  { value: "all", label: "সব ধরন" },
  { value: "vita", label: "ভিটা 🏡" },
  { value: "nala", label: "নালা 💧" },
  { value: "samatal", label: "সমতল 🌾" },
];

const ROAD_ACCESS = [
  { value: "all", label: "সব রাস্তা" },
  { value: "paved", label: "পিচ ঢালাই" },
  { value: "brick", label: "ইটের রাস্তা" },
  { value: "none", label: "রাস্তা নেই" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "সর্বশেষ" },
  { value: "price-asc", label: "মূল্য: কম থেকে বেশি" },
  { value: "price-desc", label: "মূল্য: বেশি থেকে কম" },
  { value: "area-asc", label: "আয়তন: কম থেকে বেশি" },
  { value: "price-per-dec-asc", label: "শতাংশ প্রতি দাম: কম" },
];

type SearchParams = {
  division?: string;
  district?: string;
  upazila?: string;
  landType?: string;
};

export function ListingsPage() {
  const searchParams = useSearch({ from: "/listings" }) as SearchParams;
  const [showFilters, setShowFilters] = useState(false);

  const [division, setDivision] = useState(searchParams.division ?? "all");
  const [district, setDistrict] = useState(searchParams.district ?? "all");
  const [upazila, setUpazila] = useState(searchParams.upazila ?? "all");
  const [landType, setLandType] = useState(searchParams.landType ?? "all");

  // Cascading location data
  const availableDistricts =
    division && division !== "all"
      ? getDistrictsForDivision(division)
      : ALL_DISTRICTS;
  const availableUpazilas =
    district && district !== "all" ? getUpazilasForDistrict(district) : [];

  const handleDivisionChange = (val: string) => {
    setDivision(val);
    setDistrict("all");
    setUpazila("all");
  };

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    setUpazila("all");
  };
  const [roadAccess, setRoadAccess] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const { listings } = useLocalListings();
  const isLoading = false;

  const filtered = useMemo(() => {
    if (!listings) return [];

    let result: LandListing[] = listings.filter((l) => l.status === "active");

    if (division && division !== "all")
      result = result.filter((l) => l.division === division);
    if (district && district !== "all")
      result = result.filter(
        (l) => l.district === district || l.address.includes(district),
      );
    if (upazila && upazila !== "all")
      result = result.filter((l) => l.upazila === upazila);
    if (landType && landType !== "all")
      result = result.filter((l) => l.landType === landType);
    if (roadAccess && roadAccess !== "all")
      result = result.filter((l) => l.roadAccess === roadAccess);
    if (verifiedOnly) result = result.filter((l) => l.isVerified);
    if (featuredOnly) result = result.filter((l) => l.isFeatured);

    result = result.filter((l) => {
      const price = Number(l.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "newest") return Number(b.createdAt) - Number(a.createdAt);
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "area-asc") return a.area - b.area;
      if (sortBy === "price-per-dec-asc")
        return Number(a.pricePerDecimal) - Number(b.pricePerDecimal);
      return 0;
    });

    return result;
  }, [
    listings,
    division,
    district,
    upazila,
    landType,
    roadAccess,
    priceRange,
    sortBy,
    verifiedOnly,
    featuredOnly,
  ]);

  const activeFilters = [
    division !== "all" && { key: "division", label: division },
    district !== "all" && { key: "district", label: district },
    upazila !== "all" && { key: "upazila", label: upazila },
    landType !== "all" && {
      key: "landType",
      label: LAND_TYPES.find((t) => t.value === landType)?.label ?? landType,
    },
    verifiedOnly && { key: "verified", label: "যাচাইকৃত" },
    featuredOnly && { key: "featured", label: "বৈশিষ্ট্যময়" },
  ].filter(Boolean) as { key: string; label: string }[];

  const clearFilter = (key: string) => {
    if (key === "division") setDivision("all");
    if (key === "district") setDistrict("all");
    if (key === "upazila") setUpazila("all");
    if (key === "landType") setLandType("all");
    if (key === "verified") setVerifiedOnly(false);
    if (key === "featured") setFeaturedOnly(false);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            জমি খুঁজুন
          </h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "লোড হচ্ছে..." : `${filtered.length}টি জমি পাওয়া গেছে`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            ফিল্টার
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              data-ocid="listings.sort.select"
              className="w-auto min-w-40"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => clearFilter(f.key)}
            >
              {f.label}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          <button
            type="button"
            onClick={() => {
              setDivision("all");
              setDistrict("all");
              setUpazila("all");
              setLandType("all");
              setVerifiedOnly(false);
              setFeaturedOnly(false);
            }}
            className="text-xs text-destructive hover:underline"
          >
            সব মুছুন
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            data-ocid="listings.filter.panel"
            className="w-64 shrink-0"
          >
            <div className="bg-white rounded-xl border border-border p-5 shadow-card sticky top-24 space-y-5">
              <h3 className="font-heading font-semibold text-sm text-foreground">
                ফিল্টার
              </h3>

              {/* Division */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">বিভাগ</Label>
                <Select value={division} onValueChange={handleDivisionChange}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="বিভাগ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব বিভাগ</SelectItem>
                    {DIVISIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">জেলা</Label>
                <Select value={district} onValueChange={handleDistrictChange}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="সব জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব জেলা</SelectItem>
                    {availableDistricts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upazila */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">উপজেলা</Label>
                <Select
                  value={upazila}
                  onValueChange={setUpazila}
                  disabled={availableUpazilas.length === 0}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="সব উপজেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব উপজেলা</SelectItem>
                    {availableUpazilas.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Land Type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  জমির ধরন
                </Label>
                <Select value={landType} onValueChange={setLandType}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="ধরন" />
                  </SelectTrigger>
                  <SelectContent>
                    {LAND_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Road Access */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  রাস্তার ধরন
                </Label>
                <Select value={roadAccess} onValueChange={setRoadAccess}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="রাস্তা" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROAD_ACCESS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  মূল্য সীমা (৳{(priceRange[0] / 100000).toFixed(0)}L - ৳
                  {(priceRange[1] / 100000).toFixed(0)}L)
                </Label>
                <Slider
                  min={0}
                  max={20000000}
                  step={100000}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="mt-2"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">শুধু যাচাইকৃত</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">শুধু বৈশিষ্ট্যময়</span>
                </label>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Listings grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["a", "b", "c", "d", "e", "f"].map((k) => (
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
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <div
              data-ocid="listings.empty_state"
              className="text-center py-20 text-muted-foreground"
            >
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">কোনো জমি পাওয়া যায়নি</p>
              <p className="text-sm mt-2">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setDivision("all");
                  setDistrict("all");
                  setUpazila("all");
                  setLandType("all");
                  setVerifiedOnly(false);
                  setFeaturedOnly(false);
                }}
              >
                ফিল্টার রিসেট করুন
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
