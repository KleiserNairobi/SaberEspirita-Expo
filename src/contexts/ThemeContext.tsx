import { DarkTheme, LightTheme } from "@/themes";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";

interface ThemeContextData {
  themeType: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  theme: typeof LightTheme;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(
    deviceColorScheme || "light"
  );

  // Sincronizar com o esquema de cores do dispositivo
  useEffect(() => {
    if (deviceColorScheme) {
      setThemeType(deviceColorScheme);
    }
  }, [deviceColorScheme]);

  const toggleTheme = () => {
    setThemeType((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const theme = themeType === "light" ? LightTheme : DarkTheme;

  const value = {
    themeType,
    toggleTheme,
    setTheme: setThemeType,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
