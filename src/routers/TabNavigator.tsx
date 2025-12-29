import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BellRing,
  ClipboardCheck,
  ClipboardClock,
  HeartHandshake,
  User,
} from "lucide-react-native";

import { TabParamList } from "./types";
import { AnimatedTabBar } from "@/components/AnimatedTabBar";
import { PrayNavigator } from "./PrayNavigator";
import { MeditateNavigator } from "./MeditateNavigator";
import AccountScreen from "@/pages/account";
import { StudyScreen } from "@/pages/study";
import FixPlaceholder from "@/pages/fix";

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="StudyTab"
        component={StudyScreen}
        options={{
          title: "Estude",
          tabBarIcon: ({ color, size }) => <ClipboardClock size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FixTab"
        component={FixPlaceholder}
        options={{
          title: "Fixe",
          tabBarIcon: ({ color, size }) => <ClipboardCheck size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MeditateTab"
        component={MeditateNavigator}
        options={{
          title: "Medite",
          tabBarIcon: ({ color, size }) => <BellRing size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PrayTab"
        component={PrayNavigator}
        options={{
          title: "Ore",
          tabBarIcon: ({ color, size }) => <HeartHandshake size={size} color={color} />,
        }}
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
