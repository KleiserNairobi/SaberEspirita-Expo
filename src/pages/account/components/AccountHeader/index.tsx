import { Leaf, Pencil, Sprout, TreePalm } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AccountHeaderProps {
  displayName: string;
  email?: string;
  photoURL?: string | null;
  onEditPress?: () => void;
  communityLevelId?: "sementeiro" | "cultivador" | "arvore_frondosa";
}

const levelConfig = {
  sementeiro: { label: "Sementeiro(a)", Icon: Sprout },
  cultivador: { label: "Cultivador(a)", Icon: Leaf },
  arvore_frondosa: { label: "Árvore Frondosa", Icon: TreePalm },
};

export function AccountHeader({
  displayName,
  onEditPress,
  communityLevelId,
}: AccountHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const level = communityLevelId ? levelConfig[communityLevelId] : null;

  const badgeColor =
    communityLevelId === "arvore_frondosa"
      ? theme.colors.reflection
      : communityLevelId === "cultivador"
        ? theme.colors.primary
        : theme.colors.textSecondary;

  const badgeBg =
    communityLevelId === "arvore_frondosa"
      ? `${theme.colors.reflection}20`
      : communityLevelId === "cultivador"
        ? `${theme.colors.primary}20`
        : `${theme.colors.border}60`;

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

        <Text style={theme.text("xxl", "semibold")}>{displayName}</Text>

        {!!level && (
          <View style={[styles.levelBadge, { backgroundColor: badgeBg }]}>
            <level.Icon size={12} color={badgeColor} style={{ flexShrink: 0 }} />
            <Text
              style={[
                theme.text("xs", "semibold"),
                { color: badgeColor },
              ]}
            >
              {level.label}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
