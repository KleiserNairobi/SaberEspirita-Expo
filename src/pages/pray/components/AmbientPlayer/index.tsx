import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Music, Waves, Moon, Play, Pause, Download } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useAmbientAudios } from "@/pages/pray/hooks/useAmbientAudios";
import { createStyles } from "./styles";

// Mapeamento de ícones
const ICON_MAP = {
  music: Music,
  waves: Waves,
  moon: Moon,
} as const;

export function AmbientPlayer() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const { isPlaying, currentTrack, setPlaying, setCurrentTrack } =
    useAmbientPlayerStore();

  // Carregar áudios do Firebase Storage com cache
  const { data: audios, isLoading, error } = useAmbientAudios();

  // Estado para rastrear qual música está sendo baixada
  const [downloadingTrack, setDownloadingTrack] = useState<string | null>(null);

  // Ref para evitar processar didJustFinish múltiplas vezes
  const hasProcessedFinish = useRef(false);

  // Player de áudio usando expo-audio
  const player = useAudioPlayer(currentTrack || "");

  // Monitorar status do player para detectar quando música termina
  const status = useAudioPlayerStatus(player);

  // Quando a track mudar, tocar automaticamente
  useEffect(() => {
    if (currentTrack && currentTrack.length > 0) {
      console.log("[AmbientPlayer] Track mudou para:", currentTrack);
      // Aguarda um pouco para o player ser recriado com o novo source
      const timer = setTimeout(() => {
        player.play();
        setPlaying(true);
        setDownloadingTrack(null); // Limpar estado de download quando começar a tocar
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentTrack]);

  // Sincronizar estado do player com o store usando status
  useEffect(() => {
    if (status.playing !== isPlaying) {
      setPlaying(status.playing);
    }
  }, [status.playing]);

  // Detectar quando música termina e tocar a próxima
  useEffect(() => {
    if (
      status.didJustFinish &&
      audios &&
      audios.length > 0 &&
      !hasProcessedFinish.current
    ) {
      console.log("[AmbientPlayer] Música terminou, tocando próxima...");
      hasProcessedFinish.current = true; // Marcar como processado

      const currentIndex = audios.findIndex((audio) => audio.localUri === currentTrack);

      if (currentIndex !== -1) {
        // Próximo índice (circular)
        const nextIndex = (currentIndex + 1) % audios.length;
        const nextTrack = audios[nextIndex];

        if (nextTrack.localUri) {
          console.log("[AmbientPlayer] Tocando próxima música:", nextTrack.title);
          setPlaying(false); // Resetar estado temporariamente
          setDownloadingTrack(nextTrack.localUri);
          setCurrentTrack(nextTrack.localUri);
        }
      }
    }

    // Resetar flag quando didJustFinish volta a false
    if (!status.didJustFinish && hasProcessedFinish.current) {
      hasProcessedFinish.current = false;
    }
  }, [status.didJustFinish, audios, currentTrack]);

  function handleTrackPress(trackUri: string) {
    try {
      if (currentTrack === trackUri && player.playing) {
        // Pausar se estiver tocando a mesma track
        console.log("[AmbientPlayer] Pausando track atual");
        player.pause();
        setPlaying(false);
      } else if (currentTrack === trackUri && !player.playing) {
        // Retomar se for a mesma track mas pausada
        console.log("[AmbientPlayer] Retomando track pausada");
        player.play();
        setPlaying(true);
      } else {
        // Tocar nova track - marcar como "baixando" se não estiver em cache
        console.log("[AmbientPlayer] Selecionando nova track:", trackUri);
        setDownloadingTrack(trackUri);
        setCurrentTrack(trackUri);
      }
    } catch (error) {
      console.error("[AmbientPlayer] Erro ao reproduzir áudio:", error);
      setPlaying(false);
      setDownloadingTrack(null);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            padding: 24,
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          },
        ]}
      >
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[styles.trackTitle, { flex: 0, textAlign: "center" }]}>
          Carregando músicas...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { padding: 24, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[styles.trackTitle, { flex: 0, textAlign: "center" }]}>
          Erro ao carregar músicas
        </Text>
      </View>
    );
  }

  // Empty state
  if (!audios || audios.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { padding: 24, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[styles.trackTitle, { flex: 0, textAlign: "center" }]}>
          Nenhuma música disponível
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {audios.map((audio, index) => {
        const IconComponent = ICON_MAP[audio.icon];
        const trackUri = audio.localUri || "";
        const isCurrentTrack = currentTrack === trackUri;
        const isTrackPlaying = isCurrentTrack && isPlaying;
        const isDownloading = downloadingTrack === trackUri;
        const isLast = index === audios.length - 1;

        return (
          <View key={audio.id}>
            <TouchableOpacity
              style={styles.trackRow}
              onPress={() => handleTrackPress(trackUri)}
              activeOpacity={0.7}
              disabled={!audio.localUri || isDownloading}
            >
              <View style={styles.trackInfo}>
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.trackTitle}>{audio.title}</Text>
              </View>

              <View style={styles.playButton}>
                {isDownloading ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : isTrackPlaying ? (
                  <Pause size={18} color={theme.colors.primary} />
                ) : (
                  <Play size={18} color={theme.colors.primary} />
                )}
              </View>
            </TouchableOpacity>

            {!isLast && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
}
