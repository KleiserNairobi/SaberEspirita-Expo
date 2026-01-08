import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
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
import { FixNavigator } from "./FixNavigator";
import AccountScreen from "@/pages/account";
import { StudyScreen } from "@/pages/study";

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
