# Implementação do Glossário Contextual Específico por Aula

Este plano documenta a estratégia para implementar o glossário contextual, resolvendo o problema de termos destacados fora de contexto e melhorando a experiência de consulta do aluno.

## 1. Objetivos

- **Resolução de Contexto**: Eliminar sublinhados em palavras que não deveriam ser termos (ex: "além" como advérbio vs "Além" como plano espiritual).
- **Leitura Fluida**: O texto principal da aula não terá nenhum tipo de formatação ou marcação visual de links (sem sublinhados ou cores diferentes), permitindo uma leitura limpa.
- **Consulta Centralizada**: Os termos relevantes de cada slide ficarão agrupados em um componente específico abaixo do conteúdo.

## 2. Requisitos de Dados (JSON da Aula)

O nó `glossary` será incorporado ao JSON de cada slide/aula conforme o exemplo abaixo:

```json
"glossary": [
  {
    "id": "perdao",
    "term": "Perdão",
    "definition": "Ato de liberar o ressentimento e a dívida moral do ofensor, sem exigir punição. No Espiritismo, é condição essencial para receber o perdão divino e libertar o próprio espírito.",
    "category": "Moral e Ética",
    "references": ["O Evangelho Segundo o Espiritismo, cap. X, item 5"],
    "synonyms": ["Absolvição", "Misericórdia"]
  }
]
```

- **Aulas Novas**: Conterão o nó `glossary` preenchido pelo modelo de IA.
- **Aulas Antigas**: Não possuirão este nó. O sistema deve tratar a ausência ocultando o componente de glossário.

## 3. Interface e UX

### Novo Componente: Card de Glossário

- **Posicionamento**: Logo abaixo do card de "Referências" no final do slide.
- **Título**: "Glossário".
- **Estilo**: Um card com cor de fundo distinta (sugestão: um tom suave que harmonize com o tema da aula).
- **Apresentação dos Termos**:
  - Os termos serão exibidos como "tags" ou "pills" (semelhante às tags de busca, mas sem o caractere `#`).
  - Layout horizontal com quebra de linha automática (flex wrap).

### Interação

- **Clique no Termo**: Abre o `BottomSheet` de detalhes do termo (que já existe no app).
- **Ligação com a Base**: O critério de busca/ligação com a base global do Firebase será o ID. Se o termo existir na coleção global, o botão "Estudar Conceito" levará à tela detalhada do glossário.

## 4. Plano de Implementação Técnica

### Parte 1: Tipagem e Dados

- [ ] Atualizar `ILesson` em `src/types/course.ts` para incluir `glossary?: IGlossaryTerm[]`.
- [ ] Garantir que `IGlossaryTerm` comporte os campos `references` e `synonyms` como arrays.

### Parte 2: Lógica de Negócio

- [ ] Desativar a injeção automática de links (sublinhados) no `glossaryParser.ts` quando a aula possuir o nó `glossary`.
- [ ] Alterar o parser para retornar o texto puro, sem tags HTML/Markdown de link para o glossário.

### Parte 3: UI (LessonPlayer)

- [ ] Criar o componente `GlossaryCard.tsx`.
- [ ] Implementar a renderização condicional: `lesson.glossary && lesson.glossary.length > 0`.
- [ ] Estilizar as "pills" conforme as especificações visuais (sem `#`, fundo sólido suave).
- [ ] Integrar o clique com o `useGlossaryBottomSheet` existente.

## 5. Verificação

- [ ] Validar se o texto da aula está "limpo" (sem sublinhados).
- [ ] Confirmar se o Card de Glossário aparece apenas em aulas que possuem os dados no JSON.
- [ ] Verificar se o `BottomSheet` abre com as informações corretas ao clicar na pill.
