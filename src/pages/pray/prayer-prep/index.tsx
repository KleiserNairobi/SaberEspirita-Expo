import { useAppTheme } from "@/hooks/useAppTheme";
import { AmbientEnvironmentCard } from "@/pages/pray/components/AmbientEnvironmentCard";
import { usePrayer } from "@/pages/pray/hooks/usePrayer";
import { PrayStackParamList } from "@/routers/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Play, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "./styles";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";

type NavigationProp = NativeStackNavigationProp<PrayStackParamList, "PrayerPrep">;
type RouteParam = RouteProp<PrayStackParamList, "PrayerPrep">;

export function PrayerPrepScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParam>();
  const { id } = route.params;
  const { data: prayer, isLoading } = usePrayer(id);
  const { isDownloading, currentTrack, currentAudioId, setPlaying, setCurrentTrack } = useAmbientPlayerStore();

  // Extermina o som caso o usuário desista na Preparação e volte pra Home/Lista
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "GO_BACK" || e.data.action.type === "POP") {
        setPlaying(false);
        setCurrentTrack(null);
      }
    });
    return unsubscribe;
  }, [navigation, setPlaying, setCurrentTrack]);

  // ANIMAÇÕES NATIVAS
  const enterAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // 1. Entrada suave de baixo para cima
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 1000,
      delay: 100,
      useNativeDriver: true,
    }).start();

    // 2. Anéis Pulsando Lento (respiração)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [enterAnim, pulseAnim]);

  // Interpolações da Aura
  const ringOuterStyle = {
    opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.4] }),
    transform: [
      { scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] }) },
    ],
  };
  const ringMiddleStyle = {
    opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] }),
    transform: [
      { scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.1] }) },
    ],
  };
  const ringInnerStyle = {
    opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] }),
    transform: [
      { scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.05] }) },
    ],
  };

  // Interpolação de entrada (Fade-in e Slide-up)
  const contentStyle = {
    opacity: enterAnim,
    transform: [
      {
        translateY: enterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
  };

  function handleStartPrayer() {
    // Se tem um áudio selecionado (ID presente), mas ainda não tem trilha local (URL ausente)
    // e está baixando, não permitimos avançar para não quebrar a imersão na próxima tela.
    if (currentAudioId && !currentTrack && isDownloading) {
      return;
    }

    setPlaying(true); // Auto-Play garantido e forçado se houvesse track 
    navigation.navigate("Prayer", { id });
  }

  if (isLoading || !prayer) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Botão Voltar */}
          <View style={styles.headerSide}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Ícone Central com Anéis Animados */}
          <View style={styles.iconRingsContainer}>
            <Animated.View style={[styles.ringOuter, ringOuterStyle]} />
            <Animated.View style={[styles.ringMiddle, ringMiddleStyle]} />
            <Animated.View style={[styles.ringInner, ringInnerStyle]} />
            <View style={styles.iconLargeContainer}>
              <Sparkles size={40} color={theme.colors.background} />
            </View>
          </View>

          {/* Espaço para Equilíbrio */}
          <View style={styles.headerSide} />
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={contentStyle}
      >
        <View style={styles.messageContainer}>
          <Text style={styles.title}>{prayer.title}</Text>
          <Text style={styles.subtitle}>
            {`Aquiete o coração e respire fundo. Se desejar,\n escolha uma melodia para elevar sua prece.`}
          </Text>
        </View>

        <View style={styles.ambientContainer}>
          <AmbientEnvironmentCard variant="selector" />
        </View>
      </Animated.ScrollView>

      <View
        style={[
          styles.footerContainer,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 28,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.startButton, (isDownloading && currentAudioId) && { opacity: 0.6 }]}
          onPress={handleStartPrayer}
          activeOpacity={0.8}
          disabled={isDownloading && !!currentAudioId}
        >
          {isDownloading && currentAudioId ? (
            <ActivityIndicator 
              color={theme.colors.background} 
              size="small" 
              style={{ marginRight: 10 }} 
            />
          ) : (
            <Play
              size={20}
              color={theme.colors.background}
              fill={theme.colors.background}
            />
          )}
          <Text style={styles.startButtonText}>
            {isDownloading && currentAudioId ? "Preparando Melodia..." : "Iniciar Prece"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
