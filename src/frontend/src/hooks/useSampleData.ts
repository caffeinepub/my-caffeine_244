import { useEffect, useRef } from "react";
import type {
  LandListing,
  Lawyer,
  NewsArticle,
  PropertyHistory,
  SoilReport,
} from "../backend.d";
import { useActor } from "./useActor";
import {
  useGetAllLawyers,
  useGetAllListings,
  useGetAllNews,
} from "./useQueries";

const SAMPLE_LISTINGS: LandListing[] = [
  {
    id: "listing-001",
    title: "ঢাকার কাছে রমনায় বিশাল আবাসিক প্লট",
    description:
      "রমনা থানার কেন্দ্রস্থলে অবস্থিত এই জমিটি আবাসিক ও বাণিজ্যিক উভয় কাজেই ব্যবহারযোগ্য। চারদিকে পাকা রাস্তা, স্কুল ও হাসপাতাল কাছে।",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "রমনা",
    address: "রমনা, ঢাকা-১০০০",
    area: 10,
    price: BigInt(5000000),
    pricePerDecimal: BigInt(500000),
    landType: "vita",
    roadAccess: "paved",
    roadWidth: "২০ ফুট",
    orientation: "পূর্বমুখী",
    isFeatured: true,
    isVerified: true,
    verifiedBadge: "verified",
    sellerId: "seller-001",
    sellerName: "মোহাম্মদ রফিকুল ইসলাম",
    sellerPhone: "01711234567",
    sellerWhatsapp: "01711234567",
    status: "active",
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "listing-002",
    title: "চট্টগ্রাম হালিশহরে সমতল কৃষিজমি",
    description:
      "হালিশহর উপজেলায় উর্বর সমতল জমি। বছরে দুইবার ধান চাষ হয়। সেচ সুবিধা আছে এবং সড়ক থেকে সহজে প্রবেশযোগ্য।",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    upazila: "হালিশহর",
    address: "হালিশহর, চট্টগ্রাম",
    area: 25,
    price: BigInt(3750000),
    pricePerDecimal: BigInt(150000),
    landType: "samatal",
    roadAccess: "brick",
    roadWidth: "১২ ফুট",
    orientation: "দক্ষিণমুখী",
    isFeatured: true,
    isVerified: true,
    verifiedBadge: "verified",
    sellerId: "seller-002",
    sellerName: "আব্দুল করিম চৌধুরী",
    sellerPhone: "01811234567",
    sellerWhatsapp: "01811234567",
    status: "active",
    createdAt: BigInt((Date.now() - 86400000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 86400000) * 1_000_000),
  },
  {
    id: "listing-003",
    title: "সিলেট শহরের কাছে গোলাপগঞ্জে চা বাগানের জমি",
    description:
      "সিলেটের বিখ্যাত চা বাগান এলাকায় পাহাড়ি ভিটা জমি। প্রকৃতির কোলে, বিশুদ্ধ পরিবেশ। রিসোর্ট বা বাংলো তৈরির জন্য আদর্শ।",
    division: "সিলেট",
    district: "সিলেট",
    upazila: "গোলাপগঞ্জ",
    address: "গোলাপগঞ্জ, সিলেট-৩১৮০",
    area: 15,
    price: BigInt(7500000),
    pricePerDecimal: BigInt(500000),
    landType: "vita",
    roadAccess: "paved",
    roadWidth: "১৬ ফুট",
    orientation: "উত্তর-পূর্বমুখী",
    isFeatured: true,
    isVerified: false,
    verifiedBadge: "",
    sellerId: "seller-003",
    sellerName: "নুরুল ইসলাম বেগ",
    sellerPhone: "01911234567",
    sellerWhatsapp: "01911234567",
    status: "active",
    createdAt: BigInt((Date.now() - 172800000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 172800000) * 1_000_000),
  },
  {
    id: "listing-004",
    title: "রাজশাহী পবা উপজেলায় কৃষিজমি বিক্রয়",
    description:
      "পদ্মা নদীর তীরে উর্বর পলিমাটির জমি। আম বাগান আছে, প্রতি বছর ভালো আমদানি হয়। সেচ সুবিধাসম্পন্ন।",
    division: "রাজশাহী",
    district: "রাজশাহী",
    upazila: "পবা",
    address: "পবা, রাজশাহী",
    area: 40,
    price: BigInt(4000000),
    pricePerDecimal: BigInt(100000),
    landType: "samatal",
    roadAccess: "brick",
    roadWidth: "৮ ফুট",
    orientation: "পশ্চিমমুখী",
    isFeatured: false,
    isVerified: true,
    verifiedBadge: "verified",
    sellerId: "seller-004",
    sellerName: "মশিউর রহমান",
    sellerPhone: "01611234567",
    sellerWhatsapp: "01611234567",
    status: "active",
    createdAt: BigInt((Date.now() - 259200000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 259200000) * 1_000_000),
  },
  {
    id: "listing-005",
    title: "খুলনা সদরে বাণিজ্যিক প্লট",
    description:
      "খুলনা মহানগরীর প্রধান সড়কের পাশে বাণিজ্যিক জমি। দোকান বা অফিস নির্মাণের জন্য উপযুক্ত। চারপাশে ব্যবসায়িক এলাকা।",
    division: "খুলনা",
    district: "খুলনা",
    upazila: "খুলনা সদর",
    address: "সদর, খুলনা-৯০০০",
    area: 8,
    price: BigInt(12000000),
    pricePerDecimal: BigInt(1500000),
    landType: "vita",
    roadAccess: "paved",
    roadWidth: "৩০ ফুট",
    orientation: "দক্ষিণমুখী",
    isFeatured: true,
    isVerified: true,
    verifiedBadge: "verified",
    sellerId: "seller-005",
    sellerName: "সালমা বেগম",
    sellerPhone: "01511234567",
    sellerWhatsapp: "01511234567",
    status: "active",
    createdAt: BigInt((Date.now() - 345600000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 345600000) * 1_000_000),
  },
  {
    id: "listing-006",
    title: "বরিশাল বাকেরগঞ্জে নদীর পাড়ে জমি",
    description:
      "সুন্দরী গাছের বন ও নদী দ্বারা বেষ্টিত এই জমিটি মাছ চাষ এবং পর্যটনের জন্য উপযুক্ত। নৌপথে সহজে পৌঁছানো যায়।",
    division: "বরিশাল",
    district: "বরিশাল",
    upazila: "বাকেরগঞ্জ",
    address: "বাকেরগঞ্জ, বরিশাল",
    area: 50,
    price: BigInt(2500000),
    pricePerDecimal: BigInt(50000),
    landType: "nala",
    roadAccess: "none",
    roadWidth: "",
    orientation: "উত্তরমুখী",
    isFeatured: false,
    isVerified: false,
    verifiedBadge: "",
    sellerId: "seller-006",
    sellerName: "জাহাঙ্গীর আলম",
    sellerPhone: "01411234567",
    sellerWhatsapp: "01411234567",
    status: "active",
    createdAt: BigInt((Date.now() - 432000000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 432000000) * 1_000_000),
  },
  {
    id: "listing-007",
    title: "রংপুর মিঠাপুকুরে আবাসিক প্লট",
    description:
      "রংপুর শহর থেকে মাত্র ১০ কিমি দূরে মিঠাপুকুর উপজেলায় পরিষ্কার পরিবেশে আবাসিক প্লট। শান্ত এলাকা, স্কুল ও বাজার পাশে।",
    division: "রংপুর",
    district: "রংপুর",
    upazila: "মিঠাপুকুর",
    address: "মিঠাপুকুর, রংপুর",
    area: 6,
    price: BigInt(1800000),
    pricePerDecimal: BigInt(300000),
    landType: "vita",
    roadAccess: "brick",
    roadWidth: "১০ ফুট",
    orientation: "দক্ষিণমুখী",
    isFeatured: false,
    isVerified: true,
    verifiedBadge: "verified",
    sellerId: "seller-007",
    sellerName: "তানভীর হোসেন",
    sellerPhone: "01311234567",
    sellerWhatsapp: "01311234567",
    status: "active",
    createdAt: BigInt((Date.now() - 518400000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 518400000) * 1_000_000),
  },
  {
    id: "listing-008",
    title: "ময়মনসিংহ ভালুকায় শিল্প এলাকার জমি",
    description:
      "ভালুকা ইকোনমিক জোনের কাছে শিল্প জমি। বিদ্যুৎ ও গ্যাস সংযোগ আছে। গার্মেন্টস বা কারখানা স্থাপনের জন্য উপযুক্ত।",
    division: "ময়মনসিংহ",
    district: "ময়মনসিংহ",
    upazila: "ভালুকা",
    address: "ভালুকা, ময়মনসিংহ",
    area: 100,
    price: BigInt(20000000),
    pricePerDecimal: BigInt(200000),
    landType: "samatal",
    roadAccess: "paved",
    roadWidth: "৪০ ফুট",
    orientation: "পূর্বমুখী",
    isFeatured: true,
    isVerified: true,
    verifiedBadge: "verified",
    sellerId: "seller-008",
    sellerName: "করপোরেশন প্রোপার্টিজ লিমিটেড",
    sellerPhone: "01211234567",
    sellerWhatsapp: "01211234567",
    status: "active",
    createdAt: BigInt((Date.now() - 604800000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 604800000) * 1_000_000),
  },
];

