import React, { useRef } from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  Smile,
  ChevronDown,
} from "lucide-react-native";
import { MOODS } from "./constants";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useMoodStore } from "@/stores/moodStore";
import { MoodSelectionBottomSheet } from "./MoodSelectionBottomSheet";
import { createStyles } from "./styles";

interface MoodSelectorProps {
  style?: StyleProp<ViewStyle>;
}

export function MoodSelector({ style }: MoodSelectorProps = {}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { currentMood, checkDayTransition } = useMoodStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Garante que virada de dia civil renove o seletor de humor
  React.useEffect(() => {
    checkDayTransition();
  }, [checkDayTransition]);

  const selectedMoodData = MOODS.find((m) => m.id === currentMood);
  const Icon = selectedMoodData?.icon || Smile;

  function handleOpenSelector() {
    bottomSheetRef.current?.present();
  }

  const hasMood = Boolean(currentMood);

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={handleOpenSelector}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Humor de Agora: ${selectedMoodData?.label || "Como você se sente?"}`}
      >
        <View style={styles.labelSection}>
          <View style={styles.iconContainer}>
            <Icon size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Humor de Agora</Text>
            <Text style={styles.description}>
              {selectedMoodData?.label || "Como você se sente?"}
            </Text>
          </View>
        </View>

        <View style={styles.selectorButton}>
          <Text style={styles.selectorButtonText}>
            {hasMood ? "Alterar" : "Selecionar"}
          </Text>
          <ChevronDown size={14} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <MoodSelectionBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
