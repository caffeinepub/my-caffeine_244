import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_DISTRICTS,
  DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
} from "@/utils/bangladeshData";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

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
  const [district, setDistrict] = useState(initialValues.district ?? "all");
  const [upazila, setUpazila] = useState(initialValues.upazila ?? "all");
  const [landType, setLandType] = useState(initialValues.landType ?? "all");

  // Cascading districts: if division selected, show only those districts
  const availableDistricts =
    division && division !== "all"
      ? getDistrictsForDivision(division)
      : ALL_DISTRICTS;

  // Cascading upazilas: if district selected, show its upazilas
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

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (division && division !== "all") params.division = division;
    if (district && district !== "all") params.district = district;
    if (upazila && upazila !== "all") params.upazila = upazila;
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
            <Select value={division} onValueChange={handleDivisionChange}>
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
            <Select value={district} onValueChange={handleDistrictChange}>
              <SelectTrigger
                data-ocid="hero.district.select"
                className="w-full"
              >
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
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              উপজেলা
            </span>
            <Select
              value={upazila}
              onValueChange={setUpazila}
              disabled={availableUpazilas.length === 0}
            >
              <SelectTrigger data-ocid="hero.upazila.select" className="w-full">
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
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              জমির ধরন
            </span>
            <Select value={landType} onValueChange={setLandType}>
              <SelectTrigger data-ocid="hero.landtype.select">
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
      <Select value={district} onValueChange={handleDistrictChange}>
        <SelectTrigger
          data-ocid="hero.district.select"
          className="flex-1 min-w-32"
        >
          <SelectValue placeholder="জেলা বেছে নিন..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">সব জেলা</SelectItem>
          {ALL_DISTRICTS.slice(0, 20).map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} data-ocid="hero.search.button" size="sm">
        <Search className="w-4 h-4 mr-1" />
        খুঁজুন
      </Button>
    </div>
  );
}
