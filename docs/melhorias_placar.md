# Planejamento de Melhorias - Tela de Placar (Leaderboard)

Documento registrado para acompanhamento e execução na próxima sessão de desenvolvimento.

---

## 🎯 Objetivos Principais

### 1. Limitação do Placar ao Top 100

- **Motivação de UX/Gamificação**: Reduzir a carga cognitiva do usuário e focar o engajamento na busca pelas 100 primeiras posições (padrão de mercado como Duolingo e Strava).
- **Desempenho de Backend**: Manter a consulta SQL leve com `LIMIT 100` ordenado por pontuação descendente (`ORDER BY score DESC`).

### 2. Posição Fixa do Usuário Logado (Card de Rodapé)

- **Cenário**: Quando o usuário autenticado não estiver entre os 100 primeiros colocados (ex: posição 250º).
- **Implementação**:
  - Manter o feed principal renderizando estritamente o Top 100.
  - Exibir um card fixo ou destacado no rodapé com a posição atual e a pontuação do usuário logado:
    > **Sua Posição: 250º — [Nome] (40 pts)**
  - Caso a posição do usuário esteja entre o quarto ao centéssimo, destacar o card com borda verde primária para que o usuário identifique sua posição mais facilmente.

### 3. Otimização de Performance no React Native (Virtualização)

- **Virtualização**: Garantir o uso de `<FlatList>` (ou `@shopify/flash-list`) na renderização da lista em vez de mapas dentro de `<ScrollView>`.
- **Economia de Memória**: Configurar as propriedades `initialNumToRender={10}`, `maxToRenderPerBatch={10}` e `windowSize={5}` para reciclagem dos avatares fora de tela.

### 4. Micro-interação de Gamificação no Pódio (Opcional)

- **Destaque do 1º Lugar**: Adicionar um badge sutil (ex: coroa/medalha dourada) no avatar do 1º colocado no pódio para reforçar a celebração do líder da semana.

---

_Registrado em 25/08/2026._
