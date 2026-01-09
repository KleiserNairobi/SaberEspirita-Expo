import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FixStackParamList } from "./types";
import FixPlaceholder from "@/pages/fix";
import { SubcategoriesScreen } from "@/pages/fix/subcategories";
import { QuizScreen } from "@/pages/fix/quiz";
import { QuizResultScreen } from "@/pages/fix/quiz/result";
import { QuizReviewScreen } from "@/pages/fix/quiz/review";
import { LeaderboardScreen } from "@/pages/fix/leaderboard";
import { TruthOrFalseHomeScreen } from "@/pages/fix/truth-or-false/home";
import { TruthOrFalseQuestionScreen } from "@/pages/fix/truth-or-false/question";
import { TruthOrFalseResultScreen } from "@/pages/fix/truth-or-false/result";
import { TruthOrFalseHistoryScreen } from "@/pages/fix/truth-or-false/history";

const Stack = createNativeStackNavigator<FixStackParamList>();

export function FixNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FixHome" component={FixPlaceholder} />
      <Stack.Screen name="Subcategories" component={SubcategoriesScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
      <Stack.Screen name="QuizReview" component={QuizReviewScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="TruthOrFalseHome" component={TruthOrFalseHomeScreen} />
      <Stack.Screen name="TruthOrFalseQuestion" component={TruthOrFalseQuestionScreen} />
      <Stack.Screen name="TruthOrFalseResult" component={TruthOrFalseResultScreen} />
      <Stack.Screen name="TruthOrFalseHistory" component={TruthOrFalseHistoryScreen} />
    </Stack.Navigator>
  );
}
