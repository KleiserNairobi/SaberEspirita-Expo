import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Music, Waves, Moon, Play, Pause, Download } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useAmbientAudios } from "@/pages/pray/hooks/useAmbientAudios";
import { createStyles } from "./styles";
import { IAmbientAudio } from "@/types/ambientAudio";
import { getAudioLocalUri } from "@/services/firebase/ambientAudioService";
import { useAuth } from "@/stores/authStore";

// Mapeamento de ícones
const ICON_MAP = {
  music: Music,
  waves: Waves,
  moon: Moon,
} as const;

export function AmbientPlayer() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { isPlaying, currentTrack, setPlaying, setCurrentTrack } =
    useAmbientPlayerStore();

  // Carregar áudios do Firebase Storage com cache
  const { data: audios, isLoading, error } = useAmbientAudios();

  // Estado para rastrear qual música está sendo baixada (pelo ID/FileName)
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleTrackPress(audio: IAmbientAudio) {
    try {
      // 1. Se já tem URI local, comportamento normal (Play/Pause)
      if (audio.localUri) {
        if (currentTrack === audio.localUri && isPlaying) {
          // Pausar
          console.log("[AmbientPlayer] Pausando track atual");
          setPlaying(false);
        } else if (currentTrack === audio.localUri && !isPlaying) {
          // Retomar
          console.log("[AmbientPlayer] Retomando track pausada");
          setPlaying(true);
        } else {
          // Tocar nova (Em cache)
          console.log("[AmbientPlayer] Selecionando nova track:", audio.localUri);

          // Removemos o 'setDownloadingId' estético aqui. Se a música já existe em disco,
          // ela não deve simular engasgo visual de reload para não causar desconfiança do cache.
          setPlaying(true); // Engata o store
          setCurrentTrack(audio.localUri);
        }
        return;
      }

      // 2. Se NÃO tem URI, iniciar download real com Feedback Spinning Completo
      console.log("[AmbientPlayer] Áudio não em cache, baixando:", audio.title);
      setDownloadingId(audio.id);

      // Baixa o áudio
      const newLocalUri = await getAudioLocalUri(audio.storagePath);

      // Atualiza o cache do React Query para persistir que agora temos o arquivo localmente
      await queryClient.invalidateQueries({ queryKey: ["ambientAudios"] });

      // Toca o áudio baixado imediatamente
      setCurrentTrack(newLocalUri);
      setPlaying(true);
      // setDownloadingId(null) será limpo pelo Effect mestre
    } catch (error) {
      console.error("[AmbientPlayer] Erro ao reproduzir/baixar áudio:", error);
      setPlaying(false);
      setDownloadingId(null);
    }
  }

  // Loading state (apenas inicial)
  if (isLoading && !audios) {
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
    // ... manter lógica de erro
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
    // ... manter lógica de vazio
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
        const isCurrentTrack = currentTrack === trackUri && !!trackUri;
        const isTrackPlaying = isCurrentTrack && isPlaying;

        // Verifica se está baixando este item específico
        const isDownloading = downloadingId === audio.id;
        const isLast = index === audios.length - 1;

        // Se não tem localUri e não está baixando, mostramos ícone de Download (ou Play normal, mas indicando ação necessária?)
        // Vamos usar Play mesmo, mas sem disabled.

        return (
          <View key={audio.id}>
            <TouchableOpacity
              style={styles.trackRow}
              onPress={() => handleTrackPress(audio)}
              activeOpacity={0.7}
              disabled={isDownloading} // Desabilita apenas se estiver baixando ESTE
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
                ) : !audio.localUri ? (
                  // Indicador visual que vai baixar (Download icon ou Play com cor diferente?)
                  // O usuário pediu otimização, play direto é mais fluido.
                  // Mas um ícone de download seria informativo.
                  // Vou usar Play, mas talvez pudesse ser Download.
                  // Mantendo Play para simplicidade visual, o loading aparecerá ao clicar.
                  <Play size={18} color={theme.colors.primary} style={{ opacity: 0.6 }} />
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
