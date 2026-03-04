import type { DocumentAccessRequest, LandListing, Offer } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLocalListings, useLocalOffers } from "@/hooks/useLocalStore";
import {
  useGetDocuments,
  useGetPropertyHistory,
  useGetSoilReport,
  useRequestDocumentAccess,
} from "@/hooks/useQueries";
import {
  formatArea,
  formatBDT,
  formatDate,
  getLandTypeLabel,
  getRoadAccessLabel,
  getStatusLabel,
} from "@/utils/format";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  Download,
  Droplets,
  FileSearch,
  FileText,
  History,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Route,
  Ruler,
  Send,
  ShieldCheck,
  Star,
  Unlock,
  X,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// Extended listing type with images
type ListingWithImages = LandListing & { images?: string[] };

// ─── Image Gallery Component ─────────────────────────────────────────────────
function ListingImageGallery({ listing }: { listing: ListingWithImages }) {
  const images = listing.images ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    // Fallback placeholder
    return (
      <div className="h-72 md:h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
        <div className="text-8xl opacity-20">
          {listing.landType === "vita"
            ? "🏡"
            : listing.landType === "nala"
              ? "💧"
              : "🌾"}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {listing.isFeatured && (
            <Badge className="gold-badge flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> বৈশিষ্ট্যময়
            </Badge>
          )}
          {listing.isVerified && (
            <Badge className="verified-badge flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> যাচাইকৃত
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        data-ocid="listing.image.panel"
        className="mb-8 rounded-2xl overflow-hidden"
        style={{ border: "1px solid oklch(0.88 0.015 145)" }}
      >
        {/* Hero image — use button element for a11y */}
        <button
          type="button"
          className="relative h-72 md:h-96 bg-muted cursor-zoom-in group w-full text-left p-0 border-0"
          onClick={() => setLightboxOpen(true)}
          aria-label="ছবি বড় করে দেখুন"
          style={{ display: "block" }}
        >
          <img
            src={images[activeIdx]}
            alt={`${listing.title} — ছবি ${activeIdx + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {listing.isFeatured && (
              <Badge className="gold-badge flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> বৈশিষ্ট্যময়
              </Badge>
            )}
            {listing.isVerified && (
              <Badge className="verified-badge flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> যাচাইকৃত
              </Badge>
            )}
          </div>

          {/* Image counter badge */}
          <div
            className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
            style={{ background: "oklch(0.12 0.06 155 / 0.75)" }}
          >
            {activeIdx + 1}/{images.length}
          </div>

          {/* Zoom hint */}
          <div
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "oklch(1 0 0 / 0.85)" }}
          >
            <ZoomIn className="w-4 h-4 text-foreground" />
          </div>
        </button>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            className="flex gap-2 p-3 overflow-x-auto"
            style={{ background: "oklch(0.97 0.005 145)" }}
          >
            {images.map((src, idx) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: thumbnail strip position is stable
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  border:
                    activeIdx === idx
                      ? "2px solid oklch(0.32 0.11 155)"
                      : "2px solid transparent",
                  opacity: activeIdx === idx ? 1 : 0.65,
                }}
                aria-label={`ছবি ${idx + 1} দেখুন`}
              >
                <img
                  src={src}
                  alt={`থাম্বনেইল ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[activeIdx]}
              alt={`${listing.title} — বড় ছবি`}
              className="max-w-full max-h-full rounded-xl object-contain"
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const legalChecklist = [
  { id: 1, label: "CS/SA পর্চা মিলানো হয়েছে?" },
  { id: 2, label: "খাজনা হালনাগাদ আছে?" },
  { id: 3, label: "নামজারি করা আছে?" },
  { id: 4, label: "দলিল যাচাই করা হয়েছে?" },
  { id: 5, label: "মূল মালিকের পরিচয় যাচাই করা হয়েছে?" },
];

export function ListingDetailPage() {
  const { id } = useParams({ from: "/listings/$id" });
  const { identity } = useInternetIdentity();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [counterDialogOffer, setCounterDialogOffer] = useState<Offer | null>(
    null,
  );
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  const { listings } = useLocalListings();
  const listing = listings.find((l) => l.id === id) ?? null;
  const isLoading = false;
  const { data: history } = useGetPropertyHistory(id);
  const { data: soilReport } = useGetSoilReport(id);
  const { data: documents } = useGetDocuments(id);
  const {
    offers,
    submitOffer,
    counterOffer: localCounterOffer,
  } = useLocalOffers(id);

  const requestAccessMut = useRequestDocumentAccess();

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmitOffer = () => {
    if (!offerPrice || Number.isNaN(Number(offerPrice))) {
      toast.error("সঠিক মূল্য দিন");
      return;
    }
    if (!buyerName || !buyerPhone) {
      toast.error("নাম ও ফোন নম্বর দিন");
      return;
    }
    const offer: Offer = {
      id: `offer-${Date.now()}`,
      listingId: id,
      buyerId: identity?.getPrincipal().toString() ?? "anonymous",
      buyerName,
      buyerPhone,
      offerPrice: BigInt(Math.round(Number(offerPrice))),
      message: offerMessage,
      status: "pending_approval",
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    };
    try {
      submitOffer(offer);
      toast.success("অফার পাঠানো হয়েছে!");
      setOfferPrice("");
      setOfferMessage("");
      setBuyerName("");
      setBuyerPhone("");
    } catch {
      toast.error("অফার পাঠাতে সমস্যা হয়েছে");
    }
  };

  const handleCounterOffer = () => {
    if (!counterDialogOffer || !counterPrice) return;
    try {
      localCounterOffer(
        counterDialogOffer.id,
        BigInt(Math.round(Number(counterPrice))),
        counterMessage,
      );
      toast.success("পাল্টা অফার পাঠানো হয়েছে");
      setCounterDialogOffer(null);
    } catch {
      toast.error("পাল্টা অফার পাঠাতে সমস্যা হয়েছে");
    }
  };

  const handleRequestAccess = async (_docId: string) => {
    const request: DocumentAccessRequest = {
      id: `req-${Date.now()}`,
      listingId: id,
      requester: identity?.getPrincipal().toString() ?? "anonymous",
      status: "pending",
      createdAt: BigInt(Date.now() * 1_000_000),
    };
    try {
      await requestAccessMut.mutateAsync(request);
      toast.success("অ্যাক্সেস চাওয়া হয়েছে। বিক্রেতা অনুমোদন করলে দেখতে পাবেন।");
    } catch {
      toast.error("অ্যাক্সেস চাইতে সমস্যা হয়েছে");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-80 w-full rounded-xl mb-6" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          জমি পাওয়া যায়নি
        </h2>
        <Link to="/listings">
          <Button variant="outline" className="mt-4">
            জমির তালিকায় ফিরুন
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      data-ocid="listing.detail.panel"
      className="container max-w-6xl mx-auto px-4 py-8"
    >
      {/* Breadcrumb + Print/PDF buttons */}
      <div
        className="flex items-center justify-between gap-2 mb-6 flex-wrap"
        data-print-hide
      >
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/listings" className="hover:text-primary transition-colors">
            জমির তালিকা
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate max-w-48">
            {listing.title}
          </span>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => window.print()}
                  data-ocid="listing.print.button"
                >
                  <Printer className="w-3.5 h-3.5" />
                  প্রিন্ট করুন
                </Button>
              </TooltipTrigger>
              <TooltipContent>এই জমির তথ্য প্রিন্ট করুন</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => window.print()}
                  data-ocid="listing.pdf.button"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF ডাউনলোড
                </Button>
              </TooltipTrigger>
              <TooltipContent>PDF হিসেবে সংরক্ষণ করুন</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Image Gallery */}
      <ListingImageGallery listing={listing as ListingWithImages} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Price */}
          <div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>
                {listing.division} › {listing.district} › {listing.upazila}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 leading-snug">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {formatBDT(listing.price)}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {formatBDT(listing.pricePerDecimal)} প্রতি শতাংশ
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {formatArea(listing.area)}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/80 leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* ===== SPECIFICATION TABLE ===== */}
          <div className="bg-secondary/40 rounded-xl p-5">
            <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-primary" />
              জমির বিস্তারিত তথ্য
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "🏞️",
                  label: "জমির ধরন",
                  value: getLandTypeLabel(listing.landType),
                },
                {
                  icon: "🛣️",
                  label: "রাস্তার ধরন",
                  value: getRoadAccessLabel(listing.roadAccess),
                },
                {
                  icon: "📏",
                  label: "রাস্তার প্রশস্ততা",
                  value: listing.roadWidth || "অজানা",
                },
                {
                  icon: "🧭",
                  label: "দিকনির্দেশনা",
                  value: listing.orientation || "অজানা",
                },
                { icon: "📐", label: "আয়তন", value: formatArea(listing.area) },
                { icon: "📍", label: "ঠিকানা", value: listing.address },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-lg p-3 flex items-center gap-3 border border-border"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="font-semibold text-foreground text-sm mt-0.5">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== PROPERTY HISTORY TIMELINE ===== */}
          {history && history.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                মালিকানার ইতিহাস
              </h2>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-primary/20" />
                {history
                  .sort((a, b) => Number(a.year) - Number(b.year))
                  .map((h, i) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative mb-4 last:mb-0"
                    >
                      <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                      <div className="bg-white border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-primary text-sm">
                            {h.year.toString()} সাল
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {h.event}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {h.previousOwner} →{" "}
                          <strong className="text-foreground">
                            {h.currentOwner}
                          </strong>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* ===== SOIL REPORT ===== */}
          {soilReport && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h2 className="font-heading font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                মাটি ও পরিবেশ রিপোর্ট
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    মাটির ধরন
                  </div>
                  <div className="font-semibold text-emerald-700 text-sm">
                    {soilReport.soilType}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    বন্যার ঝুঁকি
                  </div>
                  <div
                    className={`font-semibold text-sm ${
                      soilReport.floodRisk === "কম"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {soilReport.floodRisk}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    পানি জমা
                  </div>
                  <div
                    className={`font-semibold text-sm ${
                      soilReport.waterLogging === "নেই"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {soilReport.waterLogging}
                  </div>
                </div>
              </div>
              {soilReport.notes && (
                <p className="mt-3 text-sm text-emerald-700 bg-white rounded-lg p-3 border border-emerald-100">
                  {soilReport.notes}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                রিপোর্ট: {soilReport.reportedBy} •{" "}
                {formatDate(soilReport.reportDate)}
              </p>
            </div>
          )}

          {/* ===== DOCUMENT VAULT ===== */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h2 className="font-heading font-bold text-blue-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ডিজিটাল ডকুমেন্ট ভল্ট
            </h2>
            {documents && documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-lg p-3 flex items-center justify-between border border-blue-100"
                  >
                    <div className="flex items-center gap-2">
                      {doc.isPublic ? (
                        <Unlock className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-600" />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {doc.fileName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {doc.docType}
                      </Badge>
                    </div>
                    {doc.isPublic ? (
                      <Button size="sm" variant="outline" className="text-xs">
                        ডাউনলোড
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        data-ocid="listing.document.request.button"
                        onClick={() => handleRequestAccess(doc.id)}
                        disabled={requestAccessMut.isPending}
                      >
                        অ্যাক্সেস চাইন
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-blue-600">কোনো ডকুমেন্ট আপলোড করা হয়নি</p>
            )}
          </div>

          {/* ===== LEGAL CHECKLIST ===== */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="font-heading font-bold text-amber-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              আইনি চেকলিস্ট
            </h2>
            <div className="space-y-2">
              {legalChecklist.map((item, i) => (
                <div
                  key={item.id}
                  data-ocid={`listing.checklist.item.${i + 1}`}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className="shrink-0"
                  >
                    {checkedItems.includes(item.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-amber-400" />
                    )}
                  </button>
                  <span
                    className={`text-sm ${
                      checkedItems.includes(item.id)
                        ? "line-through text-muted-foreground"
                        : "text-amber-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            {checkedItems.length === legalChecklist.length && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                সব চেক করা হয়েছে! জমি কিনতে প্রস্তুত।
              </div>
            )}
          </div>

          {/* ===== OFFER PORTAL ===== */}
          <div
            className="bg-white border border-border rounded-xl p-5 shadow-card"
            data-print-hide
          >
            <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              অফার পোর্টাল
            </h2>

            {/* Submit offer form */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    আপনার নাম
                  </Label>
                  <Input
                    placeholder="নাম দিন"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    ফোন নম্বর
                  </Label>
                  <Input
                    placeholder="01XXXXXXXXX"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  অফার মূল্য (টাকা)
                </Label>
                <Input
                  data-ocid="listing.offer.input"
                  type="number"
                  placeholder={`যেমন: ${Number(listing.price) * 0.9}`}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  বার্তা (ঐচ্ছিক)
                </Label>
                <Textarea
                  placeholder="বিক্রেতাকে কিছু বলুন..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                />
              </div>
              <Button
                onClick={handleSubmitOffer}
                data-ocid="listing.offer.submit_button"
                className="w-full bg-primary hover:bg-primary/90 shadow-green"
              >
                <Send className="w-4 h-4 mr-2" />
                অফার পাঠান
              </Button>
            </div>

            {/* Offer history */}
            {offers.length > 0 && (
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  অফারের ইতিহাস
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-muted/50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-primary">
                          {formatBDT(offer.offerPrice)}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            offer.status === "accepted"
                              ? "border-emerald-500 text-emerald-600"
                              : offer.status === "rejected"
                                ? "border-red-500 text-red-600"
                                : ""
                          }`}
                        >
                          {getStatusLabel(offer.status)}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {offer.buyerName} • {formatDate(offer.createdAt)}
                      </div>
                      {offer.message && (
                        <p className="text-xs mt-1">{offer.message}</p>
                      )}
                      {offer.counterPrice && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                          <strong>পাল্টা অফার:</strong>{" "}
                          {formatBDT(offer.counterPrice)}
                          {offer.counterMessage && (
                            <span> — {offer.counterMessage}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Contact Card */}
          <div
            className="bg-white border border-border rounded-xl p-5 shadow-card sticky top-24"
            data-print-hide
          >
            <h3 className="font-heading font-bold text-foreground mb-4">
              বিক্রেতার সাথে যোগাযোগ করুন
            </h3>
            <div className="mb-4">
              <div className="font-semibold text-foreground">
                {listing.sellerName}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                মালিক / বিক্রেতা
              </div>
            </div>

            {listing.sellerPhone && (
              <a
                href={`tel:${listing.sellerPhone}`}
                data-ocid="listing.contact.button"
              >
                <Button className="w-full mb-2 gap-2 bg-primary hover:bg-primary/90">
                  <Phone className="w-4 h-4" />
                  কল করুন
                </Button>
              </a>
            )}

            {listing.sellerWhatsapp && (
              <a
                href={`https://wa.me/88${listing.sellerWhatsapp.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp করুন
                </Button>
              </a>
            )}

            <p className="text-xs text-muted-foreground mt-3 text-center">
              সরাসরি মালিকের সাথে কথা বলুন
            </p>
          </div>

          {/* Quick specs */}
          <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Ruler className="w-4 h-4" /> আয়তন
              </span>
              <span className="font-semibold">{formatArea(listing.area)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Route className="w-4 h-4" /> রাস্তা
              </span>
              <span className="font-semibold">
                {getRoadAccessLabel(listing.roadAccess)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> দিকনির্দেশনা
              </span>
              <span className="font-semibold">
                {listing.orientation || "অজানা"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> বিভাগ
              </span>
              <span className="font-semibold">{listing.division}</span>
            </div>
          </div>

          {/* Share / Compare */}
          <Link to="/compare" data-print-hide>
            <Button variant="outline" className="w-full gap-2 text-sm">
              <ArrowLeftRight className="w-4 h-4" />
              তুলনা করুন
            </Button>
          </Link>
        </div>
      </div>

      {/* Counter offer dialog */}
      <Dialog
        open={!!counterDialogOffer}
        onOpenChange={(open) => !open && setCounterDialogOffer(null)}
        data-print-hide
      >
        <DialogContent data-ocid="listing.dialog">
          <DialogHeader>
            <DialogTitle>পাল্টা অফার দিন</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-sm">পাল্টা মূল্য (টাকা)</Label>
              <Input
                type="number"
                placeholder="মূল্য দিন"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">বার্তা</Label>
              <Textarea
                placeholder="ক্রেতাকে বলুন..."
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCounterDialogOffer(null)}
              data-ocid="listing.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleCounterOffer}
              data-ocid="listing.confirm_button"
            >
              পাল্টা অফার পাঠান
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
