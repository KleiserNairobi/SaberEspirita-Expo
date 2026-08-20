# Checklist de Migração API REST: App Mobile Saber Espírita (Expo & React Native)

Este documento contém o planejamento completo e detalhado de todas as tarefas necessárias para migrar o aplicativo mobile **SaberEspirita-Expo** do acesso direto ao Firebase/Firestore para o consumo da nova **API REST em Spring Boot (Java 21)**.

---

## 🔒 Diretrizes Invioláveis de Autenticação & Sessão (Regras do App)

1. **Persistência Absoluta da Sessão**: O usuário se autentica (ou cria conta) **apenas uma vez**. A sessão é mantida **permanentemente** (online/offline) no MMKV (`auth-storage`). O aplicativo NUNCA deve forçar logout, deslogar automaticamente no boot ou expirar a sessão ao navegar ou falhar requisição.
2. **Logout Exclusivamente Manual**: O logout do usuário (`signOut()`) **SÓ PODE OCORRER** se o próprio usuário acessar a aba **Conta** e acionar ativamente a opção de **Sair/Deslogar** ou **Excluir Conta**. Handlers de erro de requisição (como HTTP 401/403) jamais devem limpar o `auth-storage` ou forçar o estado do usuário para `null`.
3. **Independência do Hot-Updater (OTA)**: Atualizações de código enviadas via Cloudflare/hot-updater NUNCA devem interferir na chave de autenticação do usuário.
4. **Isolamento de Caches**: Limpezas de cache de consultas no React Query (`queryClient.clear()`) aplicam-se estritamente aos dados de leitura/cache e JAMAIS afetam a chave de autenticação (`auth-storage`).

---

## 📌 Progresso Geral da Migração

- [x] **Módulo 0: Cliente HTTP & Infraestrutura de Rede** `[5/5]`
- [x] **Módulo 1: Autenticação, Usuários & Perfil** `[5/5]`
- [x] **Módulo 2: Cursos, Aulas & Conteúdo Didático** `[6/6]`
- [x] **Módulo 3: Exercícios Práticos & Avaliações** `[4/4]`
- [x] **Módulo 4: Quizzes & Histórico de Tentativas** `[5/5]`
- [x] **Módulo 5: Conteúdos Espíritas, Meditações & Orações** `[7/7]`
- [x] **Módulo 6: Fórum de Lições & Reações** `[4/4]`
- [x] **Módulo 7: Progresso, Certificados, Favoritos & Notificações** `[5/5]`
- [x] **Módulo 8: Estatísticas, Logs & Leaderboard** `[4/4]`
- [x] **Módulo 9: Upload de Mídias (Cloudflare R2)** `[2/2]`
- [x] **Módulo 10: Assistentes de IA & Chatbots (DeepSeek API)** `[3/3]`
- [ ] **Módulo 12: Configurações Globais & Controle de Versão (AppConfig)** `[0/2]`

---

## 🌐 Módulo 0: Cliente HTTP & Infraestrutura de Rede

- [x] **0.1 Instalação da Lib Axios**: Adicionar dependência `axios` no `package.json` do `SaberEspirita-Expo`.
- [x] **0.2 Variáveis de Ambiente**: Adicionar `EXPO_PUBLIC_API_URL` nos arquivos `.env` e `.env.example` (ex: `http://localhost:8080/api/v1` em dev ou URL da CDN/servidor).
- [x] **0.3 Configuração do `apiClient.ts`**:
  - Instância do Axios centralizada em `src/services/api/apiClient.ts`.
  - Configuração de `baseURL`, `timeout` (15s padrão, 120s para IA) e cabeçalhos padrão (`Content-Type: application/json`).
- [x] **0.4 Interceptor de Requisições (Auth Header)**:
  - Injetar automaticamente o token de autenticação JWT/Firebase no cabeçalho `Authorization: Bearer <token>` em todas as requisições autenticadas.
- [x] **0.5 Interceptor de Respostas & Resiliência Offline**:
  - Tratar exceções de rede e erros HTTP (400, 404, 500) sem deslogar o usuário em caso de 401/403. Em falhas de autorização, sinalizar o erro para o componente invocador mantendo o `auth-storage` intacto.


---

## 👤 Módulo 1: Autenticação, Usuários & Perfil

- [x] **1.1 Service de Auth & Perfil (`authApiService.ts`)**:
  - `login(credentials)` ➔ `POST /api/v1/auth/login`
  - `register(data)` ➔ `POST /api/v1/auth/register`
  - `getProfile()` ➔ `GET /api/v1/users/me`
  - `updateProfile(data)` ➔ `PUT /api/v1/users/me`
  - `deleteAccount()` ➔ `DELETE /api/v1/users/me`
