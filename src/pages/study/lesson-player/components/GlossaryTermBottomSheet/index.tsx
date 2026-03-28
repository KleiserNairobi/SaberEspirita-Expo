import React, { forwardRef, useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BookA } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/routers/types";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm, GLOSSARY_CATEGORIES } from "@/types/glossary";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";

interface GlossaryTermBottomSheetProps {
  term: IGlossaryTerm | null;
  isLoading?: boolean;
  matchedWord?: string;
}

export const GlossaryTermBottomSheet = forwardRef<
  BottomSheetModal,
  GlossaryTermBottomSheetProps
>(({ term, isLoading, matchedWord }, ref) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  // Tamanhos flexíveis garantidos
  const snapPoints = useMemo(() => ["55%", "85%"], []);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handleClose = () => {
    (ref as any)?.current?.dismiss();
  };

  const handleOpenDetailed = () => {
    if (!term) return;
    handleClose();
    // Pequeno timeout caso o dismiss feche a navegação inteira (overlap stacks)
    setTimeout(() => {
      (navigation as any).navigate("Glossary", {
        screen: "TermDetail",
        params: { id: term.id },
      });
    }, 100);
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : term ? (
          <>
            {/* Header: Ícone e Títulos */}
            <View style={styles.headerRow}>
              <View style={styles.iconContainer}>
                {GLOSSARY_CATEGORIES[term.category] ? (
                  React.createElement(GLOSSARY_CATEGORIES[term.category].icon, {
                    size: 24,
                    color: theme.colors.primary,
                  })
                ) : (
                  <BookA size={24} color={theme.colors.primary} />
                )}
              </View>
              <View style={styles.titleGroup}>
                <Text style={styles.categoryLabel}>
                  {GLOSSARY_CATEGORIES[term.category]?.label || term.category}
                </Text>
                <Text style={styles.termTitle}>{term.term}</Text>
                {matchedWord && matchedWord.toLowerCase() !== term.term.toLowerCase() && (
                  <Text style={[styles.categoryLabel, { color: theme.colors.textSecondary, marginTop: 4, textTransform: "none" }]}>
                    (Sinônimo de: <Text style={{ fontStyle: "italic",...theme.text("sm", "semibold") }}>{matchedWord}</Text>)
                  </Text>
                )}
              </View>
            </View>

            {/* Definição Otimizada para Leitura Rápida */}
            <BottomSheetScrollView
              style={styles.definitionScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
            >
              <Text style={styles.definitionText}>{term.definition}</Text>
            </BottomSheetScrollView>

            {/* Ações */}
            <View style={styles.buttonContainer}>
              <Button
                title="ESTUDAR CONCEITO"
                onPress={handleOpenDetailed}
                fullWidth
              />
              <Button
                title="Fechar e retornar à aula"
                onPress={handleClose}
                fullWidth
              />
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.definitionText}>Termo não encontrado.</Text>
            <Button
              title="Fechar"
              variant="outline"
              onPress={handleClose}
              fullWidth
            />
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

GlossaryTermBottomSheet.displayName = "GlossaryTermBottomSheet";
