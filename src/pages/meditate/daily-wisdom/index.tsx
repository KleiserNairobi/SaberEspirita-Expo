import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BookOpen,
  ChevronDown,
  HeartHandshake,
  Share2,
  User,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ContentSheet } from "@/components/ContentSheet";
import { HeroHeader } from "@/components/HeroHeader";
import { ReaderPreferencesBottomSheet } from "@/components/ReaderPreferencesBottomSheet";
import { WisdomMomentBottomSheet } from "@/components/WisdomMomentBottomSheet";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MeditateStackParamList } from "@/routers/types";
import { dailyWisdomApiService } from "@/services/api/dailyWisdomApiService";
import { statsApiService } from "@/services/api/statsApiService";
import { useReaderPreferencesStore } from "@/stores/readerPreferencesStore";
import { IDailyWisdom, WISDOM_MOMENTS, WisdomMoment } from "@/types/dailyWisdom";
import { SHARE_FOOTER } from "@/utils/constants";
import { isSpeaking, speakText, stopSpeaking } from "@/utils/textToSpeech";

import {
  getLocalSeedWisdom,
  useTodayWisdom,
  useWisdomById,
} from "../hooks/useDailyWisdom";
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
  const initialMoment = route.params?.moment;

  const { getFontSize, getLineHeight } = useReaderPreferencesStore();

  const readerPreferencesRef = useRef<BottomSheetModal>(null);
  const momentBottomSheetRef = useRef<BottomSheetModal>(null);
  const hasLogged = useRef(false);

  const [isNarrating, setIsNarrating] = useState(false);
  const [selectedWisdom, setSelectedWisdom] = useState<IDailyWisdom | null>(null);
  const [currentMoment, setCurrentMoment] = useState<string | undefined>(initialMoment);

  const { data: todayWisdom, isLoading: loadingToday } = useTodayWisdom();
  const { data: idWisdom, isLoading: loadingId } = useWisdomById(paramId);

  // Define qual sabedoria exibir
  const activeWisdom: IDailyWisdom | null =
    selectedWisdom || (paramId ? idWisdom || null : todayWisdom || null);

  const handleOpenPreferences = () => {
    readerPreferencesRef.current?.present();
  };

  const handleOpenMomentSelector = () => {
    momentBottomSheetRef.current?.present();
  };

  const handleSelectMoment = async (moment: WisdomMoment | "RANDOM" | "GERAL") => {
    try {
      if (moment === "RANDOM") {
        const randomItem =
          (await dailyWisdomApiService.getRandomWisdom()) || getLocalSeedWisdom();
        setSelectedWisdom(randomItem);
        setCurrentMoment(randomItem.moment);
      } else {
        const items = await dailyWisdomApiService.getWisdomByMoment(moment);
        if (items && items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setSelectedWisdom(items[randomIndex]);
        } else {
          setSelectedWisdom(getLocalSeedWisdom(moment));
        }
        setCurrentMoment(moment);
      }
    } catch (e) {
      console.warn("DailyWisdomScreen: erro ao trocar momento", e);
      setSelectedWisdom(getLocalSeedWisdom(moment === "RANDOM" ? undefined : moment));
      if (moment !== "RANDOM") setCurrentMoment(moment);
    }
  };

  async function handleShare() {
    if (!activeWisdom) return;
    try {
      const quote = activeWisdom.openingQuote ? `"${activeWisdom.openingQuote}"\n\n` : "";
      const message = `${activeWisdom.title}\n${quote}${activeWisdom.content}\n\n— ${
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
        const textToSpeak = `${activeWisdom.title}. ${activeWisdom.openingQuote || ""}. ${
          activeWisdom.content
        }. ${activeWisdom.author}.`;

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
    if (activeWisdom && !hasLogged.current) {
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

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MeditateHome");
    }
  }

  const isLoading = (paramId ? loadingId : loadingToday) && !activeWisdom;

  if (isLoading) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Buscando Gotas de Sabedoria...</Text>
        </View>
      </View>
    );
  }

  const dayOfWeek = new Date().getDay();
  const coverImage = activeWisdom?.imageUrl || DAY_BACKGROUNDS[dayOfWeek];
  const momentMeta = WISDOM_MOMENTS.find(
    (m) => m.key === (currentMoment || activeWisdom?.moment)
  );
  const momentLabel = momentMeta ? momentMeta.label : "Momento da Alma";

  return (
    <View style={styles.safeArea}>
      {/* 1. Header com Imagem de Capa e Ações no Topo Direito: (Narrar, Compartilhar, Fonte Aa) */}
      <HeroHeader
        imageUrl={coverImage}
        title={activeWisdom?.title || "Gotas de Sabedoria"}
        subtitle="Gotas de Sabedoria"
        subtitleAbove={true}
        onBack={() => navigation.goBack()}
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
      <ContentSheet contentContainerStyle={styles.contentSheetScroll}>
        {/* Metadados Editoriais com Simbologia de Ícones (Cada Item em Sua Linha) */}
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
        {activeWisdom?.openingQuote ? (
          <View style={styles.openingQuoteContainer}>
            <Text style={styles.openingQuoteText}>"{activeWisdom.openingQuote}"</Text>
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
            {activeWisdom?.content}
          </Text>
        </View>
      </ContentSheet>

      {/* 3. Rodapé Fixo na Thumb Zone (Seletor de Escopo Pill + Botão Finalizar) */}
      <View style={[styles.fixedFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {/* Seletor de Momento da Alma em formato Pill (estilo AmbientPlayerControls de Oração) */}
        <TouchableOpacity
          style={styles.momentBottomChip}
          onPress={handleOpenMomentSelector}
          activeOpacity={0.8}
          accessibilityLabel={`Momento atual: ${momentLabel}. Toque para alterar.`}
        >
          <View style={styles.momentInfoSection}>
            <View style={styles.momentIconCircle}>
              <HeartHandshake size={15} color={theme.colors.onPrimary} />
            </View>
            <Text style={styles.momentTitle} numberOfLines={1}>
              <Text style={styles.momentPrefix}>Acolhendo: </Text>
              {momentLabel}
            </Text>
          </View>
          <View style={styles.momentActionCircle}>
            <ChevronDown size={20} color={theme.colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Botão de Finalizar Leitura */}
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

      {/* BottomSheets Modais */}
      <ReaderPreferencesBottomSheet ref={readerPreferencesRef} />
      <WisdomMomentBottomSheet
        ref={momentBottomSheetRef}
        currentMoment={currentMoment || activeWisdom?.moment}
        onSelectMoment={handleSelectMoment}
      />
    </View>
  );
}

export default DailyWisdomScreen;
