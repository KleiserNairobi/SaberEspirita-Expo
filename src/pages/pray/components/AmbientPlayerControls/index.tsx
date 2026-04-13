import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Pause, Music } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { createStyles } from "./styles";

export function AmbientPlayerControls() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  
  const { 
    isPlaying, 
    currentAudioId, 
    setPlaying, 
  } = useAmbientPlayerStore();

  if (!currentAudioId) return null;

  function handleTogglePlay() {
    setPlaying(!isPlaying);
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <View style={styles.iconCircle}>
          <Music size={14} color={theme.colors.background} />
        </View>
        <Text style={styles.trackName} numberOfLines={1}>Melodia Ambiente</Text>
      </View>

      <View style={styles.actionGroup}>
        <TouchableOpacity 
          onPress={handleTogglePlay} 
          style={styles.playButton}
          activeOpacity={0.7}
        >
          {isPlaying ? (
            <Pause size={18} color={theme.colors.text} fill={theme.colors.text} />
          ) : (
            <Play size={18} color={theme.colors.text} fill={theme.colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
