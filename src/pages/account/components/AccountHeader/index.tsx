import { Leaf, Pencil, Sprout, TreePalm } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AccountHeaderProps {
  displayName: string;
  email: string;
  onEditPress?: () => void;
  communityLevelId?: "sementeiro" | "cultivador" | "arvore_frondosa";
}

const levelConfig = {
  sementeiro: { label: "Sementeiro", Icon: Sprout },
  cultivador: { label: "Cultivador", Icon: Leaf },
  arvore_frondosa: { label: "Árvore Frondosa", Icon: TreePalm },
};

export function AccountHeader({
  displayName,
  email,
  onEditPress,
  communityLevelId,
}: AccountHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const level = communityLevelId ? levelConfig[communityLevelId] : null;

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.avatarSection}
        onPress={onEditPress}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          <View style={styles.editBadge}>
            <Pencil size={14} color={theme.colors.onPrimary} />
          </View>
        </View>

        <View style={styles.nameRow}>
          <Text style={theme.text("xxl", "semibold")}>{displayName}</Text>
          {!!level && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 }}>
              <level.Icon size={14} color={theme.colors.textSecondary} />
              <Text style={theme.text("sm", "semibold", theme.colors.textSecondary)}>
                {level.label}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Text style={theme.text("lg", "semibold", theme.colors.textSecondary)}>
        {email}
      </Text>
    </View>
  );
}
