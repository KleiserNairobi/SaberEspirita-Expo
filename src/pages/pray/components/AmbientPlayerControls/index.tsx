import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Pause, Music } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useAmbientAudios } from "@/pages/pray/hooks/useAmbientAudios";
import { createStyles } from "./styles";

const COMPOSERS: Record<string, string> = {
  AveMaria: "Franz Schubert",
  ClairDeLune: "Claude Debussy",
  Gymnopedie: "Erik Satie",
  Nocturne: "Frédéric Chopin",
};

export function AmbientPlayerControls() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data: audios } = useAmbientAudios();
  
  const { 
    isPlaying, 
    currentAudioId, 
    setPlaying, 
  } = useAmbientPlayerStore();

  if (!currentAudioId) return null;

  const activeAudio = audios?.find(a => a.id === currentAudioId);
  const trackTitle = activeAudio ? activeAudio.title : "Melodia Ambiente";
  const composer = currentAudioId ? COMPOSERS[currentAudioId] : null;

  function handleTogglePlay() {
    setPlaying(!isPlaying);
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <View style={styles.iconCircle}>
          <Music size={14} color={theme.colors.background} />
        </View>
        <Text style={styles.trackName} numberOfLines={1}>
          {trackTitle}
          {composer && (
            <Text style={{ fontWeight: "normal", fontSize: 11, opacity: 0.6 }}>
              {" "}
              ({composer})
            </Text>
          )}
        </Text>
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
