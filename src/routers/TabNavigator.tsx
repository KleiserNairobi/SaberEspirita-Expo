import React, { useEffect, useMemo } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  BellRing,
  ClipboardCheck,
  ClipboardClock,
  HeartHandshake,
  User,
} from "lucide-react-native";

import { AnimatedTabBar } from "@/components/AnimatedTabBar";
import { AccountScreen } from "@/pages/account";
import { StudyScreen } from "@/pages/study";
import {
  getInitialStudyCategoryForGoal,
  getInitialTabForGoal,
  useOnboardingStore,
} from "@/stores/onboardingStore";

import { FixNavigator } from "./FixNavigator";
import { MeditateNavigator } from "./MeditateNavigator";
import { PrayNavigator } from "./PrayNavigator";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const answers = useOnboardingStore((state) => state.answers);
  const initialTabConsumed = useOnboardingStore((state) => state.initialTabConsumed);
  const consumeInitialTab = useOnboardingStore((state) => state.consumeInitialTab);

  const initialRouteName = useMemo(() => {
    if (!initialTabConsumed && answers.goal) {
      return getInitialTabForGoal(answers.goal);
    }
    return "StudyTab";
  }, [initialTabConsumed, answers.goal]);

  const initialStudyCategory = useMemo(() => {
    if (!initialTabConsumed && answers.goal) {
      return getInitialStudyCategoryForGoal(answers.goal);
    }
    return undefined;
  }, [initialTabConsumed, answers.goal]);

  useEffect(() => {
    if (!initialTabConsumed && answers.goal) {
      consumeInitialTab();
    }
  }, [initialTabConsumed, answers.goal, consumeInitialTab]);

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="StudyTab"
        component={StudyScreen}
        initialParams={initialStudyCategory ? { initialCategory: initialStudyCategory } : undefined}
        options={{
          title: "Estude",
          tabBarIcon: ({ color, size }) => <ClipboardClock size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FixTab"
        component={FixNavigator}
        options={({ route }: { route: any }) => ({
          title: "Fixe",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <ClipboardCheck size={size} color={color} />
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            if (routeName && routeName !== "FixHome") {
              return { display: "none" };
            }
            return undefined;
          })(route),
        })}
      />
      <Tab.Screen
        name="MeditateTab"
        component={MeditateNavigator}
        options={({ route }: { route: any }) => ({
          title: "Medite",
          tabBarIcon: ({ color, size }) => <BellRing size={size} color={color} />,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            if (routeName && routeName !== "MeditateHome") {
              return { display: "none" };
            }
            return undefined;
          })(route),
        })}
      />
      <Tab.Screen
        name="PrayTab"
        component={PrayNavigator}
        options={({ route }: { route: any }) => ({
          title: "Ore",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <HeartHandshake size={size} color={color} />
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            if (routeName && routeName !== "PrayHome") {
              return { display: "none" };
            }
            return undefined;
          })(route),
        })}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{
          title: "Conta",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
