import React, { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";

interface RateAppBottomSheetProps {
  onRate: () => void;
  onRemindLater: () => void;
  onDismiss?: () => void;
}

export const RateAppBottomSheet = forwardRef<BottomSheetModal, RateAppBottomSheetProps>(
  ({ onRate, onRemindLater, onDismiss }, ref) => {
    const config: BottomSheetMessageConfig = {
      type: "question",
      title: "Gostando do App?",
      message:
        "Sua opinião é muito importante para nós! Que tal avaliar o Saber Espírita na loja?",
      primaryButton: {
        label: "Avaliar Agora ⭐",
        onPress: onRate,
      },
      secondaryButton: {
        label: "Lembrar Depois",
        onPress: onRemindLater,
      },
    };

    return <BottomSheetMessage ref={ref} config={config} onDismiss={onDismiss} />;
  }
);

RateAppBottomSheet.displayName = "RateAppBottomSheet";