const SAMPLE_PROPERTY_HISTORIES: PropertyHistory[] = [
  {
    id: "hist-001",
    listingId: "listing-001",
    year: BigInt(1985),
    event: "প্রথম নিবন্ধন",
    previousOwner: "সরকারি সম্পত্তি",
    currentOwner: "আলী হোসেন",
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "hist-002",
    listingId: "listing-001",
    year: BigInt(2005),
    event: "বিক্রয়",
    previousOwner: "আলী হোসেন",
    currentOwner: "রফিকুল পরিবার",
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "hist-003",
    listingId: "listing-001",
    year: BigInt(2018),
    event: "উত্তরাধিকার",
    previousOwner: "রফিকুল পরিবার",
    currentOwner: "মোহাম্মদ রফিকুল ইসলাম",
    createdAt: BigInt(Date.now() * 1_000_000),
  },
];

const SAMPLE_SOIL_REPORTS: SoilReport[] = [
  {
    id: "soil-001",
    listingId: "listing-001",
    soilType: "দোআঁশ মাটি",
    floodRisk: "কম",
    waterLogging: "নেই",
    reportedBy: "মৃত্তিকা গবেষণা ইনস্টিটিউট",
    reportDate: BigInt((Date.now() - 15552000000) * 1_000_000),
    notes: "মাটি উর্বর এবং নির্মাণের জন্য উপযুক্ত। pH মাত্রা ৬.৫-৭.০ এর মধ্যে।",
  },
];

