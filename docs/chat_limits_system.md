# Sistema de Limites para Chats com IA

## Visão Geral

Este documento descreve o sistema de limitação de uso para os chats com IA (Emocional e Científico) do aplicativo Saber Espírita. O objetivo é controlar custos mantendo uma experiência gratuita de qualidade para os usuários.

## Motivação

- **Controle de Custos**: APIs de IA têm custo por mensagem (~$0.002/msg com GPT-4)
- **Sustentabilidade**: Manter app gratuito sem comprometer viabilidade financeira
- **Qualidade**: Incentivar perguntas bem formuladas ao invés de spam
- **Escalabilidade**: Permitir crescimento controlado da base de usuários

## Modelo de Limitação Recomendado

### Modelo Híbrido

Combina limites diários e mensais para máximo controle:

```typescript
const CHAT_LIMITS = {
  // Limite por chat por dia
  messagesPerDayPerChat: 10,

  // Limite total mensal (ambos chats combinados)
  messagesPerMonth: 100,

  // Cooldown anti-spam entre mensagens
  cooldownMinutes: 1,
};
```

### Justificativa dos Valores

**10 mensagens/dia por chat:**

- Suficiente para 2-3 conversas significativas
- Previne uso excessivo em um único dia
- Reseta à meia-noite, dando nova chance diária

**100 mensagens/mês total:**

- ~3 mensagens/dia em média
- Permite dias de uso mais intenso
- Controla custo mensal por usuário

**1 minuto de cooldown:**

- Previne spam acidental
- Não frustra usuário normal
- Dá tempo para IA processar resposta

## Estrutura de Dados

### Firestore Collection: `chatLimits`

```typescript
interface UserChatLimits {
  userId: string;

  // Uso diário - Chat Emocional
  dailyEmotional: {
    date: string; // "2026-01-25"
    count: number; // 0-10
    lastResetAt: Timestamp;
  };

  // Uso diário - Chat Científico
  dailyScientific: {
    date: string; // "2026-01-25"
    count: number; // 0-10
    lastResetAt: Timestamp;
  };

  // Uso mensal total
  monthlyTotal: {
    month: string; // "2026-01"
    count: number; // 0-100
    lastResetAt: Timestamp;
  };

  // Anti-spam
  lastMessageAt: Timestamp;

  // Metadados
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Exemplo de Documento

```json
{
  "userId": "abc123",
  "dailyEmotional": {
    "date": "2026-01-25",
    "count": 7,
    "lastResetAt": "2026-01-25T00:00:00Z"
  },
  "dailyScientific": {
    "date": "2026-01-25",
    "count": 3,
    "lastResetAt": "2026-01-25T00:00:00Z"
  },
  "monthlyTotal": {
    "month": "2026-01",
    "count": 45,
    "lastResetAt": "2026-01-01T00:00:00Z"
  },
  "lastMessageAt": "2026-01-25T14:30:00Z",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-25T14:30:00Z"
}
```

## Implementação

### 1. Service de Controle de Limites

**Arquivo**: `src/services/firebase/chatLimitsService.ts`

```typescript
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebase";

const LIMITS = {
  messagesPerDayPerChat: 10,
  messagesPerMonth: 100,
  cooldownMinutes: 1,
};

export type ChatType = "emotional" | "scientific";

export interface LimitCheckResult {
  canSend: boolean;
  reason?: string;
  remainingToday?: number;
  remainingMonth?: number;
  nextAvailableAt?: Date;
}

