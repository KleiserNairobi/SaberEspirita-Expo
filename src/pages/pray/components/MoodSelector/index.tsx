import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  Smile,
  CloudRain,
  Activity,
  Heart,
  Flame,
  Moon,
  Sparkles,
  Sun,
  ChevronDown,
} from "lucide-react-native";
import { MOODS } from "./constants";

import { useAppTheme } from "@/hooks/useAppTheme";
import { UserMood, useMoodStore } from "@/stores/moodStore";
import { MoodSelectionBottomSheet } from "./MoodSelectionBottomSheet";
import { createStyles } from "./styles";



export function MoodSelector() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { currentMood } = useMoodStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const selectedMoodData = MOODS.find((m) => m.id === currentMood);
  const Icon = selectedMoodData?.icon || Smile;

  function handleOpenSelector() {
    bottomSheetRef.current?.present();
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={handleOpenSelector}
        activeOpacity={0.8}
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
          <Text style={styles.selectorButtonText}>Selecionar</Text>
          <ChevronDown size={14} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <MoodSelectionBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
