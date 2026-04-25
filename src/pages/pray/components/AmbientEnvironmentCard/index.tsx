import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ChevronDown, Moon, Music, Pause, Play, Waves } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { State, usePlaybackState } from "react-native-track-player";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientAudios } from "@/pages/pray/hooks/useAmbientAudios";
import { useSuggestedContent } from "@/pages/pray/hooks/useSuggestedContent";
import { downloadAudio } from "@/services/firebase/ambientAudioService";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useMoodStore } from "@/stores/moodStore";
import { IAmbientAudio } from "@/types/ambientAudio";
import { AmbientSelectionBottomSheet } from "./AmbientSelectionBottomSheet";
import { createStyles } from "./styles";

const ICON_MAP = {
  music: Music,
  waves: Waves,
  moon: Moon,
} as const;

// Mapeamento amigável (User pediu que venha do Firebase, mas enquanto não alteramos
// a estrutura do DB, usamos este mapeamento para a "Desconstrução da Playlist")
const FRIENDLY_NAMES: Record<string, string> = {
  AveMaria: "Consolo da Alma",
  ClairDeLune: "Paz Lunar",
  Gymnopedie: "Serenidade",
  Nocturne: "Céu Estrelado",
};

const COMPOSERS: Record<string, string> = {
  AveMaria: "Franz Schubert",
  ClairDeLune: "Claude Debussy",
  Gymnopedie: "Erik Satie",
  Nocturne: "Frédéric Chopin",
};

interface AmbientEnvironmentCardProps {
  variant?: "full" | "minimal" | "selector";
}