export class ChatLimitsService {
  /**
   * Verifica se usuário pode enviar mensagem
   */
  static async checkCanSendMessage(
    userId: string,
    chatType: ChatType
  ): Promise<LimitCheckResult> {
    const limitsRef = doc(db, "chatLimits", userId);
    const limitsSnap = await getDoc(limitsRef);

    // Criar documento se não existir
    if (!limitsSnap.exists()) {
      await this.initializeUserLimits(userId);
      return {
        canSend: true,
        remainingToday: LIMITS.messagesPerDayPerChat,
        remainingMonth: LIMITS.messagesPerMonth,
      };
    }

    const limits = limitsSnap.data() as UserChatLimits;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const thisMonth = today.substring(0, 7);

    // 1. Verificar cooldown (anti-spam)
    if (limits.lastMessageAt) {
      const lastMessage = limits.lastMessageAt.toDate();
      const timeSinceMs = now.getTime() - lastMessage.getTime();
      const cooldownMs = LIMITS.cooldownMinutes * 60 * 1000;

      if (timeSinceMs < cooldownMs) {
        const nextAvailable = new Date(lastMessage.getTime() + cooldownMs);
        const waitSeconds = Math.ceil((cooldownMs - timeSinceMs) / 1000);

        return {
          canSend: false,
          reason: `Aguarde ${waitSeconds} segundos antes de enviar outra mensagem.`,
          nextAvailableAt: nextAvailable,
        };
      }
    }

    // 2. Verificar limite diário
    const dailyKey = chatType === "emotional" ? "dailyEmotional" : "dailyScientific";
    const dailyUsage = limits[dailyKey];

    // Reset automático se mudou o dia
    const currentDailyCount = dailyUsage.date === today ? dailyUsage.count : 0;

    if (currentDailyCount >= LIMITS.messagesPerDayPerChat) {
      return {
        canSend: false,
        reason: `Você atingiu o limite diário de ${LIMITS.messagesPerDayPerChat} mensagens neste chat. Volte amanhã!`,
        remainingToday: 0,
      };
    }

    // 3. Verificar limite mensal
    const currentMonthlyCount =
      limits.monthlyTotal.month === thisMonth ? limits.monthlyTotal.count : 0;

    if (currentMonthlyCount >= LIMITS.messagesPerMonth) {
      return {
        canSend: false,
        reason: `Você atingiu o limite mensal de ${LIMITS.messagesPerMonth} mensagens. Volte no próximo mês!`,
        remainingMonth: 0,
      };
    }

    // Pode enviar!
    return {
      canSend: true,
      remainingToday: LIMITS.messagesPerDayPerChat - currentDailyCount,
      remainingMonth: LIMITS.messagesPerMonth - currentMonthlyCount,
    };
  }

  /**
   * Incrementa contadores após enviar mensagem
   */
  static async incrementUsage(userId: string, chatType: ChatType): Promise<void> {
    const limitsRef = doc(db, "chatLimits", userId);
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const thisMonth = today.substring(0, 7);

    const dailyKey = chatType === "emotional" ? "dailyEmotional" : "dailyScientific";

    // Buscar dados atuais
    const limitsSnap = await getDoc(limitsRef);
    const limits = limitsSnap.data() as UserChatLimits;

    // Preparar updates
    const updates: any = {
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Atualizar contador diário
    if (limits[dailyKey].date === today) {
      updates[`${dailyKey}.count`] = limits[dailyKey].count + 1;
    } else {
      // Novo dia, resetar
      updates[`${dailyKey}.date`] = today;
      updates[`${dailyKey}.count`] = 1;
      updates[`${dailyKey}.lastResetAt`] = serverTimestamp();
    }

    // Atualizar contador mensal
    if (limits.monthlyTotal.month === thisMonth) {
      updates["monthlyTotal.count"] = limits.monthlyTotal.count + 1;
    } else {
      // Novo mês, resetar
      updates["monthlyTotal.month"] = thisMonth;
      updates["monthlyTotal.count"] = 1;
      updates["monthlyTotal.lastResetAt"] = serverTimestamp();
    }

    await updateDoc(limitsRef, updates);
  }

  /**
   * Inicializa documento de limites para novo usuário
   */
  private static async initializeUserLimits(userId: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = today.substring(0, 7);

    const initialLimits: UserChatLimits = {
      userId,
      dailyEmotional: {
        date: today,
        count: 0,
        lastResetAt: serverTimestamp() as any,
      },
      dailyScientific: {
        date: today,
        count: 0,
        lastResetAt: serverTimestamp() as any,
      },
      monthlyTotal: {
        month: thisMonth,
        count: 0,
        lastResetAt: serverTimestamp() as any,
      },
      lastMessageAt: null as any,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };

    await setDoc(doc(db, "chatLimits", userId), initialLimits);
  }

  /**
   * Obtém estatísticas de uso do usuário
   */
  static async getUserStats(userId: string): Promise<{
    dailyEmotional: number;
    dailyScientific: number;
    monthlyTotal: number;
  }> {
    const limitsRef = doc(db, "chatLimits", userId);
    const limitsSnap = await getDoc(limitsRef);

    if (!limitsSnap.exists()) {
      return {
        dailyEmotional: 0,
        dailyScientific: 0,
        monthlyTotal: 0,
      };
    }

    const limits = limitsSnap.data() as UserChatLimits;
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = today.substring(0, 7);

    return {
      dailyEmotional:
        limits.dailyEmotional.date === today ? limits.dailyEmotional.count : 0,
      dailyScientific:
        limits.dailyScientific.date === today ? limits.dailyScientific.count : 0,
      monthlyTotal:
        limits.monthlyTotal.month === thisMonth ? limits.monthlyTotal.count : 0,
    };
  }
}
```

### 2. Hook React Query

**Arquivo**: `src/hooks/queries/useChatLimits.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatLimitsService, ChatType } from "@/services/firebase/chatLimitsService";
import { useAuthStore } from "@/stores/authStore";

export function useChatLimits(chatType: ChatType) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["chatLimits", user?.uid, chatType],
    queryFn: async () => {
      if (!user?.uid) return null;
      return ChatLimitsService.checkCanSendMessage(user.uid, chatType);
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 30, // 30 segundos
  });
}

