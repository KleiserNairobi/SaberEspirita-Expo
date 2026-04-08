import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { UserMood, useMoodStore } from "@/stores/moodStore";
import { createStyles } from "./styles";

const MOODS: { id: UserMood; emoji: string; label: string }[] = [
  { id: "CALMO", emoji: "😊", label: "Calmo" },
  { id: "TRISTE", emoji: "😢", label: "Triste" },
  { id: "ANSIOSO", emoji: "😰", label: "Ansioso" },
  { id: "GRATO", emoji: "🙏", label: "Grato" },
  { id: "IRRITADO", emoji: "😤", label: "Irritado" },
  { id: "CANSADO", emoji: "😴", label: "Cansado" },
  { id: "DESCONHECIDO", emoji: "❓", label: "Pular" },
];

export function MoodSelector() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { currentMood, setMood } = useMoodStore();

  function handleMoodPress(moodId: UserMood) {
    if (currentMood === moodId) {
      setMood(null); // Desmarca se clicar no mesmo
    } else {
      setMood(moodId);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você está se sentindo?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOODS.map((mood) => {
          const isSelected = currentMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[styles.moodChip, isSelected && styles.moodChipSelected]}
              onPress={() => handleMoodPress(mood.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
