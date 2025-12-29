import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AlphabetIndexProps {
  onLetterPress: (letter: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function AlphabetIndex({ onLetterPress }: AlphabetIndexProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {ALPHABET.map((letter) => (
        <TouchableOpacity
          key={letter}
          onPress={() => onLetterPress(letter)}
          style={styles.letterButton}
          activeOpacity={0.6}
        >
          <Text style={styles.letter}>{letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
