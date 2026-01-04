# Prompts Stitch AI - Módulo de Cursos Espíritas

**Data**: 03/01/2026  
**Objetivo**: Gerar protótipos de todas as telas do módulo de Cursos

---

## 🎨 Tema Base (Usar em TODOS os prompts)

```
THEME TOKENS (use in all screens):
- Background: #191a1f (deep dark)
- Card background: #1f2026 (slightly lighter)
- Primary color: #7ED957 (soft green)
- Text primary: #FFFFFF (white)
- Text secondary: #9CA3AF (gray)
- Border: rgba(255,255,255,0.1)
- Border radius: 16px (cards), 12px (buttons)
- Font: Google Sans, clean and modern
- Dark mode only
```

---

## PROMPT 1: Catálogo de Cursos

```
Design a mobile "Courses Catalog" screen for a spiritual education app (SaberEspirita) with dark mode.

THEME:
- Background: #191a1f (deep dark)
- Card background: #1f2026
- Primary color: #7ED957 (soft green)
- Text: white primary, #9CA3AF secondary
- Border radius: 16px
- Premium, modern design

HEADER:
- Back button (←) on left
- Title: "Cursos Espíritas" (white, bold, 20px)
- Padding: 16px

SEARCH BAR:
- Full width search input
- Placeholder: "Buscar cursos..."
- Magnifying glass icon on left
- Background: #1f2026
- Border: 1px solid rgba(255,255,255,0.1)
- Height: 48px
- Margin bottom: 16px

FILTER CHIPS (horizontal scroll):
- Chips: "Todos", "Iniciante", "Intermediário", "Avançado"
- Selected: green background (#7ED957), white text
- Unselected: transparent, gray text, gray border
- Pill shape (fully rounded)
- Spacing: 8px between chips
- Margin bottom: 24px

COURSE CARDS (vertical list):
Each card (full width, ~200px tall):
- Background: #1f2026
- Border radius: 16px
- Border: 1px solid rgba(255,255,255,0.1)
- Padding: 0 (image full width at top)

CARD STRUCTURE:
- TOP: Course image (16:9 ratio, 320x180px, rounded top corners)
- CONTENT AREA (padding 16px):
  - Title: "Introdução ao Espiritismo" (white, bold, 16px)
  - Metadata row (gray, 13px):
    - "12 aulas • 180 min • Iniciante"
    - Icons: 📚 ⏱️ 📊 before each item
  - Progress bar (if in progress):
    - Height: 4px
    - Green fill (#7ED957)
    - Gray background (rgba(255,255,255,0.1))
    - Text: "45% concluído" (12px, gray)

CARDS TO SHOW (3 examples):
1. "Introdução ao Espiritismo" - 12 aulas • 180 min • Iniciante - 45% progress
2. "Mediunidade e Desenvolvimento" - 8 aulas • 120 min • Intermediário - No progress
3. "O Evangelho Segundo o Espiritismo" - 15 aulas • 240 min • Avançado - No progress

SPACING:
- Screen padding: 16px horizontal
- Card spacing: 16px vertical
- Content scrollable

DESIGN STYLE:
- Premium, clean, modern
- Subtle shadows on cards
- Smooth visual hierarchy
- Mobile portrait (375x812px)
```

---

## PROMPT 2: Detalhes do Curso

