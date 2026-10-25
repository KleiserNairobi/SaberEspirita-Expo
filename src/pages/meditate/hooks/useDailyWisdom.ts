import { useQuery } from "@tanstack/react-query";
import { dailyWisdomApiService } from "@/services/api/dailyWisdomApiService";
import { IDailyWisdom, WisdomMoment } from "@/types/dailyWisdom";
import * as Storage from "@/utils/Storage";
import seedMessages from "@/assets/dailyWisdom/seed.json";

export const DAILY_WISDOM_KEYS = {
  all: ["dailyWisdom"] as const,
  today: ["dailyWisdom", "today"] as const,
  random: (moment?: string) => ["dailyWisdom", "random", moment || "all"] as const,
  byMoment: (moment?: string) => ["dailyWisdom", "byMoment", moment || "all"] as const,
  byId: (id: string) => ["dailyWisdom", "detail", id] as const,
};

const STORAGE_KEYS = {
  today: "@daily_wisdom_today",
  byId: (id: string) => `@daily_wisdom_detail_${id}`,
};

/**
 * Retorna uma mensagem de sabedoria padrão a partir do seed local embutido
 */
export function getLocalSeedWisdom(moment?: WisdomMoment | string): IDailyWisdom {
  const seeds = seedMessages as IDailyWisdom[];
  if (moment && moment !== "GERAL") {
    const filtered = seeds.filter((s) => s.moment === moment);
    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      return filtered[randomIndex];
    }
  }

  // Fallback baseado no dia do ano para mensagem consistente do dia
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const matched = seeds.find((s) => s.dayOfYear === ((dayOfYear % seeds.length) + 1));
  return matched || seeds[0];
}

/**
 * Hook para a Gota de Sabedoria de Hoje
 * Carrega com 0ms de latência via cache persistente do MMKV e revalida em background.
 */
export function useTodayWisdom() {
  return useQuery<IDailyWisdom>({
    queryKey: DAILY_WISDOM_KEYS.today,
    queryFn: async () => {
      try {
        const remote = await dailyWisdomApiService.getTodayWisdom();
        if (remote) {
          Storage.save(STORAGE_KEYS.today, remote);
          return remote;
        }
      } catch (e) {
        console.warn("useTodayWisdom: falha ao buscar remoto, usando fallback local", e);
      }

      // Fallback 1: cache do MMKV
      const cached = Storage.load<IDailyWisdom>(STORAGE_KEYS.today);
      if (cached) return cached;

      // Fallback 2: seed bundled
      return getLocalSeedWisdom();
    },
    initialData: () => {
      const cached = Storage.load<IDailyWisdom>(STORAGE_KEYS.today);
      return cached || getLocalSeedWisdom();
    },
    staleTime: 1000 * 60 * 30, // 30 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
  });
}

/**
 * Hook para sorteio de Gotas ao Acaso (com suporte opcional a filtro por Momento da Alma)
 */
export function useRandomWisdom(moment?: WisdomMoment | string, enabled = true) {
  return useQuery<IDailyWisdom>({
    queryKey: DAILY_WISDOM_KEYS.random(moment),
    queryFn: async () => {
      try {
        const remote = await dailyWisdomApiService.getRandomWisdom(moment);
        if (remote) return remote;
      } catch (e) {
        console.warn("useRandomWisdom: falha ao sortear remoto, usando fallback do seed", e);
      }
      return getLocalSeedWisdom(moment);
    },
    enabled,
    staleTime: 0, // Sempre novo ao solicitar sorteio
    refetchOnMount: "always",
  });
}

/**
 * Hook para consultar mensagens filtradas pelo Momento da Alma
 */
export function useWisdomByMoment(moment?: WisdomMoment | string) {
  return useQuery<IDailyWisdom[]>({
    queryKey: DAILY_WISDOM_KEYS.byMoment(moment),
    queryFn: async () => {
      try {
        const remote = await dailyWisdomApiService.getWisdomByMoment(moment);
        if (remote && remote.length > 0) return remote;
      } catch (e) {
        console.warn("useWisdomByMoment: falha remota, filtrando do seed", e);
      }

      const seeds = seedMessages as IDailyWisdom[];
      if (!moment || moment === "GERAL") return seeds;
      const filtered = seeds.filter((s) => s.moment === moment);
      return filtered.length > 0 ? filtered : seeds;
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

/**
 * Hook para obter uma lição de sabedoria específica por ID
 */
export function useWisdomById(id?: string) {
  return useQuery<IDailyWisdom | null>({
    queryKey: DAILY_WISDOM_KEYS.byId(id || ""),
    queryFn: async () => {
      if (!id) return null;

      try {
        const remote = await dailyWisdomApiService.getWisdomById(id);
        if (remote) {
          Storage.save(STORAGE_KEYS.byId(id), remote);
          return remote;
        }
      } catch (e) {
        console.warn(`useWisdomById: falha ao buscar ${id}:`, e);
      }

      const cached = Storage.load<IDailyWisdom>(STORAGE_KEYS.byId(id));
      if (cached) return cached;

      const seeds = seedMessages as IDailyWisdom[];
      const foundInSeed = seeds.find((s) => s.id === id);
      return foundInSeed || null;
    },
    initialData: () => {
      if (!id) return null;
      const cached = Storage.load<IDailyWisdom>(STORAGE_KEYS.byId(id));
      if (cached) return cached;
      const seeds = seedMessages as IDailyWisdom[];
      return seeds.find((s) => s.id === id) || null;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 60,
  });
}
