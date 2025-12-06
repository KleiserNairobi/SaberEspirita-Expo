export const LightTheme = {
  colors: {
    // Cor de fundo principal da tela (verde bem claro da imagem)
    background: "#F0F6E8", // OK

    // Fundo dos cards/brancos de conteúdo
    card: "#FFFFFF", // OK

    // Texto forte: títulos, headings ("Populares", "Explore a Biblioteca")
    primary: "#101010", // OK

    // Cor para botões de ação, CTA ou elementos de maior destaque
    secondary: "#6F7C60",

    // Detalhes suaves: badges, chips, pequenos backgrounds
    accent: "#D9E4CC",

    // Texto padrão sobre fundo claro
    text: "#222222",

    // Subtítulos e descrições ("Vamos começar sua jornada de conhecimento?")
    textSecondary: "#565551", // OK

    // Linhas divisórias, bordas de cards e inputs
    border: "#E3E2DA", // OK

    // Ícones em geral (mesma família da bottom tab verde-acinzentada)
    icon: "#839278", // OK

    // Fundo da bottom tab (o verde mais escuro arredondado)
    tabBar: "#5E6A52",

    // Cor para estados desabilitados / texto menos importante
    muted: "#A3B09A",

    // Feedback de erro (para formulários, quizzes etc.)
    error: "#C94B4B",

    // Feedback de sucesso (acertos em quizzes, ações concluídas)
    success: "#5C8A5C",

    // icon: "#7C8C76",
    // cores dos ícones na tabBar
    // color: isFocused ? "#FFFFFF" : "#D8D6C9",
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
      fontFamily: "Oswald_700Bold",
      color: "#1D1D1D",
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#6B6B6B",
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      color: "#1D1D1D",
    },
    caption: {
      fontSize: 12,
      color: "#6B6B6B",
    },
  },
};