```
Design a mobile "Course Details" screen for a spiritual education app (SaberEspirita) with dark mode.

THEME:
- Background: #191a1f
- Card background: #1f2026
- Primary green: #7ED957
- Text: white primary, #9CA3AF secondary
- Border radius: 16px
- Premium design

HERO SECTION:
- Full width image (375x250px)
- Dark gradient overlay at bottom (black to transparent)
- Back button (←) top left (white, circular background rgba(0,0,0,0.5))
- Course title overlay at bottom: "Introdução ao Espiritismo" (white, bold, 24px)
- Author below title: "Por Allan Kardec" (white, 14px)
- Padding: 16px

PROGRESS BAR (if course started):
- Below hero image
- Full width with 16px horizontal padding
- Height: 8px
- Green fill (#7ED957) at 75%
- Gray background
- Text above: "75% concluído" (12px, gray)
- Margin: 16px vertical

STATS GRID:
- 2x2 grid of stat items
- Each item:
  - Icon (24px, green) on left
  - Label + value on right
  - Background: #1f2026
  - Border radius: 12px
  - Padding: 16px
  - Border: 1px solid rgba(255,255,255,0.05)

STATS:
- Row 1: "📚 12 aulas" | "⏱️ 180 minutos"
- Row 2: "📊 Iniciante" | "📅 2024"
- Grid gap: 12px
- Margin: 24px vertical

DESCRIPTION SECTION:
- Title: "Sobre o Curso" (white, semibold, 18px)
- Content: "Compreenda os principais conceitos e doutrinas que fundamentam o Espiritismo. Este curso aborda desde os fundamentos básicos até conceitos mais profundos da doutrina espírita." (gray, 14px, line height 1.6)
- Margin bottom: 24px

ACTION BUTTONS (bottom):
- Button 1: "CONTINUAR CURSO" (if in progress)
  - Background: #7ED957 (green)
  - Text: white, bold, 16px
  - Height: 52px
  - Full width
  - Border radius: 12px
  - Margin bottom: 12px

- Button 2: "VER AULAS"
  - Background: transparent
  - Border: 2px solid #7ED957
  - Text: #7ED957, bold, 16px
  - Height: 52px
  - Full width
  - Border radius: 12px

SPACING:
- Screen padding: 16px horizontal
- Content scrollable
- Bottom padding: 24px

DESIGN:
- Premium feel
- Smooth gradients
- Clean hierarchy
- Mobile portrait (375x812px)
```

---

## PROMPT 3: Lista de Aulas (Currículo)

```
Design a mobile "Course Curriculum" screen showing lesson list for a spiritual education app (SaberEspirita) with dark mode.

THEME:
- Background: #191a1f
- Card background: #1f2026
- Primary green: #7ED957
- Success green: #10B981
- Warning yellow: #F59E0B
- Text: white primary, #9CA3AF secondary
- Border radius: 12px
- Premium design

HEADER:
- Back button (←) on left
- Title: "Aulas do Curso" (white, bold, 20px)
- Padding: 16px

COURSE PROGRESS SUMMARY:
- Course title: "Introdução ao Espiritismo" (white, semibold, 18px)
- Progress text: "8 de 12 aulas concluídas" (gray, 14px)
- Progress bar: 8/12 = 67% (green fill)
- Background: #1f2026
- Padding: 16px
- Border radius: 16px
- Margin bottom: 24px

LESSON CARDS (vertical list):

CARD 1 - COMPLETED:
- Background: rgba(16, 185, 129, 0.1) (light green tint)
- Border: 1px solid rgba(16, 185, 129, 0.3)
- Border radius: 12px
- Padding: 16px
- Icon: ✓ (green circle, 32px) on left
- Content:
  - "1. O que é Espiritismo" (white, semibold, 15px)
  - "15 min • Concluída" (gray, 13px)
- Chevron right (›) on far right

CARD 2 - IN PROGRESS:
- Background: rgba(245, 158, 11, 0.1) (light yellow tint)
- Border: 1px solid rgba(245, 158, 11, 0.3)
- Border radius: 12px
- Padding: 16px
- Icon: ▶ (yellow circle, 32px) on left
- Content:
  - "2. Os Princípios Básicos" (white, semibold, 15px)
  - "18 min • 8 min restantes" (gray, 13px)
- Progress bar at bottom (10px tall, 55% filled yellow)
- Chevron right (›) on far right

CARD 3 - LOCKED:
- Background: #1f2026
- Border: 1px solid rgba(255,255,255,0.05)
- Border radius: 12px
- Padding: 16px
- Icon: 🔒 (gray circle, 32px) on left
- Content:
  - "3. A Vida Futura" (gray, semibold, 15px)
  - "20 min • Bloqueada" (gray, 13px)
- No chevron (not clickable)
- Opacity: 0.6

CARD 4 - AVAILABLE:
- Background: #1f2026
- Border: 1px solid rgba(255,255,255,0.1)
- Border radius: 12px
- Padding: 16px
- Icon: Circle with number "4" (white, 32px) on left
- Content:
  - "4. Reencarnação" (white, semibold, 15px)
  - "22 min" (gray, 13px)
- Badge: "Quiz" (small green pill) on right
- Chevron right (›) on far right

SHOW 4 CARDS TOTAL (examples above)

SPACING:
- Screen padding: 16px horizontal
- Card spacing: 12px vertical
- Content scrollable

DESIGN:
- Clear visual states
- Color-coded status
- Premium feel
- Mobile portrait (375x812px)
```

