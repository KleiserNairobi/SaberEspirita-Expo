import { CommunityLevelId } from "@/types/forum";

export interface CommunityLevelUpModalProps {
  visible: boolean;
  levelId: CommunityLevelId;
  onClose: () => void;
}

