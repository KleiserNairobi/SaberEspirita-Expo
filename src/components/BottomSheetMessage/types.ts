export type MessageType = "success" | "error" | "warning" | "info" | "question";

export interface BottomSheetMessageConfig {
  type: MessageType;
  title: string;
  message: string;
  primaryButton?: {
    label: string;
    onPress: () => void;
  };
  secondaryButton?: {
    label: string;
    onPress: () => void;
  };
}