---

## PROMPT 4: Player de Aula (Slides)

```
Design a mobile "Lesson Player" screen showing slide content for a spiritual education app (SaberEspirita) with dark mode.

THEME:
- Background: #191a1f
- Card background: #1f2026
- Primary green: #7ED957
- Accent blue: #3B82F6
- Text: white primary, #9CA3AF secondary
- Border radius: 16px
- Premium design

HEADER:
- Back button (←) on left
- Title: "Aula 2: Os Princípios Básicos" (white, semibold, 16px)
- Menu button (⋮) on right
- Background: #191a1f
- Padding: 16px
- Border bottom: 1px solid rgba(255,255,255,0.05)

SLIDE CONTENT AREA (scrollable):
- Background: #1f2026
- Border radius: 16px
- Padding: 24px
- Margin: 16px

SLIDE TITLE:
- "O Perispírito" (white, bold, 22px)
- Margin bottom: 16px

SLIDE CONTENT:
- Paragraph text (white, 15px, line height 1.7):
  "O perispírito é o corpo fluídico dos Espíritos. É semi-material, servindo de intermediário entre o Espírito e o corpo físico."

- Bullet points (white, 15px):
  • Natureza semi-material
  • Liga o Espírito ao corpo
  • Sobrevive após a morte física

HIGHLIGHT CARD (optional):
- Background: rgba(59, 130, 246, 0.1) (light blue tint)
- Border left: 4px solid #3B82F6 (blue)
- Border radius: 8px
- Padding: 16px
- Icon: 💡 (24px) on left
- Title: "Destaques" (blue, semibold, 14px)
- Content: "O perispírito é a prova da continuidade da vida após a morte física." (white, 14px)
- Margin: 24px vertical

REFERENCE CARD (optional):
- Background: rgba(126, 217, 87, 0.1) (light green tint)
- Border left: 4px solid #7ED957 (green)
- Border radius: 8px
- Padding: 16px
- Icon: 📖 (24px) on left
- Title: "Referências" (green, semibold, 14px)
- Content:
  - "Kardeciana: O Livro dos Espíritos, questão 135"
  - "Bíblica: 1 Coríntios 15:44"
  (white, 13px, line height 1.6)
- Margin: 24px vertical

SLIDE INDICATOR:
- Centered at bottom
- Dots: ●●●○○○○ (filled green, empty gray)
- Text: "3/7" (gray, 13px)
- Margin: 24px vertical

NAVIGATION BUTTONS:
- Two buttons side by side
- Button 1: "← Anterior"
  - Background: transparent
  - Border: 1px solid rgba(255,255,255,0.2)
  - Text: white, 15px
  - Padding: 12px 24px
  - Border radius: 8px
  - Flex: 1

- Button 2: "Próximo →"
  - Background: #7ED957 (green)
  - Text: white, bold, 15px
  - Padding: 12px 24px
  - Border radius: 8px
  - Flex: 1

- Gap: 12px between buttons
- Margin: 16px horizontal, 24px bottom

SPACING:
- Content scrollable
- Clean, readable layout

DESIGN:
- Focus on readability
- Clear visual hierarchy
- Premium educational feel
- Mobile portrait (375x812px)
```

