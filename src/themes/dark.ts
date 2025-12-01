// themes/dark.ts
export const DarkTheme = {
  colors: {
    background: "#1A1A1A",
    card: "#222222",
    primary: "#FFFFFF",
    secondary: "#D7B084", // mantém o tom amarronzado, mas mais vivo no dark
    accent: "#3A3A3A",
    text: "#FFFFFF",
    textSecondary: "#C7C7C7",
    border: "#333333",
    icon: "#9EB49A", // mesmo verde, mais claro
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },

  typography: {
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#C7C7C7",
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      color: "#FFFFFF",
    },
    caption: {
      fontSize: 12,
      color: "#C7C7C7",
    },
  },
};
