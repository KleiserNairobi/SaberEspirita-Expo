import React, { useEffect, useState } from "react";
import { ActivityIndicator, Share, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MeditateStackParamList } from "@/routers/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Clock, Headphones, Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { HeroHeader } from "@/components/HeroHeader";
import { ContentSheet } from "@/components/ContentSheet";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/utils/constants";

import { useMeditation } from "@/hooks/queries/useMeditations";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getCachedAudioUri } from "@/services/audio/audioCacheService";
import { logMeditationUsage } from "@/services/firebase/meditationService";
import { useAuth } from "@/stores/authStore";
import { useMeditationPlayerStore } from "@/stores/meditationPlayerStore";
import { createStyles } from "./styles";

export default function MeditationPlayerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const route = useRoute<RouteProp<MeditateStackParamList, "MeditationPlayer">>();
  const { id } = route.params;
  const { user } = useAuth();
  const hasLogged = React.useRef(false);

  // --- ESTADO GLOBAL: meditação em memória (vinda da listagem) ---
  // Evita re-fetch do Firestore quando os dados já estão disponíveis.
  const cachedMeditation = useMeditationPlayerStore((s) => s.currentMeditation);

  // Só aciona o fetch se não temos o objeto em memória OU se o id não bate
  const shouldFetch = !cachedMeditation || cachedMeditation.id !== id;
  const { data: fetchedMeditation, isLoading } = useMeditation(shouldFetch ? id : "");

  // Resolve a fonte da meditação: store (instantâneo) > fetch (fallback)
  const meditation = shouldFetch ? fetchedMeditation : cachedMeditation;

  // --- CACHE LOCAL DE ÁUDIO (FileSystem) ---
  const [localAudioUri, setLocalAudioUri] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocalAudio() {
      if (meditation?.audioUrl) {
        try {
          const uri = await getCachedAudioUri(meditation.audioUrl);
          setLocalAudioUri(uri);
        } catch (error) {
          console.error(
            "[MeditationPlayer] Falha ao obter URI de áudio em cache:",
            error
          );
          setLocalAudioUri(meditation.audioUrl); // fallback para URL remota
        }
      }
    }
    fetchLocalAudio();
  }, [meditation?.audioUrl]);

  // --- ESTADO DO TRACK PLAYER (desacoplado do Ore) ---
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
  // position e duration são atualizados pelo timer nativo a cada 500ms.
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
      // 1. pause(): seta playWhenReady=false no ExoPlayer/AVPlayer.
      //    OBRIGATÓRIO antes do seekTo(0) — sem isso, o player reinicia
      //    automaticamente após o seek pois playWhenReady ainda é true.
      // 2. seekTo(0): reseta posição para o início sem zerar duration nem limpar fila.
      TrackPlayer.pause()
        .catch(() => {})
        .finally(() => {
          TrackPlayer.seekTo(0).catch(() => {});
        });
    } else if (position > 0 && position < effectiveDuration - 1) {
      // Reprodução em curso: libera o lock para permitir nova detecção
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
  // Lógica de lock para evitar race conditions em Fast Refresh / remounts
  useEffect(() => {
    let isActive = true;

    async function setupAndLoad() {
      if (localAudioUri && meditation) {
        try {
          // Pergunta diretamente ao engine nativo o que está tocando
          const currentNativeTrackIndex = await TrackPlayer.getActiveTrackIndex();
          let currentNativeTrack = null;
          if (currentNativeTrackIndex !== undefined && currentNativeTrackIndex !== null) {
            currentNativeTrack = await TrackPlayer.getTrack(currentNativeTrackIndex);
          }

          // Se a meditação já está carregada na engine nativa, apenas dá play (sem re-injeção)
          if (currentNativeTrack?.id === meditation.id) {
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
            id: meditation.id,
            url: localAudioUri,
            title: meditation.title,
            artist: meditation.author,
            artwork: meditation.imageUrl,
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
            "[MeditationPlayer] Erro crítico ao carregar/iniciar o player:",
            err
          );
        }
      }
    }

    setupAndLoad();

    return () => {
      // KILL-SWITCH LOCAL: cancela operações assíncronas pendentes
      isActive = false;
      setPlaying(false);

      // stop() para o áudio e reseta posição para 0, mantendo a fila inteira.
      // É mais seguro que reset() no cleanup do iOS (evita "Removed Instance").
      TrackPlayer.stop().catch(() => {});
    };
  }, [localAudioUri, meditation?.id]);

  // --- LOG DE USO (analytics) ---
  useEffect(() => {
    if (isPlaying && meditation && !hasLogged.current) {
      logMeditationUsage({
        userId: user?.uid || "guest",
        itemId: meditation.id,
        itemTitle: meditation.title,
        contentType: "guided_meditation",
      });
      hasLogged.current = true;
    }
  }, [isPlaying, meditation, user]);

  // --- HANDLERS ---
  function handleGoBack() {
    navigation.goBack();
  }

  async function handleShare() {
    if (!meditation) return;
    try {
      const parts = [`Confira a meditação guiada "${meditation.title}" no Saber Espírita!`];
      if (meditation.description) {
        parts.push(`\nSobre esta Meditação:\n${meditation.description}`);
      }
      parts.push("\nBaixe o app e ouça agora mesmo:");
      parts.push(`🤖 Android: ${PLAY_STORE_URL}`);
      parts.push(`🍎 iOS: ${APP_STORE_URL}`);

      await Share.share({
        message: parts.join("\n"),
      });
    } catch (error) {
      console.error("Erro ao compartilhar meditação:", error);
    }
  }

  const togglePlayPause = async () => {
    // stop() reseta posição para 0 e mantém fila — um play() após stop()
    // sempre reinicia do começo, sem necessidade de tratamento especial.
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
    // Usa lastKnownDuration como fallback: após pause()+seekTo(0), duration pode ser
    // momentaneamente 0 no useProgress, causando Math.min(newTime, 0) = 0 (bug de seek).
    const effectiveDuration = duration > 0 ? duration : lastKnownDuration.current;
    const newTime = position + 15;
    // Limita a 1.5s antes do fim para não disparar o detector de fim acidentalmente
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
  if ((isLoading && shouldFetch) || !meditation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const effectiveDuration = duration > 0 ? duration : lastKnownDuration.current;

  return (
    <View style={styles.safeArea}>
      <HeroHeader
        imageUrl={meditation.imageUrl}
        title={meditation.title}
        subtitle={meditation.author}
        onBack={handleGoBack}
        onShare={handleShare}
      />

      <ContentSheet contentContainerStyle={styles.contentSheetScroll}>
        {/* Descrição */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Sobre esta Meditação</Text>

          {/* Metadados leves */}
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Clock size={12} color={theme.colors.muted} />
              <Text style={styles.metadataText}>{formatTime(effectiveDuration)}</Text>
            </View>
            <Text style={styles.metadataSeparator}>•</Text>
            <View style={styles.metadataItem}>
              <Headphones size={12} color={theme.colors.muted} />
              <Text style={styles.metadataText}>Meditação Guiada</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>
            {meditation.description || "Sem descrição disponível."}
          </Text>
        </View>

        {/* Player de Áudio */}
        <View style={styles.playerContainer}>
          {/* Barra de Progresso Real */}
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
              <Text style={styles.timeText}>{formatTime(effectiveDuration)}</Text>
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
      </ContentSheet>
    </View>
  );
}
