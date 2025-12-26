import React from "react";
import { Text, TextStyle } from "react-native";
import { useInputContext } from "./InputContext";
import { styles } from "./styles";

interface LabelProps {
  text: string;
  style?: TextStyle;
}

export const InputLabel = ({ text, style }: LabelProps) => {
  const { required, error, isFocused } = useInputContext();
  const labelStyle = [
    styles.label,
    style,
    isFocused && styles.labelFocused,
    error && styles.labelError,
  ];

  return (
    <Text style={labelStyle}>
      {text}
      {required && <Text style={styles.requiredIndicator}> *</Text>}
    </Text>
  );
};
