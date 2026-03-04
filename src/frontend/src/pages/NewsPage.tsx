import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalNews } from "@/hooks/useLocalStore";
import { formatDate } from "@/utils/format";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
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

const categoryBgGradients: Record<string, string> = {
  আইন: "from-blue-900/70 to-blue-700/50",
  বাজারদর: "from-emerald-900/70 to-emerald-700/50",
  "সরকারি প্রজ্ঞাপন": "from-amber-900/70 to-amber-700/50",
};

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function NewsArticleDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { news } = useLocalNews();
  const article = news.find((a) => a.id === id) ?? null;

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

  const readTime = estimateReadingTime(article.content);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2"
        data-ocid="news.back.button"
      >
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            পড়তে {readTime} মিনিট
          </span>
        </div>
      </div>

      {/* Article image */}
      <div
        className={`h-56 bg-gradient-to-br ${categoryBgGradients[article.category ?? ""] ?? "from-primary/20 to-primary/5"} rounded-xl mb-6 flex items-center justify-center`}
      >
        <Newspaper className="w-14 h-14 text-white/20" />
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </motion.div>
  );
}

export function NewsPage() {
  const { news: allNews } = useLocalNews();
  const news = allNews.filter((a) => a.isPublished);
  const isLoading = false;
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

  const filtered = news.filter((a) => {
    const matchCat =
      selectedCategory === "all" || a.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      a.title.includes(searchQuery) ||
      a.content.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const featuredArticle = filtered.length > 0 ? filtered[0] : null;
  const restArticles = filtered.length > 1 ? filtered.slice(1) : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary/5 border-b border-border py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                ভূমি সংবাদ
              </h1>
              <p className="text-muted-foreground">
                জমি সংক্রান্ত সর্বশেষ আইন, বাজার দর ও সরকারি প্রজ্ঞাপন
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="সংবাদ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-ocid="news.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-primary" : ""}
              data-ocid="news.all.tab"
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
                data-ocid="news.category.tab"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
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
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-10">
            {/* Featured top article */}
            {featuredArticle && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedArticleId(featuredArticle.id)}
                data-ocid="news.featured.card"
              >
                <div className="md:flex">
                  {/* Featured image area */}
                  <div
                    className={`md:w-2/5 h-56 md:h-auto bg-gradient-to-br ${categoryBgGradients[featuredArticle.category ?? ""] ?? "from-primary/30 to-primary/10"} relative flex items-center justify-center shrink-0`}
                  >
                    <Newspaper className="w-16 h-16 text-white/20" />
                    {featuredArticle.category && (
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={`text-xs ${categoryColors[featuredArticle.category] ?? "bg-secondary"}`}
                        >
                          {featuredArticle.category}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <Badge className="gold-badge text-xs px-2 py-0.5">
                        শীর্ষ সংবাদ
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="font-heading font-bold text-foreground text-xl md:text-2xl leading-snug mb-3 hover:text-primary transition-colors line-clamp-3">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {featuredArticle.content.substring(0, 200)}...
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {featuredArticle.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(featuredArticle.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          পড়তে {estimateReadingTime(featuredArticle.content)}{" "}
                          মিনিট
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 gap-1 text-xs"
                      >
                        পুরোটা পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Rest of articles grid */}
            {restArticles.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  আরও সংবাদ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restArticles.map((article, i) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i + 1) * 0.05 }}
                      whileHover={{ y: -4 }}
                      data-ocid={`news.item.${i + 1}`}
                      className="bg-white rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedArticleId(article.id)}
                    >
                      {/* Thumbnail */}
                      <div
                        className={`h-40 bg-gradient-to-br ${categoryBgGradients[article.category ?? ""] ?? "from-primary/20 to-primary/5"} relative flex items-center justify-center`}
                      >
                        <Newspaper className="w-10 h-10 text-white/20" />
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
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                          {article.content.substring(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-primary/60">
                            <Clock className="w-3 h-3" />
                            {estimateReadingTime(article.content)} মিনিট
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            data-ocid="news.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">কোনো সংবাদ পাওয়া যায়নি</p>
            <p className="text-sm mt-2">ভিন্ন বিভাগ বা কীওয়ার্ড ব্যবহার করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}
