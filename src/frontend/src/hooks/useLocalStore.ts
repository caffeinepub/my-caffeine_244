/**
 * useLocalStore — localStorage-backed CRUD store for admin-managed content.
 * This bypasses ICP backend authorization checks by keeping data client-side.
 * All data persists across page refreshes via localStorage.
 */

import { useCallback, useEffect, useState } from "react";
import type { LandListing, Lawyer, NewsArticle } from "../backend.d";
import { SAMPLE_DATA } from "./useSampleData";

// ─── Storage Keys ────────────────────────────────────────────────────────────
const KEYS = {
  listings: "jomibazar_listings",
  lawyers: "jomibazar_lawyers",
  news: "jomibazar_news",
  seeded: "jomibazar_seeded",
} as const;

// ─── Generic helpers ─────────────────────────────────────────────────────────
function readStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    // Parse and revive BigInt values (stored as strings with "n" suffix)
    return JSON.parse(raw, (_k, v) => {
      if (typeof v === "string" && /^\d+n$/.test(v))
        return BigInt(v.slice(0, -1));
      return v;
    }) as T[];
  } catch {
    return [];
  }
}

function writeStore<T>(key: string, items: T[]): void {
  try {
    // Serialize BigInt values as "123n"
    const serialized = JSON.stringify(items, (_k, v) =>
      typeof v === "bigint" ? `${v}n` : v,
    );
    localStorage.setItem(key, serialized);
  } catch {
    // ignore quota errors
  }
}

// ─── Seed sample data on first load ──────────────────────────────────────────
function ensureSeeded(): void {
  try {
    if (localStorage.getItem(KEYS.seeded)) return;
    // Only seed if stores are empty
    if (readStore(KEYS.listings).length === 0) {
      writeStore(KEYS.listings, SAMPLE_DATA.listings);
    }
    if (readStore(KEYS.lawyers).length === 0) {
      writeStore(KEYS.lawyers, SAMPLE_DATA.lawyers);
    }
    if (readStore(KEYS.news).length === 0) {
      writeStore(KEYS.news, SAMPLE_DATA.news);
    }
    localStorage.setItem(KEYS.seeded, "1");
  } catch {
    // ignore
  }
}

// ─── Event bus for cross-hook updates ────────────────────────────────────────
const STORE_CHANGE_EVENT = "jomibazar_store_change";
function notifyChange() {
  window.dispatchEvent(new Event(STORE_CHANGE_EVENT));
}

