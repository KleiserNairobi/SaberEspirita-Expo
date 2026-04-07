import React, { memo } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ISlide, IReflectionQuestion } from "@/types/course";
import { IGlossaryTerm } from "@/types/glossary";
import { SlideContent } from "./SlideContent";
import { HighlightCard } from "./HighlightCard";
import { ReferenceCard } from "./ReferenceCard";
import { ReflectionQuestionsCard } from "./ReflectionQuestionsCard";
import { ITheme } from "@/configs/theme/types";

const { width } = Dimensions.get("window");

interface LessonSlideProps {
  slide: ISlide;
  fontSize: number;
  isLastSlide: boolean;
  reflectionQuestions?: IReflectionQuestion[];
  glossaryTerms?: IGlossaryTerm[];
  onGlossaryTermPress?: (termId: string, matchedWord?: string) => void;
}

export const LessonSlide = memo(
  ({
    slide,
    fontSize,
    isLastSlide,
    reflectionQuestions,
    glossaryTerms,
    onGlossaryTermPress,
  }: LessonSlideProps) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    const hasLocalGlossary = !!slide.glossary && slide.glossary.length > 0;
    const termsForInjection = hasLocalGlossary ? [] : glossaryTerms;

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
            slideType={slide.slideType}
            glossaryTerms={termsForInjection}
            onGlossaryTermPress={onGlossaryTermPress}
          />

          {slide.highlights && slide.highlights.length > 0 && (
            <HighlightCard
              highlights={slide.highlights}
              fontSize={fontSize}
              glossaryTerms={termsForInjection}
              onGlossaryTermPress={onGlossaryTermPress}
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
              references={slide.references}
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
