import { Tabs } from "expo-router";

import { AnimatedTabBar } from "@/components/AnimatedTabBar";
import {
  BellRing,
  ClipboardCheck,
  ClipboardClock,
  HeartHandshake,
  UserPen,
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Study"
        options={{
          title: "Estude",
          tabBarIcon: ({ color, size }) => (
            <ClipboardClock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Fix"
        options={{
          title: "Fixe",
          tabBarIcon: ({ color, size }) => (
            <ClipboardCheck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Meditate"
        options={{
          title: "Medite",
          tabBarIcon: ({ color, size }) => (
            <BellRing size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Pray"
        options={{
          title: "Ore",
          tabBarIcon: ({ color, size }) => (
            <HeartHandshake size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <UserPen size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
