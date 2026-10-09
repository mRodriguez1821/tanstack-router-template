export type ThemeMode = "light" | "dark" | "system";

export type ButtonHoverEffect = "lift" | "scale" | "glow" | "subtle" | "flat";

export interface ThemeColors {
  primary: string;
  primaryForeground?: string;
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  border?: string;
  radius?: string;
  // Tipografías y escala de fuentes
  fontSans?: string;
  fontHeading?: string;
  fontMono?: string;
  fontSizeBase?: string;
  // Animaciones y microinteracciones de botón
  btnHoverEffect?: ButtonHoverEffect;
  btnHoverTranslateY?: number;
  btnHoverScale?: number;
  btnHoverShadowBlur?: number;
  btnHoverShadowColor?: string;
  btnHoverTransform?: string;
  btnHoverShadow?: string;
  // Animaciones y microinteracciones de tarjetas (Cards)
  cardHoverEffect?: "lift" | "scale" | "border" | "glow" | "flat";
  cardHoverTranslateY?: number;
  cardHoverScale?: number;
  cardHoverShadowBlur?: number;
  cardHoverBorderHighlight?: boolean;
  cardHoverTransform?: string;
  cardHoverShadow?: string;
  cardHoverBorder?: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  mode: "light" | "dark";
  colors: ThemeColors;
  isCustom?: boolean;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  currentThemeId: string;
  activeTheme: ThemeDefinition;
  allThemes: ThemeDefinition[];
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setTheme: (themeId: string) => void;
  saveCustomTheme: (theme: ThemeDefinition) => void;
  deleteCustomTheme: (themeId: string) => void;
  resetToDefault: () => void;
}
