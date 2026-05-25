import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MessageCircle, MessageSquare, X } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ITheme } from "@/configs/theme/types";

interface LessonActionsFABProps {
  visible: boolean;
  hasNewForum: boolean;
  onAskAI: () => void;
  onOpenForum: () => void;
  forumEnabled?: boolean;
}

export function LessonActionsFAB({
  visible,
  hasNewForum,
  onAskAI,
  onOpenForum,
  forumEnabled = false,
}: LessonActionsFABProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const [expanded, setExpanded] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const actionsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) setExpanded(false);
    Animated.spring(scale, {
      toValue: visible ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [visible, scale]);

  useEffect(() => {
    Animated.timing(actionsOpacity, {
      toValue: expanded ? 1 : 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  }, [actionsOpacity, expanded]);

  function toggleExpanded() {
    setExpanded((v) => !v);
  }

  function handleMainButtonPress() {
    if (forumEnabled) {
      toggleExpanded();
    } else {
      onAskAI();
    }
  }

  function handleAskAI() {
    setExpanded(false);
    onAskAI();
  }

  function handleOpenForum() {
    setExpanded(false);
    onOpenForum();
  }

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.container,
        {
          transform: [{ scale }],
        },
      ]}
    >
      {forumEnabled && (
        <Animated.View style={[styles.actionsRow, { opacity: actionsOpacity }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAskAI}
            activeOpacity={0.8}
            accessibilityLabel="Perguntar à IA"
          >
            <MessageSquare size={20} color={theme.colors.onPrimary} strokeWidth={2.5} />
            <Text style={styles.actionLabel}>Sr. Allan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOpenForum}
            activeOpacity={0.8}
            accessibilityLabel="Abrir Fórum"
          >
            <View style={styles.forumIconWrap}>
              <MessageCircle size={20} color={theme.colors.onPrimary} strokeWidth={2.5} />
              {hasNewForum && <View style={styles.newDot} />}
            </View>
            <Text style={styles.actionLabel}>Fórum</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleMainButtonPress}
        activeOpacity={0.8}
        accessibilityLabel={forumEnabled ? "Ações da aula" : "Perguntar à IA"}
      >
        {expanded && forumEnabled ? (
          <X size={22} color={theme.colors.onPrimary} strokeWidth={2.5} />
        ) : (
          <MessageSquare size={22} color={theme.colors.onPrimary} strokeWidth={2.5} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      right: theme.spacing.lg,
      bottom: 100,
      zIndex: 999,
      alignItems: "flex-end",
    },
    actionsRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    actionLabel: {
      ...theme.text("sm", "semibold", theme.colors.onPrimary),
    },
    mainButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    forumIconWrap: {
      position: "relative",
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    newDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#FF3B30",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
  });

