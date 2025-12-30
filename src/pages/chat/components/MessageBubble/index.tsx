import React from "react";
import { View, Text, TouchableOpacity, Share, Alert } from "react-native";
import Markdown from "react-native-markdown-display";
import { User, Compass, Share2 } from "lucide-react-native";

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

  async function handleShare() {
    try {
      await Share.share({
        message: `📚 Resposta do Sr. Allan:\n\n${message.text}\n\n---\nCompartilhado via App Saber Espírita`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar a mensagem");
    }
  }

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
          <Markdown
            style={{
              body: textStyle,
              heading1: {
                ...theme.text("md", "bold"),
                color: theme.colors.text,
                marginTop: 8,
                marginBottom: 6,
              },
              heading2: {
                ...theme.text("md", "semibold"),
                color: theme.colors.text,
                marginTop: 12,
                marginBottom: 4,
              },
              heading3: {
                ...theme.text("md", "medium"),
                color: theme.colors.text,
                marginTop: 10,
                marginBottom: 3,
              },
              paragraph: {
                ...theme.text("md", "regular"),
                color: theme.colors.text,
                marginTop: 0,
                marginBottom: 6,
                lineHeight: 20,
              },
              strong: {
                ...theme.text("md", "semibold"),
                color: theme.colors.text,
              },
              em: {
                ...theme.text("md", "regular"),
                fontStyle: "italic",
                color: theme.colors.text,
              },
              bullet_list: {
                marginTop: 4,
                marginBottom: 6,
              },
              ordered_list: {
                marginTop: 4,
                marginBottom: 6,
              },
              list_item: {
                ...theme.text("md", "regular"),
                color: theme.colors.text,
                marginTop: 2,
                marginBottom: 2,
                lineHeight: 20,
              },
              code_inline: {
                ...theme.text("sm", "regular"),
                backgroundColor: theme.colors.muted + "30",
                color: theme.colors.primary,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
              },
              code_block: {
                ...theme.text("sm", "regular"),
                backgroundColor: theme.colors.muted + "20",
                color: theme.colors.text,
                padding: 8,
                borderRadius: 8,
                marginTop: 4,
                marginBottom: 4,
              },
              blockquote: {
                backgroundColor: theme.colors.muted + "10",
                borderLeftWidth: 3,
                borderLeftColor: theme.colors.primary,
                paddingLeft: 12,
                paddingVertical: 8,
                marginTop: 4,
                marginBottom: 6,
              },
              hr: {
                backgroundColor: theme.colors.border,
                height: 1,
                marginVertical: theme.spacing.md,
              },
            }}
          >
            {message.text}
          </Markdown>
        )}

        {/* Footer: Compartilhar + Timestamp */}
        <View style={styles.footer}>
          {!message.isUser && (
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={14} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}
