import React, { memo } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ISlide, IReflectionQuestion } from "@/types/course";
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
}

export const LessonSlide = memo(
  ({ slide, fontSize, isLastSlide, reflectionQuestions }: LessonSlideProps) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

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
          />

          {slide.highlights && slide.highlights.length > 0 && (
            <HighlightCard highlights={slide.highlights} fontSize={fontSize} />
          )}

          {slide.references && (
            <ReferenceCard references={slide.references} fontSize={fontSize} />
          )}

          {/* Perguntas Reflexivas - Apenas no último slide */}
          {isLastSlide && reflectionQuestions && reflectionQuestions.length > 0 && (
            <ReflectionQuestionsCard
              questions={reflectionQuestions}
              fontSize={fontSize}
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
