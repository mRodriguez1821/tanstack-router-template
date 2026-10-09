import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useId } from "react";
import {
  Palette,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  Layers,
  Sliders,
  Download,
  MousePointer,
  Type,
} from "lucide-react";
import { useTheme } from "@/common/context/ThemeContext";
import { useToast } from "@/common/hooks/useToast";
import { Button } from "@/common/components/Button";
import { Card } from "@/common/components/Card";
import type { ThemeDefinition, ThemeColors, ButtonHoverEffect } from "@/common/types/theme";

export const Route = createFileRoute("/_public/(demo)/demo/themes")({
  component: ThemeConfiguratorPage,
});

export const FONT_OPTIONS = [
  {
    id: "public-sans",
    name: "Public Sans",
    family: '"Public Sans Variable", system-ui, sans-serif',
    sample: "Aa Bb Gg 123 • Diseño moderno y equilibrado",
    badge: "Dashboard",
  },
  {
    id: "inter",
    name: "Inter",
    family: '"Inter Variable", system-ui, sans-serif',
    sample: "Aa Bb Gg 123 • Precisa, técnica y geométrica",
    badge: "Minimalista",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: '"Raleway Variable", system-ui, sans-serif',
    sample: "Aa Bb Gg 123 • Sofisticada y elegante",
    badge: "Editorial",
  },
  {
    id: "system",
    name: "Sistema (Nativa)",
    family: "system-ui, -apple-system, sans-serif",
    sample: "Aa Bb Gg 123 • Rendimiento nativo del SO",
    badge: "Nativo",
  },
];

