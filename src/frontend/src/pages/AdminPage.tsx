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
import { formatBDT, getLandTypeLabel, getStatusLabel } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogIn,
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

function AdminLogin() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-border p-8 text-center max-w-sm w-full shadow-card"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">
          অ্যাডমিন প্যানেল
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          অ্যাডমিন প্যানেলে প্রবেশ করতে লগইন করুন
        </p>
        <Button
          onClick={() => login()}
          disabled={isLoggingIn}
          className="w-full bg-primary hover:bg-primary/90 shadow-green"
          size="lg"
        >
          <LogIn className="w-4 h-4 mr-2" />
          {isLoggingIn ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </Button>
      </motion.div>
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
                onValueChange={(v) => setForm((p) => ({ ...p, division: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">জেলা *</Label>
              <Input
                value={form.district}
                onChange={(e) =>
                  setForm((p) => ({ ...p, district: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">উপজেলা</Label>
              <Input
                value={form.upazila}
                onChange={(e) =>
                  setForm((p) => ({ ...p, upazila: e.target.value }))
                }
              />
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
  const { identity } = useInternetIdentity();
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
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              অ্যাডমিন প্যানেল
            </h1>
            <p className="text-sm text-muted-foreground">
              জমিবাজার ব্যবস্থাপনা কেন্দ্র
            </p>
          </div>
        </div>
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
  );
}
