import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Pause, Music } from "lucide-react-native";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

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
    currentTrack,
    setPlaying, 
  } = useAmbientPlayerStore();

  const { position, duration } = useProgress(500);
  const playbackState = usePlaybackState();

  const lastKnownDuration = useRef<number>(0);
  const hasResetOnEnd = useRef(false);

  const activeAudio = audios?.find(a => a.id === currentAudioId);
  const trackTitle = activeAudio ? activeAudio.title : "Melodia Ambiente";
  const composer = currentAudioId ? COMPOSERS[currentAudioId] : null;

  useEffect(() => {
    if (duration > 0) lastKnownDuration.current = duration;
  }, [duration]);

  // --- DETECÇÃO DE FIM VIA useProgress (cross-platform) ---
  useEffect(() => {
    const effectiveDuration = duration > 0 ? duration : lastKnownDuration.current;
    if (
      effectiveDuration > 0 &&
      position > 0 &&
      position >= effectiveDuration - 0.8 &&
      !hasResetOnEnd.current
    ) {
      hasResetOnEnd.current = true;
      setPlaying(false);
      TrackPlayer.pause()
        .catch(() => {})
        .finally(() => {
          TrackPlayer.seekTo(0).catch(() => {});
        });
    } else if (position > 0 && position < effectiveDuration - 1) {
      hasResetOnEnd.current = false;
    }
  }, [position, duration, setPlaying]);

  // Sincroniza Play/Pause e estados externos (hardware, notificação)
  useEffect(() => {
    if (playbackState.state === State.Playing && !isPlaying && !hasResetOnEnd.current) {
      setPlaying(true);
    } else if (
      (playbackState.state === State.Paused || playbackState.state === State.Stopped) &&
      isPlaying
    ) {
      setPlaying(false);
    }
  }, [playbackState.state]);

  // --- SETUP E CARREGAMENTO DO ÁUDIO ---
  useEffect(() => {
    let isActive = true;

    async function setupAndLoad() {
      if (currentTrack && currentAudioId) {
        try {
          const currentNativeTrackIndex = await TrackPlayer.getActiveTrackIndex();
          let currentNativeTrack = null;
          if (currentNativeTrackIndex !== undefined && currentNativeTrackIndex !== null) {
            currentNativeTrack = await TrackPlayer.getTrack(currentNativeTrackIndex);
          }

          if (currentNativeTrack?.id === currentAudioId) {
            const currentState = await TrackPlayer.getPlaybackState();
            if (currentState.state !== State.Playing) {
              await TrackPlayer.play();
            }
            setPlaying(true);
            return;
          }

          await TrackPlayer.reset();

          if (!isActive) return;
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (!isActive) return;

          await TrackPlayer.add({
            id: currentAudioId,
            url: currentTrack,
            title: trackTitle,
            artist: composer || "Oração",
          });

          if (!isActive) return;
          await TrackPlayer.setVolume(1.0);
          if (!isActive) return;
          await TrackPlayer.setRepeatMode(RepeatMode.Off);
          if (!isActive) return;

          await TrackPlayer.play();
          setPlaying(true);
        } catch (err) {
          console.error("[AmbientPlayerControls] Erro crítico ao carregar/iniciar o player:", err);
        }
      }
    }

    setupAndLoad();

    return () => {
      isActive = false;
      setPlaying(false);
      TrackPlayer.stop().catch(() => {});
    };
  }, [currentTrack, currentAudioId]);

  if (!currentAudioId) return null;

  async function handleTogglePlay() {
    if (isPlaying) {
      await TrackPlayer.pause();
      setPlaying(false);
    } else {
      await TrackPlayer.play();
      setPlaying(true);
    }
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
