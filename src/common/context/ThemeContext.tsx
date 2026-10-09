import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ThemeMode,
  ThemeDefinition,
  ThemeContextValue,
} from "../types/theme";

export const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    id: "default-light",
    name: "Claro Predeterminado",
    mode: "light",
    colors: {
      primary: "#18181b",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#09090b",
      card: "#ffffff",
      border: "#e4e4e7",
      radius: "0.75rem",
    },
  },
  {
    id: "default-dark",
    name: "Oscuro Predeterminado",
    mode: "dark",
    colors: {
      primary: "#fafafa",
      primaryForeground: "#09090b",
      background: "#09090b",
      foreground: "#fafafa",
      card: "#18181b",
      border: "#27272a",
      radius: "0.75rem",
    },
  },
  {
    id: "zinc-monochrome",
    name: "Zinc Monocromático",
    mode: "dark",
    colors: {
      primary: "#ffffff",
      primaryForeground: "#000000",
      background: "#000000",
      foreground: "#f4f4f5",
      card: "#09090b",
      border: "#27272a",
      radius: "0.5rem",
    },
  },
  {
    id: "slate-minimal",
    name: "Pizarra Ejecutivo (Slate)",
    mode: "light",
    colors: {
      primary: "#334155",
      primaryForeground: "#ffffff",
      background: "#f8fafc",
      foreground: "#0f172a",
      card: "#ffffff",
      border: "#e2e8f0",
      radius: "0.625rem",
    },
  },
  {
    id: "midnight-indigo",
    name: "Medianoche Índigo",
    mode: "dark",
    colors: {
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      background: "#030712",
      foreground: "#f9fafb",
      card: "#111827",
      border: "#1f2937",
      radius: "0.875rem",
    },
  },
  {
    id: "emerald-forest",
    name: "Esmeralda Botánico",
    mode: "light",
    colors: {
      primary: "#059669",
      primaryForeground: "#ffffff",
      background: "#f0fdf4",
      foreground: "#064e3b",
      card: "#ffffff",
      border: "#bbf7d0",
      radius: "0.75rem",
    },
  },
  {
    id: "violet-neon",
    name: "Violeta Tecnológico",
    mode: "dark",
    colors: {
      primary: "#8b5cf6",
      primaryForeground: "#ffffff",
      background: "#090514",
      foreground: "#f5f3ff",
      card: "#130d29",
      border: "#2e1065",
      radius: "1rem",
    },
  },
];

const THEME_STORAGE_KEY = "app.theme_id";
const MODE_STORAGE_KEY = "app.theme_mode";
const CUSTOM_THEMES_STORAGE_KEY = "app.custom_themes";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Mode: 'light' | 'dark' | 'system'
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode;
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "dark";
  });

  // Custom Themes list
  const [customThemes, setCustomThemes] = useState<ThemeDefinition[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // All Themes = Built-in + Custom
  const allThemes = useMemo(
    () => [...BUILT_IN_THEMES, ...customThemes],
    [customThemes]
  );

  // Active theme ID
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    if (typeof window === "undefined") return "default-dark";
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved || "default-dark";
  });

  // Active theme definition
  const activeTheme = useMemo(() => {
    const found = allThemes.find((t) => t.id === currentThemeId);
    if (found) return found;
    return mode === "dark" ? BUILT_IN_THEMES[1] : BUILT_IN_THEMES[0];
  }, [allThemes, currentThemeId, mode]);

  // Resolve actual display mode ('light' | 'dark')
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Listen to system preference changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolvedMode: "light" | "dark" = useMemo(() => {
    if (mode === "system") {
      return systemIsDark ? "dark" : "light";
    }
    return activeTheme.mode || mode;
  }, [mode, systemIsDark, activeTheme.mode]);

