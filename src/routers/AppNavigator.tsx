import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { FAQScreen } from "@/pages/account/faq";
import { PrivacyScreen } from "@/pages/account/privacy";
import { TermsScreen } from "@/pages/account/terms";
import { EmotionalChatScreen } from "@/pages/chat/emotional";
import { ScientificChatScreen } from "@/pages/chat/scientific";
import { PerformanceScreen } from "@/pages/fix/performance";
import { CourseQuizScreen } from "@/pages/fix/quiz/CourseQuizScreen";
import { QuizResultScreen } from "@/pages/fix/quiz/result";
import { QuizReviewScreen } from "@/pages/fix/quiz/review";
import { CourseCertificateScreen } from "@/pages/study/course-certificate";
import { CourseCurriculumScreen } from "@/pages/study/course-curriculum";
import { CourseDetailsScreen } from "@/pages/study/course-details";
import { CoursesCatalogScreen } from "@/pages/study/courses-catalog";
import { LessonPlayerScreen } from "@/pages/study/lesson-player";
import { GlossaryNavigator } from "./GlossaryNavigator";
import { TabNavigator } from "./TabNavigator";

import type { AppStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * Navegador Principal da Aplicação.
 * Define todas as rotas de alto nível e modais globais.
 */
export function AppNavigator() {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="EmotionalChat" component={EmotionalChatScreen} />
        <Stack.Screen name="ScientificChat" component={ScientificChatScreen} />
        <Stack.Screen name="Glossary" component={GlossaryNavigator} />
        <Stack.Screen name="CoursesCatalog" component={CoursesCatalogScreen} />
        <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
        <Stack.Screen name="CourseCurriculum" component={CourseCurriculumScreen} />
        <Stack.Screen name="LessonPlayer" component={LessonPlayerScreen} />
        <Stack.Screen name="CourseQuiz" component={CourseQuizScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        <Stack.Screen name="QuizReview" component={QuizReviewScreen} />
        <Stack.Screen name="CourseCertificate" component={CourseCertificateScreen} />
        <Stack.Screen name="Performance" component={PerformanceScreen} />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
