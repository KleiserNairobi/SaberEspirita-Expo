import { ChatType, LimitCheckResult } from "@/services/firebase/chatLimitsService";
import * as Storage from "@/utils/Storage";

const GUEST_LIMITS = {
  messagesPerDayPerChat: 3,
  messagesPerMonth: 10,
};

const GUEST_LIMITS_KEY = "guestChatLimits";

interface GuestLimitsData {
  dailyEmotional: {
    date: string;
    count: number;
  };
  dailyScientific: {
    date: string;
    count: number;
  };
  monthlyTotal: {
    month: string;
    count: number;
  };
}

export class LocalChatLimitsService {
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
   * Obtém os limites locais do MMKV
   */
  private static getLimitsData(): GuestLimitsData {
    const dataStr = Storage.loadString(GUEST_LIMITS_KEY);
    if (!dataStr) {
      return this.initializeLimitsData();
    }
    try {
      return JSON.parse(dataStr) as GuestLimitsData;
    } catch (e) {
      return this.initializeLimitsData();
    }
  }

  /**
   * Salva os limites locais no MMKV
   */
  private static saveLimitsData(data: GuestLimitsData): void {
    Storage.saveString(GUEST_LIMITS_KEY, JSON.stringify(data));
  }

  /**
   * Inicializa dados de limites para visitante
   */
  private static initializeLimitsData(): GuestLimitsData {
    const today = this.getLocalDateString();
    const thisMonth = today.substring(0, 7);

    const initialData: GuestLimitsData = {
      dailyEmotional: { date: today, count: 0 },
      dailyScientific: { date: today, count: 0 },
      monthlyTotal: { month: thisMonth, count: 0 },
    };

    this.saveLimitsData(initialData);
    return initialData;
  }

  /**
   * Verifica se o visitante pode enviar mensagem
   */
  static async checkCanSendMessage(chatType: ChatType): Promise<LimitCheckResult> {
    const limits = this.getLimitsData();
    const today = this.getLocalDateString();
    const thisMonth = today.substring(0, 7);

    // Verificar limite diário
    const dailyKey = chatType === "emotional" ? "dailyEmotional" : "dailyScientific";
    const dailyUsage = limits[dailyKey];

    const currentDailyCount = dailyUsage.date === today ? dailyUsage.count : 0;

    if (currentDailyCount >= GUEST_LIMITS.messagesPerDayPerChat) {
      return {
        canSend: false,
        reason: `Como visitante, você atingiu o limite de ${GUEST_LIMITS.messagesPerDayPerChat} mensagens.\nPara continuar conversando sem limites, crie sua conta gratuitamente!`,
        remainingToday: 0,
      };
    }

    // Verificar limite mensal
    const currentMonthlyCount =
      limits.monthlyTotal.month === thisMonth ? limits.monthlyTotal.count : 0;

    if (currentMonthlyCount >= GUEST_LIMITS.messagesPerMonth) {
      return {
        canSend: false,
        reason: `Como visitante, você atingiu o limite mensal de ${GUEST_LIMITS.messagesPerMonth} mensagens.\nPara continuar conversando sem limites, crie sua conta gratuitamente!`,
        remainingMonth: 0,
      };
    }

    // Pode enviar!
    return {
      canSend: true,
      remainingToday: GUEST_LIMITS.messagesPerDayPerChat - currentDailyCount,
      remainingMonth: GUEST_LIMITS.messagesPerMonth - currentMonthlyCount,
    };
  }

  /**
   * Incrementa contadores do visitante após enviar mensagem
   */
  static async incrementUsage(chatType: ChatType): Promise<void> {
    const limits = this.getLimitsData();
    const today = this.getLocalDateString();
    const thisMonth = today.substring(0, 7);

    const dailyKey = chatType === "emotional" ? "dailyEmotional" : "dailyScientific";

    // Atualizar contador diário
    if (limits[dailyKey].date === today) {
      limits[dailyKey].count += 1;
    } else {
      limits[dailyKey].date = today;
      limits[dailyKey].count = 1;
    }

    // Atualizar contador mensal
    if (limits.monthlyTotal.month === thisMonth) {
      limits.monthlyTotal.count += 1;
    } else {
      limits.monthlyTotal.month = thisMonth;
      limits.monthlyTotal.count = 1;
    }

    this.saveLimitsData(limits);
  }

  /**
   * Obtém estatísticas de uso do visitante
   */
  static async getUserStats(): Promise<{
    dailyEmotional: number;
    dailyScientific: number;
    monthlyTotal: number;
  }> {
    const limits = this.getLimitsData();
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
