/**
 * Convert numbers/digits to Bengali digits (e.g. 148 -> "১৪৮")
 */
export function toBnNum(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return "";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

/**
 * Format currency in Bengali (e.g. 148 -> "১৪৮ টাকা")
 */
export function formatBnPrice(num: number | string | undefined | null): string {
  return `${toBnNum(num)} টাকা`;
}

/**
 * Standardize unit label to Bengali phrasing matching Figma
 */
export function formatBnUnit(unit: string | undefined | null): string {
  if (!unit) return "প্রতি কেজি";
  const lower = unit.toLowerCase();
  if (lower.includes("kg") || lower.includes("কেজি")) return "প্রতি কেজি";
  if (lower.includes("liter") || lower.includes("litre") || lower.includes("লিটার")) return "প্রতি লিটার";
  if (lower.includes("dozen") || lower.includes("ডজন")) return "প্রতি ডজন";
  if (lower.includes("piece") || lower.includes("পিস") || lower.includes("হালি")) return "প্রতি পিস";
  return `প্রতি ${unit}`;
}

/**
 * Bengali Day & Month Date Formatter
 */
export function getBengaliDate(date: Date = new Date()): string {
  const daysBn = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const monthsBn = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const dayName = daysBn[date.getDay()];
  const day = toBnNum(date.getDate());
  const monthName = monthsBn[date.getMonth()];
  const year = toBnNum(date.getFullYear());

  return `${dayName}, ${day} ${monthName}, ${year}`;
}
