import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppStackParamList } from "@/routers/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { usePodcast } from "@/hooks/queries/usePodcasts";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getCachedAudioUri } from "@/services/audio/audioCacheService";
import { logPodcastUsage } from "@/services/firebase/podcastService";
import { useAuth } from "@/stores/authStore";
import { usePodcastPlayerStore } from "@/stores/podcastPlayerStore";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function PodcastPlayerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<AppStackParamList, "PodcastPlayer">>();
  const { id } = route.params;
  const { user } = useAuth();
  const hasLogged = React.useRef(false);

  // --- ESTADO GLOBAL: podcast em memória (vindo da listagem) ---
  // Evita re-fetch do Firestore quando os dados já estão disponíveis.
  const cachedPodcast = usePodcastPlayerStore((s) => s.currentPodcast);

  // Só aciona o fetch se não temos o objeto em memória OU se o id não bate
  const shouldFetch = !cachedPodcast || cachedPodcast.id !== id;
  const { data: fetchedPodcast, isLoading } = usePodcast(shouldFetch ? id : "");

  // Resolve a fonte do podcast: store (instantâneo) > fetch (fallback)
  const podcast = shouldFetch ? fetchedPodcast : cachedPodcast;

  // --- CACHE LOCAL DE ÁUDIO (FileSystem) ---
  const [localAudioUri, setLocalAudioUri] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocalAudio() {
      if (podcast?.audioUrl) {
        try {
          const uri = await getCachedAudioUri(podcast.audioUrl);
          setLocalAudioUri(uri);
        } catch (error) {
          console.error(
            "[PodcastPlayer] Falha ao obter URI de áudio em cache:",
            error
          );
          setLocalAudioUri(podcast.audioUrl); // fallback para URL remota
        }
      }
    }
    fetchLocalAudio();
  }, [podcast?.audioUrl]);

  // --- ESTADO DO TRACK PLAYER ---
  const { position, duration } = useProgress(500);
  const [isPlaying, setPlaying] = useState(false);

  // Preserva a última duração conhecida para evitar loading após fim do áudio.
  const lastKnownDuration = React.useRef<number>(0);
  React.useEffect(() => {
    if (duration > 0) lastKnownDuration.current = duration;
  }, [duration]);

  // isReady: true quando temos duração (atual ou cacheada) ou o player já toca
  const isReady = duration > 0 || lastKnownDuration.current > 0 || isPlaying;

  const playbackState = usePlaybackState();

  // Ref para evitar loop: resetar apenas uma vez por reprodução
  const hasResetOnEnd = React.useRef(false);

  // --- DETECÇÃO DE FIM VIA useProgress (cross-platform garantido) ---
  // É a única fonte verdadeiramente confiável em iOS e Android.
  // State.Ended e PlaybackQueueEnded são inconsistentes no Android (ExoPlayer).
  useEffect(() => {
    const effectiveDuration = duration > 0 ? duration : lastKnownDuration.current;
    if (
      effectiveDuration > 0 &&
      position > 0 &&
      position >= effectiveDuration - 0.8 && // margem de 800ms antes do fim exato
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
  }, [position, duration]);

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
      if (localAudioUri && podcast) {
        try {
          const currentNativeTrackIndex = await TrackPlayer.getActiveTrackIndex();
          let currentNativeTrack = null;
          if (currentNativeTrackIndex !== undefined && currentNativeTrackIndex !== null) {
            currentNativeTrack = await TrackPlayer.getTrack(currentNativeTrackIndex);
          }

          // Se o podcast já está carregado na engine nativa, apenas dá play
          if (currentNativeTrack?.id === podcast.id) {
            const currentState = await TrackPlayer.getPlaybackState();
            if (currentState.state !== State.Playing) {
              await TrackPlayer.play();
            }
            setPlaying(true);
            return;
          }

          // Fila diferente ou vazia: reset completo e carregamento fresco
          await TrackPlayer.reset();

          if (!isActive) return;
          // Aguarda 300ms para maior estabilidade no iOS (evita "Removed Instance")
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (!isActive) return;

          await TrackPlayer.add({
            id: podcast.id,
            url: localAudioUri,
            title: podcast.title,
            artist: podcast.author,
            artwork: podcast.imageUrl,
          });

          if (!isActive) return;
          await TrackPlayer.setVolume(1.0);
          if (!isActive) return;
          await TrackPlayer.setRepeatMode(RepeatMode.Off);
          if (!isActive) return;

          await TrackPlayer.play();
          setPlaying(true);
        } catch (err) {
          console.error(
            "[PodcastPlayer] Erro crítico ao carregar/iniciar o player:",
            err
          );
        }
      }
    }

    setupAndLoad();

    return () => {
      isActive = false;
      setPlaying(false);
      TrackPlayer.stop().catch(() => {});
    };
  }, [localAudioUri, podcast?.id]);

  // --- LOG DE USO (analytics) ---
  useEffect(() => {
    if (isPlaying && podcast && !hasLogged.current) {
      logPodcastUsage({
        userId: user?.uid || "guest",
        itemId: podcast.id,
        itemTitle: podcast.title,
      });
      hasLogged.current = true;
    }
  }, [isPlaying, podcast, user]);

  // --- HANDLERS ---
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
    const effectiveDuration = duration > 0 ? duration : lastKnownDuration.current;
    const newTime = position + 15;
    await TrackPlayer.seekTo(Math.min(newTime, Math.max(0, effectiveDuration - 1.5)));
  }

  async function handleSeekBackward() {
    if (!isReady) return;
    const newTime = position - 15;
    await TrackPlayer.seekTo(Math.max(0, newTime));
  }

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const totalSeconds = Math.floor(seconds);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // --- ESTADOS DE CARREGAMENTO ---
  if ((isLoading && shouldFetch) || !podcast) {
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
        <Text style={styles.navTitle}>Podcast</Text>
      </View>

      <View style={styles.content}>
        {/* Cover Art do Podcast */}
        <View style={styles.coverArtContainer}>
          <Image
            source={{ uri: podcast.imageUrl }}
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
            {podcast.title}
          </Text>
          <Text style={styles.author}>{podcast.author}</Text>
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

        {/* Controles de Áudio */}
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
