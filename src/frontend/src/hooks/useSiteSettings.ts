import { useCallback, useEffect, useState } from "react";

export interface StatItem {
  label: string;
  value: string;
}

export interface FeatureItem {
  title: string;
  desc: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  desc: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  stats: StatItem[];
  features: FeatureItem[];
  howItWorksSteps: HowItWorksStep[];
  showPopularAreas: boolean;
  footerCopyright: string;
  siteTagline: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "সরাসরি মালিকের সাথে কথা বলুন",
  heroSubtitle:
    "বাংলাদেশের প্রথম D2C ভূমি বাজার — দালাল ছাড়া, ঝামেলা ছাড়া। সরাসরি মালিকের সাথে কেনাবেচা করুন।",
  heroCtaText: "এখনই জমি খুঁজুন",
  siteTagline: "বাংলাদেশের সেরা ডিজিটাল জমি মার্কেটপ্লেস",
  stats: [
    { label: "সক্রিয় জমি", value: "৫০০+" },
    { label: "যাচাইকৃত বিক্রেতা", value: "২০০+" },
    { label: "সফল লেনদেন", value: "১৫০+" },
    { label: "নিবন্ধিত ব্যবহারকারী", value: "১,০০০+" },
  ],
  features: [
    {
      title: "সরাসরি যোগাযোগ",
      desc: "দালাল ছাড়া সরাসরি মালিকের সাথে কথা বলুন",
    },
    {
      title: "যাচাইকৃত বিক্রেতা",
      desc: "NID ও দলিল যাচাই করা Trust Badge বিক্রেতা",
    },
    {
      title: "আইনজীবী সহায়তা",
      desc: "বিশেষজ্ঞ ভূমি আইনজীবীর সাথে সরাসরি পরামর্শ",
    },
    {
      title: "ডিজিটাল ভল্ট",
      desc: "এনক্রিপ্টেড নিরাপদ কাগজপত্র সংরক্ষণ",
    },
  ],
  howItWorksSteps: [
    {
      step: "০১",
      title: "জমি খুঁজুন",
      desc: "বিভাগ, জেলা ও উপজেলা ফিল্টার দিয়ে আপনার পছন্দের এলাকায় জমি খুঁজুন",
    },
    {
      step: "০২",
      title: "মালিকের সাথে কথা বলুন",
      desc: "সরাসরি WhatsApp বা ফোনে মালিকের সাথে যোগাযোগ করুন — কোনো মধ্যস্থতাকারী নেই",
    },
    {
      step: "০৩",
      title: "নিরাপদে কেনাবেচা করুন",
      desc: "অভিজ্ঞ ভূমি আইনজীবীর সহায়তায় নিরাপদ ও বৈধ লেনদেন সম্পন্ন করুন",
    },
  ],
  showPopularAreas: true,
  footerCopyright: "জমিবাজার। সর্বস্বত্ব সংরক্ষিত।",
};

const STORAGE_KEY = "jomibajar_site_settings";

function loadFromStorage(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Singleton state so all consumers share the same instance
let _settings: SiteSettings = loadFromStorage();
const _listeners: Set<() => void> = new Set();

function setGlobalSettings(next: SiteSettings) {
  _settings = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  for (const fn of _listeners) fn();
}

export function useSiteSettings() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const fn = () => forceUpdate((n) => n + 1);
    _listeners.add(fn);
    return () => {
      _listeners.delete(fn);
    };
  }, []);

  const updateSettings = useCallback((partial: Partial<SiteSettings>) => {
    setGlobalSettings({ ..._settings, ...partial });
  }, []);

  const resetToDefaults = useCallback(() => {
    setGlobalSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings: _settings,
    updateSettings,
    resetToDefaults,
    DEFAULT_SETTINGS,
  };
}