export function useIncrementChatUsage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (chatType: ChatType) => {
      if (!user?.uid) throw new Error("User not authenticated");
      await ChatLimitsService.incrementUsage(user.uid, chatType);
    },
    onSuccess: () => {
      // Invalidar queries para atualizar UI
      queryClient.invalidateQueries({ queryKey: ["chatLimits"] });
    },
  });
}

export function useChatStats() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["chatStats", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      return ChatLimitsService.getUserStats(user.uid);
    },
    enabled: !!user?.uid,
  });
}
```

### 3. Componentes de UI

#### 3.1 Indicador de Limites

**Arquivo**: `src/components/ChatLimitIndicator.tsx`

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ChatLimitIndicatorProps {
  remainingToday: number;
  remainingMonth: number;
}

export function ChatLimitIndicator({
  remainingToday,
  remainingMonth
}: ChatLimitIndicatorProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.sm,
      gap: theme.spacing.xs,
    }}>
      <Info size={16} color={theme.colors.textSecondary} />
      <View style={{ flex: 1 }}>
        <Text style={{
          ...theme.text('xs', 'regular', theme.colors.textSecondary),
        }}>
          {remainingToday} mensagens restantes hoje • {remainingMonth} este mês
        </Text>
      </View>
    </View>
  );
}
```

#### 3.2 Modal de Limite Atingido

**Arquivo**: `src/components/ChatLimitReachedModal.tsx`

```typescript
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { X, Clock, Calendar } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Button } from '@/components/Button';

interface ChatLimitReachedModalProps {
  visible: boolean;
  onClose: () => void;
  reason: string;
  isDaily?: boolean;
}

export function ChatLimitReachedModal({
  visible,
  onClose,
  reason,
  isDaily = true,
}: ChatLimitReachedModalProps) {
  const { theme } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
      }}>
        <View style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.xl,
          width: '100%',
          maxWidth: 400,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.primary + '15',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {isDaily ? (
                <Clock size={24} color={theme.colors.primary} />
              ) : (
                <Calendar size={24} color={theme.colors.primary} />
              )}
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Text style={{
            ...theme.text('xl', 'bold', theme.colors.text),
            marginBottom: theme.spacing.sm,
          }}>
            Limite atingido
          </Text>

          <Text style={{
            ...theme.text('md', 'regular', theme.colors.textSecondary),
            marginBottom: theme.spacing.xl,
            lineHeight: 22,
          }}>
            {reason}
          </Text>

          {/* Suggestions */}
          <View style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.background,
            borderRadius: theme.radius.md,
            marginBottom: theme.spacing.lg,
          }}>
            <Text style={{
              ...theme.text('sm', 'semibold', theme.colors.text),
              marginBottom: theme.spacing.xs,
            }}>
              Enquanto isso, você pode:
            </Text>
            <Text style={{
              ...theme.text('sm', 'regular', theme.colors.textSecondary),
              lineHeight: 20,
            }}>
              • Explorar os cursos espíritas{'\n'}
              • Responder quizzes de fixação{'\n'}
              • Ler reflexões diárias{'\n'}
              • Meditar com áudios ambiente
            </Text>
          </View>

          {/* Actions */}
          <Button
            title="Entendi"
            onPress={onClose}
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
}
```

### 4. Integração nos Chats

**Modificar**: `src/pages/meditate/emotional-chat/index.tsx` e `scientific-chat/index.tsx`

```typescript
import { useChatLimits, useIncrementChatUsage } from '@/hooks/queries/useChatLimits';
import { ChatLimitIndicator } from '@/components/ChatLimitIndicator';
import { ChatLimitReachedModal } from '@/components/ChatLimitReachedModal';

export function EmotionalChatScreen() {
  // ... código existente

  const { data: limits } = useChatLimits('emotional');
  const incrementUsage = useIncrementChatUsage();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitReason, setLimitReason] = useState('');

  async function handleSendMessage() {
    // Verificar limites antes de enviar
    if (!limits?.canSend) {
      setLimitReason(limits?.reason || 'Limite atingido');
      setShowLimitModal(true);
      return;
    }

    // Enviar mensagem
    await sendMessageToAI(message);

    // Incrementar contador
    await incrementUsage.mutateAsync('emotional');
  }

  return (
    <View>
      {/* Indicador de limites */}
      {limits && limits.canSend && (
        <ChatLimitIndicator
          remainingToday={limits.remainingToday || 0}
          remainingMonth={limits.remainingMonth || 0}
        />
      )}

      {/* Chat UI */}
      {/* ... */}

      {/* Modal de limite */}
      <ChatLimitReachedModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        reason={limitReason}
      />
    </View>
  );
}
```

## Regras de Negócio

### Reset Automático

