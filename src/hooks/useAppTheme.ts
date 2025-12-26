import { useColorScheme } from "react-native";
import { useThemeStore } from "@/stores/themeStore";
import { DarkTheme, LightTheme, ITheme } from "@/configs/theme";

export function useAppTheme() {
  const { themeType, setThemeType, toggleTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const resolvedThemeType =
    themeType === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeType;

  const theme: ITheme = resolvedThemeType === "dark" ? DarkTheme : LightTheme;

  return {
    theme,
    themeType,
    resolvedThemeType,
    setThemeType,
    toggleTheme,
    isDark: resolvedThemeType === "dark",
  };
}