function applyThemeToDom(colors: ThemeDefinition["colors"], isDark: boolean) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // 1. Toggle dark class
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // 2. Set custom CSS variables
  if (colors) {
    if (colors.primary) {
      root.style.setProperty("--primary", colors.primary);
      root.style.setProperty("--ring", colors.primary);
    }
    if (colors.primaryForeground)
      root.style.setProperty("--primary-foreground", colors.primaryForeground);
    if (colors.background)
      root.style.setProperty("--background", colors.background);
    if (colors.foreground) {
      root.style.setProperty("--foreground", colors.foreground);
      root.style.setProperty("--popover-foreground", colors.foreground);
    }
    if (colors.card) {
      root.style.setProperty("--card", colors.card);
      root.style.setProperty("--popover", colors.card);
    }
    const cardFg = colors.cardForeground || colors.foreground;
    if (cardFg) {
      root.style.setProperty("--card-foreground", cardFg);
    }
    if (colors.border) {
      root.style.setProperty("--border", colors.border);
      root.style.setProperty("--input", colors.border);
    }
    if (colors.radius) root.style.setProperty("--radius", colors.radius);
    if (colors.fontSans) root.style.setProperty("--font-sans", colors.fontSans);
    if (colors.fontHeading) root.style.setProperty("--font-heading", colors.fontHeading);

    // Font size scaling: set both CSS variable AND documentElement style for total REM scaling
    if (colors.fontSizeBase) {
      root.style.setProperty("--font-size-base", colors.fontSizeBase);
      root.style.fontSize = colors.fontSizeBase;
    }

    // Efecto de hover de botones (detallado o preset)
    if (colors.btnHoverTransform) {
      root.style.setProperty("--btn-hover-transform", colors.btnHoverTransform);
    } else if (
      colors.btnHoverTranslateY !== undefined ||
      colors.btnHoverScale !== undefined
    ) {
      const ty = colors.btnHoverTranslateY ?? 0;
      const sc = colors.btnHoverScale ?? 1;
      const transforms: string[] = [];
      if (ty !== 0) transforms.push(`translateY(${ty}px)`);
      if (sc !== 1) transforms.push(`scale(${sc})`);
      root.style.setProperty(
        "--btn-hover-transform",
        transforms.length > 0 ? transforms.join(" ") : "none"
      );
    } else if (colors.btnHoverEffect) {
      switch (colors.btnHoverEffect) {
        case "lift":
          root.style.setProperty("--btn-hover-transform", "translateY(-2px)");
          root.style.setProperty("--btn-hover-shadow", "0 6px 16px -2px rgba(0, 0, 0, 0.16)");
          break;
        case "scale":
          root.style.setProperty("--btn-hover-transform", "scale(1.04)");
          root.style.setProperty("--btn-hover-shadow", "0 4px 14px rgba(0, 0, 0, 0.12)");
          break;
        case "glow":
          root.style.setProperty("--btn-hover-transform", "translateY(-1px)");
          root.style.setProperty(
            "--btn-hover-shadow",
            `0 0 16px ${colors.primary || "var(--primary)"}`
          );
          break;
        case "subtle":
          root.style.setProperty("--btn-hover-transform", "translateY(-1px)");
          root.style.setProperty("--btn-hover-shadow", "0 2px 6px rgba(0, 0, 0, 0.08)");
          break;
        case "flat":
          root.style.setProperty("--btn-hover-transform", "none");
          root.style.setProperty("--btn-hover-shadow", "none");
          break;
      }
    }

    if (colors.btnHoverShadow) {
      root.style.setProperty("--btn-hover-shadow", colors.btnHoverShadow);
    } else if (colors.btnHoverShadowBlur !== undefined) {
      const blur = colors.btnHoverShadowBlur;
      const shadowColor = colors.btnHoverShadowColor || "rgba(0, 0, 0, 0.14)";
      root.style.setProperty(
        "--btn-hover-shadow",
        blur > 0 ? `0 ${Math.round(blur / 2)}px ${blur}px ${shadowColor}` : "none"
      );
    }

    // Efecto de hover de tarjetas (Cards)
    if (colors.cardHoverTransform) {
      root.style.setProperty("--card-hover-transform", colors.cardHoverTransform);
    } else if (
      colors.cardHoverTranslateY !== undefined ||
      colors.cardHoverScale !== undefined
    ) {
      const ty = colors.cardHoverTranslateY ?? 0;
      const sc = colors.cardHoverScale ?? 1;
      const transforms: string[] = [];
      if (ty !== 0) transforms.push(`translateY(${ty}px)`);
      if (sc !== 1) transforms.push(`scale(${sc})`);
      root.style.setProperty(
        "--card-hover-transform",
        transforms.length > 0 ? transforms.join(" ") : "none"
      );
    }

    if (colors.cardHoverShadow) {
      root.style.setProperty("--card-hover-shadow", colors.cardHoverShadow);
    } else if (colors.cardHoverShadowBlur !== undefined) {
      const blur = colors.cardHoverShadowBlur;
      root.style.setProperty(
        "--card-hover-shadow",
        blur > 0 ? `0 ${Math.round(blur / 2)}px ${blur}px rgba(0, 0, 0, 0.12)` : "none"
      );
    }

    if (colors.cardHoverBorder) {
      root.style.setProperty("--card-hover-border", colors.cardHoverBorder);
    } else if (colors.cardHoverBorderHighlight !== undefined) {
      root.style.setProperty(
        "--card-hover-border",
        colors.cardHoverBorderHighlight ? (colors.primary || "var(--primary)") : (colors.border || "var(--border)")
      );
    }
  }
}

  // Apply theme to DOM
  useEffect(() => {
    applyThemeToDom(activeTheme.colors, resolvedMode === "dark");
  }, [resolvedMode, activeTheme]);

  // Handlers
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);

    // If switching between light/dark, automatically adapt to default light/dark theme if using defaults
    if (newMode === "light" && currentThemeId === "default-dark") {
      setTheme("default-light");
    } else if (newMode === "dark" && currentThemeId === "default-light") {
      setTheme("default-dark");
    }
  };

  const toggleMode = () => {
    const nextMode = resolvedMode === "dark" ? "light" : "dark";
    setMode(nextMode);
  };

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);

    const theme = allThemes.find((t) => t.id === themeId);
    if (theme) {
      setModeState(theme.mode);
      localStorage.setItem(MODE_STORAGE_KEY, theme.mode);
    }
  };

  const saveCustomTheme = (theme: ThemeDefinition) => {
    const updatedTheme: ThemeDefinition = { ...theme, isCustom: true };
    const filtered = customThemes.filter((t) => t.id !== updatedTheme.id);
    const updatedList = [...filtered, updatedTheme];

    setCustomThemes(updatedList);
    localStorage.setItem(
      CUSTOM_THEMES_STORAGE_KEY,
      JSON.stringify(updatedList)
    );

    // Synchronously update DOM, mode and active theme ID
    applyThemeToDom(updatedTheme.colors, updatedTheme.mode === "dark");
    setModeState(updatedTheme.mode);
    localStorage.setItem(MODE_STORAGE_KEY, updatedTheme.mode);
    setCurrentThemeId(updatedTheme.id);
    localStorage.setItem(THEME_STORAGE_KEY, updatedTheme.id);
  };

  const deleteCustomTheme = (themeId: string) => {
    const updatedList = customThemes.filter((t) => t.id !== themeId);
    setCustomThemes(updatedList);
    localStorage.setItem(
      CUSTOM_THEMES_STORAGE_KEY,
      JSON.stringify(updatedList)
    );

    if (currentThemeId === themeId) {
      setTheme("default-dark");
    }
  };

  const resetToDefault = () => {
    const defaultId = resolvedMode === "dark" ? "default-dark" : "default-light";
    setTheme(defaultId);
  };

  const value: ThemeContextValue = {
    mode,
    resolvedMode,
    currentThemeId,
    activeTheme,
    allThemes,
    setMode,
    toggleMode,
    setTheme,
    saveCustomTheme,
    deleteCustomTheme,
    resetToDefault,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