- [x] **1.2 Atualização da `authStore.ts`**:
  - Integrar chamadas REST ao fluxo de autenticação social e por email/senha.
  - Garantir a persistência do token e estado do usuário no MMKV (`auth-storage`).
- [x] **1.3 Suporte a Perfil Público**:
  - Endpoint `GET /api/v1/users/{userId}` para consulta de perfis na comunidade.
- [x] **1.4 Validação de Dispositivos e Domínios Banidos**:
  - Tratar respostas de bloqueio (`403 Forbidden`) retornadas pelo filtro de moderação do backend.
- [x] **1.5 Validação dos Fluxos de Auth na UI**:
  - Testar login, cadastro, edição de perfil e exclusão voluntária da própria conta.

---

## 📚 Módulo 2: Cursos, Aulas & Conteúdo Didático

- [x] **2.1 Service de Cursos (`courseApiService.ts`)**:
  - `getCourses(params)` ➔ `GET /api/v1/courses` (com filtros por categoria e nível)
  - `getCourseById(courseId)` ➔ `GET /api/v1/courses/{courseId}`
  - `sendCourseFeedback(courseId, data)` ➔ `POST /api/v1/courses/{courseId}/feedbacks`
  - `getCourseFeedbacks(courseId)` ➔ `GET /api/v1/courses/{courseId}/feedbacks`
- [x] **2.2 Service de Aulas (`lessonApiService.ts`)**:
  - `getLessonById(lessonId)` ➔ `GET /api/v1/lessons/{lessonId}` (parsing da estrutura de slides em `JSONB`)
  - `getLessonMaterials(lessonId)` ➔ `GET /api/v1/lessons/{lessonId}/materials`
  - `getLessonReflections(lessonId)` ➔ `GET /api/v1/lessons/{lessonId}/reflections`
- [x] **2.3 Mapeamento de DTOs e Tipos TypeScript**:
  - Atualizar interfaces de `Course`, `Lesson`, `Slide`, `SupplementaryMaterial` e `CourseFeedback`.
- [x] **2.4 Suporte a Mídias e CDN Cloudflare**:
  - Ajustar visualizadores de vídeo, áudio e imagem para carregar via CDN REST (`cdn.saberespirita.app.br`).
- [x] **2.5 Atualização dos Hooks do React Query (`useCourses`, `useLesson`)**:
  - Substituir serviços legados do Firestore pelos novos endpoints REST do Spring Boot.
- [x] **2.6 Validação da Tela de Curso e Player de Slide**:
  - Validar navegação de slides, exibição de materiais complementares e envio de nota do curso.

---

## ✍️ Módulo 3: Exercícios Práticos & Avaliações

- [x] **3.1 Service de Exercícios (`exerciseApiService.ts`)**:
  - `getExercisesByLesson(lessonId)` ➔ `GET /api/v1/exercises/lesson/{lessonId}`
  - `getExerciseDetails(exerciseId)` ➔ `GET /api/v1/exercises/{exerciseId}`
  - `submitExercise(exerciseId, answers)` ➔ `POST /api/v1/exercises/{exerciseId}/submit`
  - `getExerciseAttempts(exerciseId)` ➔ `GET /api/v1/exercises/{exerciseId}/attempts`
- [x] **3.2 Mapeamento de Respostas Dissertativas**:
  - Adaptar DTOs do app para enviar respostas estruturadas ao backend.
- [x] **3.3 Atualização dos Hooks do React Query (`useExercises`)**:
  - Conectar submissão e cálculo de nota de corte ao Spring Boot.
- [x] **3.4 Validação de Avaliações na UI**:
  - Testar envio de exercícios, exibição de feedback/nota e consulta do histórico de tentativas.

---

## 🧩 Módulo 4: Quizzes & Histórico de Tentativas

- [x] **4.1 Service de Quizzes (`quizApiService.ts`)**:
  - `getCategories()` ➔ `GET /api/v1/quizzes/categories`
  - `getQuizzesByCategory(categoryId)` ➔ `GET /api/v1/quizzes/category/{categoryId}`
  - `getQuizById(quizId)` ➔ `GET /api/v1/quizzes/{quizId}` (questões e alternativas em `JSONB`)
  - `submitQuiz(quizId, answers)` ➔ `POST /api/v1/quizzes/{quizId}/submit`
  - `getUserQuizHistory()` ➔ `GET /api/v1/quizzes/history/me`
  - `reportQuestion(questionId, reason)` ➔ `POST /api/v1/quizzes/questions/{questionId}/report`
- [x] **4.2 Mapeamento e Parsing de Questões**:
  - Atualizar tipos TypeScript para paridade com os DTOs do backend.
