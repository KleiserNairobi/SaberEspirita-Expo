import { CommunityLevelId } from "@/types/forum";
import { loadString, saveString } from "@/utils/Storage";

const LEVEL_ORDER: Record<CommunityLevelId, number> = {
  sementeiro: 1,
  cultivador: 2,
  arvore_frondosa: 3,
};

function getKey(userId: string) {
  return `community_level_last_seen:${userId}`;
}

export function getStoredCommunityLevelRaw(userId: string): string | null {
  return loadString(getKey(userId));
}

export function getStoredCommunityLevel(userId: string): CommunityLevelId {
  const raw = loadString(getKey(userId));
  if (raw === "cultivador" || raw === "arvore_frondosa") return raw;
  return "sementeiro";
}

export function setStoredCommunityLevel(userId: string, levelId: CommunityLevelId): void {
  saveString(getKey(userId), levelId);
}

export function getLevelUpIfAny(params: {
  userId: string;
  currentLevelId: CommunityLevelId;
}): CommunityLevelId | null {
  const raw = getStoredCommunityLevelRaw(params.userId);
  if (raw === null) return null;
  const lastSeen = getStoredCommunityLevel(params.userId);
  return LEVEL_ORDER[params.currentLevelId] > LEVEL_ORDER[lastSeen] ? params.currentLevelId : null;
}
