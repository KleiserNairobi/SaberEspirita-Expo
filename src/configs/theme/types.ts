import { TextStyle } from "react-native";

export type ThemeColors = {
  gradientStart: string;
  gradientEnd: string;
  background: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  icon: string;
  tabBar: string;
  muted: string;
  error: string;
  success: string;
  onPrimary: string;
  onSecondary: string;
};

export type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type ThemeRadius = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
};

export type ThemeTypography = {
  weights: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
};

export interface ITheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  isDark: boolean;

  // Helper function para criar estilos de texto
  text: (
    size: keyof ThemeTypography["sizes"],
    weight: keyof ThemeTypography["weights"],
    color?: string
  ) => TextStyle;
}
