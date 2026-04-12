import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Pause, Music, Volume2, Volume1, X } from "lucide-react-native";

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

  const [showVolume, setShowVolume] = useState(false);

  if (!currentAudioId) return null;

  function handleTogglePlay() {
    setPlaying(!isPlaying);
  }

  function handleAdjustVolume(delta: number) {
    const newVolume = Math.min(1, Math.max(0, volume + delta));
    setVolume(newVolume);
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
      {showVolume ? (
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

          <TouchableOpacity onPress={() => setShowVolume(false)} style={styles.closeVolumeBtn}>
            <X size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.infoSection}>
            <View style={styles.iconCircle}>
              <Music size={14} color={theme.colors.background} />
            </View>
            <Text style={styles.trackName} numberOfLines={1}>Melodia Ambiente</Text>
          </View>

          <View style={styles.actionGroup}>
            <TouchableOpacity onPress={() => setShowVolume(true)} style={styles.volumeToggleBtn}>
              <Volume2 size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

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
        </>
      )}
    </View>
  );
}
