import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { BookOpen, Share2, User, Volume2, VolumeX } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ContentSheet } from "@/components/ContentSheet";
import { HeroHeader } from "@/components/HeroHeader";
import { ReaderPreferencesBottomSheet } from "@/components/ReaderPreferencesBottomSheet";
import { useAppTheme } from "@/hooks/useAppTheme";
import { OnboardingCompletionPromptModal } from "@/pages/onboarding/components/OnboardingCompletionPromptModal";
import { MeditateStackParamList } from "@/routers/types";
import { logEvent } from "@/services/analytics/analyticsService";
import { statsApiService } from "@/services/api/statsApiService";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useReaderPreferencesStore } from "@/stores/readerPreferencesStore";
import { IDailyWisdom } from "@/types/dailyWisdom";
import { SHARE_FOOTER } from "@/utils/constants";
import { isSpeaking, speakText, stopSpeaking } from "@/utils/textToSpeech";

import { useTodayWisdom, useWisdomById } from "../hooks/useDailyWisdom";
import { createStyles } from "./styles";

// Artes espirituais dos dias da semana como fallback acolhedor caso a lição não tenha URL remota
const DAY_BACKGROUNDS = [
  require("@/assets/images/meditate/domingo.png"),
  require("@/assets/images/meditate/segunda.png"),
  require("@/assets/images/meditate/terca.png"),
  require("@/assets/images/meditate/quarta.png"),
  require("@/assets/images/meditate/quinta.png"),
  require("@/assets/images/meditate/sexta.png"),
  require("@/assets/images/meditate/sabado.png"),
];

type DailyWisdomScreenRouteProp = RouteProp<MeditateStackParamList, "DailyWisdom">;

