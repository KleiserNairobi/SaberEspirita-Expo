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
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward } from "lucide-react-native";

import { useMeditation } from "@/hooks/queries/useMeditations";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getCachedAudioUri } from "@/services/audio/audioCacheService";
import { createStyles } from "./styles";

const { width } = Dimensions.get("window");

export default function MeditationPlayerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const route = useRoute<RouteProp<MeditateStackParamList, "MeditationPlayer">>();
  const { id } = route.params;

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

  const player = useAudioPlayer(localAudioUri || "");
  const status = useAudioPlayerStatus(player);

  function handleGoBack() {
    navigation.goBack();
  }

  function togglePlayPause() {
    if (!player) return;

    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  function handleSeekForward() {
    if (!player) return;
    // status.currentTime e status.duration costumam ser lidos em SEGUNDOS na API native do expo-audio.
    // Vamos adicionar 15 segundos ao tempo atual
    const newTime = player.currentTime + 15;
    player.seekTo(newTime);
  }

  function handleSeekBackward() {
    if (!player) return;
    // Voltar 15 segundos
    const newTime = player.currentTime - 15;
    player.seekTo(Math.max(0, newTime));
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

        {/* Barra de Progresso Real (expo-audio) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(status.currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
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
            disabled={status.duration === 0}
          >
            {status.duration === 0 ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : player.playing ? (
              <Pause
                size={26}
                color={theme.colors.background}
                fill={theme.colors.background}
              />
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
