import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CheckCircle2, Crown, Lock, Sparkles } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

export interface PremiumContentNoticeModalProps {
  title?: string;
  itemName?: string;
  description?: string;
  onClose?: () => void;
}

export const PremiumContentNoticeModal = forwardRef<
  BottomSheetModal,
  PremiumContentNoticeModalProps
>(({ title = "Conteúdo Exclusivo", itemName, description, onClose }, ref) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  function handleClose() {
    // @ts-ignore
    ref?.current?.dismiss();
    onClose?.();
  }

  function renderBackdrop(props: any) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );
  }

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 24) + 16 },
        ]}
      >
        <View style={styles.iconContainer}>
          <Crown size={32} color={theme.colors.warning} />
        </View>

        <Text style={styles.title}>{title}</Text>

        {itemName && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {itemName}
          </Text>
        )}

        <Text style={styles.description}>
          {description ||
            "Este material complementar é reservado para apoiadores e membros premium. Apoie o Saber Espírita para ter acesso irrestrito a apostilas, podcasts e meditações exclusivas."}
        </Text>

        <View style={styles.benefitsCard}>
          <View style={styles.benefitItem}>
            <CheckCircle2 size={18} color={theme.colors.primary} />
            <Text style={styles.benefitText}>Apostilas completas em PDF de alta qualidade</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle2 size={18} color={theme.colors.primary} />
            <Text style={styles.benefitText}>Podcasts e reflexões exclusivas</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle2 size={18} color={theme.colors.primary} />
            <Text style={styles.benefitText}>Contribua diretamente com a disseminação da Doutrina</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>ENTENDI</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PremiumContentNoticeModal;
