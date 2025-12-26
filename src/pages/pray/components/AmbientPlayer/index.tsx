import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAudioPlayer } from "expo-audio";
import { Music, Waves, Play, Pause } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { createStyles } from "./styles";

// URLs de teste funcionais - Áudios livres para meditação
// Fonte: Bensound (royalty-free) - arquivos MP3 diretos
// TODO: Substituir por URLs do Firebase Storage em produção
const AMBIENT_TRACKS = [
  {
    id: "music",
    title: "Música Suave",
    icon: Music,
    url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
  },
  {
    id: "nature",
    title: "Sons da Natureza",
    icon: Waves,
    url: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
  },
];

export function AmbientPlayer() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const { isPlaying, currentTrack, setPlaying, setCurrentTrack } =
    useAmbientPlayerStore();

  // Player de áudio usando expo-audio
  const player = useAudioPlayer(currentTrack || "");

  // Quando a track mudar, tocar automaticamente
  useEffect(() => {
    if (currentTrack && currentTrack.length > 0) {
      console.log("Track mudou para:", currentTrack);
      // Aguarda um pouco para o player ser recriado com o novo source
      const timer = setTimeout(() => {
        player.play();
        setPlaying(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentTrack]);

  // Sincronizar estado do player com o store
  useEffect(() => {
    if (player.playing !== isPlaying) {
      setPlaying(player.playing);
    }
  }, [player.playing]);

  function handleTrackPress(trackUrl: string) {
    try {
      if (currentTrack === trackUrl && player.playing) {
        // Pausar se estiver tocando a mesma track
        console.log("Pausando track atual");
        player.pause();
        setPlaying(false);
      } else if (currentTrack === trackUrl && !player.playing) {
        // Retomar se for a mesma track mas pausada
        console.log("Retomando track pausada");
        player.play();
        setPlaying(true);
      } else {
        // Tocar nova track - apenas atualiza o estado, o useEffect cuida do resto
        console.log("Selecionando nova track:", trackUrl);
        setCurrentTrack(trackUrl);
      }
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
      setPlaying(false);
    }
  }

  return (
    <View style={styles.container}>
      {AMBIENT_TRACKS.map((track, index) => {
        const IconComponent = track.icon;
        const isCurrentTrack = currentTrack === track.url;
        const isTrackPlaying = isCurrentTrack && isPlaying;
        const isLast = index === AMBIENT_TRACKS.length - 1;

        return (
          <View key={track.id}>
            <TouchableOpacity
              style={styles.trackRow}
              onPress={() => handleTrackPress(track.url)}
              activeOpacity={0.7}
            >
              <View style={styles.trackInfo}>
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.trackTitle}>{track.title}</Text>
              </View>

              <View style={styles.playButton}>
                {isTrackPlaying ? (
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
