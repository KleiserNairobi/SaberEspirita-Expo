import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
    }>;
  };
  descriptors: {
    [key: string]: {
      options: {
        tabBarLabel?: string | ((props: any) => React.ReactNode);
        title?: string;
        tabBarIcon?: (props: {
          focused: boolean;
          color: string;
          size: number;
        }) => React.ReactNode;
      };
    };
  };
  navigation: {
    emit: (event: any) => any;
    navigate: (name: string) => void;
  };
}

interface TabItemProps {
  route: TabBarProps["state"]["routes"][0];
  options: TabBarProps["descriptors"][string]["options"];
  isFocused: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ route, options, isFocused, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2, // Aumenta o ícone
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Volta ao tamanho normal
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]);

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
        ? options.title
        : route.name;

  return (
    <TouchableOpacity
      key={route.key}
      onPress={onPress}
      style={styles.item}
      activeOpacity={0.7}
    >
      {options.tabBarIcon && (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {options.tabBarIcon({
            focused: isFocused,
            color: isFocused ? "#FFFFFF" : "#D8D6C9",
            size: 24,
          })}
        </Animated.View>
      )}
      <Text
        style={{
          color: isFocused ? "#FFFFFF" : "#D8D6C9",
          fontSize: 12,
          marginTop: 2,
        }}
      >
        {typeof label === "string" ? label : route.name}
      </Text>
    </TouchableOpacity>
  );
};

export const AnimatedTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets();
  const BASE_HEIGHT = 78;
  const safeBottom =
    insets.bottom > 0
      ? insets.bottom + 10 // iPhones modernos e Android gestual
      : 22; // fallback para Android com 3 botões

  return (
    <View
      style={[
        styles.container,
        {
          height: BASE_HEIGHT + safeBottom,
          paddingBottom: safeBottom,
        },
      ]}
    >
      <BlurView intensity={60} tint="dark" style={styles.blurContainer}>
        <View style={styles.items}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            function onPress() {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }

            return (
              <TabItem
                key={route.key}
                route={route}
                options={options}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    overflow: "hidden",
  },
  blurContainer: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(131, 146, 120, 0.8)",
  },
  items: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
});
