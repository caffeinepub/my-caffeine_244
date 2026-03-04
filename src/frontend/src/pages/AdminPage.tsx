import type { LandListing, Lawyer, NewsArticle } from "@/backend.d";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useCreateLawyer,
  useCreateListing,
  useCreateNewsArticle,
  useDeleteLawyer,
  useDeleteListing,
  useDeleteNewsArticle,
  useGetAllLawyers,
  useGetAllListings,
  useGetAllNews,
  useIsAdmin,
  useToggleFeatured,
  useUpdateLawyer,
  useUpdateListing,
  useUpdateNewsArticle,
} from "@/hooks/useQueries";
import {
  DIVISIONS as BD_DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
} from "@/utils/bangladeshData";
import { formatBDT, getLandTypeLabel, getStatusLabel } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Info,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPin,
  MessageSquare,
  Newspaper,
  Pencil,
  Plus,
  Scale,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function AdminLogin() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    {
      icon: ShieldCheck,
      title: "নিরাপদ যাচাইকরণ",
      desc: "Internet Identity দিয়ে সুরক্ষিত অ্যাক্সেস",
    },
    {
      icon: MapPin,
      title: "লিস্টিং পরিচালনা",
      desc: "সকল জমির বিজ্ঞাপন সরাসরি নিয়ন্ত্রণ",
    },
    {
      icon: Scale,
      title: "আইনি তথ্য ব্যবস্থাপনা",
      desc: "আইনজীবী ও নথিপত্র সম্পূর্ণ নিয়ন্ত্রণ",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative bg-primary flex-col justify-between p-12 overflow-hidden">
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
          style={{
            background: "oklch(1 0 0 / 0.04)",
          }}
        />
        <div
          className="absolute top-1/3 -left-16 w-64 h-64 rounded-full"
          style={{ background: "oklch(1 0 0 / 0.03)" }}
        />
        <div
          className="absolute -bottom-16 right-12 w-80 h-80 rounded-full"
          style={{ background: "oklch(1 0 0 / 0.05)" }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.12)" }}
            >
              <MapPin
                className="w-6 h-6"
                style={{ color: "oklch(0.88 0.16 78)" }}
              />
            </div>
            <div>
              <span
                className="text-2xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', system-ui",
                  color: "oklch(0.97 0.01 120)",
                }}
              >
                জমিবাজার
              </span>
              <div
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: "oklch(1 0 0 / 0.5)" }}
              >
                Bangladesh Land Marketplace
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tagline + Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <h2
            className="text-3xl xl:text-4xl font-extrabold leading-tight mb-3"
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui",
              color: "oklch(0.97 0.01 120)",
            }}
          >
            বাংলাদেশের সেরা
            <br />
            <span style={{ color: "oklch(0.88 0.16 78)" }}>ডিজিটাল জমি</span>
            <br />
            মার্কেটপ্লেস
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "oklch(1 0 0 / 0.55)" }}
          >
            সরাসরি মালিকের সাথে কেনাবেচা — দালাল ছাড়া, ঝামেলা ছাড়া
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "oklch(1 0 0 / 0.1)" }}
                >
                  <f.icon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.88 0.16 78)" }}
                  />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.95 0.01 120)" }}
                  >
                    {f.title}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(1 0 0 / 0.5)" }}
                  >
                    {f.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10"
          style={{ color: "oklch(1 0 0 / 0.35)" }}
        >
          <p className="text-xs">
            © {new Date().getFullYear()} জমিবাজার। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </motion.div>
      </div>

      {/* ── Right Login Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span
              className="text-xl font-extrabold text-foreground"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
            >
              জমিবাজার
            </span>
          </div>

          {/* Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-8 sm:p-10">
            {/* Badge */}
            <div className="mb-6">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
                style={{
                  background: "oklch(var(--primary) / 0.08)",
                  borderColor: "oklch(var(--primary) / 0.2)",
                  color: "oklch(var(--primary))",
                }}
              >
                <ShieldCheck className="w-3 h-3" />
                অ্যাডমিন পোর্টাল
              </span>
            </div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-6"
            >
              <h1
                className="text-3xl font-extrabold text-foreground mb-1.5"
                style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
              >
                স্বাগতম
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                অ্যাডমিন প্যানেল পরিচালনার জন্য
                <br />
                আপনার পরিচয় যাচাই করুন
              </p>
            </motion.div>

            {/* Info box */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl p-4 mb-6 flex gap-3"
              style={{
                background: "oklch(0.55 0.14 200 / 0.07)",
                borderLeft: "3px solid oklch(0.55 0.14 200 / 0.5)",
              }}
            >
              <Info
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "oklch(0.45 0.14 200)" }}
              />
              <div>
                <p
                  className="text-xs font-semibold mb-0.5"
                  style={{ color: "oklch(0.35 0.12 200)" }}
                >
                  Internet Identity লগইন
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.45 0.1 200)" }}
                >
                  আপনার ICP ডিজিটাল পরিচয় ব্যবহার করে নিরাপদে প্রবেশ করুন। কোনো পাসওয়ার্ড
                  প্রয়োজন নেই।
                </p>
              </div>
            </motion.div>

            {/* Login button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Button
                onClick={() => login()}
                disabled={isLoggingIn}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200"
                data-ocid="admin.login.submit_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    যাচাই করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    লগইন করুন
                  </>
                )}
              </Button>
            </motion.div>

            {/* Security note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-4 flex items-center justify-center gap-1.5"
            >
              <LockKeyhole className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                256-bit এনক্রিপশন দ্বারা সুরক্ষিত সংযোগ
              </p>
            </motion.div>
          </div>

          {/* Back to homepage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← হোমপেজে ফিরুন
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">
          অ্যাক্সেস নেই
        </h2>
        <p className="text-sm text-muted-foreground">
          এই পেজটি শুধুমাত্র অ্যাডমিনদের জন্য
        </p>
      </div>
    </div>
  );
}

// ===== LISTINGS MANAGEMENT =====
function ListingsManagement() {
  const { data: listings, isLoading } = useGetAllListings();
  const deleteMut = useDeleteListing();
  const toggleFeaturedMut = useToggleFeatured();
  const createMut = useCreateListing();
  const updateMut = useUpdateListing();
  const [editListing, setEditListing] = useState<LandListing | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyListing: LandListing = {
    id: `listing-${Date.now()}`,
    title: "",
    description: "",
    division: "ঢাকা",
    district: "",
    upazila: "",
    address: "",
    area: 0,
    price: BigInt(0),
    pricePerDecimal: BigInt(0),
    landType: "vita",
    roadAccess: "paved",
    roadWidth: "",
    orientation: "",
    isFeatured: false,
    isVerified: false,
    verifiedBadge: "",
    sellerId: "admin",
    sellerName: "",
    sellerPhone: "",
    sellerWhatsapp: "",
    status: "active",
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  };

  const [form, setForm] = useState<LandListing>(emptyListing);

  // Cascading location dropdowns
  const adminAvailableDistricts = form.division
    ? getDistrictsForDivision(form.division)
    : [];
  const adminAvailableUpazilas = form.district
    ? getUpazilasForDistrict(form.district)
    : [];

  const openCreate = () => {
    setForm({
      ...emptyListing,
      id: `listing-${Date.now()}`,
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    });
    setEditListing(null);
    setShowForm(true);
  };

  const openEdit = (l: LandListing) => {
    setForm(l);
    setEditListing(l);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.district) {
      toast.error("শিরোনাম ও জেলা আবশ্যক");
      return;
    }
    try {
      if (editListing) {
        await updateMut.mutateAsync({
          ...form,
          updatedAt: BigInt(Date.now() * 1_000_000),
        });
        toast.success("আপডেট হয়েছে");
      } else {
        await createMut.mutateAsync(form);
        toast.success("নতুন লিস্টিং যোগ করা হয়েছে");
      }
      setShowForm(false);
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">
          লিস্টিং ব্যবস্থাপনা ({listings?.length ?? 0})
        </h3>
        <Button
          size="sm"
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 gap-1.5"
        >
          <Plus className="w-4 h-4" /> নতুন লিস্টিং
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
          <Table data-ocid="admin.listings.table">
            <TableHeader>
              <TableRow>
                <TableHead>শিরোনাম</TableHead>
                <TableHead>অবস্থান</TableHead>
                <TableHead>মূল্য</TableHead>
                <TableHead>ধরন</TableHead>
                <TableHead>অবস্থা</TableHead>
                <TableHead>বৈশিষ্ট্য</TableHead>
                <TableHead>ক্রিয়া</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(listings ?? []).map((l, i) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-sm max-w-xs">
                    <span className="line-clamp-1">{l.title}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {l.district}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-primary">
                    {formatBDT(l.price)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getLandTypeLabel(l.landType)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={l.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {getStatusLabel(l.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      data-ocid={`admin.listing.featured.toggle.${i + 1}`}
                      checked={l.isFeatured}
                      onCheckedChange={() => toggleFeaturedMut.mutate(l.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        data-ocid={`admin.listing.edit_button.${i + 1}`}
                        onClick={() => openEdit(l)}
                        className="h-7 w-7 p-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-ocid={`admin.listing.delete_button.${i + 1}`}
                        onClick={() => handleDelete(l.id)}
                        disabled={deleteMut.isPending}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Listing Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.listings.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editListing ? "লিস্টিং সম্পাদনা" : "নতুন লিস্টিং"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">শিরোনাম *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">বিভাগ *</Label>
              <Select
                value={form.division}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    division: v,
                    district: "",
                    upazila: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BD_DIVISIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">জেলা *</Label>
              <Select
                value={form.district}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, district: v, upazila: "" }))
                }
                disabled={adminAvailableDistricts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="জেলা বেছে নিন" />
                </SelectTrigger>
                <SelectContent>
                  {adminAvailableDistricts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">উপজেলা</Label>
              <Select
                value={form.upazila}
                onValueChange={(v) => setForm((p) => ({ ...p, upazila: v }))}
                disabled={adminAvailableUpazilas.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="উপজেলা বেছে নিন" />
                </SelectTrigger>
                <SelectContent>
                  {adminAvailableUpazilas.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ঠিকানা</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">আয়তন (শতাংশ)</Label>
              <Input
                type="number"
                value={form.area}
                onChange={(e) =>
                  setForm((p) => ({ ...p, area: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">মোট মূল্য (টাকা)</Label>
              <Input
                type="number"
                value={Number(form.price)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    price: BigInt(Math.round(Number(e.target.value))),
                    pricePerDecimal:
                      p.area > 0
                        ? BigInt(Math.round(Number(e.target.value) / p.area))
                        : BigInt(0),
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">জমির ধরন</Label>
              <Select
                value={form.landType}
                onValueChange={(v) => setForm((p) => ({ ...p, landType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vita">ভিটা</SelectItem>
                  <SelectItem value="nala">নালা</SelectItem>
                  <SelectItem value="samatal">সমতল</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">রাস্তার ধরন</Label>
              <Select
                value={form.roadAccess}
                onValueChange={(v) => setForm((p) => ({ ...p, roadAccess: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paved">পিচ ঢালাই</SelectItem>
                  <SelectItem value="brick">ইটের রাস্তা</SelectItem>
                  <SelectItem value="none">রাস্তা নেই</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">রাস্তার প্রশস্ততা</Label>
              <Input
                value={form.roadWidth}
                onChange={(e) =>
                  setForm((p) => ({ ...p, roadWidth: e.target.value }))
                }
                placeholder="যেমন: ১৬ ফুট"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">বিক্রেতার নাম</Label>
              <Input
                value={form.sellerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sellerName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">বিক্রেতার ফোন</Label>
              <Input
                value={form.sellerPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sellerPhone: e.target.value }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">বিবরণ</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isVerified}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isVerified: v }))
                }
              />
              <Label className="text-xs">যাচাইকৃত</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isFeatured: v }))
                }
              />
              <Label className="text-xs">বৈশিষ্ট্যময়</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="admin.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMut.isPending || updateMut.isPending}
              data-ocid="admin.save_button"
            >
              {createMut.isPending || updateMut.isPending
                ? "সংরক্ষণ হচ্ছে..."
                : "সংরক্ষণ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== LAWYERS MANAGEMENT =====
function LawyersManagement() {
  const { data: lawyers, isLoading } = useGetAllLawyers();
  const createMut = useCreateLawyer();
  const updateMut = useUpdateLawyer();
  const deleteMut = useDeleteLawyer();
  const [showForm, setShowForm] = useState(false);
  const [editLawyer, setEditLawyer] = useState<Lawyer | null>(null);

  const emptyLawyer: Lawyer = {
    id: `lawyer-${Date.now()}`,
    name: "",
    specialization: "",
    phone: "",
    email: "",
    location: "",
    consultationFee: BigInt(0),
    description: "",
    isAvailable: true,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  };
  const [form, setForm] = useState<Lawyer>(emptyLawyer);

  const openCreate = () => {
    setForm({
      ...emptyLawyer,
      id: `lawyer-${Date.now()}`,
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    });
    setEditLawyer(null);
    setShowForm(true);
  };

  const openEdit = (l: Lawyer) => {
    setForm(l);
    setEditLawyer(l);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error("নাম ও ফোন আবশ্যক");
      return;
    }
    try {
      if (editLawyer) {
        await updateMut.mutateAsync({
          ...form,
          updatedAt: BigInt(Date.now() * 1_000_000),
        });
        toast.success("আপডেট হয়েছে");
      } else {
        await createMut.mutateAsync(form);
        toast.success("আইনজীবী যোগ করা হয়েছে");
      }
      setShowForm(false);
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">
          আইনজীবী ব্যবস্থাপনা ({lawyers?.length ?? 0})
        </h3>
        <Button
          size="sm"
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 gap-1.5"
        >
          <Plus className="w-4 h-4" /> নতুন আইনজীবী
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
          <Table data-ocid="admin.lawyers.table">
            <TableHeader>
              <TableRow>
                <TableHead>নাম</TableHead>
                <TableHead>বিশেষজ্ঞতা</TableHead>
                <TableHead>ফোন</TableHead>
                <TableHead>ফি</TableHead>
                <TableHead>উপলব্ধ</TableHead>
                <TableHead>ক্রিয়া</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(lawyers ?? []).map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-sm">
                    {l.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {l.specialization}
                  </TableCell>
                  <TableCell className="text-sm">{l.phone}</TableCell>
                  <TableCell className="text-sm font-semibold text-primary">
                    {formatBDT(l.consultationFee)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${l.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"}`}
                    >
                      {l.isAvailable ? "হ্যাঁ" : "না"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(l)}
                        className="h-7 w-7 p-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMut.mutate(l.id)}
                        disabled={deleteMut.isPending}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent data-ocid="admin.lawyers.dialog">
          <DialogHeader>
            <DialogTitle>
              {editLawyer ? "আইনজীবী সম্পাদনা" : "নতুন আইনজীবী"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">নাম *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">বিশেষজ্ঞতা</Label>
              <Input
                value={form.specialization}
                onChange={(e) =>
                  setForm((p) => ({ ...p, specialization: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ফোন *</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ইমেইল</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">অবস্থান</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">পরামর্শ ফি (টাকা)</Label>
              <Input
                type="number"
                value={Number(form.consultationFee)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    consultationFee: BigInt(Math.round(Number(e.target.value))),
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isAvailable}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isAvailable: v }))
                }
              />
              <Label className="text-xs">উপলব্ধ</Label>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">বিবরণ</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="admin.lawyers.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMut.isPending || updateMut.isPending}
              data-ocid="admin.lawyers.save_button"
            >
              সংরক্ষণ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== NEWS MANAGEMENT =====
function NewsManagement() {
  const { data: news, isLoading } = useGetAllNews();
  const createMut = useCreateNewsArticle();
  const updateMut = useUpdateNewsArticle();
  const deleteMut = useDeleteNewsArticle();
  const [showForm, setShowForm] = useState(false);
  const [editArticle, setEditArticle] = useState<NewsArticle | null>(null);

  const emptyArticle: NewsArticle = {
    id: `news-${Date.now()}`,
    title: "",
    content: "",
    category: "আইন",
    isPublished: false,
    publishedAt: BigInt(Date.now() * 1_000_000),
    author: "",
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  };
  const [form, setForm] = useState<NewsArticle>(emptyArticle);

  const openCreate = () => {
    setForm({
      ...emptyArticle,
      id: `news-${Date.now()}`,
      createdAt: BigInt(Date.now() * 1_000_000),
      updatedAt: BigInt(Date.now() * 1_000_000),
    });
    setEditArticle(null);
    setShowForm(true);
  };

  const openEdit = (a: NewsArticle) => {
    setForm(a);
    setEditArticle(a);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("শিরোনাম ও বিষয়বস্তু আবশ্যক");
      return;
    }
    try {
      if (editArticle) {
        await updateMut.mutateAsync({
          ...form,
          updatedAt: BigInt(Date.now() * 1_000_000),
        });
        toast.success("আপডেট হয়েছে");
      } else {
        await createMut.mutateAsync(form);
        toast.success("সংবাদ প্রকাশিত হয়েছে");
      }
      setShowForm(false);
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">
          সংবাদ ব্যবস্থাপনা ({news?.length ?? 0})
        </h3>
        <Button
          size="sm"
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 gap-1.5"
        >
          <Plus className="w-4 h-4" /> নতুন সংবাদ
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-card">
          <Table data-ocid="admin.news.table">
            <TableHeader>
              <TableRow>
                <TableHead>শিরোনাম</TableHead>
                <TableHead>বিভাগ</TableHead>
                <TableHead>লেখক</TableHead>
                <TableHead>প্রকাশিত</TableHead>
                <TableHead>ক্রিয়া</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(news ?? []).map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-sm max-w-xs">
                    <span className="line-clamp-1">{a.title}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.category}
                  </TableCell>
                  <TableCell className="text-sm">{a.author}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${a.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                    >
                      {a.isPublished ? "হ্যাঁ" : "না"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(a)}
                        className="h-7 w-7 p-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMut.mutate(a.id)}
                        disabled={deleteMut.isPending}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.news.dialog"
        >
          <DialogHeader>
            <DialogTitle>{editArticle ? "সংবাদ সম্পাদনা" : "নতুন সংবাদ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs">শিরোনাম *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">বিভাগ</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="আইন">আইন</SelectItem>
                    <SelectItem value="বাজারদর">বাজারদর</SelectItem>
                    <SelectItem value="সরকারি প্রজ্ঞাপন">সরকারি প্রজ্ঞাপন</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">লেখক</Label>
                <Input
                  value={form.author}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, author: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">বিষয়বস্তু *</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={8}
                className="resize-none"
                data-ocid="admin.news.editor"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    isPublished: v,
                    publishedAt: v
                      ? BigInt(Date.now() * 1_000_000)
                      : p.publishedAt,
                  }))
                }
              />
              <Label className="text-xs">প্রকাশিত</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="admin.news.cancel_button"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMut.isPending || updateMut.isPending}
              data-ocid="admin.news.save_button"
            >
              সংরক্ষণ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminPage() {
  const { identity, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: listings } = useGetAllListings();
  const { data: lawyers } = useGetAllLawyers();
  const { data: news } = useGetAllNews();

  if (!identity) return <AdminLogin />;
  if (adminLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!isAdmin) return <AccessDenied />;

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal =
    principal.length > 16
      ? `${principal.slice(0, 8)}...${principal.slice(-6)}`
      : principal;

  const dashStats = [
    {
      label: "মোট লিস্টিং",
      value: listings?.length ?? 0,
      icon: MapPin,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "আইনজীবী",
      value: lawyers?.length ?? 0,
      icon: Scale,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "সংবাদ",
      value: news?.length ?? 0,
      icon: Newspaper,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "প্রকাশিত সংবাদ",
      value: news?.filter((n) => n.isPublished).length ?? 0,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div>
      {/* ── Gradient Admin Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 155) 0%, oklch(0.28 0.1 155) 50%, oklch(0.24 0.09 165) 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Decorative circle */}
        <div
          className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: "oklch(0.88 0.16 78)" }}
        />

        <div className="relative z-10 container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(1 0 0 / 0.12)" }}
              >
                <ShieldCheck
                  className="w-5 h-5"
                  style={{ color: "oklch(0.88 0.16 78)" }}
                />
              </div>
              <div>
                <h1
                  className="text-xl font-extrabold leading-tight"
                  style={{
                    fontFamily: "'Bricolage Grotesque', system-ui",
                    color: "oklch(0.97 0.01 120)",
                  }}
                >
                  অ্যাডমিন প্যানেল
                </h1>
                <p className="text-xs" style={{ color: "oklch(1 0 0 / 0.5)" }}>
                  জমিবাজার ব্যবস্থাপনা কেন্দ্র
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Identity badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "oklch(1 0 0 / 0.08)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.88 0.16 78 / 0.2)" }}
                >
                  <ShieldCheck
                    className="w-3 h-3"
                    style={{ color: "oklch(0.88 0.16 78)" }}
                  />
                </div>
                <span
                  className="text-xs font-mono font-medium"
                  style={{ color: "oklch(1 0 0 / 0.65)" }}
                >
                  {shortPrincipal}
                </span>
              </div>

              {/* Logout button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                data-ocid="admin.header.logout_button"
                className="gap-1.5 text-xs border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
                style={{
                  color: "oklch(1 0 0 / 0.75)",
                  background: "oklch(1 0 0 / 0.06)",
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                লগআউট
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Section sub-header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground">
            সকল লিস্টিং, আইনজীবী এবং সংবাদ এখান থেকে পরিচালনা করুন
          </p>
        </motion.div>

        {/* Dashboard stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {dashStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-border p-4 shadow-card"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-heading font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Management tabs */}
        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger
              value="listings"
              data-ocid="admin.listings.tab"
              className="gap-1.5"
            >
              <MapPin className="w-4 h-4" /> লিস্টিং
            </TabsTrigger>
            <TabsTrigger
              value="lawyers"
              data-ocid="admin.lawyers.tab"
              className="gap-1.5"
            >
              <Scale className="w-4 h-4" /> আইনজীবী
            </TabsTrigger>
            <TabsTrigger
              value="news"
              data-ocid="admin.news.tab"
              className="gap-1.5"
            >
              <Newspaper className="w-4 h-4" /> সংবাদ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <ListingsManagement />
          </TabsContent>
          <TabsContent value="lawyers">
            <LawyersManagement />
          </TabsContent>
          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
