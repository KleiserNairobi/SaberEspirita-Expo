# Especificação: Exibição de Imagens no Player de Slides

Documento de decisão técnica e arquitetura de produto para inclusão de suporte a imagens e infográficos diretamente no fluxo de leitura dos slides de aulas.

---

## 1. Motivação e Diagnóstico de UX

Atualmente, recursos visuais e documentos de apoio estão alocados na aba externa de **Materiais Complementares**. No entanto, a observação do comportamento real do estudante revelou dois pontos críticos de fricção:

1. **Atrito de Contexto e Quebra de Fluxo:** 
   * O aluno precisa interromper a leitura do slide, sair do player, navegar até outra aba para visualizar uma imagem ou PDF e depois retornar. Esse processo quebra o estado de concentração e imersão (*flow*).
2. **Evasão Pós-Conclusão:** 
   * Ao finalizar o último slide, o estímulo imediato do usuário é avançar para a próxima aula ou fechar o aplicativo. O material complementar externo raramente é visitado após a conclusão.
3. **Sincronia Pedagógica:** 
   * Um esquema visual, mapa conceitual ou infográfico ganha sua máxima eficácia didática quando é apreciado **simultaneamente** ao texto explicativo (ex.: o mapa da colônia e seus ministérios enquanto o texto narra a estrutura da cidade).

**Decisão de Produto:** Integrar o suporte a imagens como elemento nativo de primeira classe dentro do próprio slide da aula.

---

## 2. Análise de Viabilidade Técnica no Projeto

O aplicativo já conta com todos os blocos de infraestrutura necessários para a implementação imediata:

1. **Biblioteca de Imagens de Alta Performance:**
   * Uso do `expo-image` (versão `~3.0.11`), com suporte nativo a cache em disco e memória, transições suaves e carregamento sem gargalos de UI no `FlatList` horizontal do player.
2. **Layout com Scroll Vertical:**
   * Tanto `LessonSlide` quanto `PremiumSlideRenderer` já utilizam `ScrollView` vertical e o container `AdaptiveReadingContainer`. Imagens de qualquer proporção (retrato, paisagem, infográficos longos) são acomodadas naturalmente com rolagem de tela, sem espremer o texto.
3. **Mecanismo de Zoom já Existente:**
   * O projeto já implementou o componente `ZoomableImage.tsx` (`react-native-gesture-handler` + `react-native-reanimated`), suportando gestos nativos de pinça (*pinch*), arrasto (*pan*) e duplo toque (*double tap*). Esse componente pode ser reutilizado para visualização detalhada em tela cheia (lightbox).
4. **Pré-carregamento em Background:**
   * O utilitário `imagePrefetch.ts` permite realizar o prefetch das imagens dos próximos slides assim que o player é aberto, eliminando tempos de espera durante a transição de telas.

---

## 3. Especificação do Modelo de Dados

### Atualização das Tipagens (`src/types/course.ts`)

Definir a interface para o objeto de imagem do slide:

```typescript
export interface ISlideImage {
  url: string;
  caption?: string;
  alt?: string;
  aspectRatio?: number; // Ex: 1.77 (16:9), 1.33 (4:3) ou 1.0 (quadrado)
}
```

Atualizar as interfaces `ISlide` e `IPremiumSlide`:

```typescript
export interface ISlide {
  slideType?: SlideType;
  title: string;
  content: string;
  image?: ISlideImage;       // Objeto de imagem real para renderização
  imagePrompt?: string;      // Mantido para metadados/geração de IA
  highlights?: { title: string; content: string }[];
  references?: {
    kardeciana?: string;
    biblica?: string;
  };
  glossary?: IGlossaryTerm[];
}
```

### Exemplo de Estrutura no JSON da Aula

```json
{
  "title": "A arquitetura e os seis Ministérios",
  "content": "A colônia estrutura-se em formato de estrela de seis pontas, irradiando a partir da Governadoria central...",
  "image": {
    "url": "https://storage.googleapis.com/saber-espirita/cursos/nosso-lar/mapa-ministerios.webp",
    "caption": "Esquema da distribuição dos seis Ministérios a partir da Governadoria",
    "aspectRatio": 1.77
  }
}
```

---

## 4. Arquitetura de UI e Componentes

### Componente `SlideImageCard`

Criar um componente dedicado (`src/pages/study/lesson-player/components/SlideImageCard/`):

* **Container Flat:** Borda suave com cor do tema (`theme.colors.border`), cantos arredondados (`theme.radius.md`), sem elevação/sombras excessivas para manter a sobriedade editorial.
* **Aspect Ratio Dinâmico:** Respeita o `aspectRatio` enviado ou adota padrão 16:9 (1.77), evitando saltos visuais de layout (*layout shifts*) enquanto a imagem carrega.
* **Legenda Contextual (*Caption*):** Renderizada abaixo da imagem em tipografia de leitura secundária (`theme.readingText`), estilo itálico e cor de texto atenuada.
* **Ação de Toque para Ampliação (Lightbox Modal):**
  * Ícone discreto de ampliação / dica tátil ("Toque para ampliar").
  * Ao tocar na imagem, abre um modal fullscreen que encapsula o `ZoomableImage`, permitindo explorar detalhes de infográficos e mapas em alta resolução.

### Posicionamento no Slide

A ordem de renderização sugerida dentro de `SlideContent` ou do `AdaptiveReadingContainer` é:
1. Badge de Tipo do Slide;
2. Título do Slide;
3. **`SlideImageCard` (se presente);**
4. Conteúdo textual em Markdown;
5. Cards especiais / Destaques / Referências.

