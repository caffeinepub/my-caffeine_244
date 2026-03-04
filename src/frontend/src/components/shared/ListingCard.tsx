import type { LandListing } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import {
  formatArea,
  formatBDT,
  getLandTypeLabel,
  getRoadAccessLabel,
} from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { Compass, MapPin, Route, Ruler, ShieldCheck, Star } from "lucide-react";
import { motion } from "motion/react";

interface ListingCardProps {
  listing: LandListing;
  index?: number;
}

const landTypeColors: Record<string, string> = {
  vita: "bg-emerald-100 text-emerald-800",
  nala: "bg-blue-100 text-blue-800",
  samatal: "bg-amber-100 text-amber-800",
};

const landTypeIcons: Record<string, string> = {
  vita: "🏡",
  nala: "💧",
  samatal: "🌾",
};

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
      data-ocid={`listings.item.${index + 1}`}
    >
      <Link to="/listings/$id" params={{ id: listing.id }}>
        <div className="bg-white rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Image placeholder */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-30">
                {landTypeIcons[listing.landType] ?? "🏞️"}
              </div>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {listing.isFeatured && (
                <Badge className="gold-badge text-xs font-semibold px-2 py-0.5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  বৈশিষ্ট্যময়
                </Badge>
              )}
              {listing.isVerified && (
                <Badge className="verified-badge text-xs font-semibold px-2 py-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  যাচাইকৃত
                </Badge>
              )}
            </div>

            {/* Land type */}
            <div className="absolute bottom-3 right-3">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${landTypeColors[listing.landType] ?? "bg-gray-100 text-gray-800"}`}
              >
                {landTypeIcons[listing.landType]}{" "}
                {getLandTypeLabel(listing.landType)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3.5 h-3.5 text-primary/70" />
              <span>
                {listing.division} › {listing.district} › {listing.upazila}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading font-semibold text-foreground text-sm leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>

            {/* Price - Primary info */}
            <div className="mb-3">
              <div className="text-xl font-bold text-primary">
                {formatBDT(listing.price)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatBDT(listing.pricePerDecimal)} প্রতি শতাংশ
              </div>
            </div>

            {/* Details row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-3">
              <div className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" />
                <span>{formatArea(listing.area)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Route className="w-3.5 h-3.5" />
                <span>{getRoadAccessLabel(listing.roadAccess)}</span>
              </div>
              {listing.orientation && (
                <div className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{listing.orientation.substring(0, 6)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
