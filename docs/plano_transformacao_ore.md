# Plano de Transformação: Módulo Ore (Acolhimento & Personalização) - V3.1 (Conceitual Final)

Este documento detalha a estratégia para evoluir o módulo **Ore** de uma listagem funcional para uma experiência de suporte emocional, acolhimento e direcionamento espiritual personalizado.

---

## 🎯 Objetivo

Transformar a jornada do usuário no módulo Ore, focando em **Acolhimento** (o app escuta como o usuário se sente) e **Direcionamento** (o app sugere a melhor prece e ambiente sonoro para aquele momento), criando um vínculo de "companheiro espiritual".

## 🛠️ Pilares de Mudança

### 1. Inversão da Hierarquia (Acolhimento Primeiro)

- **Fluxo Principal:** O "Check-in Emocional" é o ponto de entrada obrigatório (mas contornável).
- **Lógica:** Se o usuário chega ansioso, triste ou grato, ele é guiado diretamente para o alívio ou celebração, em vez de ter que navegar em um catálogo de categorias por horário (ex: "Ao Acordar").
- **Opções Secundárias:** Os cards fixos de momentos (Ao Acordar, Diário, etc.) tornam-se opções de acesso direto abaixo da sugestão principal.

### 2. Vínculo e Retenção (Memória Emocional)

- **Persistência:** O app deve lembrar o estado emocional declarado anteriormente.
- **Interação Contextual:** Ao retornar após um período, a saudação é baseada no último estado: _"Ontem você estava [Estado]. Como se sente hoje?"_
- **Implementação:** Requer campos `lastMood` (string) e `lastMoodDate` (Timestamp) no perfil do usuário (Zustand/Firestore).

### 3. Ecossistema Sensorial (Sintonia como Resposta)

O ambiente sonoro deixa de ser uma escolha manual e passa a ser uma **resposta do sistema** ao humor declarado:

| Estado do Usuário     | Ambiente Sugerido                | Ação UI                    |
| :-------------------- | :------------------------------- | :------------------------- |
| **Ansioso / Agitado** | Som calmo + Instrumentais lentos | Sugerir Respiração Guiada  |
| **Triste / Cansado**  | Música suave + Piano             | Sugerir Prece de Conforto  |
| **Grato / Alegre**    | Música vibrante + Natureza       | Sugerir Oração de Gratidão |
| **Confuso / Perdido** | Silêncio profundo / Pad etéreo   | Sugerir Reflexão Curta     |

- **Liberdade de Escolha:** Embora o app sugira a trilha ideal, o usuário terá um botão de "Trocar" no card de sintonia para selecionar qualquer outro áudio do catálogo.

#### 3.1 Desconstrução da Playlist (Ambientes Imersivos)
Para evitar que a sintonia pareça uma "lista de reprodução" comum:
- **Visual:** Substituição de listas verticais por **Cards Visuais (Carrossel)** ou um único **Card Hero de Imersão** que use backgrounds artísticos ou texturas suaves.
- **Nomenclatura:** Foco no **Benefício/Estado** em vez do nome da faixa. Ex: "Paz Lunar" em vez de "Clair de Lune".
- **Metáfora:** O usuário não "dá play em uma música", ele "Entra em um Ambiente".

### 4. Controle e Liberdade (Evitando o Atrito)

- **Opção de Salto:** Incluir botão "Não quero dizer agora" ou "❓ Não sei".
- **Timeout:** Permitir pular o check-in após 3 segundos ou via scroll para baixo, evitando que o acolhimento se torne uma barreira ou "obrigação".

### 5. Oração Assistida por IA (O Guia)

- **Ponto de Entrada:** No Card de Acolhimento, incluir um botão secundário: _"Gostaria de uma prece exclusiva para o agora? [Gerar com IA]"_.
- **Integração:** Redirecionamento para o `EmotionalChat` (`O Guia`) com um contexto secreto (prompt) que já informa o estado emocional do usuário para que a oração seja gerada na hora.

---

## 📐 Estrutura de UI (Protótipo ASCII V3.1)

```text
┌──────────────────────────────────────────┐
│  Ore                                     │
│  Como posso ajudar você hoje?            │
│                                          │
│  [😊 Calmo]    [😢 Triste]               │
│  [😰 Ansioso]  [🙏 Grato]                │
│  [😤 Irritado] [😴 Cansado]               │
│  [❓ Não quero dizer agora]              │
│                                          │
│  ──────────────────────────────────────  │
│  SUGESTÃO PARA AGORA:                    |
|  "Prece para Acalmar o Coração"          |
|  [ INICIAR PRECE ]                       |
|                                          |
|  AMBIENTE DE CONFORTO:                   |
|  +------------------------------------+  |
|  | [ IMAGEM SUAVE / "PAZ LUNAR" ]     |  |
|  | [ ENTRAR EM SINTONIA ]             |  |
|  +------------------------------------+  |
|  [ ☰ Trocar Ambiente ]                   |
|                                          |
|  ──────────────────────────────────────  |
|  ESTÁ DIFÍCIL ORAR SOZINHO?              |
|  [ Conversar com O Guia (IA) ]           |
|                                          |
│  OUTROS MOMENTOS:                        │
│  [Ao Acordar] [Ao Dormir] [Diário]       │
└──────────────────────────────────────────┘
```

---

## 📋 Tarefas Técnicas

### [CORE] Componentes e Lógica

- [ ] **MoodSelector Component:** Lista de chips com emojis e rótulos de estado.
- [ ] **SuggestionEngine:** Hook que cruza o `SelectedMood` com as orações do `prayers/data/*.json` e áudios de sintonia.
- [ ] **AIChatBridge:** Lógica para abrir o chat emocional passando o contexto de humor.

### [UI/UX] Interface

- [ ] **Hero Section:** Refatorar o topo da tela `pray/index.tsx` para o novo fluxo.
- [ ] **Environmental Audio Selection:** Substituir a lista de áudio por um seletor visual e imersivo.

---

## ✅ Plano de Verificação

- [ ] Validar se o usuário consegue trocar o ambiente sugerido.
- [ ] Testar o redirecionamento para o O Guia com o contexto emocional correto.
- [ ] Verificar a persistência do humor no profile para a saudação de retorno.
