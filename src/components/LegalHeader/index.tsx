import React from "react";
import { View, Text } from "react-native";

import { type LucideIcon } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface LegalHeaderProps {
  title: string;
  icon: LucideIcon;
  lastUpdate: string;
}

export function LegalHeader({ title, icon: Icon, lastUpdate }: LegalHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Icon size={40} color={theme.colors.background} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.lastUpdate}>Última atualização: {lastUpdate}</Text>
    </View>
  );
}
