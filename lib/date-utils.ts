/**
 * Unified Date Utilities for Gym-Git
 * 
 * Provides single-source-of-truth date formatters, arithmetic,
 * lookback calculations, and timezone-safe date key generation.
 */

/**
 * Formats a Date object or string into a standardized ISO date key (YYYY-MM-DD).
 */
export function formatDateKey(dateInput?: Date | string | null): string {
  if (!dateInput) {
    const now = new Date();
    return formatStandardDate(now);
  }
  if (typeof dateInput === 'string') {
    // If already in YYYY-MM-DD format, return trimmed string
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
      return dateInput.trim();
    }
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      return formatStandardDate(parsed);
    }
    return dateInput;
  }
  return formatStandardDate(dateInput);
}

function formatStandardDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Safely parses any date representation into a local Date object.
 */
export function parseDate(dateInput: Date | string): Date {
  if (dateInput instanceof Date) return dateInput;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return new Date(`${dateInput}T00:00:00`);
  }
  return new Date(dateInput);
}

/**
 * Formats a date into a human-friendly display string.
 * e.g. "Today" or "Mon, Jan 5, 2026"
 */
export function formatDisplayDate(
  dateInput: Date | string,
  options?: { showToday?: boolean; includeYear?: boolean }
): string {
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  if (options?.showToday && isToday(date)) {
    return 'Today';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: options?.includeYear !== false ? 'numeric' : undefined,
  });
}

/**
 * Formats a date into a full verbose string.
 * e.g. "Monday, January 5, 2026"
 */
export function formatFullDate(dateInput: Date | string): string {
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date into a compact short string.
 * e.g. "Jan 5" or "Jan 5, 2026"
 */
export function formatShortDate(dateInput: Date | string, includeYear = false): string {
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined,
  });
}

/**
 * Formats a date into Month & Year.
 * e.g. "January 2026"
 */
export function formatMonthYear(dateInput: Date | string, short = false): string {
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('en-US', {
    month: short ? 'short' : 'long',
    year: 'numeric',
  });
}

/**
 * Formats total seconds into a readable countdown / duration string.
 * e.g. "1d 4h 30m 12s", "4h 30m 12s", "12s", or "Expired"
 */
export function formatTimeRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'Expired';
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Returns difference in calendar days between two dates (endDate - startDate).
 */
export function getDaysDifference(startDate: Date | string, endDate: Date | string): number {
  const d1 = parseDate(startDate);
  const d2 = parseDate(endDate);
  // Strip time part for pure calendar day comparison
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a given date string is within the past lookback recovery window (1 to maxDays ago).
 * Default maxDays is 3.
 */
export function isWithinLookbackWindow(dateStr: string, maxDays = 3): boolean {
  const today = formatDateKey(new Date());
  if (dateStr >= today) return false;
  const diffDays = getDaysDifference(dateStr, today);
  return diffDays >= 1 && diffDays <= maxDays;
}

/**
 * Returns true if the date is today in the local timezone.
 */
export function isToday(dateInput: Date | string): boolean {
  const targetKey = formatDateKey(dateInput);
  const todayKey = formatDateKey(new Date());
  return targetKey === todayKey;
}

/**
 * Returns true if the date is strictly in the future (after today).
 */
export function isFuture(dateInput: Date | string): boolean {
  const targetKey = formatDateKey(dateInput);
  const todayKey = formatDateKey(new Date());
  return targetKey > todayKey;
}

/**
 * Gets the start (Monday or Sunday) and end of the week for a given date.
 */
export function getStartAndEndOfWeek(
  dateInput: Date | string,
  startOnMonday = true
): { start: Date; end: Date; startStr: string; endStr: string } {
  const date = parseDate(dateInput);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  
  let diffToStart: number;
  if (startOnMonday) {
    diffToStart = day === 0 ? -6 : 1 - day;
  } else {
    diffToStart = -day;
  }

  const start = new Date(date);
  start.setDate(date.getDate() + diffToStart);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
    startStr: formatDateKey(start),
    endStr: formatDateKey(end),
  };
}
