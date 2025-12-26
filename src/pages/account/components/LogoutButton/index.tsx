import React from "react";
import { TouchableOpacity, Text } from "react-native";

import { LogOut } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.logoutButton,
        {
          backgroundColor: `${theme.colors.error}25`, // 15% opacity (26 em hex)
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <LogOut size={20} color={theme.colors.error} style={styles.logoutIcon} />
      <Text style={theme.text("md", "medium", theme.colors.error)}>Sair da Conta</Text>
    </TouchableOpacity>
  );
}
