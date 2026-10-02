import React, { memo } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { IPremiumSlide, IReflectionQuestion } from "@/types/course";
import { IGlossaryTerm } from "@/types/glossary";
import { ITheme } from "@/configs/theme/types";

import { SlideContent } from "./SlideContent";
import { HighlightCard } from "./HighlightCard";
import { ReflectionQuestionsCard } from "./ReflectionQuestionsCard";
import { SpecialElementCard } from "./SpecialElementCard";
import { CommonMisunderstandingCard } from "./CommonMisunderstandingCard";
import { LayeredReferenceCard } from "./LayeredReferenceCard";

const { width } = Dimensions.get("window");

interface PremiumSlideRendererProps {
  slide: IPremiumSlide;
  fontSize: number;
  isLastSlide: boolean;
  source?: string;
  chapter?: string;
  reflectionQuestions?: IReflectionQuestion[];
  glossaryTerms?: IGlossaryTerm[];
  onGlossaryTermPress?: (termId: string, matchedWord?: string) => void;
  slideIndex: number;
}

export const PremiumSlideRenderer = memo(function PremiumSlideRenderer({
  slide,
  fontSize,
  isLastSlide,
  reflectionQuestions,
  onGlossaryTermPress,
  slideIndex,
}: PremiumSlideRendererProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const slideType =
    slide.slideType ||
    (slide as any).type ||
    (slide as any).label ||
    (slide as any).tag ||
    (slide as any).slide_type ||
    (slide as any).category ||
    undefined;

  const termsForInjection: IGlossaryTerm[] = [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Conteúdo Principal do Slide (com Badge do tipo no topo) */}
        <SlideContent
          title={slide.title}
          content={slide.content}
          imagePrompt={slide.imagePrompt}
          fontSize={fontSize}
          slideType={slideType}
          glossaryTerms={termsForInjection}
          onGlossaryTermPress={onGlossaryTermPress}
          slideIndex={slideIndex}
        />

        {/* Card de Elemento Especial (Flat, integrado e sem sombras) */}
        {!!slide.specialElement && (
          <SpecialElementCard
            specialElement={slide.specialElement}
            fontSize={fontSize}
          />
        )}

        {/* Card de Equívoco Frequente a Evitar (Flat, âmbar suave) */}
        {!!slide.commonMisunderstanding && (
          <CommonMisunderstandingCard
            misunderstanding={slide.commonMisunderstanding}
            fontSize={fontSize}
          />
        )}

        {/* Destaques Conceituais (mesmo padrão da aula free) */}
        {!!slide.highlights && slide.highlights.length > 0 && (
          <HighlightCard
            highlights={slide.highlights}
            fontSize={fontSize}
            glossaryTerms={termsForInjection}
            onGlossaryTermPress={onGlossaryTermPress}
            slideIndex={slideIndex}
          />
        )}

        {/* Perguntas Reflexivas — Apenas no último slide */}
        {isLastSlide && reflectionQuestions && reflectionQuestions.length > 0 && (
          <ReflectionQuestionsCard
            questions={reflectionQuestions}
            fontSize={fontSize}
          />
        )}

        {/* Referências em Camadas e/ou Glossário (Flat, paridade com ReferenceCard) */}
        {(slide.references || (slide.glossary && slide.glossary.length > 0)) && (
          <LayeredReferenceCard
            references={slide.references as any}
            glossary={slide.glossary}
            fontSize={fontSize}
            onGlossaryTermPress={(termId) => onGlossaryTermPress?.(termId)}
          />
        )}

        {/* Espaço extra inferior para navegação */}
        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
});

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      width: width,
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 0,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    footerSpace: {
      height: 80,
    },
  });
