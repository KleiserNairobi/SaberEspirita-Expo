import { IGlossaryTerm } from "@/types/glossary";

/**
 * Injeta links do glossário no arquivo markdown, transformando palavras exatas em links clicáveis
 * com o protocolo interno glossary://
 * 
 * @param markdownText Texto markdown original
 * @param terms Lista de termos do glossário com seus sinônimos
 * @returns Markdown com links simulados
 */
export function injectGlossaryLinks(markdownText: string, terms: IGlossaryTerm[]): string {
  if (!markdownText || !terms || terms.length === 0) return markdownText;

  // Extrair todos os baseWords a serem buscados
  const termMap = new Map<string, { id: string; baseWord: string }>();

  terms.forEach(term => {
    // Lista o título original e seus eventuais sinônimos
    const variations = [term.term, ...(term.synonyms || [])];
    
    variations.forEach(variation => {
      const cleanVar = variation.trim().toLowerCase();
      // Ignorar palavras muito curtas (ex: luz, lei, Deus) para evitar falsos positivos
      // ou hiperativas poluições de texto. Sugerimos maior que 3.
      if (cleanVar.length > 3) {
        // Se a key já existe, a primeira (frequentemente o título principal) vence
        if (!termMap.has(cleanVar)) {
          termMap.set(cleanVar, { id: term.id, baseWord: cleanVar });
        }
      }
    });
  });

  // Ordenar as chaves por tamanho decrescente.
  // Isso garante que expressões maiores ("O Livro dos Espíritos")
  // sejam substituídas ANTES de palavras simples ("Espírito").
  const sortedKeys = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);

  if (sortedKeys.length === 0) return markdownText;

  // 1. Escapar regex characters para segurança
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedTerms = sortedKeys.map(escapeRegExp);

  // 2. Construir o Regex combinando todos as variações com limites seguros
  // O JavaScript `\b` não lida bem com acentuação, então usamos `(^|[^a-zA-ZÀ-ÿ0-9_])` no prefixo 
  // e `(?=[^a-zA-ZÀ-ÿ0-9_]|$)` no sufixo (lookahead).
  // E aceitar plural básico (s opcional) em português usando `(s?)`.
  const combinedRegex = new RegExp(
    `(^|[^a-zA-ZÀ-ÿ0-9_])(${escapedTerms.join('|')})(s?)(?=[^a-zA-ZÀ-ÿ0-9_]|$)`,
    'ig'
  );

  // 3. Dividir o texto original por blocos que não devem ser modificados.
  // Queremos ignorar títulos markdown (com ###), links já criados `[texto](url)`, código `` e blocks ```.
  // Vamos processar apenas o texto puro.
  // O RegExp abaixo pega: Imagens ![], Links [], Inline code ``, ou Block code ```
  const regexDoNotTouch = /(!?\[.*?\]\(.*?\)|`.*?`|```[\s\S]*?```)/g;
  
  const chunks = markdownText.split(regexDoNotTouch);

  // Percorrer os chunks, onde os de índice par são o texto puro,
  // e os de índice ímpar são os blocos casados pelas exceções (links/imgs).
  for (let i = 0; i < chunks.length; i++) {
    // Se for índice ímpar, é um link ou código. Pula.
    if (i % 2 !== 0) continue;

    let textPart = chunks[i];

    // Se o pedaço estiver vazio, continua
    if (!textPart) continue;

    // Aplicar substituição de todos os termos presentes neste chunk usando o regex combinado
    textPart = textPart.replace(combinedRegex, (match, prefix, termMatched, pluralSuffix) => {
      const basePhrase = termMatched.toLowerCase();
      const termData = termMap.get(basePhrase);
      
      if (termData) {
        // Encode safe pra caso a palavra case com acentos/espaços e passe na URL
        const safeMatch = encodeURIComponent(basePhrase);
        // Formato final: prefixo[PalavraOriginalS](glossary://ID?matched=palavra)
        return `${prefix}[${termMatched}${pluralSuffix}](glossary://${termData.id}?matched=${safeMatch})`;
      }
      
      // Se por algum motivo o basePhrase não estivesse no MAP, devolvemos inalterado
      return match;
    });

    chunks[i] = textPart;
  }

  // Juntar tudo de volta
  return chunks.join("");
}
