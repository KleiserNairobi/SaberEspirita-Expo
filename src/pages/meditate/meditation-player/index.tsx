import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MeditateStackParamList } from "@/routers/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { useMeditation } from "@/hooks/queries/useMeditations";
import { useAppTheme } from "@/hooks/useAppTheme";
// Removemos useAmbientPlayerStore para evitar colisão com a oração
import { getCachedAudioUri } from "@/services/audio/audioCacheService";
import { createStyles } from "./styles";

import { logMeditationUsage } from "@/services/firebase/meditationService";
import { useAuth } from "@/stores/authStore";

const { width } = Dimensions.get("window");

export default function MeditationPlayerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const route = useRoute<RouteProp<MeditateStackParamList, "MeditationPlayer">>();
  const { id } = route.params;
  const { user } = useAuth();
  const hasLogged = React.useRef(false);

  const { data: meditation, isLoading } = useMeditation(id);
  const [localAudioUri, setLocalAudioUri] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocalAudio() {
      if (meditation?.audioUrl) {
        try {
          const uri = await getCachedAudioUri(meditation.audioUrl);
          setLocalAudioUri(uri);
        } catch (error) {
          console.error("Failed to cache audio:", error);
          setLocalAudioUri(meditation.audioUrl); // Fallback to remote if cache fails
        }
      }
    }
    fetchLocalAudio();
  }, [meditation?.audioUrl]);

  // --- TRACK PLAYER STATE LOCAL (DESACOLPADO DA ORAÇAO) ---
  const { position, duration } = useProgress(200);
  const [isPlaying, setPlaying] = useState(false);

  // O isReady agora é simples: se temos duração ou se o player diz que está tocando
  const isReady = duration > 0 || isPlaying;

  const playbackState = usePlaybackState();

  useEffect(() => {
    if (playbackState.state === State.Playing && !isPlaying) setPlaying(true);
    else if (playbackState.state === State.Paused && isPlaying) setPlaying(false);
    else if (playbackState.state === State.Ended && isPlaying) {
      setPlaying(false);
      TrackPlayer.pause();
    }
  }, [playbackState.state]);

  // Track local reference para lock de Race Condition espelhando a solidez do GlobalAmbientPlayer
  // Carrega e Sobe o Áudio para o Serviço de Background Nativo
  useEffect(() => {
    let isActive = true;

    async function setupAndLoad() {
      if (localAudioUri && meditation) {
        try {
          // Em vez de lutar com variáveis do React (que se confundem nos Unmounts e Fast Refreshes),
          // Perguntamos DIRETAMENTE para a Engine Nativa do iOS o que ela está tocando!
          const currentNativeTrackIndex = await TrackPlayer.getActiveTrackIndex();
          let currentNativeTrack = null;
          if (currentNativeTrackIndex !== undefined && currentNativeTrackIndex !== null) {
            currentNativeTrack = await TrackPlayer.getTrack(currentNativeTrackIndex);
          }

          // Se a música atual da Engine C++ JÁ É A MEDITAÇÃO... não injetamos uma nova Track na Fila.
          // SÓ TOCAMOS! Isso fulmina o erro de duplicar/picotar.
          if (currentNativeTrack?.id === meditation.id) {
            const currentState = await TrackPlayer.getPlaybackState();
            if (currentState.state !== State.Playing) {
              await TrackPlayer.play();
            }
            setPlaying(true);
            return;
          }

          // Se for outra música (ou fila vazia), limpamos a fila nativa e começamos 100% fresco do Zero
          await TrackPlayer.reset();

          if (!isActive) return;
          await new Promise((resolve) => setTimeout(resolve, 300)); // Aumentado para 300ms para maior estabilidade no iOS
          if (!isActive) return;

          await TrackPlayer.add({
            id: meditation.id,
            url: localAudioUri,
            title: meditation.title,
            artist: meditation.author,
            artwork: meditation.imageUrl,
          });

          if (!isActive) return;
          // Garantir volume máximo para meditações guiadas
          await TrackPlayer.setVolume(1.0);
          if (!isActive) return;
          await TrackPlayer.setRepeatMode(RepeatMode.Off);
          if (!isActive) return;

          await TrackPlayer.play();
          setPlaying(true);
        } catch (err) {
          console.error(
            "[MeditationPlayer] Erro crítico ao carregar/iniciar o player:",
            err
          );
          // Ignorar silencias do setup para impedir trava
        }
      }
    }
    setupAndLoad();

    return () => {
      // KILL-SWITCH LOCAL
      isActive = false;
      setPlaying(false);

      TrackPlayer.pause()
        .catch(() => {})
        .finally(() => {
          // Removemos o reset do finally pois uma das origens de "picote" são resets concorrentes desengatando no IOS Background Audio e forçando crash de "Removed Instance" no meio do Playback da próxima mount
        });
    };
  }, [localAudioUri, meditation?.id]);

  useEffect(() => {
    // Log target: only when the audio is actually playing, avoiding multiple logs per session
    if (isPlaying && meditation && !hasLogged.current) {
      logMeditationUsage(meditation.id, user?.uid || "guest", "guided");
      hasLogged.current = true;
    }
  }, [isPlaying, meditation, user]);

  function handleGoBack() {
    navigation.goBack();
  }

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
      setPlaying(false);
    } else {
      await TrackPlayer.play();
      setPlaying(true);
    }
  };

  async function handleSeekForward() {
    if (!isReady) return;
    const newTime = position + 15;
    await TrackPlayer.seekTo(Math.min(newTime, duration));
  }

  async function handleSeekBackward() {
    if (!isReady) return;
    const newTime = position - 15;
    await TrackPlayer.seekTo(Math.max(0, newTime));
  }

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    // O valor já está em segundos inteiros ou fracionados
    const totalSeconds = Math.floor(seconds);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (isLoading || !meditation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header Padronizado */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Meditação Guiada</Text>
      </View>

      <View style={styles.content}>
        {/* Cover Art / Avatar da Meditação */}
        <View style={styles.coverArtContainer}>
          <Image
            source={{ uri: meditation.imageUrl }}
            style={styles.coverArt}
            contentFit="cover"
            transition={500}
            cachePolicy="memory-disk"
            placeholder={require("@/assets/images/placeholder.png")}
            placeholderContentFit="cover"
          />
        </View>

        {/* Título e Autor */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {meditation.title}
          </Text>
          <Text style={styles.author}>{meditation.author}</Text>
        </View>

        {/* Barra de Progresso Real (Track Player) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controles de Áudio Reais */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={handleSeekBackward}
            activeOpacity={0.7}
          >
            <SkipBack size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isPlaying ? (
              <Pause
                size={26}
                color={theme.colors.background}
                fill={theme.colors.background}
              />
            ) : !isReady ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <Play
                size={26}
                color={theme.colors.background}
                fill={theme.colors.background}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={handleSeekForward}
            activeOpacity={0.7}
          >
            <SkipForward size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