export function AmbientEnvironmentCard({
  variant = "full",
}: AmbientEnvironmentCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const { currentMood } = useMoodStore();
  const { suggestedContent } = useSuggestedContent(currentMood);
  const { data: audios, isLoading } = useAmbientAudios();

  const {
    isPlaying,
    currentTrack,
    currentAudioId,
    isDownloading,
    setPlaying,
    setCurrentTrack,
    setDownloading,
  } = useAmbientPlayerStore();
  const playbackState = usePlaybackState();
  const isActuallyPlaying = playbackState.state === State.Playing;

  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const [pendingName, setPendingName] = React.useState<string | null>(null);

  // Áudio ativo baseado no ID estável (evita que a interface se perca com URIs voláteis)
  const activeAudio = React.useMemo(() => {
    if (!audios || !currentAudioId) return null;
    return audios.find((a) => a.id === currentAudioId) || null;
  }, [audios, currentAudioId]);

  async function handleTogglePlay() {
    // Se não há trilha no store, mas temos um áudio 'ativo' sugerido, selecionamos ele.
    if (!currentTrack) {
      if (activeAudio) {
        handleSelectTrack(activeAudio);
      }
      return;
    }

    // Lógica direta baseada no estado do store e player global
    try {
      if (isPlaying) {
        setPlaying(false);
      } else {
        setPlaying(true);
      }
    } catch (error) {
      console.error("[AmbientPlayer] Erro ao alternar play/pause:", error);
    }
  }

  async function handleSelectTrack(audio: IAmbientAudio | null) {
    // FECHA IMEDIATAMENTE - Resposta instantânea de UI
    bottomSheetRef.current?.dismiss();

    if (!audio) {
      setCurrentTrack(null, null);
      setPendingName(null);
      return;
    }

    if (audio.localUri) {
      setPendingName(null);
      setCurrentTrack(audio.localUri, audio.id);
    } else {
      try {
        // Feedback instantâneo no COMBO e no estado Global
        setDownloading(true);
        setCurrentTrack(null, audio.id); // Registra a intenção Imediatamente!
        setPendingName(`${audio.title}${COMPOSERS[audio.id] ? ` (${COMPOSERS[audio.id]})` : ""}`);

        // Baixa o áudio em segundo plano
        const localUri = await downloadAudio(audio.storagePath, audio.fileName);
        setCurrentTrack(localUri, audio.id);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar este áudio ambiente.");
      } finally {
        setDownloading(false);
        setPendingName(null);
      }
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const activeAudioName = pendingName
    ? pendingName
    : !currentAudioId
      ? "Selecione uma melodia"
      : activeAudio
        ? `${activeAudio.title}${COMPOSERS[activeAudio.id] ? ` (${COMPOSERS[activeAudio.id]})` : ""}`
        : "Silêncio";

  const activeAudioSubtitle =
    !pendingName && activeAudio && FRIENDLY_NAMES[activeAudio.id]
      ? FRIENDLY_NAMES[activeAudio.id]
      : null;

  const isCurrentPlaying =
    !isDownloading && currentTrack && activeAudio && isActuallyPlaying;

  if (variant === "minimal" || variant === "selector") {
    const isSelector = variant === "selector";
    return (
      <View style={styles.minimalContainer}>
        {!isSelector && <Text style={styles.minimalLabel}>Sintonizar Ambiente</Text>}
        <TouchableOpacity
          style={styles.minimalSelector}
          onPress={() => bottomSheetRef.current?.present()}
          activeOpacity={0.7}
        >
          <View style={styles.minimalSelectorContent}>
            <View style={styles.minimalIconContainer}>
              {isDownloading ? (
                <ActivityIndicator size="small" color={theme.colors.background} />
              ) : isCurrentPlaying ? (
                <Waves size={14} color={theme.colors.background} />
              ) : (
                <Music size={14} color={theme.colors.background} />
              )}
            </View>
            <View>
              <Text style={styles.minimalTrackName}>{activeAudioName}</Text>
              <Text style={styles.minimalActionLabel}>
                {isDownloading
                  ? "Baixando áudio..."
                  : activeAudioSubtitle
                    ? activeAudioSubtitle
                    : !isSelector && !currentAudioId
                      ? "Mergulhe em sintonia"
                      : "Toque para alterar"}
              </Text>
            </View>
          </View>

          <View style={styles.minimalRightSection}>
            {!isDownloading && !isSelector && currentTrack && (
              <TouchableOpacity
                onPress={handleTogglePlay}
                style={styles.minimalPlayButton}
              >
                {isCurrentPlaying ? (
                  <Pause
                    size={18}
                    color={theme.colors.primary}
                    fill={theme.colors.primary}
                  />
                ) : (
                  <Play
                    size={18}
                    color={theme.colors.primary}
                    fill={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            )}
            <ChevronDown size={18} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <AmbientSelectionBottomSheet
          ref={bottomSheetRef}
          audios={audios}
          onSelect={handleSelectTrack}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/placeholder.png")} // Placeholder imersivo
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      >
        <View style={styles.overlay}>
          <View style={styles.infoSection}>
            <Text style={styles.environmentLabel}>
              {activeAudioSubtitle ? activeAudioSubtitle.toUpperCase() : "AMBIENTE ATUAL"}
            </Text>
            <Text style={styles.environmentName}>{activeAudioName}</Text>
          </View>

          <View style={styles.controlsSection}>
            <TouchableOpacity
              style={styles.mainButton}
              onPress={handleTogglePlay}
              activeOpacity={0.8}
            >
              {isCurrentPlaying ? (
                <Pause
                  size={24}
                  color={theme.colors.onPrimary}
                  fill={theme.colors.onPrimary}
                />
              ) : (
                <Play
                  size={24}
                  color={theme.colors.onPrimary}
                  fill={theme.colors.onPrimary}
                />
              )}
              <Text style={styles.mainButtonText}>
                {isCurrentPlaying ? "EM SINTONIA" : "ENTRAR EM SINTONIA"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerTrigger}
              onPress={() => bottomSheetRef.current?.present()}
              activeOpacity={0.7}
            >
              <Text style={styles.pickerTriggerText}>Trocar Ambiente</Text>
              <ChevronDown size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <AmbientSelectionBottomSheet
        ref={bottomSheetRef}
        audios={audios}
        onSelect={handleSelectTrack}
      />
    </View>
  );
}
