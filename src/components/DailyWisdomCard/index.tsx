import React, { useEffect, useRef, useState } from "react";

import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react-native";

import { WisdomMomentBottomSheet } from "@/components/WisdomMomentBottomSheet";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  getLocalSeedWisdom,
  useTodayWisdom,
} from "@/pages/meditate/hooks/useDailyWisdom";
import { dailyWisdomApiService } from "@/services/api/dailyWisdomApiService";
import { useMoodStore } from "@/stores/moodStore";
import { IDailyWisdom, WISDOM_MOMENTS, WisdomMoment } from "@/types/dailyWisdom";

import { createStyles } from "./styles";

interface DailyWisdomCardProps {
  style?: StyleProp<ViewStyle>;
  onSelectMoment?: () => void;
}

export function DailyWisdomCard({ style, onSelectMoment }: DailyWisdomCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const momentBottomSheetRef = useRef<BottomSheetModal>(null);

  const { currentMoment, setMoment, checkDayTransition } = useMoodStore();
  const { data: todayWisdom } = useTodayWisdom();
  const [selectedWisdom, setSelectedWisdom] = useState<IDailyWisdom | null>(null);

  // Garante que virada de dia civil restaure a leitura padrão
  useEffect(() => {
    checkDayTransition();
  }, [checkDayTransition]);

  // Sincroniza a lição exibida com o currentMoment do store (que pode ter sido alterado em Ore ou Medite)
  useEffect(() => {
    let isCancelled = false;

    async function syncWisdomWithMoment() {
      if (!currentMoment || currentMoment === "GERAL") {
        if (!isCancelled) setSelectedWisdom(null);
        return;
      }

      if (currentMoment === "RANDOM") {
        return;
      }

      try {
        const items = await dailyWisdomApiService.getWisdomByMoment(currentMoment);
        if (!isCancelled && items && items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setSelectedWisdom(items[randomIndex]);
        } else if (!isCancelled) {
          setSelectedWisdom(getLocalSeedWisdom(currentMoment));
        }
      } catch (err) {
        if (!isCancelled) setSelectedWisdom(getLocalSeedWisdom(currentMoment));
      }
    }

    syncWisdomWithMoment();

    return () => {
      isCancelled = true;
    };
  }, [currentMoment]);

  const activeWisdom = selectedWisdom || todayWisdom;

  // Pré-carrega a imagem da sabedoria do dia em segundo plano
  useEffect(() => {
    if (activeWisdom?.imageUrl && typeof activeWisdom.imageUrl === "string") {
      Image.prefetch(activeWisdom.imageUrl);
    }
  }, [activeWisdom?.imageUrl]);

  function handleOpenReading() {
    if (!activeWisdom) return;
    navigation.navigate("DailyWisdom", {
      id: activeWisdom.id,
      moment: activeWisdom.moment,
      wisdom: activeWisdom,
    });
  }

  function handleOpenMomentSelection() {
    if (onSelectMoment) {
      onSelectMoment();
    } else {
      // Abre o BottomSheet diretamente na tela atual (Medite), sem navegar para a leitura!
      momentBottomSheetRef.current?.present();
    }
  }

  async function handleSelectMoment(moment: WisdomMoment | "RANDOM" | "GERAL") {
    try {
      if (moment === "RANDOM") {
        const randomItem =
          (await dailyWisdomApiService.getRandomWisdom()) || getLocalSeedWisdom();
        setSelectedWisdom(randomItem);
        // Atualiza o store com o momento da sabedoria sorteada, refletindo em Ore
        setMoment(randomItem.moment as WisdomMoment);
      } else if (moment === "GERAL") {
        setSelectedWisdom(null);
        setMoment("GERAL");
      } else {
        const items = await dailyWisdomApiService.getWisdomByMoment(moment);
        if (items && items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setSelectedWisdom(items[randomIndex]);
        } else {
          setSelectedWisdom(getLocalSeedWisdom(moment));
        }
        setMoment(moment);
      }
    } catch (error) {
      console.warn("DailyWisdomCard: falha ao atualizar momento no card", error);
      const fallback = getLocalSeedWisdom(
        moment === "RANDOM" || moment === "GERAL" ? undefined : moment
      );
      setSelectedWisdom(fallback);
      setMoment(moment);
    }
  }

  if (!activeWisdom) return null;

  // Apenas considera momento customizado se o usuário explicitamente escolheu algo diferente do geral/diário
  const hasCustomMoment = Boolean(currentMoment && currentMoment !== "GERAL");
  const momentMeta = hasCustomMoment
    ? WISDOM_MOMENTS.find((m) => m.key === currentMoment)
    : null;
  const momentLabel = momentMeta ? momentMeta.label : "Selecionar";
  const promptLabel = hasCustomMoment
    ? "Sentindo algo diferente?"
    : "Sentindo algo específico?";

  return (
    <>
      <View style={[styles.container, style]}>
        {/* Floating Cutout Badge */}
        <View style={styles.badge}>
          <Sparkles size={13} color={theme.colors.primary} />
          <Text style={styles.badgeText}>Gotas de Sabedoria</Text>
        </View>

        {/* Área tocável principal */}
        <TouchableOpacity
          onPress={handleOpenReading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Abrir lição: ${activeWisdom.title}`}
        >
          {/* Título da lição */}
          <Text style={styles.title} numberOfLines={2}>
            {activeWisdom.title}
          </Text>

          {/* Citação de abertura / Destaque */}
          {activeWisdom.openingQuote ? (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText} numberOfLines={2}>
                "{activeWisdom.openingQuote.replace(/\\n/g, "\n")}"
              </Text>
            </View>
          ) : null}

          {/* Prévia textual */}
          <Text style={styles.contentSnippet} numberOfLines={3}>
            {activeWisdom.content?.replace(/\\n/g, "\n")}
          </Text>

          {/* Ação de Continuação de Leitura */}
          <View style={styles.continueReadingRow}>
            <Text style={styles.continueReadingText}>Continuar lendo</Text>
            <ChevronRight
              size={15}
              color={theme.colors.primary}
              style={styles.continueReadingIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Gatilho de Sintonia Emocional (Subtle Mood Prompt) */}
        <TouchableOpacity
          style={styles.moodPromptContainer}
          onPress={handleOpenMomentSelection}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${promptLabel} ${momentLabel}`}
        >
          <Text style={styles.moodPromptLabel}>{promptLabel}</Text>
          <View style={styles.moodPromptButton}>
            <Text style={styles.moodPromptButtonText}>{momentLabel}</Text>
            <ChevronDown size={16} color={theme.colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* BottomSheet de seleção de momento renderizado localmente sem navegar */}
      <WisdomMomentBottomSheet
        ref={momentBottomSheetRef}
        currentMoment={hasCustomMoment && currentMoment ? currentMoment : "GERAL"}
        onSelectMoment={handleSelectMoment}
      />
    </>
  );
}
