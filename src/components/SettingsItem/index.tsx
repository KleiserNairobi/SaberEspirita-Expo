import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { ChevronRight, LucideIcon } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  iconColor?: string;
  showDivider?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SettingsItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightElement,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  iconColor,
  showDivider = false,
  isFirst = false,
  isLast = false,
}: SettingsItemProps) {
  const { theme } = useAppTheme();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors.card,
      borderBottomColor: theme.colors.border,
    },
    isFirst && {
      borderTopLeftRadius: theme.radius.md,
      borderTopRightRadius: theme.radius.md,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.colors.border,
    },
    isLast && {
      borderBottomLeftRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.colors.border,
    },
    !isFirst &&
      !isLast && {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.colors.border,
      },
    showDivider ? styles.withDivider : styles.withMargin,
    showDivider && !isLast && styles.dividerBorder,
  ];

  const iconContainerStyle = [
    styles.iconContainer,
    {
      borderRadius: 20, // Circular para seguir padrão do app
      backgroundColor: `${theme.colors.primary}15`,
    },
  ];

  const content = (
    <View style={containerStyle}>
      <View style={iconContainerStyle}>
        <Icon size={20} color={iconColor || theme.colors.icon} />
      </View>

      <View style={styles.textContainer}>
        <Text style={theme.text("lg", "semibold")}>{title}</Text>
        {subtitle && (
          <Text
            style={[
              theme.text("sm", "regular", theme.colors.textSecondary),
              styles.subtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: theme.colors.muted,
            true: theme.colors.primary,
          }}
          thumbColor={switchValue ? "#FFFFFF" : "#f4f3f4"}
        />
      ) : rightElement ? (
        rightElement
      ) : showChevron ? (
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      ) : null}
    </View>
  );

  if (isSwitch || !onPress) {
    return content;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  withDivider: {
    marginBottom: 0,
  },
  withMargin: {
    marginBottom: 8,
  },
  dividerBorder: {
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
});
