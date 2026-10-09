import {
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import { Clock, X } from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface TimePickerProps
  extends Omit<InputProps, "value" | "onChange" | "type"> {
  /** Formato 'HH:mm' (24 horas) */
  value?: string;
  /** Callback con valor 'HH:mm' */
  onChange?: (time: string) => void;
  /** Formato de 12 o 24 horas (por defecto: 24h) */
  use12Hours?: boolean;
  /** Intervalo en minutos para el selector rápido (por defecto: 15) */
  minuteStep?: number;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker(
    {
      value = "",
      onChange,
      use12Hours = false,
      minuteStep = 15,
      placeholder = "HH:mm",
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

    const [hours, minutes] = value ? value.split(":") : ["12", "00"];
    const [selectedHour, setSelectedHour] = useState(hours || "12");
    const [selectedMinute, setSelectedMinute] = useState(minutes || "00");

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

    const handleSelect = (h: string, m: string) => {
      setSelectedHour(h);
      setSelectedMinute(m);
      onChange?.(`${h.padStart(2, "0")}:${m.padStart(2, "0")}`);
      setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.("");
    };

    // Format display for 12h if requested
    const formatDisplay = (val: string) => {
      if (!val) return "";
      if (!use12Hours) return val;
      const [h, m] = val.split(":");
      const numH = parseInt(h, 10);
      const ampm = numH >= 12 ? "PM" : "AM";
      const displayH = numH % 12 || 12;
      return `${displayH}:${m} ${ampm}`;
    };

    // Generate minute options based on step
    const minuteOptions: string[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      minuteOptions.push(String(m).padStart(2, "0"));
    }

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
            icon={Clock}
            actionElement={
              value ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                  title="Limpiar hora"
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
          <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-64 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-3 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="text-xs font-bold text-[var(--foreground)] pb-2 mb-2 border-b border-[var(--border)] flex items-center justify-between">
              <span>Seleccionar Hora</span>
              <span className="font-mono text-[11px] text-[var(--primary)] font-semibold">
                {selectedHour}:{selectedMinute}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 h-48 overflow-hidden">
              {/* Horas Column */}
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold opacity-60 mb-1 text-center">Hora</span>
                <div className="overflow-y-auto space-y-1 pr-1 border-r border-[var(--border)] h-full">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hStr = String(i).padStart(2, "0");
                    const isSelected = selectedHour === hStr;
                    return (
                      <button
                        key={`hour-${hStr}`}
                        type="button"
                        onClick={() => {
                          setSelectedHour(hStr);
                          onChange?.(`${hStr}:${selectedMinute}`);
                        }}
                        className={`w-full py-1 text-xs rounded font-mono transition text-center cursor-pointer ${
                          isSelected
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs"
                            : "hover:bg-[var(--background)] text-[var(--foreground)]"
                        }`}
                      >
                        {hStr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minutos Column */}
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold opacity-60 mb-1 text-center">Minuto</span>
                <div className="overflow-y-auto space-y-1 h-full">
                  {minuteOptions.map((mStr) => {
                    const isSelected = selectedMinute === mStr;
                    return (
                      <button
                        key={`min-${mStr}`}
                        type="button"
                        onClick={() => handleSelect(selectedHour, mStr)}
                        className={`w-full py-1 text-xs rounded font-mono transition text-center cursor-pointer ${
                          isSelected
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs"
                            : "hover:bg-[var(--background)] text-[var(--foreground)]"
                        }`}
                      >
                        {mStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick shortcuts */}
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-between text-[11px]">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const h = String(now.getHours()).padStart(2, "0");
                  const m = String(now.getMinutes()).padStart(2, "0");
                  handleSelect(h, m);
                }}
                className="text-[var(--primary)] font-medium hover:underline cursor-pointer"
              >
                Ahora
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="opacity-70 hover:opacity-100 cursor-pointer"
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