- [x] **4.3 Atualização de Pontuação e Integrador de Scores**:
  - Garantir atualização síncrona de pontos em `user_scores` após envio de quizzes com sucesso.
- [x] **4.4 Migração dos Hooks do React Query (`useQuizzes`, `useQuizHistory`)**:
  - Substituir queries diretas ao Firestore pelo `quizApiService.ts`.
- [x] **4.5 Validação do Fluxo de Quiz na UI**:
  - Testar listagem de categorias FIXE, execução do quiz, resultado e reporte de erros em questões.

---

## 📖 Módulo 5: Conteúdos Espíritas, Meditações & Orações

- [x] **5.1 Glossário Kardequiano (`glossaryApiService.ts`)**:
  - `GET /api/v1/glossary` e `GET /api/v1/glossary/{id}` (busca por termo e categoria).
- [x] **5.2 Reflexões Diárias (`reflectionApiService.ts`)**:
  - `GET /api/v1/reflections/today` e `GET /api/v1/reflections`.
- [x] **5.3 Meditações Guiadas (`meditationApiService.ts`)**:
  - `GET /api/v1/meditations/categories` e `GET /api/v1/meditations`.
- [x] **5.4 Podcasts Espíritas (`podcastApiService.ts`)**:
  - `GET /api/v1/podcasts`.
- [x] **5.5 Central de Orações (`prayerApiService.ts`)**:
  - `GET /api/v1/prayers/categories`, `GET /api/v1/prayers` e `GET /api/v1/prayers/{id}`.
- [x] **5.6 Áudios Ambientes (`ambientAudioApiService.ts`)**:
  - `GET /api/v1/ambient-audios`.
- [x] **5.7 Atualização dos Players de Áudio (Track Player / Expo Sound)**:
  - Garantir streaming direto das URLs Cloudflare R2 retornadas pelos endpoints da API REST.

---

## 💬 Módulo 6: Fórum de Lições & Reações

- [x] **6.1 Service do Fórum (`forumApiService.ts`)**:
  - `getComments(lessonId, page)` ➔ `GET /api/v1/forum/lessons/{lessonId}/comments`
  - `postComment(lessonId, data)` ➔ `POST /api/v1/forum/lessons/{lessonId}/comments`
  - `deleteComment(commentId)` ➔ `DELETE /api/v1/forum/comments/{commentId}`
  - `toggleReaction(commentId, type)` ➔ `POST /api/v1/forum/comments/{commentId}/reactions`
- [x] **6.2 Paginação & Atualização em Tempo Real (React Query)**:
  - Configurar `useInfiniteQuery` para rolar comentários paginados de forma fluida.
- [x] **6.3 Gestão de Reações (*Me Tocou*, *Aprendi Algo*, etc.)**:
  - Sincronizar alternância de reações com atualização otimista na UI.
- [x] **6.4 Validação do Fórum na UI**:
  - Testar comentários, respostas aninhadas, remoção própria e reações.

---

## 🎓 Módulo 7: Progresso, Certificados, Favoritos & Notificações

- [x] **7.1 Service de Atividade do Aluno (`userActivityApiService.ts`)**:
  - `getProgress()` ➔ `GET /api/v1/user-activity/courses/progress`
  - `completeLesson(courseId, lessonId)` ➔ `POST /api/v1/user-activity/courses/progress/{courseId}/lessons/{lessonId}/complete`
  - `getCertificates()` ➔ `GET /api/v1/user-activity/courses/certificates`
  - `generateCertificate(courseId)` ➔ `POST /api/v1/user-activity/courses/certificates/generate/{courseId}`
- [x] **7.2 Service de Favoritos (`favoritesApiService.ts`)**:
  - `togglePrayerFavorite(prayerId)` e `getFavoritePrayers()` ➔ `/api/v1/favorites/prayers`
  - `toggleReflectionFavorite(reflectionId)` e `getFavoriteReflections()` ➔ `/api/v1/favorites/reflections`
- [x] **7.3 Jogo Verdadeiro ou Falso (`truthOrFalseApiService.ts`)**:
  - `getQuestions()` e `submitAnswers()` ➔ `/api/v1/truth-or-false/*`
- [x] **7.4 Central de Notificações (`notificationApiService.ts`)**:
  - `getNotifications()` ➔ `GET /api/v1/notifications`
  - `markAsRead(id)` ➔ `PATCH /api/v1/notifications/{id}/read`
- [x] **7.5 Validação dos Módulos Interativos**:
  - Testar conclusão de curso 100%, geração do PDF do certificado e marcação de favoritos.

---

## 📈 Módulo 8: Estatísticas, Logs & Leaderboard

