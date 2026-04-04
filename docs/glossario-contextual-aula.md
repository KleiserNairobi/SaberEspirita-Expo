# Implementação do Glossário Contextual Específico por Aula

Este plano visa resolver o problema de termos do glossário sendo sublinhados fora de contexto (ex: "além") ao permitir que cada aula possua seu próprio nó `glossary`. O algoritmo priorizará (ou usará exclusivamente) estes termos quando presentes.

## User Review Required

> [!IMPORTANT]
> A implementação proposta assume que o nó `glossary` no JSON da aula terá uma estrutura compatível com os termos globais, mas simplificada. 
> 
> O algoritmo será alterado para:
> 1. Se a aula tiver um nó `glossary`, usar **apenas** esses termos para os destaques.
> 2. Se a aula **não** tiver o nó (aulas antigas), continuará usando o glossário global como fallback (ou podemos desativar, se preferir).
>
> **Questão para o usuário:** Você deseja que as definições no nó `glossary` da aula sejam completas (com categoria, referências, etc.) ou apenas `term` e `definition`?

## Proposed Changes

---

### Shared Types

#### [MODIFY] [course.ts](file:///Users/nairobi/Documents/Desenv/2026/SaberEspirita-Expo/src/types/course.ts)
- Adicionar o campo opcional `glossary` à interface `ILesson`.
- Definir uma sub-interface ou reutilizar `IGlossaryTerm` (com campos opcionais).

---

### Core Logic

#### [MODIFY] [glossaryParser.ts](file:///Users/nairobi/Documents/Desenv/2026/SaberEspirita-Expo/src/utils/glossaryParser.ts)
- Ajustar `injectGlossaryLinks` para garantir que ele processe corretamente a lista de termos fornecida, sem depender de uma base global externa se uma lista local for passada.

---

### UI Components

#### [MODIFY] [index.tsx (LessonPlayer)](file:///Users/nairobi/Documents/Desenv/2026/SaberEspirita-Expo/src/pages/study/lesson-player/index.tsx)
- Alterar a lógica de obtenção dos termos do glossário.
- Passar `lesson.glossary || globalGlossary` para os componentes filhos.

#### [MODIFY] [LessonSlide.tsx](file:///Users/nairobi/Documents/Desenv/2026/SaberEspirita-Expo/src/pages/study/lesson-player/components/LessonSlide.tsx)
- Atualizar as props para aceitar os termos que vêm da aula.

#### [MODIFY] [SlideContent/index.tsx](file:///Users/nairobi/Documents/Desenv/2026/SaberEspirita-Expo/src/pages/study/lesson-player/components/SlideContent/index.tsx)
- Garantir que a injeção use os termos passados via props.

## Open Questions

> [!IMPORTANT]
> **Formato do JSON da Aula:** Como o prompt vai gerar o nó `glossary`, precisamos definir o formato exato. Minha sugestão:
> ```json
> "glossary": [
>   {
>     "id": "slug-do-termo",
>     "term": "Palavra",
>     "definition": "Definição extendida...",
>     "synonyms": ["sinônimo1", "sinônimo2"]
>   }
> ]
> ```
> O `id` é importante para que o `BottomSheet` de detalhes funcione corretamente.

## Verification Plan

### Automated Tests
- Criar um mock de aula com o nó `glossary` contendo o termo "além" com uma definição específica.
- Verificar se o termo é sublinhado e se a definição exibida é a do JSON da aula.

### Manual Verification
- Testar uma aula antiga (sem o nó) para garantir que o glossário global ainda funciona (se desejado).
- Testar uma aula nova com o nó e verificar a ausência de termos globais que não estão no nó local.
