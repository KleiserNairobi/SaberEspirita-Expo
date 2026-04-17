# Changelog - Saber Espírita (Expo)

Este documento registra todas as alterações relevantes do projeto a partir da versão 2.0.0.

## [2.0.12] - 2026-04-17

### Adicionado

- **UX/Privacidade**: Nova funcionalidade de edição de nome/apelido integrada diretamente ao Placar, permitindo que o usuário personalize sua exibição pública para evitar constrangimentos.
- **Dicas Contextuais**: Sistema de banners informativos e removíveis (via MMKV) para educar o usuário sobre funcionalidades de personalização no momento em que são necessárias.

### Alterado

- **Módulo Ore (Refatoração)**: Reformulação completa da experiência de oração:
  - Novo seletor de humor ("Humor de Agora") com ícones dinâmicos.
  - Seção "Para o seu Momento" com curadoria de orações.
  - Integração aprimorada com "Ajuda para Orar" (Chat IA).
  - Listagem de "Orações em Alta" (Top 5 mais lidas pela comunidade).
  - Nova interface para listagem geral de orações.
- **Home Estude**: Implementação de animações fluidas no carrossel de cursos para uma navegação mais moderna e agradável.
- **Compartilhamento**: Padronização global das mensagens compartilhadas, incluindo agora links diretos para download na Play Store e App Store, além de títulos contextualizados para cada tipo de chat (Apoio Emocional vs. Esclarecimento Doutrinário).

### Corrigido

- **Player de Música**: Novo motor de áudio para orações e meditações, corrigindo bugs de interrupção e melhorando a estabilidade da reprodução.
- **Navegação**: Correção de bug que exibia a barra de abas inferior indevidamente durante conversas no chat emocional.

## [2.0.11] - 2026-04-02

### Adicionado

- **Login Social**: Adicionado login social com Google e Apple.

### Corrigido

- Travamento na tela de quiz quandoo feedback auditivo era executado.
- **Autenticação Google (Android):** Resolvido o erro de login em produção através da sincronização do SHA-1 da "Chave de Assinatura do Google Play" no Firebase Console.
- **Conflitos de SHA-1:** Identificação e limpeza de IDs de cliente OAuth 2.0 duplicados no Google Cloud Console que impediam o registro de novas chaves.
- **Configuração de Ambiente:** Atualização dos IDs de cliente (Web, Android e iOS) no arquivo `.env` para refletir as novas credenciais gerenciadas pelo Google Service.

### Alterado

- **Google Sign-in:** Adicionada a flag `offlineAccess: true` na configuração do GoogleSignin para garantir a consistência de tokens em diferentes estados de rede.
- **Fluxo de Release:** Sincronização dos arquivos `google-services.json` entre a pasta de desenvolvimento (`dev/configs/`) e a pasta nativa do Android para evitar regressões durante o `expo prebuild`.

## [2.0.10] - 2026-03-30

### Adicionado

- **Glossário Contextual**: Links interativos dentro dos slides das lições que abrem definições em `BottomSheetModal`.
- **Chat com IA**: Integração do "Sr. Allan" ao final das aulas para suporte pedagógico imediato.
- **UI de Cursos**: Modernização do carrossel de cursos com novos estados de interação ("Iniciar", "Continuar", "Concluído") e efeitos visuais.

### Melhorado

- **Acessibilidade**: Nova estilização de termos técnicos em lições (sublinhado tracejado) para reduzir a poluição visual.
- **Navegação**: Barra de busca fixa (sticky) na tela de "Textos para Reflexão", seguindo o padrão de usabilidade do Glossário.
- **Padronização**: Refatoração global de modais (`BottomSheets`) para garantir coerência visual em todo o módulo de estudo.

### Corrigido

- **Quiz**: Resolução de travamento de interface após a conclusão de exercícios e correção na sincronização de progresso.

## [2.0.9] - 2026-03-22

### Adicionado

- **Medita**: Recurso de "Favoritos" para meditações guiadas com sincronização em tempo real via Firebase.
- **Ore**: Listagem de orações favoritas e novos emblemas (badges) "NOVO" para conteúdos recentes (15 dias).
- **Pedagogia**: Implementação de novos títulos amigáveis e envolventes para as lições do curso.
- **Metodologia**: Adicionada seção de metodologia de aprendizagem ativa nos detalhes do curso.

## [2.0.8] - 2026-03-10

### Adicionado

- **UX**: Restauração automática da posição do scroll ao retornar para a tela de currículo do curso.
- **UI**: Ícone de aviso (_warning_) para exercícios realizados com nota abaixo da média (7.0).

### Corrigido

- **Navegação**: Correção de bug no scroll do currículo que perdia a posição ao trocar de aba.
- **Quiz**: Correção de erro de _runtime_ (undefined) ao salvar progresso de exercícios em condições específicas.
- **Dados**: Ajuste na formatação de campos de Timestamp no Firestore para garantir compatibilidade entre plataformas.

## [2.0.7] - 2026-03-02

### Adicionado

- **Avaliações**: Implementação do sistema de avaliação de cursos (estrelas e feedback textual).
- **UX**: Fluxo proativo de avaliação (aparece automaticamente ao atingir 40% e 75% de progresso).
- **Segurança**: Bloqueio de emails e domínios específicos no campo de "Apelido" para evitar spam e identificação indevida.
- **Analytics**: Integração completa de rastreamento de visitantes e unificação de fuso horário (São Paulo) para relatórios consistentes.

### Corrigido

- **Ranking**: Reversão do nível padrão para 0 e correção na lógica de reset semanal do placar global.

## [2.0.5] - 2026-02-15

### Adicionado

- **Acesso Visitante**: Implementação de modo de degustação para usuários não autenticados.
- **Verificação**: Fluxo de verificação de email pós-cadastro para garantir integridade da base de usuários.
- **Marketing**: Adição de documentação oficial de marketing e planos de gamificação (Roadmap 1.5).

### Corrigido

- **Push Notifications**: Correção de loop de permissões e entrega de notificações em background no Android.

## [2.0.1] - 2026-02-05

### Adicionado

- **Meditação Guiada**: Lançamento do novo módulo "Medite" com player dedicado.
- **Offline**: Implementação de cache de áudio inteligente para permitir ouvir meditações sem internet.
- **Objetivos**: Novo sistema de metas e objetivos semanais para incentivar o estudo contínuo.

### Melhorado

- **Performance**: Otimização no carregamento de imagens pesadas através de pré-renderização e compressão MMKV.

## [2.0.0] - 2025-12-26

### Adicionado

- **V2 Core**: Migração completa para a arquitetura V2 (Expo Router + MMKV).
- **Estudo**: Nova interface de currículo sequencial, suporte a slides interativos e sistema de reflexão.
- **Cursos**: Lançamento do catálogo dinâmico de cursos iniciando com "O Evangelho Segundo o Espiritismo".
- **Gamificação**: Implementação inicial de níveis, pontos e sistema de certificados automáticos.
- **Glossário**: Dicionário de termos espíritas integrado às lições.

---

_Nota: Este changelog é gerado automaticamente com base nos registros do Git e documentações de desenvolvimento._
