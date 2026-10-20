import React, { useRef, useState } from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import {
  getLocalSeedWisdom,
  useTodayWisdom,
} from "@/pages/meditate/hooks/useDailyWisdom";
import { dailyWisdomApiService } from "@/services/api/dailyWisdomApiService";
import { IDailyWisdom, WisdomMoment, WISDOM_MOMENTS } from "@/types/dailyWisdom";
import { WisdomMomentBottomSheet } from "@/components/WisdomMomentBottomSheet";
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

  const { data: todayWisdom } = useTodayWisdom();
  const [selectedWisdom, setSelectedWisdom] = useState<IDailyWisdom | null>(null);
  const [currentMoment, setCurrentMoment] = useState<string | undefined>(undefined);

  const activeWisdom = selectedWisdom || todayWisdom;

  function handleOpenReading() {
    if (!activeWisdom) return;
    navigation.navigate("DailyWisdom", {
      id: activeWisdom.id,
      moment: activeWisdom.moment,
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
    } catch (error) {
      console.warn("DailyWisdomCard: falha ao atualizar momento no card", error);
      const fallback = getLocalSeedWisdom(moment === "RANDOM" ? undefined : moment);
      setSelectedWisdom(fallback);
      if (moment !== "RANDOM") setCurrentMoment(moment);
    }
  }

  if (!activeWisdom) return null;

  const momentMeta = WISDOM_MOMENTS.find((m) => m.key === (currentMoment || activeWisdom.moment));
  const momentLabel = momentMeta ? momentMeta.label : "Momento da Alma";

  return (
    <>
      <View style={[styles.container, style]}>
        {/* Floating Cutout Badge */}
        <View style={styles.badge}>
          <Sparkles size={13} color={theme.colors.primary} />
          <Text style={styles.badgeText}>Gotas de Sabedoria</Text>
        </View>

        {/* Ação de Leitura Completa no Topo Direito (Apenas Ícone Circular, Substituindo o Compartilhar) */}
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.readFullButton}
            onPress={handleOpenReading}
            activeOpacity={0.7}
            accessibilityLabel="Ler mensagem completa"
          >
            <ArrowUpRight size={16} color={theme.colors.primary} />
          </TouchableOpacity>
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

          {/* Metadados: Referência / Livro / Autor */}
          <View style={styles.referenceRow}>
            {activeWisdom.bookReference ? (
              <>
                <Text style={styles.referenceText}>{activeWisdom.bookReference}</Text>
                <Text style={styles.dividerDot}>•</Text>
              </>
            ) : null}
            <Text style={styles.authorText}>{activeWisdom.author}</Text>
          </View>

          {/* Citação de abertura / Destaque */}
          {activeWisdom.openingQuote ? (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText} numberOfLines={2}>
                "{activeWisdom.openingQuote}"
              </Text>
            </View>
          ) : null}

          {/* Prévia textual */}
          <Text style={styles.contentSnippet} numberOfLines={3}>
            {activeWisdom.content}
          </Text>
        </TouchableOpacity>

        {/* Gatilho de Sintonia Emocional (Subtle Mood Prompt) */}
        <View style={styles.moodPromptContainer}>
          <Text style={styles.moodPromptLabel}>Sentindo algo específico?</Text>
          <TouchableOpacity
            style={styles.moodPromptButton}
            onPress={handleOpenMomentSelection}
            activeOpacity={0.7}
          >
            <Text style={styles.moodPromptButtonText}>{momentLabel}</Text>
            <ChevronDown size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BottomSheet de seleção de momento renderizado localmente sem navegar */}
      <WisdomMomentBottomSheet
        ref={momentBottomSheetRef}
        currentMoment={currentMoment || activeWisdom.moment}
        onSelectMoment={handleSelectMoment}
      />
    </>
  );
}
