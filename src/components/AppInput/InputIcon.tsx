import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { useInputContext } from "./InputContext";
import { styles } from "./styles";

interface IconProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const InputIcon = ({ children, onPress, style }: IconProps) => {
  const { iconPosition } = useInputContext();

  const iconContainerStyle = [
    styles.iconContainer,
    iconPosition === "left" ? styles.iconLeft : styles.iconRight,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={iconContainerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={iconContainerStyle}>{children}</View>;
};