export function DailyWisdomScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const route = useRoute<DailyWisdomScreenRouteProp>();

  const paramId = route.params?.id;
  const paramWisdom = route.params?.wisdom;

  const { getFontSize, getLineHeight } = useReaderPreferencesStore();

  const readerPreferencesRef = useRef<BottomSheetModal>(null);
  const hasLogged = useRef(false);

  const { answers } = useOnboardingStore();
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isInitialImageReady, setIsInitialImageReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { data: todayWisdom, isLoading: loadingToday } = useTodayWisdom();
  const { data: idWisdom, isLoading: loadingId } = useWisdomById(paramId);

  // Define a sabedoria ativa a ser consumida
  const activeWisdom: IDailyWisdom | null =
    paramWisdom || (paramId ? idWisdom || null : todayWisdom || null);

  const dayOfWeek = new Date().getDay();
  const coverImage = activeWisdom?.imageUrl || DAY_BACKGROUNDS[dayOfWeek];

  // Sincronização inicial: aguarda a imagem estar no cache antes de revelar o conteúdo
  useEffect(() => {
    let isMounted = true;

    async function checkInitialImage() {
      if (!activeWisdom) return;

      const imgUrl = activeWisdom.imageUrl;
      if (imgUrl && typeof imgUrl === "string" && imgUrl.startsWith("http")) {
        try {
          await Promise.race([
            Image.prefetch(imgUrl),
            new Promise((resolve) => setTimeout(resolve, 1200)),
          ]);
        } catch {
          // Continua mesmo se offline ou falha de rede
        }
      }

      if (isMounted) {
        setIsInitialImageReady(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    }

    checkInitialImage();

    return () => {
      isMounted = false;
    };
  }, [activeWisdom?.id, activeWisdom?.imageUrl]);

  const handleOpenPreferences = () => {
    readerPreferencesRef.current?.present();
  };

  async function handleShare() {
    if (!activeWisdom) return;
    try {
      const sanitizedQuote = activeWisdom.openingQuote
        ? `"${activeWisdom.openingQuote.replace(/\\n/g, "\n")}"\n\n`
        : "";
      const sanitizedContent = activeWisdom.content
        ? activeWisdom.content.replace(/\\n/g, "\n")
        : "";
      const message = `${activeWisdom.title}\n${sanitizedQuote}${sanitizedContent}\n\n— ${
        activeWisdom.author
      }${activeWisdom.bookReference ? ` (${activeWisdom.bookReference})` : ""}${SHARE_FOOTER}`;

      await Share.share({ message });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar a mensagem");
    }
  }

  async function handleNarrate() {
    if (!activeWisdom) return;

    try {
      const speaking = await isSpeaking();

      if (speaking || isNarrating) {
        await stopSpeaking();
        setIsNarrating(false);
      } else {
        setIsNarrating(true);
        const sanitizedQuote = activeWisdom.openingQuote
          ? activeWisdom.openingQuote.replace(/\\n/g, " ")
          : "";
        const sanitizedContent = activeWisdom.content
          ? activeWisdom.content.replace(/\\n/g, " ")
          : "";
        const textToSpeak = `${activeWisdom.title}. ${sanitizedQuote}. ${sanitizedContent}. ${activeWisdom.author}.`;

        await speakText(
          textToSpeak,
          undefined,
          () => setIsNarrating(false),
          () => setIsNarrating(false)
        );
      }
    } catch (error) {
      setIsNarrating(false);
      Alert.alert("Erro", "Não foi possível narrar a mensagem");
    }
  }

  function handleFinishReading() {
    if (isNarrating) {
      stopSpeaking();
      setIsNarrating(false);
    }

    if (activeWisdom && !hasLogged.current) {
      logEvent("daily_wisdom_read", {
        id: activeWisdom.id,
        title: activeWisdom.title,
        moment: activeWisdom.moment,
      });

      statsApiService.logEvent({
        eventName: "daily_wisdom_read",
        category: "daily_wisdom",
        label: activeWisdom.title,
        id: activeWisdom.id,
        title: activeWisdom.title,
        moment: activeWisdom.moment,
      });
      hasLogged.current = true;
    }

    // Se o usuário ainda não respondeu ao convite de notificação diária, abre o modal contextual
    if (!answers.notificationTime) {
      setShowPromptModal(true);
      return;
    }

    proceedNavigationAfterReading();
  }

  function proceedNavigationAfterReading() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MeditateHome");
    }
  }

  const isDataLoading = (paramId ? loadingId : loadingToday) && !activeWisdom;
  const showInitialLoading =
    isDataLoading || (!isInitialImageReady && !!activeWisdom?.imageUrl);

  if (showInitialLoading) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Buscando Gotas de Sabedoria...</Text>
        </View>
      </View>
    );
  }

  const sanitizedOpeningQuote = activeWisdom?.openingQuote?.replace(/\\n/g, "\n");
  const sanitizedContent = activeWisdom?.content?.replace(/\\n/g, "\n");

  return (
    <View style={styles.safeArea}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        {/* 1. Header com Imagem de Capa e Ações no Topo Direito: (Narrar, Compartilhar, Fonte Aa) */}
        <HeroHeader
          imageUrl={coverImage}
          title={activeWisdom?.title || "Gotas de Sabedoria"}
          subtitle="Gotas de Sabedoria"
          subtitleAbove={true}
          onBack={() => {
            if (isNarrating) stopSpeaking();
            navigation.goBack();
          }}
          renderRight={() => (
            <View style={styles.headerActionsRow}>
              {/* 1. Narrar por Voz (TTS) */}
              <TouchableOpacity
                style={[
                  styles.headerActionButton,
                  isNarrating && styles.headerActionButtonActive,
                ]}
                onPress={handleNarrate}
                activeOpacity={0.7}
                accessibilityLabel={isNarrating ? "Pausar narração" : "Narrar lição"}
              >
                {isNarrating ? (
                  <VolumeX size={20} color="#FFFFFF" />
                ) : (
                  <Volume2 size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* 2. Compartilhar */}
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={handleShare}
                activeOpacity={0.7}
                accessibilityLabel="Compartilhar lição"
              >
                <Share2 size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {/* 3. Ajuste de Tipografia (Fonte Aa) */}
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={handleOpenPreferences}
                activeOpacity={0.7}
                accessibilityLabel="Ajustar tamanho da fonte"
              >
                <Text style={styles.headerActionAaText}>Aa</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* 2. ContentSheet deslizante sobre a base da imagem */}
        <ContentSheet
          key={activeWisdom?.id}
          contentContainerStyle={styles.contentSheetScroll}
        >
          {/* Metadados Editoriais com Simbologia de Ícones */}
          <View style={styles.metadataList}>
            {activeWisdom?.bookReference ? (
              <View style={styles.metadataItem}>
                <BookOpen size={16} color={theme.colors.muted} />
                <Text style={styles.metadataText}>{activeWisdom.bookReference}</Text>
              </View>
            ) : null}

            {activeWisdom?.author ? (
              <View style={styles.metadataItem}>
                <User size={16} color={theme.colors.muted} />
                <Text style={styles.metadataText}>{activeWisdom.author}</Text>
              </View>
            ) : null}
          </View>

          {/* Epígrafe / Citação de Abertura */}
          {sanitizedOpeningQuote ? (
            <View style={styles.openingQuoteContainer}>
              <Text style={styles.openingQuoteText}>"{sanitizedOpeningQuote}"</Text>
            </View>
          ) : null}

          {/* Corpo de Leitura Contínuo com Tipografia Dinâmica */}
          <View style={styles.bodyContainer}>
            <Text
              style={[
                styles.bodyText,
                { fontSize: getFontSize(), lineHeight: getLineHeight() },
              ]}
            >
              {sanitizedContent}
            </Text>
          </View>
        </ContentSheet>

        {/* 3. Rodapé Fixo Focado na Ação de Leitura Concluída */}
        <View
          style={[styles.fixedFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishReading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Finalizar leitura"
          >
            <Text style={styles.finishButtonText}>FINALIZEI A LEITURA</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* BottomSheet de Preferências Tipográficas */}
      <ReaderPreferencesBottomSheet ref={readerPreferencesRef} />

      {/* Modal Contextual de Lembrete Diário (Push) e Cadastro para Visitantes */}
      <OnboardingCompletionPromptModal
        visible={showPromptModal}
        onClose={() => {
          setShowPromptModal(false);
          proceedNavigationAfterReading();
        }}
      />
    </View>
  );
}
