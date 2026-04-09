import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Music, Waves, Moon, VolumeX } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { IAmbientAudio } from "@/types/ambientAudio";
import { createStyles } from "./styles";

const ICON_MAP = {
  music: Music,
  waves: Waves,
  moon: Moon,
} as const;

const FRIENDLY_NAMES: Record<string, string> = {
  AveMaria: "Consolo da Alma",
  ClairDeLune: "Paz Lunar",
  Gymnopedie: "Serenidade",
  Nocturne: "Céu Estrelado",
};

interface AmbientSelectionBottomSheetProps {
  audios: IAmbientAudio[] | undefined;
  onSelect: (audio: IAmbientAudio | null) => void;
}

export const AmbientSelectionBottomSheet = forwardRef<
  BottomSheetModal,
  AmbientSelectionBottomSheetProps
>(function AmbientSelectionBottomSheet({ audios, onSelect }, ref) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const { currentAudioId } = useAmbientPlayerStore();

  function renderBackdrop(props: any) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    );
  }

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
    >
      <BottomSheetView
        style={{
          padding: 24,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Sons de Sintonia</Text>
        </View>

        {/* Opção Silêncio */}
        <TouchableOpacity
          style={[
            styles.audioOption,
            !currentAudioId && styles.audioOptionSelected,
          ]}
          onPress={() => onSelect(null)}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: !currentAudioId
                ? theme.colors.primary
                : theme.colors.primary + "15",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VolumeX
              size={20}
              color={!currentAudioId ? theme.colors.background : theme.colors.primary}
            />
          </View>
          <Text
            style={[
              styles.audioOptionText,
              !currentAudioId && styles.audioOptionTextSelected,
            ]}
          >
            Sem música (Silêncio)
          </Text>
          {!currentAudioId && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }} />}
        </TouchableOpacity>

        {/* Lista de Áudios */}
        {audios?.map((audio, index) => {
          const Icon = ICON_MAP[audio.icon as keyof typeof ICON_MAP] || Music;
          // COMPARANDO POR ID ESTÁVEL - Correção definitiva para o destaque
          const isSelected = audio.id === currentAudioId;
          const isLast = index === audios.length - 1;

          return (
            <TouchableOpacity
              key={audio.id}
              style={[
                styles.audioOption,
                isSelected && styles.audioOptionSelected,
                isLast && { borderBottomWidth: 0 },
              ]}
              onPress={() => onSelect(audio)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.primary + "15",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={20}
                  color={isSelected ? theme.colors.background : theme.colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.audioOptionText,
                  isSelected && styles.audioOptionTextSelected,
                ]}
              >
                {FRIENDLY_NAMES[audio.id] || audio.title}
              </Text>
              {isSelected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }} />}
            </TouchableOpacity>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
