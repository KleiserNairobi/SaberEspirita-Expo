const CONNECTIVES = new Set(["de", "da", "do", "das", "dos", "e", "del", "van", "von"]);

/**
 * Formata nomes de usuários padronizando a caixa alta/baixa e removendo números sujos.
 * Exemplo:
 * - "KleiSER nairobi De Oliveira 2" -> "Kleiser Nairobi de Oliveira"
 * - "Raphael teixeira rodrigues" -> "Raphael Teixeira Rodrigues"
 */
export function formatUserName(name?: string | null): string {
  if (!name || !name.trim()) return "Usuário";

  // 1. Remove números isolados no final do nome ou entre espaços (ex: "Oliveira 2" -> "Oliveira")
  let cleaned = name.trim().replace(/\s+\d+$/g, "").replace(/\s+\d+(?=\s|$)/g, "");

  // Fallback se a limpeza resultou em string vazia (ex: nome era apenas "123")
  if (!cleaned.trim()) {
    cleaned = name.trim();
  }

  // 2. Divide em palavras e formata
  const words = cleaned.split(/\s+/);

  const formattedWords = words.map((word, index) => {
    // Trata hífens dentro do nome (ex: "saint-exupéry")
    const hyphenParts = word.split("-");
    const formattedHyphenParts = hyphenParts.map((part) => {
      if (!part) return "";
      const lower = part.toLowerCase();

      // Mantém conectivos em minúsculo, exceto se for a primeira palavra do nome
      if (index > 0 && CONNECTIVES.has(lower)) {
        return lower;
      }

      // Primeira letra maiúscula, restantes minúsculas
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });

    return formattedHyphenParts.join("-");
  });

  return formattedWords.filter(Boolean).join(" ");
}
