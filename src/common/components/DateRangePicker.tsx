import {
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface DateRangeValue {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}

export interface DateRangePickerProps
  extends Omit<InputProps, "value" | "onChange" | "type"> {
  value?: DateRangeValue;
  onChange?: (val: DateRangeValue) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_NAMES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

export const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value = {},
      onChange,
      minDate,
      maxDate,
      placeholder = "Seleccionar rango de fechas",
      label,
      error,
      helperText,
      disabled,
      inputSize = "md",
      containerClassName = "",
      className = "",
      ...props
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial month view based on `from` date or today
    const baseDate = value.from ? new Date(value.from) : new Date();
    const [currentMonth, setCurrentMonth] = useState(
      isNaN(baseDate.getTime()) ? new Date().getMonth() : baseDate.getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
      isNaN(baseDate.getTime()) ? new Date().getFullYear() : baseDate.getFullYear()
    );

    // Track internal range selection in-flight
    const [hoverDate, setHoverDate] = useState<string | null>(null);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    };

    const handleSelectDay = (isoDate: string) => {
      if (!value.from || (value.from && value.to)) {
        // Start new range
        onChange?.({ from: isoDate, to: undefined });
      } else if (value.from && !value.to) {
        // Complete range
        if (isoDate < value.from) {
          onChange?.({ from: isoDate, to: value.from });
        } else {
          onChange?.({ from: value.from, to: isoDate });
        }
        setIsOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.({ from: undefined, to: undefined });
    };

    // Formatted display text
    const formatDisplay = () => {
      if (!value.from && !value.to) return "";
      const formatPart = (dStr?: string) => {
        if (!dStr) return "";
        const [y, m, d] = dStr.split("-");
        return `${d}/${m}/${y}`;
      };

      if (value.from && !value.to) {
        return `Desde ${formatPart(value.from)}`;
      }
      return `${formatPart(value.from)} - ${formatPart(value.to)}`;
    };

    return (
      <div ref={containerRef} className={`relative flex flex-col space-y-1.5 w-full ${containerClassName}`}>
        <div onClick={() => !disabled && setIsOpen((prev) => !prev)}>
          <Input
            ref={ref}
            label={label}
            error={error}
            helperText={helperText}
            placeholder={placeholder}
            disabled={disabled}
            inputSize={inputSize}
            readOnly
            value={formatDisplay()}
            icon={CalendarIcon}
            actionElement={
              value.from || value.to ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                  title="Limpiar rango"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null
            }
            className={`cursor-pointer ${className}`}
            {...props}
          />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-76 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-3.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none">
            {/* Header: Month & Year navigation */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded hover:bg-[var(--background)] transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-[var(--foreground)]">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded hover:bg-[var(--background)] transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Range status badge */}
            <div className="mb-2 text-center text-[10px] text-[var(--foreground)] opacity-70">
              {!value.from
                ? "Selecciona la fecha inicial"
                : !value.to
                ? "Selecciona la fecha final"
                : "Rango seleccionado"}
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--foreground)] opacity-50 mb-1">
              {DAY_NAMES.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-1 text-xs">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div
                  key={`prev-${i}`}
                  className="h-7 flex items-center justify-center text-[11px] opacity-25"
                >
                  {daysInPrevMonth - firstDayIndex + i + 1}
                </div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const monthStr = String(currentMonth + 1).padStart(2, "0");
                const dayStr = String(day).padStart(2, "0");
                const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

                const isStart = value.from === isoDate;
                const isEnd = value.to === isoDate;
                const isInRange =
                  value.from &&
                  value.to &&
                  isoDate > value.from &&
                  isoDate < value.to;

                const isHoverRange =
                  value.from &&
                  !value.to &&
                  hoverDate &&
                  ((isoDate > value.from && isoDate <= hoverDate) ||
                    (isoDate < value.from && isoDate >= hoverDate));

                const isDisabled =
                  (minDate && isoDate < minDate) ||
                  (maxDate && isoDate > maxDate);

                return (
                  <div
                    key={`range-day-${day}`}
                    onMouseEnter={() => setHoverDate(isoDate)}
                    className={`flex items-center justify-center h-7 ${
                      isInRange || isHoverRange ? "bg-[var(--primary)]/15" : ""
                    } ${isStart ? "rounded-l-[calc(var(--radius)*0.5)]" : ""} ${
                      isEnd ? "rounded-r-[calc(var(--radius)*0.5)]" : ""
                    }`}
                  >
                    <button
                      type="button"
                      disabled={Boolean(isDisabled)}
                      onClick={() => handleSelectDay(isoDate)}
                      className={`h-7 w-7 flex items-center justify-center rounded-[calc(var(--radius)*0.5)] text-xs font-medium transition cursor-pointer ${
                        isStart || isEnd
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs"
                          : "hover:bg-[var(--background)] text-[var(--foreground)]"
                      } ${isDisabled ? "opacity-25 cursor-not-allowed" : ""}`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets */}
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex flex-wrap gap-1.5 text-[10px]">
              {[
                { label: "Hoy", days: 0 },
                { label: "Últimos 7 días", days: 7 },
                { label: "Últimos 30 días", days: 30 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const todayIso = today.toISOString().slice(0, 10);
                    if (preset.days === 0) {
                      onChange?.({ from: todayIso, to: todayIso });
                    } else {
                      const past = new Date();
                      past.setDate(today.getDate() - preset.days);
                      onChange?.({ from: past.toISOString().slice(0, 10), to: todayIso });
                    }
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] opacity-75 hover:opacity-100 hover:border-[var(--primary)] transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
