import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

const DIVISIONS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "সিলেট",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
];

const LAND_TYPES = [
  { value: "all", label: "সব ধরন" },
  { value: "vita", label: "ভিটা" },
  { value: "nala", label: "নালা" },
  { value: "samatal", label: "সমতল" },
];

interface SearchBarProps {
  variant?: "hero" | "inline";
  initialValues?: {
    division?: string;
    district?: string;
    upazila?: string;
    landType?: string;
  };
  onSearch?: (params: Record<string, string>) => void;
}

export function SearchBar({
  variant = "hero",
  initialValues = {},
  onSearch,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [division, setDivision] = useState(initialValues.division ?? "all");
  const [district, setDistrict] = useState(initialValues.district ?? "");
  const [upazila, setUpazila] = useState(initialValues.upazila ?? "");
  const [landType, setLandType] = useState(initialValues.landType ?? "all");

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (division && division !== "all") params.division = division;
    if (district) params.district = district;
    if (upazila) params.upazila = upazila;
    if (landType && landType !== "all") params.landType = landType;

    if (onSearch) {
      onSearch(params);
    } else {
      const query = new URLSearchParams(params).toString();
      navigate({
        to: "/listings",
        search: query ? Object.fromEntries(new URLSearchParams(query)) : {},
      });
    }
  };

  if (variant === "hero") {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Division */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              বিভাগ
            </span>
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger
                data-ocid="hero.division.select"
                className="w-full"
              >
                <SelectValue placeholder="বিভাগ বেছে নিন" />
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
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              জেলা
            </span>
            <Input
              id="hero-district"
              data-ocid="hero.district.input"
              placeholder="যেমন: ঢাকা, চট্টগ্রাম"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          {/* Upazila */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              উপজেলা
            </span>
            <Input
              id="hero-upazila"
              data-ocid="hero.upazila.input"
              placeholder="উপজেলার নাম"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          {/* Land Type */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              জমির ধরন
            </span>
            <Select value={landType} onValueChange={setLandType}>
              <SelectTrigger>
                <SelectValue placeholder="জমির ধরন" />
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
        </div>

        <div className="mt-4">
          <Button
            onClick={handleSearch}
            data-ocid="hero.search.button"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base shadow-green"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            জমি খুঁজুন
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Input
        data-ocid="hero.search.input"
        placeholder="এলাকার নাম লিখুন..."
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        className="flex-1 min-w-32"
      />
      <Button onClick={handleSearch} data-ocid="hero.search.button" size="sm">
        <Search className="w-4 h-4 mr-1" />
        খুঁজুন
      </Button>
    </div>
  );
}
