import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNewsArticle, useGetPublishedNews } from "@/hooks/useQueries";
import { formatDate } from "@/utils/format";
import {
  ArrowLeft,
  Calendar,
  Newspaper,
  Search,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const CATEGORIES = ["আইন", "বাজারদর", "সরকারি প্রজ্ঞাপন"];

const categoryColors: Record<string, string> = {
  আইন: "bg-blue-100 text-blue-700 border-blue-200",
  বাজারদর: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "সরকারি প্রজ্ঞাপন": "bg-amber-100 text-amber-700 border-amber-200",
};

function NewsArticleDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: article, isLoading } = useGetNewsArticle(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl mb-6" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <div className="space-y-3">
          {["l1", "l2", "l3", "l4", "l5", "l6"].map((k) => (
            <Skeleton key={k} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">সংবাদ পাওয়া যায়নি</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> ফিরুন
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4 mr-2" /> সংবাদ তালিকায় ফিরুন
      </Button>

      <div className="mb-4">
        {article.category && (
          <Badge
            className={`text-xs mb-3 ${categoryColors[article.category] ?? "bg-secondary"}`}
          >
            <Tag className="w-3 h-3 mr-1" />
            {article.category}
          </Badge>
        )}
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-snug mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>

      {/* Article image placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl mb-6 flex items-center justify-center">
        <Newspaper className="w-12 h-12 text-primary/20" />
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </motion.div>
  );
}

export function NewsPage() {
  const { data: news, isLoading } = useGetPublishedNews();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );

  if (selectedArticleId) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <NewsArticleDetail
          id={selectedArticleId}
          onBack={() => setSelectedArticleId(null)}
        />
      </div>
    );
  }

  const filtered = (news ?? []).filter((a) => {
    const matchCat =
      selectedCategory === "all" || a.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      a.title.includes(searchQuery) ||
      a.content.includes(searchQuery);
    return matchCat && matchSearch;
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
          ভূমি সংবাদ
        </h1>
        <p className="text-muted-foreground">
          জমি সংক্রান্ত সর্বশেষ আইন, বাজার দর ও সরকারি প্রজ্ঞাপন
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="সংবাদ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-primary" : ""}
          >
            সব
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "bg-primary" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* News grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["a", "b", "c", "d"].map((k) => (
            <div
              key={k}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedArticleId(article.id)}
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-primary/15 to-primary/5 relative flex items-center justify-center">
                <Newspaper className="w-10 h-10 text-primary/20" />
                {article.category && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`text-xs ${categoryColors[article.category] ?? "bg-secondary"}`}
                    >
                      {article.category}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-heading font-bold text-foreground text-base leading-snug mb-2 hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">কোনো সংবাদ পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}