---

## PROMPT 5: Quiz da Aula

```
Design a mobile "Lesson Quiz" screen for a spiritual education app (SaberEspirita) with dark mode.

THEME:
- Background: #191a1f
- Card background: #1f2026
- Primary green: #7ED957
- Success: #10B981
- Error: #EF4444
- Text: white primary, #9CA3AF secondary
- Border radius: 12px
- Premium design

HEADER:
- Back button (←) on left
- Title: "Quiz: Os Princípios Básicos" (white, semibold, 18px)
- Padding: 16px

PROGRESS SECTION:
- Text: "Pergunta 2 de 5" (gray, 14px)
- Progress bar:
  - Height: 6px
  - Fill: 40% green (#7ED957)
  - Background: rgba(255,255,255,0.1)
  - Border radius: 3px
- Margin: 16px horizontal, 24px bottom

QUESTION CARD:
- Background: #1f2026
- Border radius: 16px
- Padding: 24px
- Border: 1px solid rgba(255,255,255,0.1)
- Margin: 0 16px 24px

QUESTION TEXT:
- "O que é o perispírito segundo o Espiritismo?" (white, semibold, 18px, line height 1.5)

ANSWER OPTIONS (4 cards):
Each option card:
- Background: #1f2026
- Border: 2px solid rgba(255,255,255,0.1)
- Border radius: 12px
- Padding: 16px
- Margin: 0 16px 12px
- Transition: smooth

OPTION STATES:
1. DEFAULT (not selected):
   - Border: rgba(255,255,255,0.1)
   - Background: #1f2026

2. SELECTED (before confirm):
   - Border: #7ED957 (green, 2px)
   - Background: rgba(126, 217, 87, 0.1)

3. CORRECT (after confirm):
   - Border: #10B981 (success green)
   - Background: rgba(16, 185, 129, 0.15)
   - Icon: ✓ (green, 24px) on right

4. INCORRECT (after confirm):
   - Border: #EF4444 (red)
   - Background: rgba(239, 68, 68, 0.15)
   - Icon: ✗ (red, 24px) on right

OPTIONS TEXT (show default state):
A) "O corpo físico" (white, 15px)
B) "O corpo fluídico semi-material" (white, 15px)
C) "A alma imortal" (white, 15px)
D) "O pensamento" (white, 15px)

CONFIRM BUTTON:
- Background: #7ED957 (green)
- Text: "CONFIRMAR" (white, bold, 16px)
- Height: 52px
- Width: calc(100% - 32px)
- Margin: 24px 16px
- Border radius: 12px
- Disabled state: opacity 0.5 (when no option selected)

SPACING:
- Screen padding: 16px horizontal
- Content scrollable
- Clean spacing between elements

DESIGN:
- Clear visual feedback
- Smooth transitions
- Premium quiz interface
- Mobile portrait (375x812px)
```

---

## PROMPT 6: Certificado de Conclusão

