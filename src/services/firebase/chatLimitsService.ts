import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";

const LIMITS = {
  messagesPerDayPerChat: 10,
  messagesPerMonth: 100,
  // cooldownSeconds removido
};

export type ChatType = "emotional" | "scientific";

export interface UserChatLimits {
  userId: string;
  dailyEmotional: {
    date: string;
    count: number;
    lastResetAt: Timestamp;
  };
  dailyScientific: {
    date: string;
    count: number;
    lastResetAt: Timestamp;
  };
  monthlyTotal: {
    month: string;
    count: number;
    lastResetAt: Timestamp;
  };
  lastMessageAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LimitCheckResult {
  canSend: boolean;
  reason?: string;
  remainingToday?: number;
  remainingMonth?: number;
  nextAvailableAt?: Date;
}

export class ChatLimitsService {
  /**
   * Helper para obter data local YYYY-MM-DD
   */
  private static getLocalDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Verifica se usuário pode enviar mensagem
   */
  static async checkCanSendMessage(
    userId: string,
    chatType: ChatType
  ): Promise<LimitCheckResult> {
    console.log(
      `[ChatLimitsService] Checking limits for ${chatType} (v2 - Cooldown REMOVED)`
    );
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
    const today = this.getLocalDateString();
    const thisMonth = today.substring(0, 7);

    // 1. REMOVIDO: Verificar cooldown (anti-spam) a pedido do usuário
    // O bloco de verificação de 5 segundos foi removido para evitar travamentos na UX.

    // 2. Verificar limite diário
    const dailyKey = chatType === "emotional" ? "dailyEmotional" : "dailyScientific";
    const dailyUsage = limits[dailyKey];

    // Reset automático se mudou o dia (apenas lógica visual, não escreve no banco ainda)
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
    const today = this.getLocalDateString();
    const thisMonth = today.substring(0, 7);

    const dailyKey = chatType === "emotional" ? "dailyEmotional" : "dailyScientific";

    // Buscar dados atuais novamente para garantir consistência
    const limitsSnap = await getDoc(limitsRef);
    if (!limitsSnap.exists()) {
      await this.initializeUserLimits(userId);
      return;
    }

    const limits = limitsSnap.data() as UserChatLimits;

    // Preparar updates
    // IMPORTANTE: Usamos Timestamp.fromDate(now) aqui para garantir que o cooldown
    // seja calculado com base no relógio do cliente, evitando problemas de clock skew
    // com o servidor que travam o usuário por mais de 5s.
    const updates: any = {
      lastMessageAt: Timestamp.fromDate(now),
      updatedAt: serverTimestamp(),
    };

    // Atualizar contador diário
    if (limits[dailyKey].date === today) {
      updates[`${dailyKey}.count`] = limits[dailyKey].count + 1;
    } else {
      // Novo dia, resetar
      updates[`${dailyKey}.date`] = today;
      updates[`${dailyKey}.count`] = 1;
      updates[`${dailyKey}.lastResetAt`] = Timestamp.fromDate(now);
    }

    // Atualizar contador mensal
    if (limits.monthlyTotal.month === thisMonth) {
      updates["monthlyTotal.count"] = limits.monthlyTotal.count + 1;
    } else {
      // Novo mês, resetar
      updates["monthlyTotal.month"] = thisMonth;
      updates["monthlyTotal.count"] = 1;
      updates["monthlyTotal.lastResetAt"] = Timestamp.fromDate(now);
    }

    await updateDoc(limitsRef, updates);
  }

  /**
   * Inicializa documento de limites para novo usuário
   */
  private static async initializeUserLimits(userId: string): Promise<void> {
    const today = this.getLocalDateString();
    const thisMonth = today.substring(0, 7);
    const nowTimestamp = Timestamp.fromDate(new Date());

    const initialLimits: UserChatLimits = {
      userId,
      dailyEmotional: {
        date: today,
        count: 0,
        lastResetAt: nowTimestamp,
      },
      dailyScientific: {
        date: today,
        count: 0,
        lastResetAt: nowTimestamp,
      },
      monthlyTotal: {
        month: thisMonth,
        count: 0,
        lastResetAt: nowTimestamp,
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
    const today = this.getLocalDateString();
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