// ─── Listings ─────────────────────────────────────────────────────────────────
export function useLocalListings() {
  ensureSeeded();
  const [items, setItems] = useState<LandListing[]>(() =>
    readStore<LandListing>(KEYS.listings),
  );

  const refresh = useCallback(() => {
    setItems(readStore<LandListing>(KEYS.listings));
  }, []);

  useEffect(() => {
    window.addEventListener(STORE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STORE_CHANGE_EVENT, refresh);
  }, [refresh]);

  const create = useCallback((listing: LandListing) => {
    const current = readStore<LandListing>(KEYS.listings);
    const updated = [...current, listing];
    writeStore(KEYS.listings, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const update = useCallback((listing: LandListing) => {
    const current = readStore<LandListing>(KEYS.listings);
    const updated = current.map((l) => (l.id === listing.id ? listing : l));
    writeStore(KEYS.listings, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const remove = useCallback((id: string) => {
    const current = readStore<LandListing>(KEYS.listings);
    const updated = current.filter((l) => l.id !== id);
    writeStore(KEYS.listings, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    const current = readStore<LandListing>(KEYS.listings);
    const updated = current.map((l) =>
      l.id === id ? { ...l, isFeatured: !l.isFeatured } : l,
    );
    writeStore(KEYS.listings, updated);
    setItems(updated);
    notifyChange();
  }, []);

  return { listings: items, create, update, remove, toggleFeatured };
}

// ─── Lawyers ──────────────────────────────────────────────────────────────────
export function useLocalLawyers() {
  ensureSeeded();
  const [items, setItems] = useState<Lawyer[]>(() =>
    readStore<Lawyer>(KEYS.lawyers),
  );

  const refresh = useCallback(() => {
    setItems(readStore<Lawyer>(KEYS.lawyers));
  }, []);

  useEffect(() => {
    window.addEventListener(STORE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STORE_CHANGE_EVENT, refresh);
  }, [refresh]);

  const create = useCallback((lawyer: Lawyer) => {
    const current = readStore<Lawyer>(KEYS.lawyers);
    const updated = [...current, lawyer];
    writeStore(KEYS.lawyers, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const update = useCallback((lawyer: Lawyer) => {
    const current = readStore<Lawyer>(KEYS.lawyers);
    const updated = current.map((l) => (l.id === lawyer.id ? lawyer : l));
    writeStore(KEYS.lawyers, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const remove = useCallback((id: string) => {
    const current = readStore<Lawyer>(KEYS.lawyers);
    const updated = current.filter((l) => l.id !== id);
    writeStore(KEYS.lawyers, updated);
    setItems(updated);
    notifyChange();
  }, []);

  return { lawyers: items, create, update, remove };
}

// ─── News ─────────────────────────────────────────────────────────────────────
export function useLocalNews() {
  ensureSeeded();
  const [items, setItems] = useState<NewsArticle[]>(() =>
    readStore<NewsArticle>(KEYS.news),
  );

  const refresh = useCallback(() => {
    setItems(readStore<NewsArticle>(KEYS.news));
  }, []);

  useEffect(() => {
    window.addEventListener(STORE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STORE_CHANGE_EVENT, refresh);
  }, [refresh]);

  const create = useCallback((article: NewsArticle) => {
    const current = readStore<NewsArticle>(KEYS.news);
    const updated = [...current, article];
    writeStore(KEYS.news, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const update = useCallback((article: NewsArticle) => {
    const current = readStore<NewsArticle>(KEYS.news);
    const updated = current.map((a) => (a.id === article.id ? article : a));
    writeStore(KEYS.news, updated);
    setItems(updated);
    notifyChange();
  }, []);

  const remove = useCallback((id: string) => {
    const current = readStore<NewsArticle>(KEYS.news);
    const updated = current.filter((a) => a.id !== id);
    writeStore(KEYS.news, updated);
    setItems(updated);
    notifyChange();
  }, []);

  return { news: items, create, update, remove };
}

// ─── Offers ───────────────────────────────────────────────────────────────────
import type { Offer } from "../backend.d";

const OFFER_KEY = "jomibazar_offers";

export function useLocalOffers(listingId?: string) {
  const [allOffers, setAllOffers] = useState<Offer[]>(() =>
    readStore<Offer>(OFFER_KEY),
  );

  const refresh = useCallback(() => {
    setAllOffers(readStore<Offer>(OFFER_KEY));
  }, []);

  useEffect(() => {
    window.addEventListener(STORE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STORE_CHANGE_EVENT, refresh);
  }, [refresh]);

  const offers = listingId
    ? allOffers.filter((o) => o.listingId === listingId)
    : allOffers;

  const submitOffer = useCallback((offer: Offer) => {
    const current = readStore<Offer>(OFFER_KEY);
    const updated = [...current, offer];
    writeStore(OFFER_KEY, updated);
    setAllOffers(updated);
    notifyChange();
  }, []);

  const updateOfferStatus = useCallback((id: string, status: string) => {
    const current = readStore<Offer>(OFFER_KEY);
    const updated = current.map((o) =>
      o.id === id
        ? { ...o, status, updatedAt: BigInt(Date.now() * 1_000_000) }
        : o,
    );
    writeStore(OFFER_KEY, updated);
    setAllOffers(updated);
    notifyChange();
  }, []);

  const counterOffer = useCallback(
    (id: string, counterPrice: bigint, counterMessage: string) => {
      const current = readStore<Offer>(OFFER_KEY);
      const updated = current.map((o) =>
        o.id === id
          ? {
              ...o,
              counterPrice,
              counterMessage,
              status: "countered",
              updatedAt: BigInt(Date.now() * 1_000_000),
            }
          : o,
      );
      writeStore(OFFER_KEY, updated);
      setAllOffers(updated);
      notifyChange();
    },
    [],
  );

  return { offers, submitOffer, updateOfferStatus, counterOffer };
}

// ─── Read-only helpers (no hooks, safe to call anywhere) ─────────────────────
export function getLocalListings(): LandListing[] {
  ensureSeeded();
  return readStore<LandListing>(KEYS.listings);
}

export function getLocalLawyers(): Lawyer[] {
  ensureSeeded();
  return readStore<Lawyer>(KEYS.lawyers);
}

export function getLocalNews(): NewsArticle[] {
  ensureSeeded();
  return readStore<NewsArticle>(KEYS.news);
}

// ─── Registrations ────────────────────────────────────────────────────────────
export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  role: "seller" | "buyer";
  registeredAt: string;
}

const REG_KEY = "jomibazar_registrations";

export function useLocalRegistrations() {
  const [items, setItems] = useState<RegisteredUser[]>(() =>
    readStore<RegisteredUser>(REG_KEY),
  );

  const refresh = useCallback(() => {
    setItems(readStore<RegisteredUser>(REG_KEY));
  }, []);

  useEffect(() => {
    window.addEventListener(STORE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STORE_CHANGE_EVENT, refresh);
  }, [refresh]);

  const addRegistration = useCallback((user: RegisteredUser) => {
    const current = readStore<RegisteredUser>(REG_KEY);
    // avoid duplicate by phone
    const exists = current.some((u) => u.phone === user.phone);
    if (exists) {
      // update existing
      const updated = current.map((u) => (u.phone === user.phone ? user : u));
      writeStore(REG_KEY, updated);
      setItems(updated);
    } else {
      const updated = [...current, user];
      writeStore(REG_KEY, updated);
      setItems(updated);
    }
    notifyChange();
  }, []);

  const removeRegistration = useCallback((id: string) => {
    const current = readStore<RegisteredUser>(REG_KEY);
    const updated = current.filter((u) => u.id !== id);
    writeStore(REG_KEY, updated);
    setItems(updated);
    notifyChange();
  }, []);

  return { registrations: items, addRegistration, removeRegistration };
}

export function saveRegistration(user: RegisteredUser) {
  const current = readStore<RegisteredUser>(REG_KEY);
  const exists = current.some((u) => u.phone === user.phone);
  if (exists) {
    const updated = current.map((u) => (u.phone === user.phone ? user : u));
    writeStore(REG_KEY, updated);
  } else {
    writeStore(REG_KEY, [...current, user]);
  }
  window.dispatchEvent(new Event(STORE_CHANGE_EVENT));
}