export function ThemeConfiguratorPage() {
  const {
    mode,
    resolvedMode,
    currentThemeId,
    activeTheme,
    allThemes,
    setMode,
    setTheme,
    saveCustomTheme,
    deleteCustomTheme,
    resetToDefault,
  } = useTheme();

  const toast = useToast();
  const formId = useId();

  // Builder form state initialized with current active theme values
  const [builderName, setBuilderName] = useState("Mi Tema Personalizado");
  const [builderMode, setBuilderMode] = useState<"light" | "dark">(resolvedMode);
  const [colors, setColors] = useState<ThemeColors>({
    primary: activeTheme.colors.primary || "#18181b",
    primaryForeground: activeTheme.colors.primaryForeground || "#ffffff",
    background: activeTheme.colors.background || "#ffffff",
    foreground: activeTheme.colors.foreground || "#09090b",
    card: activeTheme.colors.card || "#ffffff",
    border: activeTheme.colors.border || "#e4e4e7",
    radius: activeTheme.colors.radius || "0.75rem",
    fontSans: activeTheme.colors.fontSans || '"Public Sans Variable", system-ui, sans-serif',
    fontHeading: activeTheme.colors.fontHeading || '"Raleway Variable", system-ui, sans-serif',
    fontSizeBase: activeTheme.colors.fontSizeBase || "16px",
    btnHoverEffect: activeTheme.colors.btnHoverEffect || "lift",
  });

  // Keep builder form synchronized when selecting another theme to edit as baseline
  const handleLoadThemeIntoBuilder = (theme: ThemeDefinition) => {
    setBuilderName(`${theme.name} (Copia)`);
    setBuilderMode(theme.mode);
    setColors({ ...theme.colors });
    toast.info(`Configuración de "${theme.name}" cargada en el editor.`);
  };

  const handleColorChange = (key: keyof ThemeColors, value: any) => {
    setColors((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        if (key === "fontSans") root.style.setProperty("--font-sans", String(value));
        if (key === "fontHeading") root.style.setProperty("--font-heading", String(value));
        if (key === "fontSizeBase") {
          root.style.setProperty("--font-size-base", String(value));
          root.style.fontSize = String(value);
        }
        if (key === "radius") root.style.setProperty("--radius", String(value));
        if (key === "primary") {
          root.style.setProperty("--primary", String(value));
          root.style.setProperty("--ring", String(value));
        }
        if (key === "background") root.style.setProperty("--background", String(value));
        if (key === "foreground") root.style.setProperty("--foreground", String(value));
        if (key === "card") root.style.setProperty("--card", String(value));
        if (key === "border") root.style.setProperty("--border", String(value));

        // Botón hover
        if (key === "btnHoverEffect") {
          const effect = value as ButtonHoverEffect;
          if (effect === "lift") {
            root.style.setProperty("--btn-hover-transform", "translateY(-2px)");
            root.style.setProperty("--btn-hover-shadow", "0 6px 16px -2px rgba(0, 0, 0, 0.16)");
          } else if (effect === "scale") {
            root.style.setProperty("--btn-hover-transform", "scale(1.04)");
            root.style.setProperty("--btn-hover-shadow", "0 4px 14px rgba(0, 0, 0, 0.12)");
          } else if (effect === "glow") {
            root.style.setProperty("--btn-hover-transform", "translateY(-1px)");
            root.style.setProperty("--btn-hover-shadow", `0 0 16px ${next.primary || "var(--primary)"}`);
          } else if (effect === "subtle") {
            root.style.setProperty("--btn-hover-transform", "translateY(-1px)");
            root.style.setProperty("--btn-hover-shadow", "0 2px 6px rgba(0, 0, 0, 0.08)");
          } else if (effect === "flat") {
            root.style.setProperty("--btn-hover-transform", "none");
            root.style.setProperty("--btn-hover-shadow", "none");
          }
        }

        if (key === "btnHoverTranslateY" || key === "btnHoverScale") {
          const ty = next.btnHoverTranslateY ?? -2;
          const sc = next.btnHoverScale ?? 1;
          const tList: string[] = [];
          if (ty !== 0) tList.push(`translateY(${ty}px)`);
          if (sc !== 1) tList.push(`scale(${sc})`);
          root.style.setProperty("--btn-hover-transform", tList.length > 0 ? tList.join(" ") : "none");
        }

        if (key === "btnHoverShadowBlur" || key === "btnHoverShadowColor") {
          const blur = next.btnHoverShadowBlur ?? 8;
          const color = next.btnHoverShadowColor || "rgba(0, 0, 0, 0.14)";
          root.style.setProperty("--btn-hover-shadow", blur > 0 ? `0 ${Math.round(blur / 2)}px ${blur}px ${color}` : "none");
        }

        // Card hover
        if (key === "cardHoverTranslateY" || key === "cardHoverScale") {
          const ty = next.cardHoverTranslateY ?? -3;
          const sc = next.cardHoverScale ?? 1;
          const tList: string[] = [];
          if (ty !== 0) tList.push(`translateY(${ty}px)`);
          if (sc !== 1) tList.push(`scale(${sc})`);
          root.style.setProperty("--card-hover-transform", tList.length > 0 ? tList.join(" ") : "none");
        }

        if (key === "cardHoverShadowBlur") {
          const blur = next.cardHoverShadowBlur ?? 16;
          root.style.setProperty("--card-hover-shadow", blur > 0 ? `0 ${Math.round(blur / 2)}px ${blur}px rgba(0, 0, 0, 0.12)` : "none");
        }

        if (key === "cardHoverBorderHighlight") {
          root.style.setProperty("--card-hover-border", next.cardHoverBorderHighlight ? (next.primary || "var(--primary)") : (next.border || "var(--border)"));
        }
      }
      return next;
    });
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = builderName.trim();
    if (!trimmedName) {
      toast.error("Por favor ingresa un nombre para el tema.");
      return;
    }

    const newTheme: ThemeDefinition = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      mode: builderMode,
      colors,
      isCustom: true,
    };

    saveCustomTheme(newTheme);
    toast.success(`Tema "${trimmedName}" guardado y aplicado correctamente.`);
  };

  const handleApplyTemporary = () => {
    const tempTheme: ThemeDefinition = {
      id: `preview-temp`,
      name: builderName || "Vista previa",
      mode: builderMode,
      colors,
    };
    saveCustomTheme(tempTheme);
    toast.info("Vista previa en vivo aplicada temporalmente.");
  };

  const handleCopyCss = () => {
    const cssVars = `:root {
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground || "#ffffff"};
  --background: ${colors.background || "#ffffff"};
  --foreground: ${colors.foreground || "#000000"};
  --card: ${colors.card || "#ffffff"};
  --border: ${colors.border || "#e4e4e7"};
  --radius: ${colors.radius || "0.75rem"};
}`;
    navigator.clipboard.writeText(cssVars);
    toast.success("Variables CSS copiadas al portapapeles.");
  };

  const customThemes = allThemes.filter((t) => t.isCustom);

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-8 p-4 md:p-8 mx-auto w-full">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/demo"
          className="text-xs font-medium text-[var(--foreground)] opacity-70 hover:opacity-100 transition flex items-center gap-1"
        >
          &larr; Volver a Demos
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Restablecer a defecto
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Configurador y Creador de Temas
            </h1>
            <p className="text-xs md:text-sm text-[var(--foreground)] opacity-70">
              Personaliza paletas de colores, radio de bordes y temas claro/oscuro con sincronización instantánea y persistencia en storage.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Mode Selector (Segmented Control) */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60">
          Modo de Apariencia
        </h2>
        <div className="inline-flex rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-1">
          <button
            type="button"
            onClick={() => setMode("light")}
            className={`flex items-center gap-2 rounded-[calc(var(--radius)*0.7)] px-3 py-1.5 text-xs font-medium transition ${
              mode === "light"
                ? "bg-[var(--background)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--foreground)] opacity-70 hover:opacity-100"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Claro (Light)
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={`flex items-center gap-2 rounded-[calc(var(--radius)*0.7)] px-3 py-1.5 text-xs font-medium transition ${
              mode === "dark"
                ? "bg-[var(--background)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--foreground)] opacity-70 hover:opacity-100"
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            Oscuro (Dark)
          </button>
          <button
            type="button"
            onClick={() => setMode("system")}
            className={`flex items-center gap-2 rounded-[calc(var(--radius)*0.7)] px-3 py-1.5 text-xs font-medium transition ${
              mode === "system"
                ? "bg-[var(--background)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--foreground)] opacity-70 hover:opacity-100"
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            Sistema ({resolvedMode})
          </button>
        </div>
      </section>

      {/* Built-in Theme Presets Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60">
            Temas Predeterminados & Presets
          </h2>
          <span className="text-xs text-[var(--foreground)] opacity-60">
            Tema activo: <strong className="text-[var(--foreground)] opacity-100">{activeTheme.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allThemes
            .filter((t) => !t.isCustom)
            .map((preset) => {
              const isSelected = preset.id === currentThemeId;
              return (
                <div
                  key={preset.id}
                  onClick={() => setTheme(preset.id)}
                  className={`group relative flex flex-col justify-between p-3.5 rounded-[var(--radius)] border text-left cursor-pointer transition ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--card)] ring-2 ring-[var(--primary)]/20 shadow-xs"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/60"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--card-foreground)]">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
                      Modo {preset.mode}
                    </span>
                  </div>

                  {/* Swatch previews */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.colors.primary }}
                        title={`Primary: ${preset.colors.primary}`}
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.colors.background }}
                        title={`Background: ${preset.colors.background}`}
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.colors.card }}
                        title={`Card: ${preset.colors.card}`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadThemeIntoBuilder(preset);
                      }}
                      className="text-[11px] opacity-70 hover:opacity-100 transition"
                      title="Editar como plantilla base"
                    >
                      Copiar a editor &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Main Two Columns: Creator / Configurator Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Custom Theme Builder Form */}
        <section className="lg:col-span-6 space-y-6 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-5 md:p-6 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[var(--foreground)]" />
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Creador de Tema Personalizado
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCopyCss}
              className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-70 hover:opacity-100 transition"
              title="Copiar CSS variables"
            >
              <Copy className="h-3.5 w-3.5" />
              Copiar CSS
            </button>
          </div>

          <form onSubmit={handleSaveTheme} className="space-y-5">
            {/* Theme Name */}
            <div>
              <label
                htmlFor={`${formId}-name`}
                className="block text-xs font-medium text-[var(--foreground)] mb-1"
              >
                Nombre del Tema
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                value={builderName}
                onChange={(e) => setBuilderName(e.target.value)}
                placeholder="Ej. Tema Corporativo Azul"
                className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] transition focus:border-[var(--primary)] focus:outline-none"
                required
              />
            </div>

            {/* Target Mode */}
            <div>
              <span className="block text-xs font-medium text-[var(--foreground)] mb-1">
                Modo Base
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBuilderMode("light")}
                  className={`flex-1 rounded-[var(--radius)] border py-2 text-xs font-medium transition ${
                    builderMode === "light"
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border)] text-[var(--foreground)] opacity-70 hover:opacity-100 hover:bg-[var(--background)]"
                  }`}
                >
                  Modo Claro
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderMode("dark")}
                  className={`flex-1 rounded-[var(--radius)] border py-2 text-xs font-medium transition ${
                    builderMode === "dark"
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border)] text-[var(--foreground)] opacity-70 hover:opacity-100 hover:bg-[var(--background)]"
                  }`}
                >
                  Modo Oscuro
                </button>
              </div>
            </div>

            {/* Color Pickers Grid */}
            <div className="space-y-3 pt-2">
              <span className="block text-xs font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60">
                Paleta de Colores
              </span>

              {/* Color item: Primary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ColorInputRow
                  label="Color Primario"
                  value={colors.primary}
                  onChange={(val) => handleColorChange("primary", val)}
                  hint="Botones, enlaces destacados"
                />
                <ColorInputRow
                  label="Texto sobre Primario"
                  value={colors.primaryForeground || "#ffffff"}
                  onChange={(val) => handleColorChange("primaryForeground", val)}
                  hint="Texto dentro de botones primarios"
                />
                <ColorInputRow
                  label="Fondo de Aplicación"
                  value={colors.background || "#ffffff"}
                  onChange={(val) => handleColorChange("background", val)}
                  hint="Background general del layout"
                />
                <ColorInputRow
                  label="Texto General"
                  value={colors.foreground || "#09090b"}
                  onChange={(val) => handleColorChange("foreground", val)}
                  hint="Color base de tipografía"
                />
                <ColorInputRow
                  label="Fondo de Tarjetas"
                  value={colors.card || "#ffffff"}
                  onChange={(val) => handleColorChange("card", val)}
                  hint="Superficies, paneles y modales"
                />
                <ColorInputRow
                  label="Bordes y Separadores"
                  value={colors.border || "#e4e4e7"}
                  onChange={(val) => handleColorChange("border", val)}
                  hint="Líneas divisorias y contornos"
                />
              </div>
            </div>

            {/* Radius Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`${formId}-radius`}
                  className="text-xs font-medium text-[var(--foreground)]"
                >
                  Radio de Bordes (Border Radius)
                </label>
                <span className="font-mono text-xs opacity-70">{colors.radius}</span>
              </div>
              <input
                id={`${formId}-radius`}
                type="range"
                min="0"
                max="24"
                step="2"
                value={parseInt(colors.radius?.replace(/[^0-9]/g, "") || "12", 10)}
                onChange={(e) =>
                  handleColorChange("radius", `${e.target.value}px`)
                }
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-[10px] opacity-60">
                <span>0px (Cuadrado)</span>
                <span>8px (Suave)</span>
                <span>16px (Moderno)</span>
                <span>24px (Redondo)</span>
              </div>
            </div>

            {/* Font Selection with Dropdowns and Live Preview */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`${formId}-fontSans`}
                    className="text-xs font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60"
                  >
                    Fuente Principal (font-sans)
                  </label>
                  <span className="text-[10px] opacity-70 font-mono">
                    {FONT_OPTIONS.find((f) => colors.fontSans?.includes(f.id) || colors.fontSans === f.family)?.name || "Personalizada"}
                  </span>
                </div>
                <select
                  id={`${formId}-fontSans`}
                  value={
                    FONT_OPTIONS.find((f) => colors.fontSans?.includes(f.id) || colors.fontSans === f.family)?.family ||
                    colors.fontSans ||
                    FONT_OPTIONS[0].family
                  }
                  onChange={(e) => handleColorChange("fontSans", e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={`opt-sans-${font.id}`} value={font.family}>
                      {font.name} — ({font.badge})
                    </option>
                  ))}
                </select>
                <div
                  className="p-2.5 rounded-[calc(var(--radius)*0.75)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] text-xs transition"
                  style={{ fontFamily: colors.fontSans || FONT_OPTIONS[0].family }}
                >
                  <span className="text-[10px] font-semibold opacity-60 block mb-0.5">Vista previa de texto (Regular & Bold):</span>
                  <p className="leading-snug">
                    The quick brown fox jumps over the lazy dog. 1234567890.
                  </p>
                  <p className="font-bold leading-snug mt-0.5">
                    Diseño accesible, limpio y con excelente legibilidad en pantalla.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`${formId}-fontHeading`}
                    className="text-xs font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60"
                  >
                    Fuente de Encabezados (font-heading)
                  </label>
                  <span className="text-[10px] opacity-70 font-mono">
                    {FONT_OPTIONS.find((f) => colors.fontHeading?.includes(f.id) || colors.fontHeading === f.family)?.name || "Personalizada"}
                  </span>
                </div>
                <select
                  id={`${formId}-fontHeading`}
                  value={
                    FONT_OPTIONS.find((f) => colors.fontHeading?.includes(f.id) || colors.fontHeading === f.family)?.family ||
                    colors.fontHeading ||
                    FONT_OPTIONS[2].family
                  }
                  onChange={(e) => handleColorChange("fontHeading", e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={`opt-heading-${font.id}`} value={font.family}>
                      {font.name} — ({font.badge})
                    </option>
                  ))}
                </select>
                <div
                  className="p-2.5 rounded-[calc(var(--radius)*0.75)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] text-xs transition"
                  style={{ fontFamily: colors.fontHeading || FONT_OPTIONS[2].family }}
                >
                  <span className="text-[10px] font-semibold opacity-60 block mb-0.5">Vista previa de encabezado:</span>
                  <p className="text-sm font-bold tracking-tight">
                    Encabezado H1: Rendimiento y Experiencia de Usuario
                  </p>
                </div>
              </div>
            </div>

            {/* Font Size Base Scale Controls */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`${formId}-fontSize`}
                  className="text-xs font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60 flex items-center gap-1.5"
                >
                  <Type className="h-3.5 w-3.5" />
                  Tamaño de Letra Base (Escala Tipográfica)
                </label>
                <div className="flex items-center gap-1 font-mono text-xs opacity-75">
                  <span className="font-bold text-[var(--foreground)]">
                    {colors.fontSizeBase || "16px"}
                  </span>
                </div>
              </div>

              {(() => {
                const basePx = parseInt(
                  (colors.fontSizeBase || "16px").replace(/[^0-9]/g, "") || "16",
                  10
                );
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        id={`${formId}-fontSize`}
                        type="range"
                        min="12"
                        max="22"
                        step="1"
                        value={basePx}
                        onChange={(e) =>
                          handleColorChange("fontSizeBase", `${e.target.value}px`)
                        }
                        className="flex-1 accent-[var(--primary)]"
                      />
                      <input
                        type="number"
                        min="12"
                        max="22"
                        value={basePx}
                        onChange={(e) =>
                          handleColorChange("fontSizeBase", `${e.target.value}px`)
                        }
                        className="w-16 rounded-[calc(var(--radius)*0.5)] border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-center font-mono text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      />
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Compacto", val: "14px" },
                        { label: "Estándar", val: "16px" },
                        { label: "Cómodo", val: "18px" },
                        { label: "Grande", val: "20px" },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => handleColorChange("fontSizeBase", preset.val)}
                          className={`px-2.5 py-1 rounded-[calc(var(--radius)*0.5)] text-[10px] font-medium border transition cursor-pointer ${
                            (colors.fontSizeBase || "16px") === preset.val
                              ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                              : "border-[var(--border)] bg-[var(--background)] opacity-75 hover:opacity-100"
                          }`}
                        >
                          {preset.label} ({preset.val})
                        </button>
                      ))}
                    </div>

                    {/* Computed Scale Preview */}
                    <div className="grid grid-cols-6 gap-1 text-center pt-1 text-[10px] opacity-75">
                      <div className="border border-[var(--border)] rounded p-1">
                        xs: {Math.round(basePx * 0.75)}px
                      </div>
                      <div className="border border-[var(--border)] rounded p-1">
                        sm: {Math.round(basePx * 0.875)}px
                      </div>
                      <div className="border border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--primary)] rounded p-1">
                        base: {basePx}px
                      </div>
                      <div className="border border-[var(--border)] rounded p-1">
                        lg: {Math.round(basePx * 1.125)}px
                      </div>
                      <div className="border border-[var(--border)] rounded p-1">
                        xl: {Math.round(basePx * 1.25)}px
                      </div>
                      <div className="border border-[var(--border)] rounded p-1">
                        2xl: {Math.round(basePx * 1.5)}px
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Button Hover Appearance & Detailed Controls */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60 flex items-center gap-1.5">
                  <MousePointer className="h-3.5 w-3.5" />
                  Efecto Hover en Botones
                </label>
                <span className="font-mono text-[10px] uppercase font-bold text-[var(--primary)]">
                  {colors.btnHoverEffect || "lift"}
                </span>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
                {[
                  { id: "lift", title: "Lift", desc: "Eleva -2px" },
                  { id: "scale", title: "Scale", desc: "Escala 1.04" },
                  { id: "glow", title: "Glow", desc: "Brillo de color" },
                  { id: "subtle", title: "Subtle", desc: "Suave -1px" },
                  { id: "flat", title: "Flat", desc: "Estático" },
                ].map((effect) => {
                  const isSelected = (colors.btnHoverEffect || "lift") === effect.id;
                  return (
                    <button
                      key={effect.id}
                      type="button"
                      onClick={() => handleColorChange("btnHoverEffect", effect.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-[var(--radius)] border text-center transition cursor-pointer ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/40"
                      }`}
                    >
                      <span className="text-xs font-semibold text-[var(--foreground)]">{effect.title}</span>
                      <span className="text-[9px] opacity-60 mt-0.5">{effect.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Granular Button Hover Controls */}
              <div className="p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] space-y-3">
                <span className="text-[11px] font-semibold text-[var(--foreground)] block">
                  Ajuste Detallado de Botones (Microinteracción)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* TranslateY */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Elevación (Y):</span>
                      <span className="font-mono font-semibold">{colors.btnHoverTranslateY ?? -2}px</span>
                    </div>
                    <input
                      type="range"
                      min="-8"
                      max="4"
                      step="1"
                      value={colors.btnHoverTranslateY ?? -2}
                      onChange={(e) => handleColorChange("btnHoverTranslateY", parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>

                  {/* Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Escala (Zoom):</span>
                      <span className="font-mono font-semibold">{colors.btnHoverScale ?? 1}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.95"
                      max="1.1"
                      step="0.01"
                      value={colors.btnHoverScale ?? 1}
                      onChange={(e) => handleColorChange("btnHoverScale", parseFloat(e.target.value))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>

                  {/* Shadow Blur */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Difuminado de Sombra:</span>
                      <span className="font-mono font-semibold">{colors.btnHoverShadowBlur ?? 8}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="2"
                      value={colors.btnHoverShadowBlur ?? 8}
                      onChange={(e) => handleColorChange("btnHoverShadowBlur", parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>

                  {/* Shadow Color */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Color del Resplandor:</span>
                      <span className="font-mono text-[10px]">{colors.btnHoverShadowColor || "Normal"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colors.btnHoverShadowColor?.startsWith("#") ? colors.btnHoverShadowColor : colors.primary || "#3b82f6"}
                        onChange={(e) => handleColorChange("btnHoverShadowColor", e.target.value)}
                        className="h-6 w-10 cursor-pointer rounded border border-[var(--border)] bg-transparent p-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleColorChange("btnHoverShadowColor", "")}
                        className="text-[10px] px-2 py-0.5 rounded border border-[var(--border)] opacity-70 hover:opacity-100"
                      >
                        Resetear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Hover Appearance & Detailed Controls */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide uppercase text-[var(--foreground)] opacity-60 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Efecto Hover en Tarjetas (Cards)
                </label>
              </div>
              <p className="text-[11px] opacity-70">
                Personaliza la microinteracción al pasar el mouse sobre tarjetas interactivas:
              </p>

              {/* Granular Card Hover Controls */}
              <div className="p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* TranslateY */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Elevación (Y):</span>
                      <span className="font-mono font-semibold">{colors.cardHoverTranslateY ?? -3}px</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="4"
                      step="1"
                      value={colors.cardHoverTranslateY ?? -3}
                      onChange={(e) => handleColorChange("cardHoverTranslateY", parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>

                  {/* Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Escala (Zoom):</span>
                      <span className="font-mono font-semibold">{colors.cardHoverScale ?? 1}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.98"
                      max="1.06"
                      step="0.005"
                      value={colors.cardHoverScale ?? 1}
                      onChange={(e) => handleColorChange("cardHoverScale", parseFloat(e.target.value))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>

                  {/* Shadow Blur */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Sombra Profunda (Blur):</span>
                      <span className="font-mono font-semibold">{colors.cardHoverShadowBlur ?? 16}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      step="2"
                      value={colors.cardHoverShadowBlur ?? 16}
                      onChange={(e) => handleColorChange("cardHoverShadowBlur", parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>

                  {/* Border Highlight Toggle */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">Borde Resaltado:</span>
                      <span className="font-mono text-[10px] font-bold text-[var(--primary)]">
                        {colors.cardHoverBorderHighlight ? "Activo (Primario)" : "Normal"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleColorChange("cardHoverBorderHighlight", !colors.cardHoverBorderHighlight)}
                      className={`w-full py-1 px-2.5 rounded text-xs font-medium border transition cursor-pointer ${
                        colors.cardHoverBorderHighlight
                          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "border-[var(--border)] bg-[var(--card)] opacity-80"
                      }`}
                    >
                      {colors.cardHoverBorderHighlight ? "Borde Color Primario Activado" : "Mantener Borde Neutro"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border)]">
              <Button type="submit" variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                Guardar y Activar Tema
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyTemporary}
                icon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Probar en Vivo
              </Button>
            </div>
          </form>
        </section>

        {/* Right Column: Live Component Preview Sandbox */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-5 md:p-6 shadow-xs space-y-5 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[var(--foreground)]" />
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  Vista Previa en Vivo (UI Sandbox)
                </h2>
              </div>
            </div>

            {/* Showcase: WorkforceHub Button Component with Hover Animations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Botones (WorkforceHub)</h3>
                  <p className="text-xs opacity-75">
                    Microinteracción activa:{" "}
                    <strong className="uppercase text-[var(--primary)]">
                      {colors.btnHoverEffect || "lift"}
                    </strong>
                    . Pasa el cursor por encima para probar la animación y haz click para ver el feedback táctil.
                  </p>
                </div>
              </div>

              {/* Button Variants */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => toast.success("Botón Primario clickeado")}
                >
                  Primario
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.info("Botón Secundario clickeado")}
                >
                  Secundario
                </Button>
                <Button
                  variant="outline"
                  icon={<Download className="h-4 w-4" />}
                  onClick={() => toast.info("Botón Outline clickeado")}
                >
                  Outline
                </Button>
                <Button
                  variant="danger"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => toast.error("Botón Danger clickeado")}
                >
                  Danger
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toast.info("Botón Ghost clickeado")}
                >
                  Ghost
                </Button>
                <Button
                  variant="primary"
                  isLoading={true}
                >
                  Guardando...
                </Button>
              </div>

              {/* Button Sizes */}
              <div className="pt-2 border-t border-[var(--border)]">
                <p className="text-xs font-medium opacity-80 mb-2">
                  Tamaños regulados por variables de tema (--btn-height-*, --font-size-*, --icon-*):
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                    Pequeño (sm - 32px)
                  </Button>
                  <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
                    Mediano (md - 38px)
                  </Button>
                  <Button variant="primary" size="lg" icon={<Plus className="h-5 w-5" />}>
                    Grande (lg - 44px)
                  </Button>
                </div>
              </div>
            </div>

            {/* Showcase: WorkforceHub Card Component with Hover Animations */}
            <div className="space-y-3 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Tarjetas Interactivas (Card)</h3>
                  <p className="text-xs opacity-75">
                    Pasa el cursor sobre la tarjeta para apreciar la microinteracción de elevación, escala y sombra personalizada.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card
                  interactive={true}
                  title="Tarjeta Interactiva A"
                  description="Reacciona con animación suave según los controles de hover"
                  headerExtra={
                    <span className="px-2 py-0.5 rounded-[var(--radius)] text-[10px] font-bold bg-[var(--primary)] text-[var(--primary-foreground)]">
                      Hover Me
                    </span>
                  }
                  footer={
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">
                        Acción Primaria
                      </Button>
                      <Button variant="outline" size="sm">
                        Detalles
                      </Button>
                    </div>
                  }
                >
                  <p className="text-xs opacity-80">
                    Esta tarjeta utiliza los tokens dinámicos: <code className="font-mono text-[10px] bg-[var(--background)] px-1 py-0.5 rounded border border-[var(--border)]">--card-hover-transform</code> y <code className="font-mono text-[10px] bg-[var(--background)] px-1 py-0.5 rounded border border-[var(--border)]">--card-hover-shadow</code>.
                  </p>
                </Card>

                <Card
                  interactive={true}
                  title="Formulario en Tarjeta B"
                  description="Soporta inputs y botones coordinados"
                  footer={
                    <Button variant="secondary" size="sm" onClick={() => toast.success("Tarjeta interactiva!")}>
                      Probar Clic
                    </Button>
                  }
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium block">
                      Campo de texto reactivo
                    </label>
                    <input
                      type="text"
                      placeholder="Escribe algo aquí..."
                      className="w-full text-xs px-3 py-1.5 rounded-[calc(var(--radius)*0.6)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]"
                    />
                  </div>
                </Card>
              </div>
            </div>

          </div>

          {/* Saved Custom Themes Section */}
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-5 md:p-6 shadow-xs space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Mis Temas Guardados ({customThemes.length})
              </h2>
            </div>

            {customThemes.length === 0 ? (
              <p className="text-xs opacity-60 py-4 text-center">
                Aún no has guardado ningún tema personalizado. Utiliza el creador a la izquierda para guardar el tuyo.
              </p>
            ) : (
              <div className="space-y-2">
                {customThemes.map((ct) => {
                  const isActive = ct.id === currentThemeId;
                  return (
                    <div
                      key={ct.id}
                      className={`flex items-center justify-between p-3 rounded-[var(--radius)] border transition ${
                        isActive
                          ? "border-[var(--primary)] bg-[var(--background)] shadow-xs"
                          : "border-[var(--border)] hover:bg-[var(--background)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-5 w-5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: ct.colors.primary }}
                        />
                        <div>
                          <p className="text-xs font-semibold text-[var(--foreground)]">
                            {ct.name}
                          </p>
                          <p className="text-[10px] opacity-60">
                            Modo: {ct.mode} • Radio: {ct.colors.radius}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTheme(ct.id)}
                            className="text-[11px] h-7 px-2"
                          >
                            Activar
                          </Button>
                        ) : (
                          <span className="text-[11px] font-semibold text-[var(--foreground)] flex items-center gap-1">
                            <Check className="h-3 w-3" /> Activo
                          </span>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            deleteCustomTheme(ct.id);
                            toast.info(`Tema "${ct.name}" eliminado.`);
                          }}
                          className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                          title="Eliminar tema"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

interface ColorInputRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  hint?: string;
}

function ColorInputRow({ label, value, onChange, hint }: ColorInputRowProps) {
  const inputId = useId();

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-2.5 space-y-1 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-[11px] font-medium text-[var(--foreground)] opacity-85"
        >
          {label}
        </label>
        <span className="font-mono text-[10px] opacity-60 uppercase">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0"
          title={`Seleccionar color para ${label}`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-[calc(var(--radius)*0.5)] border border-[var(--border)] bg-[var(--card)] px-2 py-1 font-mono text-[11px] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
      </div>
      {hint && <p className="text-[10px] opacity-60">{hint}</p>}
    </div>
  );
}
