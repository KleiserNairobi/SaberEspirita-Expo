import React, { forwardRef, useCallback } from "react";

import { DimensionValue, Text, TouchableOpacity, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  FONT_SCALES,
  FontSizeLevel,
  LineSpacingOption,
  useReaderPreferencesStore,
} from "@/stores/readerPreferencesStore";
import { useThemeStore } from "@/stores/themeStore";

import { createStyles } from "./styles";
import { ReaderPreferencesBottomSheetProps } from "./types";

const LEVELS: FontSizeLevel[] = [0, 1, 2, 3];

export const ReaderPreferencesBottomSheet = forwardRef<
  BottomSheetModal,
  ReaderPreferencesBottomSheetProps
>(({ onDismiss, onApplied }, ref) => {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const {
    fontSizeLevel,
    lineSpacing,
    setFontSizeLevel,
    setLineSpacing,
    resetDefaults,
    getCurrentScale,
  } = useReaderPreferencesStore();

  const { setThemeType } = useThemeStore();

  const currentScale = getCurrentScale();

  const handleDismiss = useCallback(() => {
    (ref as any)?.current?.dismiss();
    onDismiss?.();
  }, [ref, onDismiss]);

  const handleApply = useCallback(() => {
    (ref as any)?.current?.dismiss();
    onApplied?.();
  }, [ref, onApplied]);

  const handleReset = useCallback(() => {
    resetDefaults();
  }, [resetDefaults]);

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

  // Calcula a largura da linha de progresso do slider com base no nível (0 a 3)
  const activeLineWidthPercent: DimensionValue = `${(fontSizeLevel / 3) * 100}%`;

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={true}
      topInset={insets.top + 16}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
    >
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 24) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Preferências de Leitura</Text>
            </View>
            <Text style={styles.subtitle}>Personalize para o seu conforto visual</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
            accessibilityLabel="Fechar preferências de leitura"
          >
            <X size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* 1. Tamanho do Texto */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Tamanho do Texto</Text>
            <View style={styles.sizeBadge}>
              <Text style={styles.sizeBadgeText}>{currentScale.label}</Text>
            </View>
          </View>

          <View style={styles.sliderCard}>
            <Text style={styles.sliderLabelA}>A</Text>

            <View style={styles.sliderTrackContainer}>
              <View style={styles.sliderBaseLine} />
              <View
                style={[styles.sliderActiveLine, { width: activeLineWidthPercent }]}
              />

              <View style={styles.stepsRow}>
                {LEVELS.map((level) => {
                  const isSelected = fontSizeLevel === level;
                  const isPassed = fontSizeLevel >= level;

                  return (
                    <TouchableOpacity
                      key={level}
                      style={styles.stepTouchTarget}
                      onPress={() => setFontSizeLevel(level)}
                      activeOpacity={0.7}
                      accessibilityLabel={`Definir tamanho ${FONT_SCALES[level].label}`}
                    >
                      {isSelected ? (
                        <View style={styles.stepHalo}>
                          <View style={styles.stepInnerDot} />
                        </View>
                      ) : (
                        <View
                          style={[styles.stepDot, isPassed && styles.stepDotActive]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sliderLabelBigA}>A</Text>
          </View>
        </View>

        {/* 2. Espaçamento de Linha */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Espaçamento de Linha</Text>
          </View>

          <View style={styles.segmentContainer}>
            {(
              [
                { id: "padrao", title: "Padrão", ratio: "1.5×" },
                { id: "confortavel", title: "Confortável", ratio: "1.7×" },
                { id: "amplo", title: "Amplo", ratio: "2.0×" },
              ] as const
            ).map((opt) => {
              const isActive = lineSpacing === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
                  onPress={() => setLineSpacing(opt.id as LineSpacingOption)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.segmentTitle, isActive && styles.segmentTitleActive]}
                  >
                    {opt.title}
                  </Text>
                  <Text
                    style={[
                      styles.segmentSubtitle,
                      isActive && styles.segmentSubtitleActive,
                    ]}
                  >
                    {opt.ratio}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Tema de Leitura */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Tema de Leitura</Text>
          </View>

          <View style={styles.themeCardsRow}>
            {/* Modo Claro */}
            <TouchableOpacity
              style={[
                styles.themeCard,
                styles.themeCardLight,
                !isDark && styles.themeCardSelected,
              ]}
              onPress={() => setThemeType("light")}
              activeOpacity={0.8}
            >
              <View style={[styles.themeIconCircle, styles.themeIconCircleLight]}>
                <Text style={styles.themeIconTextLight}>Aa</Text>
              </View>
              <Text style={styles.themeTitleLight}>Claro</Text>
              <Text style={styles.themeSubtitleLight}>Sereno</Text>
            </TouchableOpacity>

            {/* Modo Noturno */}
            <TouchableOpacity
              style={[
                styles.themeCard,
                styles.themeCardDark,
                isDark && styles.themeCardSelected,
              ]}
              onPress={() => setThemeType("dark")}
              activeOpacity={0.8}
            >
              <View style={[styles.themeIconCircle, styles.themeIconCircleDark]}>
                <Text style={styles.themeIconTextDark}>Aa</Text>
              </View>
              <Text style={styles.themeTitleDark}>Escuro</Text>
              <Text style={styles.themeSubtitleDark}>Descanso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rodapé de Ações */}
        <View style={styles.actionsContainer}>
          <Button
            title="Restaurar preferências padrão"
            onPress={handleReset}
            variant="outline"
            fullWidth
          />
          <Button title="Aplicar na Leitura" onPress={handleApply} fullWidth />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