- [x] **8.1 Service do Leaderboard (`leaderboardApiService.ts`)**:
  - `getWeeklyRanking()` ➔ `GET /api/v1/leaderboard/weekly`
  - `getMonthlyRanking()` ➔ `GET /api/v1/leaderboard/monthly`
  - `getAllTimeRanking()` ➔ `GET /api/v1/leaderboard/all-time`
  - `getMyPosition()` ➔ `GET /api/v1/leaderboard/me`
- [x] **8.2 Service de Telemetria & Logs (`statsApiService.ts`)**:
  - `logEvent(eventData)` ➔ `POST /api/v1/logs/event`
  - `getGlobalStats()` ➔ `GET /api/v1/stats/global`
- [x] **8.3 Integração com Hooks do React Query (`useLeaderboard`)**:
  - Atualizar abas de ranking semanal, mensal e geral.
- [x] **8.4 Validação do Ranking e Telemetria**:
  - Testar exibição da posição do usuário autenticado no ranking e envio de eventos de auditoria.

---

## ☁️ Módulo 9: Upload de Mídias (Cloudflare R2)

- [x] **9.1 Service de Upload de Mídia (`mediaApiService.ts`)**:
  - `uploadAvatar(file)` ➔ `POST /api/v1/media/upload/avatar` (com `FormData` e `multipart/form-data`)
- [x] **9.2 Atualização da Foto de Perfil na UI**:
  - Integrar seletor de imagem do Expo à rota de upload do backend Spring Boot com retorno da nova URL pública na CDN.

---

## 🤖 Módulo 10: Assistentes de IA & Chatbots (DeepSeek API)

- [x] **10.1 Service dos Chatbots (`chatApiService.ts`)**:
  - `sendMessage(messages, type)` ➔ `POST /api/v1/chat/completions` (`EMOTIONAL` ou `SCIENTIFIC`)
  - `getDailyLimits()` ➔ `GET /api/v1/chat/limits`
- [x] **10.2 Ajustes de Timeout & Resiliência**:
  - Configurar tempo de resposta longo (até 120s) para diálogos com os assistentes de IA (*O Guia* e *Sr. Allan Kardec*).
- [x] **10.3 Validação dos Chats na UI**:
  - Testar envio de mensagens, recepção da resposta formatada e contagem de cotas diárias de uso.

---

## ⚙️ Módulo 12: Configurações Globais & Controle de Versão (AppConfig)

- [ ] **12.1 Service de Configuração Global (`appConfigApiService.ts`)**:
  - `getAppConfig()` ➔ `GET /api/v1/app-config` (público / permitAll, chamado no boot do Expo)
- [ ] **12.2 Verificação de Versão Mínima & Modo Manutenção**:
  - Atualizar `versionControlService.ts` para verificar `minimum_required_version` e `maintenance_mode` retornados pelo Spring Boot.

---

## 📊 Histórico de Atualizações do Checklist

| Data | Responsável | Módulo Afetado | Descrição das Alterações |
| :--- | :--- | :--- | :--- |
| **2026-08-19** | Antigravity AI | Todos os Módulos | Criação do documento inicial de checklist e tarefas de migração da API REST no `SaberEspirita-Expo`. |
| **2026-08-20** | Antigravity AI | Módulo 3 | Implementação de `exerciseApiService.ts`, DTOs de submissão e atualização dos hooks do React Query (`useExercises`). |
| **2026-08-20** | Antigravity AI | Módulo 4 | Implementação de `quizApiService.ts`, DTOs de submissão/reporte e atualização dos hooks do React Query (`useQuiz`). |
| **2026-08-20** | Antigravity AI | Módulo 5 | Criação dos serviços REST (`glossaryApiService`, `reflectionApiService`, `meditationApiService`, `podcastApiService`, `prayerApiService`, `ambientAudioApiService`) e atualização de hooks. |
| **2026-08-20** | Antigravity AI | Módulo 6 | Implementação do `forumApiService.ts`, suporte à paginação infinita e atualização otimista de reações no `useLessonForum.ts`. |
| **2026-08-20** | Antigravity AI | Módulo 7 | Criação dos serviços REST (`userActivityApiService`, `favoritesApiService`, `truthOrFalseApiService`, `notificationApiService`) e atualização de hooks. |
| **2026-08-20** | Antigravity AI | Módulo 8 | Criação dos serviços REST (`leaderboardApiService`, `statsApiService`) e atualização do hook `useLeaderboard.ts`. |
| **2026-08-20** | Antigravity AI | Módulo 9 | Implementação de `mediaApiService.ts` para upload multipart/form-data de avatares para o Cloudflare R2 e hook `useMediaUpload.ts`. |
| **2026-08-20** | Antigravity AI | Módulo 10 | Implementação de `chatApiService.ts` (completions de IA com timeout de 120s e limites) e atualização do hook `useChatLimits.ts`. |
