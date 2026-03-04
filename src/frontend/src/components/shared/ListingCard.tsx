import type { LandListing } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import {
  formatArea,
  formatBDT,
  getLandTypeLabel,
  getRoadAccessLabel,
} from "@/utils/format";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  MapPin,
  Route,
  Ruler,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";

interface ListingCardProps {
  listing: LandListing;
  index?: number;
}

// Lighter, nature-inspired palettes — feel like real estate, not app icons
const landTypeTheme: Record<
  string,
  { bg: string; scrim: string; chip: string }
> = {
  vita: {
    bg: "bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100",
    scrim:
      "bg-gradient-to-t from-emerald-900/60 via-emerald-800/20 to-transparent",
    chip: "bg-emerald-700/90 text-white",
  },
  nala: {
    bg: "bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100",
    scrim: "bg-gradient-to-t from-blue-900/60 via-blue-800/20 to-transparent",
    chip: "bg-blue-700/90 text-white",
  },
  samatal: {
    bg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-100",
    scrim: "bg-gradient-to-t from-amber-900/60 via-amber-800/20 to-transparent",
    chip: "bg-amber-700/90 text-white",
  },
};

const landTypeIcons: Record<string, string> = {
  vita: "🏡",
  nala: "💧",
  samatal: "🌾",
};

// SVG-based abstract land-type illustrations (CSS background patterns)
const landTypePattern: Record<string, string> = {
  vita: `radial-gradient(ellipse 70% 60% at 50% 70%, oklch(0.55 0.12 155 / 0.18) 0%, transparent 70%),
         radial-gradient(circle at 20% 80%, oklch(0.65 0.14 145 / 0.12) 0%, transparent 40%),
         radial-gradient(circle at 80% 20%, oklch(0.72 0.16 78 / 0.08) 0%, transparent 35%)`,
  nala: `radial-gradient(ellipse 80% 50% at 50% 80%, oklch(0.55 0.14 230 / 0.20) 0%, transparent 70%),
         radial-gradient(circle at 30% 40%, oklch(0.65 0.12 220 / 0.12) 0%, transparent 40%),
         radial-gradient(circle at 70% 20%, oklch(0.70 0.10 200 / 0.08) 0%, transparent 30%)`,
  samatal: `radial-gradient(ellipse 90% 60% at 50% 60%, oklch(0.75 0.14 90 / 0.18) 0%, transparent 70%),
            radial-gradient(circle at 15% 70%, oklch(0.68 0.15 100 / 0.12) 0%, transparent 40%),
            radial-gradient(circle at 85% 30%, oklch(0.72 0.16 78 / 0.08) 0%, transparent 35%)`,
};

function isNewListing(createdAt: bigint): boolean {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const createdMs = Number(createdAt) / 1_000_000;
  return Date.now() - createdMs < sevenDaysMs;
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const isNew = isNewListing(listing.createdAt);
  const theme = landTypeTheme[listing.landType] ?? landTypeTheme.vita;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group"
      data-ocid={`listings.item.${index + 1}`}
    >
      <Link to="/listings/$id" params={{ id: listing.id }}>
        <div
          className="bg-white rounded-2xl overflow-hidden border border-border/70 transition-all duration-300"
          style={{
            boxShadow:
              "0 2px 8px oklch(0.15 0.05 155 / 0.07), 0 1px 2px oklch(0.15 0.05 155 / 0.05)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 8px 30px oklch(0.15 0.05 155 / 0.13), 0 2px 8px oklch(0.15 0.05 155 / 0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 2px 8px oklch(0.15 0.05 155 / 0.07), 0 1px 2px oklch(0.15 0.05 155 / 0.05)";
          }}
        >
          {/* Image area — airy, nature-toned, not heavy */}
          <div className={`relative h-52 overflow-hidden ${theme.bg}`}>
            {/* Abstract radial pattern */}
            <div
              className="absolute inset-0"
              style={{ background: landTypePattern[listing.landType] ?? "" }}
            />

            {/* Landscape silhouette layer — soft decorative shapes */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none">
              <span
                className="text-[96px] leading-none opacity-[0.13] pb-2"
                aria-hidden="true"
              >
                {landTypeIcons[listing.landType] ?? "🏞️"}
              </span>
            </div>

            {/* Bottom scrim for text contrast */}
            <div className={`absolute inset-0 ${theme.scrim}`} />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {listing.isFeatured && (
                <Badge className="gold-badge text-xs font-semibold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                  বৈশিষ্ট্যময়
                </Badge>
              )}
              {listing.isVerified && (
                <Badge className="verified-badge text-xs font-semibold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  যাচাইকৃত
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-rose-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 shadow-sm">
                  নতুন
                </Badge>
              )}
            </div>

            {/* Land type chip — bottom right */}
            <div className="absolute bottom-3 right-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm ${theme.chip}`}
              >
                {landTypeIcons[listing.landType]}{" "}
                {getLandTypeLabel(listing.landType)}
              </span>
            </div>

            {/* Price per decimal — bottom left, over photo */}
            <div className="absolute bottom-3 left-3">
              <div className="text-xs text-white/80 bg-black/25 backdrop-blur-sm rounded-full px-2 py-0.5">
                {formatBDT(listing.pricePerDecimal)}/শতাংশ
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4 pb-5">
            {/* Location breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <span className="truncate">
                {listing.district}
                {listing.upazila ? ` › ${listing.upazila}` : ""}
              </span>
              <span className="ml-auto shrink-0 text-muted-foreground/50">
                {listing.division}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading font-semibold text-foreground text-sm leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {listing.title}
            </h3>

            {/* Price — visually dominant */}
            <div className="mb-3.5">
              <div
                className="font-display font-bold text-primary"
                style={{ fontSize: "1.35rem", lineHeight: 1.1 }}
              >
                {formatBDT(listing.price)}
              </div>
            </div>

            {/* Details chips row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap border-t border-border/60 pt-3">
              <span className="flex items-center gap-1 bg-muted/60 rounded-full px-2 py-0.5">
                <Ruler className="w-3 h-3 shrink-0" />
                {formatArea(listing.area)}
              </span>
              <span className="flex items-center gap-1 bg-muted/60 rounded-full px-2 py-0.5">
                <Route className="w-3 h-3 shrink-0" />
                {getRoadAccessLabel(listing.roadAccess)}
              </span>
              {listing.orientation && (
                <span className="flex items-center gap-1 bg-muted/60 rounded-full px-2 py-0.5">
                  <Compass className="w-3 h-3 shrink-0" />
                  {listing.orientation.substring(0, 5)}
                </span>
              )}
            </div>

            {/* Seller */}
            {listing.sellerName && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mt-3 pt-2.5 border-t border-border/40">
                <User className="w-3 h-3 shrink-0" />
                <span className="truncate">{listing.sellerName}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
