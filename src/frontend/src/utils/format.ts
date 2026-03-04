/**
 * Format price in South Asian format with ৳ symbol
 * e.g., 1500000 => ৳১৫,০০,০০০
 */
export function formatBDT(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;

  if (num >= 10000000) {
    const crore = num / 10000000;
    return `৳${crore.toFixed(crore % 1 === 0 ? 0 : 2)} কোটি`;
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return `৳${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} লাখ`;
  }

  // Format with commas in South Asian style
  const str = num.toString();
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
  return `৳${formatted}`;
}

/**
 * Format price as plain number with South Asian commas
 */
export function formatNumber(num: number): string {
  const str = num.toString();
  if (str.length <= 3) return str;
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
}

/**
 * Format area in decimal notation
 */
export function formatArea(area: number): string {
  return `${area.toFixed(area % 1 === 0 ? 0 : 2)} শতাংশ`;
}

/**
 * Format date in Bengali
 */
export function formatDate(timestamp: bigint | number | Date): string {
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    const num = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
    // Handle nanoseconds (IC timestamps) vs milliseconds
    date = num > 1e15 ? new Date(num / 1e6) : new Date(num);
  }

  return new Intl.DateTimeFormat("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Get Bengali label for land type
 */
export function getLandTypeLabel(type: string): string {
  const map: Record<string, string> = {
    vita: "ভিটা",
    nala: "নালা",
    samatal: "সমতল",
  };
  return map[type] ?? type;
}

/**
 * Get Bengali label for road access
 */
export function getRoadAccessLabel(access: string): string {
  const map: Record<string, string> = {
    paved: "পিচ ঢালাই",
    brick: "ইটের রাস্তা",
    none: "রাস্তা নেই",
  };
  return map[access] ?? access;
}

/**
 * Get Bengali label for status
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "সক্রিয়",
    sold: "বিক্রিত",
    pending: "অপেক্ষমান",
    pending_approval: "অনুমোদনের অপেক্ষায়",
    accepted: "গৃহীত",
    rejected: "প্রত্যাখ্যাত",
    countered: "পাল্টা অফার",
  };
  return map[status] ?? status;
}

/**
 * Truncate text to given length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