1. **Diário**: Reseta à meia-noite (00:00) no timezone do servidor
2. **Mensal**: Reseta no dia 1 de cada mês
3. **Cooldown**: Calculado em tempo real, não reseta

### Contadores Independentes

- Chat Emocional e Científico têm contadores diários **separados**
- Contador mensal é **compartilhado** entre ambos
- Exemplo: 10 msg/dia em cada = 20 msg/dia total, mas limitado a 100/mês

### Prioridade de Verificação

1. **Cooldown** (mais restritivo, tempo real)
2. **Limite diário** (por chat)
3. **Limite mensal** (total)

## Estimativa de Custos

### Premissas

- Custo médio: $0.002 por mensagem (GPT-4)
- 1000 usuários ativos/mês
- Taxa de uso: 70% atingem limite diário

### Cenário Conservador (10 msg/dia)

```
Usuários: 1000
Mensagens/usuário/mês: ~100 (limite mensal)
Total mensagens/mês: 100.000
Custo mensal: $200
Custo anual: $2.400
```

### Cenário Realista (uso médio)

```
Usuários: 1000
Mensagens/usuário/mês: ~60 (média real)
Total mensagens/mês: 60.000
Custo mensal: $120
Custo anual: $1.440
```

## Monitoramento e Analytics

### Métricas a Rastrear

```typescript
// Firebase Analytics Events
analytics.logEvent("chat_limit_reached", {
  chat_type: "emotional",
  limit_type: "daily", // ou 'monthly'
  user_id: userId,
});

analytics.logEvent("chat_message_sent", {
  chat_type: "scientific",
  remaining_today: 5,
  remaining_month: 45,
});
```

### Dashboard Admin (Futuro)

Métricas importantes:

- Usuários que atingem limite diário (%)
- Usuários que atingem limite mensal (%)
- Média de mensagens por usuário
- Pico de uso por hora/dia
- Custo total mensal

## Plano de Rollout

### Fase 1: Implementação Silenciosa (1-2 semanas)

- Implementar service e tracking
- **NÃO** aplicar limites ainda
- Coletar dados de uso real
- Ajustar limites baseado em dados

### Fase 2: Soft Launch (2 semanas)

- Ativar limites generosos (20 msg/dia, 200/mês)
- Monitorar feedback
- Ajustar conforme necessário

### Fase 3: Limites Finais

- Aplicar limites definitivos (10 msg/dia, 100/mês)
- Comunicar mudança aos usuários
- Oferecer alternativas (outros recursos do app)

## Comunicação com Usuários

### Mensagens Sugeridas

**Ao atingir limite diário:**

> "Você atingiu o limite diário de 10 mensagens neste chat. Volte amanhã para continuar conversando! Enquanto isso, explore nossos cursos e quizzes."

**Ao atingir limite mensal:**

> "Você atingiu o limite mensal de 100 mensagens. Volte no próximo mês! Aproveite para explorar outros recursos do app: cursos, meditações, orações e muito mais."

**Cooldown:**

> "Aguarde 1 minuto antes de enviar outra mensagem. Isso nos ajuda a manter o serviço gratuito para todos."

## Futuras Melhorias

### Plano Premium (Opcional)

```typescript
const PREMIUM_LIMITS = {
  messagesPerDayPerChat: 50,
  messagesPerMonth: 500,
  cooldownMinutes: 0,
  priority: true, // Respostas mais rápidas
};
```

### Bônus por Engajamento

```typescript
// Exemplos de bônus
const BONUS_RULES = {
  complete10Quizzes: 5, // +5 mensagens
  streak7Days: 3, // +3 mensagens
  shareApp: 2, // +2 mensagens
  completeCourse: 10, // +10 mensagens
};
```

### Reset Manual (Admin)

Permitir que administradores resetem limites de usuários específicos em casos especiais.

## Considerações de Segurança

1. **Validação Server-Side**: Sempre validar limites no backend
2. **Rate Limiting**: Implementar rate limiting adicional no Cloud Functions
3. **Detecção de Abuso**: Monitorar padrões suspeitos
4. **Logs de Auditoria**: Registrar todas as verificações de limite

## Checklist de Implementação

- [ ] Criar collection `chatLimits` no Firestore
- [ ] Implementar `ChatLimitsService`
- [ ] Criar hooks React Query
- [ ] Desenvolver componentes de UI
- [ ] Integrar nos chats existentes
- [ ] Configurar Analytics
- [ ] Testar todos os cenários
- [ ] Documentar para usuários
- [ ] Fazer rollout gradual
- [ ] Monitorar e ajustar

## Referências

- [OpenAI Pricing](https://openai.com/pricing)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [React Query Documentation](https://tanstack.com/query/latest)

---

**Última atualização**: 2026-01-25  
**Autor**: Equipe Saber Espírita  
**Status**: Planejamento - Aguardando Implementação
