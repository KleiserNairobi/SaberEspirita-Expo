import React from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { User, Compass } from "lucide-react-native";

import { Message } from "@/types/chat";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Não renderiza mensagens vazias do assistente (evita mostrar balão vazio durante loading)
  if (!message.isUser && !message.text.trim()) {
    return null;
  }

  const bubbleStyle = message.isUser
    ? [styles.bubble, styles.userBubble]
    : [styles.bubble, styles.assistantBubble];

  const textStyle = message.isUser ? styles.userText : styles.assistantText;

  return (
    <View style={[styles.container, message.isUser && styles.userContainer]}>
      {/* Avatar */}
      <View style={styles.avatar}>
        {message.isUser ? (
          <User size={18} color={theme.colors.primary} />
        ) : (
          <Compass size={18} color={theme.colors.primary} strokeWidth={2} />
        )}
      </View>

      {/* Bolha de mensagem */}
      <View style={bubbleStyle}>
        {message.isUser ? (
          <Text style={textStyle}>{message.text}</Text>
        ) : (
          <Markdown style={{ body: textStyle }}>{message.text}</Markdown>
        )}

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}
