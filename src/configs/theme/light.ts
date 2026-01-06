import { ITheme } from "./types";

export const LightTheme: ITheme = {
  isDark: false,
  colors: {
    gradientStart: "#F2F7F2",
    gradientEnd: "#F0F6E8",
    background: "#F2F7F2", // "#F0F6E8",
    card: "#FFFFFF",
    primary: "#6F7C60",
    secondary: "#101010",
    accent: "#D9E4CC",
    text: "#222222",
    textSecondary: "#565551",
    border: "#E3E2DA",
    icon: "#839278",
    tabBar: "#5E6A52",
    muted: "#A3B09A",
    error: "#C94B4B",
    success: "#5C8A5C",
    warning: "#F59E0B", // ✅ NOVO - Laranja para avisos
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",

    // primary: "#5A6A58", // Muted olive green from the image
    // secondary: "#7D8F7A",
    // accent: "#F0F4EF",
    // "background-light": "#F2F5EC", // #F2F7F2
    // "background-dark": "#1A201A", // #1A1F1A
    // "card-light": "#FFFFFF",
    // "card-dark": "#2C332C",
    // "text-light": "#1F291F",
    // "text-dark": "#E2E8E2",
    // "subtext-light": "#6B7280",
    // "subtext-dark": "#9CA3AF"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },
  typography: {
    weights: {
      regular: "BarlowCondensed_400Regular",
      medium: "BarlowCondensed_500Medium",
      semibold: "BarlowCondensed_600SemiBold",
      bold: "Oswald_700Bold",
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
  text: (size, weight, color) => ({
    fontSize: LightTheme.typography.sizes[size],
    fontFamily: LightTheme.typography.weights[weight],
    color: color || LightTheme.colors.text,
  }),
};