```
Design a mobile "Course Certificate" screen for a spiritual education app (SaberEspirita) with dark mode.

THEME:
- Background: #191a1f
- Card background: #1f2026
- Primary green: #7ED957
- Gold accent: #F59E0B
- Text: white primary, #9CA3AF secondary
- Border radius: 16px
- Premium, celebratory design

CELEBRATION HEADER:
- Centered content
- Emoji: 🎉 (64px)
- Title: "Parabéns!" (white, bold, 32px)
- Subtitle: "Você concluiu o curso" (gray, 16px)
- Course name: "Introdução ao Espiritismo" (green, semibold, 20px)
- Padding: 32px vertical

CERTIFICATE CARD:
- Background: linear-gradient(135deg, #1f2026 0%, #2a2d35 100%)
- Border: 2px solid #F59E0B (gold)
- Border radius: 20px
- Padding: 32px
- Margin: 0 24px
- Box shadow: 0 8px 32px rgba(0,0,0,0.3)

CERTIFICATE CONTENT:
- Decorative border (gold, ornamental corners)
- Top: "CERTIFICADO DE CONCLUSÃO" (gold, uppercase, 14px, letter-spacing 2px)
- Divider line (gold, 2px, 60px wide, centered)
- User name: "[Nome do Usuário]" (white, bold, 24px, centered)
- Text: "Concluiu com sucesso o curso" (gray, 14px, centered)
- Course title: "Introdução ao Espiritismo" (white, semibold, 18px, centered)
- Metadata: "12 aulas • 180 minutos" (gray, 13px, centered)
- Date: "03/01/2026" (gray, 13px, centered)
- Decorative seal/badge icon at bottom (gold, 48px)

STATS SECTION (optional):
- Background: #1f2026
- Border radius: 12px
- Padding: 16px
- Margin: 24px horizontal
- Grid 2x2:
  - "100% Completo"
  - "12 Aulas"
  - "5 Quizzes"
  - "180 Minutos"
- Each stat: icon + label + value

ACTION BUTTONS:
- Button 1: "COMPARTILHAR"
  - Background: #7ED957 (green)
  - Icon: share icon (white, 20px) on left
  - Text: white, bold, 16px
  - Height: 52px
  - Full width (minus 32px margin)
  - Border radius: 12px
  - Margin: 24px 16px 12px

- Button 2: "EXPLORAR MAIS CURSOS"
  - Background: transparent
  - Border: 2px solid #7ED957
  - Text: #7ED957, bold, 16px
  - Height: 52px
  - Full width (minus 32px margin)
  - Border radius: 12px
  - Margin: 0 16px 32px

CONFETTI EFFECT (visual):
- Small decorative elements floating
- Gold and green colors
- Subtle, not overwhelming

SPACING:
- Content scrollable
- Generous padding
- Celebratory feel

DESIGN:
- Premium certificate aesthetic
- Gold accents for achievement
- Clean, elegant layout
- Mobile portrait (375x812px)
```

---

## 📋 Ordem de Prototipagem Recomendada

1. **Catálogo de Cursos** - Ponto de entrada
2. **Detalhes do Curso** - Decisão de iniciar
3. **Lista de Aulas** - Visão geral do currículo
4. **Player de Aula** - Experiência principal
5. **Quiz da Aula** - Validação de aprendizado
6. **Certificado** - Celebração final

---

## 🎯 Dicas para Uso no Stitch

### Para cada prompt:

1. **Cole o prompt completo** no Stitch AI
2. **Gere a primeira versão**
3. **Refine iterativamente**:
   - "Increase spacing between cards"
   - "Make the primary button more prominent"
   - "Adjust the certificate border to be more elegant"
4. **Exporte o design** quando satisfeito

### Refinamentos Comuns:

- **Espaçamento**: "Add more vertical spacing between sections"
- **Hierarquia**: "Make the course title larger and bolder"
- **Cores**: "Use a darker shade for the card background"
- **Ícones**: "Make the icons circular with green background"
- **Botões**: "Increase button height to 56px for better touch target"

---

## 📸 Exportação

Após gerar todos os protótipos:

1. **Exportar como PNG** (alta resolução)
2. **Salvar em**: `/artifacts/stitch-prototypes/`
3. **Nomear**: `01-catalog.png`, `02-details.png`, etc.
4. **Documentar decisões** de design no `courses_ux_design_spec.md`

---

**Criado por:** Antigravity AI  
**Data:** 03/01/2026 20:30
