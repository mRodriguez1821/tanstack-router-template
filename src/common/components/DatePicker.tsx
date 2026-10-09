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
  Clock,
  X,
} from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface DatePickerProps
  extends Omit<InputProps, "value" | "onChange" | "type"> {
  /** Valor en formato ISO 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm' */
  value?: string;
  /** Callback al seleccionar fecha */
  onChange?: (val: string) => void;
  /** Si debe incluir selector de hora (Datetime picker) */
  enableTime?: boolean;
  /** Formato de visualización amigable */
  placeholder?: string;
  /** Fecha mínima seleccionable 'YYYY-MM-DD' */
  minDate?: string;
  /** Fecha máxima seleccionable 'YYYY-MM-DD' */
  maxDate?: string;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_NAMES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    {
      value = "",
      onChange,
      enableTime = false,
      placeholder = enableTime ? "AAAA-MM-DD HH:mm" : "AAAA-MM-DD",
      minDate,
      maxDate,
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

    // Parse current date & time
    const initialDate = value ? new Date(value) : new Date();
    const [currentMonth, setCurrentMonth] = useState(
      isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
      isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
    );

    // Time states (HH:mm)
    const initialHour = !isNaN(initialDate.getTime()) && value.includes("T")
      ? String(initialDate.getHours()).padStart(2, "0")
      : "12";
    const initialMinute = !isNaN(initialDate.getTime()) && value.includes("T")
      ? String(initialDate.getMinutes()).padStart(2, "0")
      : "00";

    const [selectedTime, setSelectedTime] = useState(`${initialHour}:${initialMinute}`);

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

    // Calendar grid calculations
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

    const handleSelectDay = (day: number) => {
      const monthStr = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const datePart = `${currentYear}-${monthStr}-${dayStr}`;

      if (enableTime) {
        const finalVal = `${datePart}T${selectedTime}`;
        onChange?.(finalVal);
      } else {
        onChange?.(datePart);
        setIsOpen(false);
      }
    };

    const handleTimeChange = (newTime: string) => {
      setSelectedTime(newTime);
      if (value) {
        const datePart = value.split("T")[0];
        onChange?.(`${datePart}T${newTime}`);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.("");
    };

    // Format display string
    const formatDisplay = (val: string) => {
      if (!val) return "";
      try {
        if (!enableTime) {
          const [y, m, d] = val.split("-");
          return `${d}/${m}/${y}`;
        }
        const [dPart, tPart] = val.split("T");
        const [y, m, d] = dPart.split("-");
        return `${d}/${m}/${y} ${tPart || ""}`;
      } catch {
        return val;
      }
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
            value={formatDisplay(value)}
            icon={enableTime ? Clock : CalendarIcon}
            actionElement={
              value ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                  title="Limpiar fecha"
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
          <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-72 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-3 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none">
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

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--foreground)] opacity-50 mb-1">
              {DAY_NAMES.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {/* Previous month padding days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div
                  key={`prev-${i}`}
                  className="h-7 flex items-center justify-center text-[11px] opacity-25"
                >
                  {daysInPrevMonth - firstDayIndex + i + 1}
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const monthStr = String(currentMonth + 1).padStart(2, "0");
                const dayStr = String(day).padStart(2, "0");
                const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

                const isSelected = value.startsWith(isoDate);
                const isToday =
                  new Date().toISOString().slice(0, 10) === isoDate;

                const isDisabled =
                  (minDate && isoDate < minDate) ||
                  (maxDate && isoDate > maxDate);

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    disabled={Boolean(isDisabled)}
                    onClick={() => handleSelectDay(day)}
                    className={`h-7 w-7 mx-auto flex items-center justify-center rounded-[calc(var(--radius)*0.5)] text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs"
                        : isToday
                        ? "border border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[var(--primary)]/10"
                        : "hover:bg-[var(--background)] text-[var(--foreground)]"
                    } ${isDisabled ? "opacity-25 cursor-not-allowed" : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Time section for Datetime picker */}
            {enableTime && (
              <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 opacity-70">
                  <Clock className="h-3.5 w-3.5" /> Hora:
                </span>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--background)] text-xs font-mono outline-none focus:border-[var(--primary)]"
                />
              </div>
            )}

            {/* Footer quick action buttons */}
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const todayIso = new Date().toISOString().slice(0, 10);
                  if (enableTime) {
                    onChange?.(`${todayIso}T${selectedTime}`);
                  } else {
                    onChange?.(todayIso);
                  }
                  setIsOpen(false);
                }}
                className="text-[11px] text-[var(--primary)] font-medium hover:underline cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] opacity-70 hover:opacity-100 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