const SAMPLE_LAWYERS: Lawyer[] = [
  {
    id: "lawyer-001",
    name: "ব্যারিস্টার ফারহান আহমেদ",
    specialization: "জমি ও সম্পত্তি আইন",
    phone: "01712000001",
    email: "farhan.ahmed@law.bd",
    location: "ঢাকা হাইকোর্ট, ঢাকা",
    consultationFee: BigInt(2000),
    description:
      "২০ বছরের অভিজ্ঞতা সম্পন্ন ভূমি আইন বিশেষজ্ঞ। দলিল যাচাই, নামজারি ও বিরোধ নিষ্পত্তিতে পারদর্শী।",
    isAvailable: true,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "lawyer-002",
    name: "অ্যাডভোকেট নাসিমা খানম",
    specialization: "রেজিস্ট্রেশন ও দলিল",
    phone: "01812000002",
    email: "nasima.khanam@law.bd",
    location: "চট্টগ্রাম কোর্ট, চট্টগ্রাম",
    consultationFee: BigInt(1500),
    description:
      "চট্টগ্রামের সম্পত্তি রেজিস্ট্রেশন ও ক্রয়-বিক্রয় চুক্তিতে ১৫ বছরের অভিজ্ঞতা।",
    isAvailable: true,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "lawyer-003",
    name: "ব্যারিস্টার কামরুজ্জামান",
    specialization: "ভূমি জরিপ ও সীমানা",
    phone: "01912000003",
    email: "kamruzzaman@law.bd",
    location: "সুপ্রিম কোর্ট, ঢাকা",
    consultationFee: BigInt(3000),
    description: "সুপ্রিম কোর্টে অনুশীলনকারী, ভূমি বিরোধ ও সীমানা নির্ধারণে বিশেষজ্ঞ।",
    isAvailable: false,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "lawyer-004",
    name: "অ্যাডভোকেট রেহানা পারভীন",
    specialization: "পারিবারিক সম্পত্তি বিভাজন",
    phone: "01612000004",
    email: "rehana.parveen@law.bd",
    location: "রাজশাহী কোর্ট, রাজশাহী",
    consultationFee: BigInt(1200),
    description: "পারিবারিক সম্পত্তি বণ্টন ও উত্তরাধিকার আইনে বিশেষজ্ঞ অভিজ্ঞ আইনজীবী।",
    isAvailable: true,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: "lawyer-005",
    name: "অ্যাডভোকেট মাহফুজুর রহমান",
    specialization: "কৃষি ভূমি আইন",
    phone: "01512000005",
    email: "mahfuzur@law.bd",
    location: "খুলনা কোর্ট, খুলনা",
    consultationFee: BigInt(1000),
    description: "কৃষি জমি ক্রয়-বিক্রয়, খাস জমি ও সরকারি বরাদ্দে বিশেষজ্ঞ।",
    isAvailable: true,
    createdAt: BigInt(Date.now() * 1_000_000),
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
];

const SAMPLE_NEWS: NewsArticle[] = [
  {
    id: "news-001",
    title: "ডিজিটাল ভূমি ব্যবস্থাপনা: ২০২৪ সালের নতুন আইন কী বলছে?",
    content: `বাংলাদেশ সরকার ২০২৪ সালে ভূমি ডিজিটাইজেশন আইন সংশোধন করেছে। নতুন আইন অনুযায়ী, সমস্ত জমির মালিকানা অনলাইনে নিবন্ধন করতে হবে এবং ডিজিটাল পর্চা প্রদান করা হবে।

মূল পরিবর্তনসমূহ:
- অনলাইনে নামজারি আবেদন করা যাবে
- ডিজিটাল স্বাক্ষরযুক্ত দলিল বৈধ হবে
- ভূমি রেকর্ড যেকোনো সময় অনলাইনে যাচাই করা যাবে

বিশেষজ্ঞরা বলছেন, এই পরিবর্তন দালালমুক্ত জমি কেনাবেচায় বিপ্লব আনবে।`,
    category: "আইন",
    isPublished: true,
    publishedAt: BigInt((Date.now() - 86400000) * 1_000_000),
    author: "আইন সংবাদদাতা",
    createdAt: BigInt((Date.now() - 86400000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 86400000) * 1_000_000),
  },
  {
    id: "news-002",
    title: "ঢাকার আশেপাশে জমির দাম ৩০% বৃদ্ধি পেয়েছে",
    content: `গত এক বছরে ঢাকার পার্শ্ববর্তী গাজীপুর, নারায়ণগঞ্জ ও মুন্সীগঞ্জে জমির দাম উল্লেখযোগ্য হারে বৃদ্ধি পেয়েছে।

বাজার বিশ্লেষণ:
- গাজীপুর: শতাংশ প্রতি ৩-৫ লাখ টাকা
- নারায়ণগঞ্জ: শতাংশ প্রতি ৫-১০ লাখ টাকা
- মুন্সীগঞ্জ: শতাংশ প্রতি ২-৪ লাখ টাকা

বিনিয়োগকারীরা বলছেন, মেট্রোরেল সম্প্রসারণের কারণে এই অঞ্চলে ব্যাপক চাহিদা বেড়েছে।`,
    category: "বাজারদর",
    isPublished: true,
    publishedAt: BigInt((Date.now() - 172800000) * 1_000_000),
    author: "অর্থনীতি সংবাদদাতা",
    createdAt: BigInt((Date.now() - 172800000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 172800000) * 1_000_000),
  },
  {
    id: "news-003",
    title: "ভূমি মন্ত্রণালয়ের নতুন প্রজ্ঞাপন: খাস জমি বরাদ্দ প্রক্রিয়া সহজ হলো",
    content: `ভূমি মন্ত্রণালয় একটি নতুন প্রজ্ঞাপন জারি করে খাস জমি বরাদ্দ প্রক্রিয়া সহজ করেছে। এখন থেকে ভূমিহীন পরিবারগুলো অনলাইনে আবেদন করতে পারবেন।

নতুন প্রক্রিয়া:
১. ভূমি সেবা পোর্টালে আবেদন
২. ৩০ দিনের মধ্যে যাচাই
৩. ৬০ দিনের মধ্যে সিদ্ধান্ত

এই প্রজ্ঞাপন ২০২৪ সালের ১ জুলাই থেকে কার্যকর হবে।`,
    category: "সরকারি প্রজ্ঞাপন",
    isPublished: true,
    publishedAt: BigInt((Date.now() - 259200000) * 1_000_000),
    author: "সরকারি সংবাদ বিভাগ",
    createdAt: BigInt((Date.now() - 259200000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 259200000) * 1_000_000),
  },
  {
    id: "news-004",
    title: "চট্টগ্রামে মিরসরাই অর্থনৈতিক জোন: জমির বিনিয়োগে সেরা সুযোগ",
    content: `মিরসরাই অর্থনৈতিক জোন সম্পূর্ণ কার্যকর হওয়ার পথে। এই এলাকায় জমির দাম দ্রুত বাড়ছে এবং বিনিয়োগকারীরা ব্যাপক আগ্রহ দেখাচ্ছেন।

বিনিয়োগের সুযোগ:
- শিল্প প্লট: ৫০-৫০০ শতাংশ
- বাণিজ্যিক প্লট: ৫-৫০ শতাংশ
- আবাসিক এলাকা: ২-২০ শতাংশ

বিশেষজ্ঞদের মতে, আগামী ৫ বছরে এই এলাকায় জমির দাম ৩-৫ গুণ বাড়বে।`,
    category: "বাজারদর",
    isPublished: true,
    publishedAt: BigInt((Date.now() - 432000000) * 1_000_000),
    author: "ব্যবসা সংবাদদাতা",
    createdAt: BigInt((Date.now() - 432000000) * 1_000_000),
    updatedAt: BigInt((Date.now() - 432000000) * 1_000_000),
  },
];

// Export sample data for useLocalStore seeding
export const SAMPLE_DATA = {
  listings: SAMPLE_LISTINGS,
  lawyers: SAMPLE_LAWYERS,
  news: SAMPLE_NEWS,
};

export function useSampleData() {
  const { actor, isFetching } = useActor();
  const { data: listings } = useGetAllListings();
  const { data: lawyers } = useGetAllLawyers();
  const { data: news } = useGetAllNews();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!actor || isFetching || seededRef.current) return;

    const seed = async () => {
      seededRef.current = true;
      try {
        const [listingsResult, lawyersResult, newsResult] = await Promise.all([
          actor.getAllLandListings(),
          actor.getAllLawyers(),
          actor.getAllNews(),
        ]);

        const ops: Promise<void>[] = [];

        if (listingsResult.length === 0) {
          for (const listing of SAMPLE_LISTINGS) {
            ops.push(actor.createLandListing(listing));
          }
        }

        if (lawyersResult.length === 0) {
          for (const lawyer of SAMPLE_LAWYERS) {
            ops.push(actor.createLawyer(lawyer));
          }
        }

        if (newsResult.length === 0) {
          for (const article of SAMPLE_NEWS) {
            ops.push(actor.createNewsArticle(article));
          }
        }

        if (ops.length > 0) {
          await Promise.all(ops);

          // Seed soil report and property history for listing-001
          await Promise.all([
            actor.addSoilReport(SAMPLE_SOIL_REPORTS[0]),
            ...SAMPLE_PROPERTY_HISTORIES.map((h) =>
              actor.addPropertyHistory(h),
            ),
          ]);
        }
      } catch (err) {
        console.warn("Sample data seeding failed:", err);
      }
    };

    if (listings !== undefined && lawyers !== undefined && news !== undefined) {
      seed();
    }
  }, [actor, isFetching, listings, lawyers, news]);
}
