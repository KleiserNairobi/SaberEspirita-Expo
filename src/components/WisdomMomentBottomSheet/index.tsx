import React, { forwardRef, useCallback, useMemo } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  Compass,
  Heart,
  HeartHandshake,
  RotateCcw,
  ShieldAlert,
  Shuffle,
  Smile,
  Sparkles,
  Sunrise,
  Wind,
  X,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WISDOM_MOMENTS, WisdomMoment } from "@/types/dailyWisdom";

export interface WisdomMomentBottomSheetProps {
  currentMoment?: WisdomMoment | string;
  onSelectMoment: (moment: WisdomMoment | "RANDOM" | "GERAL") => void;
  onDismiss?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Smile,
  Wind,
  Sunrise,
  Heart,
  Compass,
};

export const WisdomMomentBottomSheet = forwardRef<
  BottomSheetModal,
  WisdomMomentBottomSheetProps
>(({ currentMoment, onSelectMoment, onDismiss }, ref) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const snapPoints = useMemo(() => ["80%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSelect = (moment: WisdomMoment | "RANDOM" | "GERAL") => {
    onSelectMoment(moment);
    (ref as any)?.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      topInset={insets.top}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onDismiss}
    >
      <View style={styles.header}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.title}>O que seu coração busca hoje?</Text>
          <Text style={styles.subtitle}>
            Selecione o momento da sua alma para acolhimento espiritual
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => (ref as any)?.current?.dismiss()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Fechar"
          accessibilityRole="button"
        >
          <X size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Gotas ao Acaso */}
        <TouchableOpacity
          style={[styles.momentCard, styles.randomCard]}
          onPress={() => handleSelect("RANDOM")}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainerSpecial}>
            <Shuffle size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitleSpecial}>Gotas ao Acaso (Sorteio)</Text>
            <Text style={styles.cardSubtitle}>
              Abra uma página ao acaso buscando uma orientação espontânea
            </Text>
          </View>
        </TouchableOpacity>

        {/* 8 Momentos da Alma */}
        {WISDOM_MOMENTS.map((m) => {
          const IconComponent = ICON_MAP[m.iconName] || Sparkles;
          const isSelected = currentMoment === m.key;

          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.momentCard, isSelected && styles.momentCardSelected]}
              onPress={() => handleSelect(m.key)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}
              >
                <IconComponent
                  size={20}
                  color={isSelected ? theme.colors.background : theme.colors.primary}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {m.label}
                </Text>
                <Text style={styles.cardSubtitle}>{m.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Botão de Restaurar Lição Diária */}
        {currentMoment && currentMoment !== "GERAL" && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => handleSelect("GERAL")}
            activeOpacity={0.7}
          >
            <RotateCcw size={18} color={theme.colors.primary} />
            <Text style={styles.resetButtonText}>Restabelecer lição do dia</Text>
          </TouchableOpacity>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

WisdomMomentBottomSheet.displayName = "WisdomMomentBottomSheet";

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
    },
    handleIndicator: {
      backgroundColor: `${theme.colors.textSecondary}40`,
      width: 40,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.primary}15`,
    },
    headerTextBlock: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    title: {
      ...theme.text("md", "bold", theme.colors.text),
    },
    subtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    momentCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}08`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}25`,
      borderRadius: theme.radius.sm,
      gap: theme.spacing.md,
    },
    momentCardSelected: {
      backgroundColor: `${theme.colors.primary}18`,
      borderColor: theme.colors.primary,
    },
    randomCard: {
      backgroundColor: `${theme.colors.warning}10`,
      borderColor: `${theme.colors.warning}40`,
      marginBottom: 2,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${theme.colors.primary}15`,
    },
    iconContainerSelected: {
      backgroundColor: theme.colors.primary,
    },
    iconContainerSpecial: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${theme.colors.warning}20`,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      ...theme.text("sm", "semibold", theme.colors.text),
      marginBottom: 2,
    },
    cardTitleSelected: {
      color: theme.colors.primary,
    },
    cardTitleSpecial: {
      ...theme.text("sm", "semibold", theme.colors.text),
      marginBottom: 2,
    },
    cardSubtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      lineHeight: 16,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    resetButtonText: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
  });
