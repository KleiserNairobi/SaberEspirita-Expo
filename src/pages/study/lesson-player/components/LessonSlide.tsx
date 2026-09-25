import React, { memo } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ISlide, IPremiumSlide, IReflectionQuestion } from "@/types/course";
import { IGlossaryTerm } from "@/types/glossary";
import { SlideContent } from "./SlideContent";
import { HighlightCard } from "./HighlightCard";
import { ReferenceCard } from "./ReferenceCard";
import { ReflectionQuestionsCard } from "./ReflectionQuestionsCard";
import { PremiumSlideRenderer } from "./PremiumSlideRenderer";
import { ITheme } from "@/configs/theme/types";

const { width } = Dimensions.get("window");

interface LessonSlideProps {
  slide: ISlide | IPremiumSlide;
  fontSize: number;
  isLastSlide: boolean;
  source?: string;
  chapter?: string;
  reflectionQuestions?: IReflectionQuestion[];
  glossaryTerms?: IGlossaryTerm[];
  onGlossaryTermPress?: (termId: string, matchedWord?: string) => void;
  slideIndex: number;
}

export const LessonSlide = memo(
  ({
    slide,
    fontSize,
    isLastSlide,
    source,
    chapter,
    reflectionQuestions,
    onGlossaryTermPress,
    slideIndex,
  }: LessonSlideProps) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    // Detecta se é um slide estruturado com elementos premium
    const isPremiumSlide =
      !!(slide as IPremiumSlide).specialElement ||
      !!(slide as IPremiumSlide).learningGoal ||
      !!(slide as IPremiumSlide).commonMisunderstanding ||
      !!(slide as IPremiumSlide).references?.obraPrincipal ||
      !!(slide as IPremiumSlide).references?.codificacao;

    if (isPremiumSlide) {
      return (
        <PremiumSlideRenderer
          slide={slide as IPremiumSlide}
          fontSize={fontSize}
          isLastSlide={isLastSlide}
          source={source}
          chapter={chapter}
          reflectionQuestions={reflectionQuestions}
          onGlossaryTermPress={onGlossaryTermPress}
          slideIndex={slideIndex}
        />
      );
    }

    const hasLocalGlossary = !!slide.glossary && slide.glossary.length > 0;
    const termsForInjection: IGlossaryTerm[] = [];

    const slideType =
      slide.slideType ||
      (slide as any).type ||
      (slide as any).label ||
      (slide as any).tag ||
      (slide as any).slide_type ||
      (slide as any).category ||
      undefined;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          {slide.highlights && slide.highlights.length > 0 && (
            <HighlightCard
              highlights={slide.highlights}
              fontSize={fontSize}
              glossaryTerms={termsForInjection}
              onGlossaryTermPress={onGlossaryTermPress}
              slideIndex={slideIndex}
            />
          )}

          {/* Perguntas Reflexivas - Apenas no último slide (antes das referências) */}
          {isLastSlide && reflectionQuestions && reflectionQuestions.length > 0 && (
            <ReflectionQuestionsCard
              questions={reflectionQuestions}
              fontSize={fontSize}
            />
          )}

          {/* Referências e/ou Glossário fundidos no mesmo card */}
          {(slide.references || hasLocalGlossary) && (
            <ReferenceCard
              references={slide.references as any}
              glossary={slide.glossary}
              fontSize={fontSize}
              onGlossaryTermPress={(termId) => onGlossaryTermPress?.(termId)}
            />
          )}

          {/* Espaço extra no final para não ficar colado no botão */}
          <View style={styles.footerSpace} />
        </ScrollView>
      </View>
    );
  }
);

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      width: width, // Ocupa toda a largura da tela
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.xs,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    footerSpace: {
      height: 80, // Espaço para os controles inferiores
    },
  });
