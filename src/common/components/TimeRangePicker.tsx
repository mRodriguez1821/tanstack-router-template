import {
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import { Clock, X } from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface TimeRangeValue {
  from?: string; // HH:mm
  to?: string;   // HH:mm
}

export interface TimeRangePickerProps
  extends Omit<InputProps, "value" | "onChange" | "type"> {
  value?: TimeRangeValue;
  onChange?: (val: TimeRangeValue) => void;
  placeholder?: string;
  minuteStep?: number;
}

export const TimeRangePicker = forwardRef<HTMLInputElement, TimeRangePickerProps>(
  function TimeRangePicker(
    {
      value = {},
      onChange,
      minuteStep = 15,
      placeholder = "HH:mm - HH:mm",
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

    const [activeTab, setActiveTab] = useState<"from" | "to">("from");

    const [fromTime, setFromTime] = useState(value.from || "09:00");
    const [toTime, setToTime] = useState(value.to || "18:00");

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

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.({ from: undefined, to: undefined });
    };

    const formatDisplay = () => {
      if (!value.from && !value.to) return "";
      if (value.from && !value.to) return `Desde ${value.from}`;
      return `${value.from} - ${value.to}`;
    };

    const handleApply = () => {
      onChange?.({ from: fromTime, to: toTime });
      setIsOpen(false);
    };

    const minuteOptions: string[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      minuteOptions.push(String(m).padStart(2, "0"));
    }

    const currentTimeSetting = activeTab === "from" ? fromTime : toTime;
    const [currH, currM] = currentTimeSetting.split(":");

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
            icon={Clock}
            actionElement={
              value.from || value.to ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                  title="Limpiar rango de horas"
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
            {/* Tab switch between 'From' and 'To' */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--background)] rounded-[calc(var(--radius)*0.6)] mb-3">
              <button
                type="button"
                onClick={() => setActiveTab("from")}
                className={`py-1 text-xs font-semibold rounded-[calc(var(--radius)*0.5)] transition cursor-pointer ${
                  activeTab === "from"
                    ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                Inicio: {fromTime}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("to")}
                className={`py-1 text-xs font-semibold rounded-[calc(var(--radius)*0.5)] transition cursor-pointer ${
                  activeTab === "to"
                    ? "bg-[var(--card)] text-[var(--primary)] shadow-xs"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                Fin: {toTime}
              </button>
            </div>

            {/* Time selector grid */}
            <div className="grid grid-cols-2 gap-2 h-44 overflow-hidden">
              {/* Hours */}
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold opacity-60 mb-1 text-center">Hora</span>
                <div className="overflow-y-auto space-y-1 pr-1 border-r border-[var(--border)] h-full">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hStr = String(i).padStart(2, "0");
                    const isSelected = currH === hStr;
                    return (
                      <button
                        key={`tab-h-${hStr}`}
                        type="button"
                        onClick={() => {
                          const updated = `${hStr}:${currM}`;
                          if (activeTab === "from") setFromTime(updated);
                          else setToTime(updated);
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

              {/* Minutes */}
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold opacity-60 mb-1 text-center">Minuto</span>
                <div className="overflow-y-auto space-y-1 h-full">
                  {minuteOptions.map((mStr) => {
                    const isSelected = currM === mStr;
                    return (
                      <button
                        key={`tab-m-${mStr}`}
                        type="button"
                        onClick={() => {
                          const updated = `${currH}:${mStr}`;
                          if (activeTab === "from") {
                            setFromTime(updated);
                            setActiveTab("to"); // auto switch to 'to'
                          } else {
                            setToTime(updated);
                          }
                        }}
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

            {/* Footer with Apply button */}
            <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFromTime("09:00");
                  setToTime("17:00");
                }}
                className="text-[10px] opacity-75 hover:opacity-100 cursor-pointer"
              >
                Jornada (9-17)
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 text-xs rounded hover:bg-[var(--background)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--primary)] text-[var(--primary-foreground)] cursor-pointer shadow-xs"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
