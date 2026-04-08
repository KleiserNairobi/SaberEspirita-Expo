import React, { useState } from "react";
import { 
  ActivityIndicator, 
  Text, 
  TouchableOpacity, 
  View, 
  ImageBackground,
  Modal
} from "react-native";
import { Play, Pause, ChevronDown, Music, Waves, Moon } from "lucide-react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useAmbientAudios } from "@/pages/pray/hooks/useAmbientAudios";
import { useMoodStore } from "@/stores/moodStore";
import { useSuggestedContent } from "../../hooks/useSuggestedContent";
import { createStyles } from "./styles";

const ICON_MAP = {
  music: Music,
  waves: Waves,
  moon: Moon,
} as const;

// Mapeamento amigável (User pediu que venha do Firebase, mas enquanto não alteramos 
// a estrutura do DB, usamos este mapeamento para a "Desconstrução da Playlist")
const FRIENDLY_NAMES: Record<string, string> = {
  "AveMaria": "Consolo da Alma",
  "ClairDeLune": "Paz Lunar",
  "Gymnopedie": "Serenidade",
  "Nocturne": "Céu Estrelado",
};

export function AmbientEnvironmentCard() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  
  const { currentMood } = useMoodStore();
  const { suggestedContent } = useSuggestedContent(currentMood);
  const { data: audios, isLoading } = useAmbientAudios();
  
  const { isPlaying, currentTrack, setPlaying, setCurrentTrack } = useAmbientPlayerStore();
  const player = useAudioPlayer(currentTrack || "");
  const status = useAudioPlayerStatus(player);

  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // Áudio ativo ou o sugerido
  const activeAudio = React.useMemo(() => {
    if (!audios) return null;
    if (currentTrack) {
      return audios.find(a => a.localUri === currentTrack) || audios[0];
    }
    return suggestedContent?.audio || audios[0];
  }, [audios, currentTrack, suggestedContent]);

  async function handleTogglePlay() {
    if (!activeAudio) return;

    if (currentTrack === activeAudio.localUri && status.playing) {
      player.pause();
      setPlaying(false);
    } else if (currentTrack === activeAudio.localUri && !status.playing) {
      player.play();
      setPlaying(true);
    } else {
      // Tocar o ativo (que pode ser o sugerido)
      if (activeAudio.localUri) {
        setCurrentTrack(activeAudio.localUri);
        player.play();
        setPlaying(true);
      }
    }
  }

  function handleSelectTrack(localUri: string) {
    setCurrentTrack(localUri);
    setIsPickerVisible(false);
  }

  if (isLoading || !activeAudio) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const friendlyName = FRIENDLY_NAMES[activeAudio.id] || activeAudio.title;
  const isCurrentPlaying = currentTrack === activeAudio.localUri && status.playing;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/placeholder.png")} // Placeholder imersivo
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      >
        <View style={styles.overlay}>
          <View style={styles.infoSection}>
            <Text style={styles.environmentLabel}>AMBIENTE ATUAL</Text>
            <Text style={styles.environmentName}>{friendlyName}</Text>
          </View>

          <View style={styles.controlsSection}>
            <TouchableOpacity 
              style={styles.mainButton} 
              onPress={handleTogglePlay}
              activeOpacity={0.8}
            >
              {isCurrentPlaying ? (
                <Pause size={24} color={theme.colors.onPrimary} fill={theme.colors.onPrimary} />
              ) : (
                <Play size={24} color={theme.colors.onPrimary} fill={theme.colors.onPrimary} />
              )}
              <Text style={styles.mainButtonText}>
                {isCurrentPlaying ? "EM SINTONIA" : "ENTRAR EM SINTONIA"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pickerTrigger} 
              onPress={() => setIsPickerVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.pickerTriggerText}>Trocar Ambiente</Text>
              <ChevronDown size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Modal Simples de Seleção (Substituindo a playlist vertical) */}
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Caminhos de Sintonia</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                <Text style={styles.closeButton}>Fechar</Text>
              </TouchableOpacity>
            </View>
            
            {audios?.map((audio) => {
              const Icon = ICON_MAP[audio.icon] || Music;
              const isSelected = audio.localUri === currentTrack;
              return (
                <TouchableOpacity
                  key={audio.id}
                  style={[styles.audioOption, isSelected && styles.audioOptionSelected]}
                  onPress={() => audio.localUri && handleSelectTrack(audio.localUri)}
                >
                  <Icon size={20} color={isSelected ? theme.colors.primary : theme.colors.text} />
                  <Text style={[styles.audioOptionText, isSelected && styles.audioOptionTextSelected]}>
                    {FRIENDLY_NAMES[audio.id] || audio.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}
