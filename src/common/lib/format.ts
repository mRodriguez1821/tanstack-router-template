import i18n from "@/common/i18n";

export const parseNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const EMPTY = "—";

const currentLocale = () => i18n.resolvedLanguage ?? "es";

type DateInput = string | Date | null | undefined;

const toDate = (value: DateInput) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value: DateInput) => {
  const date = toDate(value);
  if (!date) return EMPTY;
  return date.toLocaleString(currentLocale());
};

export const formatDate = (value: DateInput) => {
  const date = toDate(value);
  if (!date) return EMPTY;
  return date.toLocaleDateString(currentLocale(), {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const formatTime = (value: DateInput) => {
  const date = toDate(value);
  if (!date) return EMPTY;
  return date.toLocaleTimeString(currentLocale(), {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateAndTime = (value: DateInput) => {
  const date = toDate(value);
  if (!date) return EMPTY;
  return `${formatDate(date)}, ${formatTime(date)}`;
};

export const getWeekdayNames = (format: "long" | "short" = "long") => {
  const formatter = new Intl.DateTimeFormat(currentLocale(), {
    weekday: format,
    timeZone: "UTC",
  });
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2024, 0, 7 + index))),
  );
};

export const getMonthNames = (format: "long" | "short" = "long") => {
  const formatter = new Intl.DateTimeFormat(currentLocale(), {
    month: format,
    timeZone: "UTC",
  });
  return Array.from({ length: 12 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2024, index, 15))),
  );
};
