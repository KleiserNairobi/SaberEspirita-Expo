import React from "react";
import { TouchableOpacity } from "react-native";

export function TabBarButton(props: any) {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          flex: 1,
          paddingVertical: 8,
          alignItems: "center",
          justifyContent: "center",
        },
        props.style,
      ]}
      activeOpacity={0.8}
      hitSlop={10}
    />
  );
}
