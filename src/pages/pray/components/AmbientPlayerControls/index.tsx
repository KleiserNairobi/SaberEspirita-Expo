import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Pause, Square, Volume2, VolumeX, Volume1 } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { createStyles } from "./styles";

export function AmbientPlayerControls() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  
  const { 
    isPlaying, 
    currentAudioId, 
    volume,
    setPlaying, 
    setCurrentTrack,
    setVolume 
  } = useAmbientPlayerStore();

  if (!currentAudioId) return null;

  function handleTogglePlay() {
    setPlaying(!isPlaying);
  }

  function handleStop() {
    setPlaying(false);
    // Para parar de vez, poderíamos limpar a trilha, 
    // mas o usuário pode querer apenas dar stop e depois play no mesmo som.
    // Vamos apenas pausar por enquanto, ou resetar o tempo (mas o store não controla tempo).
  }

  function handleAdjustVolume(delta: number) {
    const newVolume = Math.min(1, Math.max(0, volume + delta));
    setVolume(newVolume);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Volume2 size={16} color={theme.colors.primary} />
          <Text style={styles.trackName}>Ambiente Ativo</Text>
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.volumeGroup}>
            <TouchableOpacity onPress={() => handleAdjustVolume(-0.1)} style={styles.volumeButton}>
              <Volume1 size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.volumeBarBg}>
              <View style={[styles.volumeBarFill, { width: `${volume * 100}%` }]} />
            </View>

            <TouchableOpacity onPress={() => handleAdjustVolume(0.1)} style={styles.volumeButton}>
              <Volume2 size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.actionGroup}>
            <TouchableOpacity 
              onPress={handleTogglePlay} 
              style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
            >
              {isPlaying ? (
                <Pause size={20} color={theme.colors.background} fill={theme.colors.background} />
              ) : (
                <Play size={20} color={theme.colors.background} fill={theme.colors.background} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setPlaying(false)} 
              style={styles.stopButton}
            >
              <Square size={18} color={theme.colors.textSecondary} fill={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
