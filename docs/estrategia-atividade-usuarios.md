# Estratégia de Gestão de Atividade e Retenção de Usuários

Este documento descreve a estratégia proposta para monitorar o engajamento dos usuários, gerenciar a retenção via notificações e manter a higiene da base de dados (Firebase Auth e Firestore).

## 1. O Desafio: Login Persistente vs. Atividade Real
No ecossistema mobile, o padrão de manter o usuário logado indefinidamente é essencial para uma boa Experiência do Usuário (UX). Entretanto, isso cria um "ponto cego" onde usuários que não acessam o aplicativo há meses ainda constam como "logados", dificultando a distinção entre usuários ativos e "zumbis".

## 2. Proposta Técnica: O Campo `lastSeenAt`
Para resolver o problema da visibilidade sem forçar logouts indesejados, propõe-se a implementação de um rastro de atividade.

*   **Implementação**: Adicionar um campo `lastSeenAt` (Timestamp) no documento do usuário em `/users`.
*   **Gatilho**: Atualização silenciosa sempre que o app é aberto ou retorna do background (`AppState`).
*   **Vantagem**: Permite métricas precisas de usuários inativos e segmentação para campanhas de marketing.

## 3. Estratégia de Retenção (Push Notifications)
Utilizando a integração já existente com o **OneSignal**, a retenção pode ser automatizada sem necessidade de código adicional complexo:

*   **Segmentação**: Criar segmentos automáticos baseados na "Last Session" (ex: Inativo há 7 dias, 15 dias, 30 dias).
*   **Re-engajamento**: Configurar notificações automáticas (Drip Campaigns) para convidar o usuário de volta com gatilhos de curiosidade (ex: "Veja o desafio do dia").

## 4. Higiene de Dados (Varrer Inativos)
Para manter o banco de dados otimizado e reduzir custos/riscos, propõe-se um fluxo de limpeza via **Cloud Functions** (Scheduled Functions):

| Período de Inatividade | Ação Proposta | Canal |
| :--- | :--- | :--- |
| **6 meses** | Notificação de "Sentimos sua falta" | Push |
| **11 meses** | Aviso de desativação de conta por inatividade | Push / E-mail |
| **12 meses** | Exclusão definitiva dos dados (Auth + Firestore) | - |

### Processo de Limpeza:
1.  **Firebase Auth**: Deletar o UID do Authentication via Admin SDK.
2.  **Firestore**: Realizar o delete recursivo de todos os dados vinculados ao UID (perfil, histórico, progresso).

## 5. Benefícios Estratégicos
*   **Métricas Reais**: Foco no DAU (Daily Active Users) e MAU (Monthly Active Users), e não em downloads brutos.
*   **Conformidade (LGPD)**: Atendimento às normas de privacidade que sugerem a não manutenção de dados desnecessários.
*   **Performance**: Consultas mais rápidas em coleções globais (rankings, estatísticas) ao remover dados obsoletos.
*   **Custo**: Redução no faturamento do Firebase por armazenamento e, principalmente, por leitura de documentos em consultas de larga escala.

---
**Nota**: Esta estratégia é um roteiro evolutivo. A fase 1 (coleta de `lastSeenAt`) é o pré-requisito para todas as demais ações.
