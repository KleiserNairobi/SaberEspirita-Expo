import { Carousel } from "@/components/Carousel";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Biblioteca } from "@/data/Biblioteca";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

export default function Tela1() {
  const { user, signOut } = useAuth();
  const { themeType, toggleTheme, theme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderHeader = () => (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "BarlowCondensed_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Olá, {user?.email?.split("@")[0] || "Usuário"}!
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: theme.colors.textSecondary,
              fontFamily: "BarlowCondensed_400Regular",
            }}
          >
            Vamos começar sua jornada de conhecimento?
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: theme.colors.secondary,
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Ionicons
              name={themeType === "light" ? "moon-outline" : "sunny-outline"}
              size={18}
              color="#FFFFFF"
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontFamily: "BarlowCondensed_600SemiBold",
              }}
            >
              {themeType === "light" ? "Escuro" : "Claro"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "#ff3b30",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "BarlowCondensed_600SemiBold",
              }}
            >
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[styles.rowBetween, { marginTop: 30, marginHorizontal: 20 }]}
      >
        <Text
          style={{
            fontSize: 26,
            marginBottom: 10,
            fontFamily: "Oswald_400Regular",
            color: theme.colors.text,
          }}
        >
          Populares
        </Text>
        {/* <Text
          style={{
            fontFamily: "Oswald_300Light",
            fontSize: 16,
            color: "#565551",
          }}
        >
          Ver todos
        </Text> */}
      </View>

      <Carousel />

      <View
        style={[styles.rowBetween, { marginTop: 30, marginHorizontal: 20 }]}
      >
        <Text
          style={{
            fontSize: 26,
            marginBottom: 10,
            fontFamily: "Oswald_400Regular",
            color: theme.colors.text,
          }}
        >
          Explore a Biblioteca
        </Text>
        {/* <Text
          style={{
            fontFamily: "Oswald_300Light",
            fontSize: 16,
            color: "#565551",
          }}
        >
          Ver todos
        </Text> */}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top"]}
    >
      <FlatList
        data={Biblioteca}
        numColumns={3}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 200 }}
        columnWrapperStyle={{ marginHorizontal: 20, gap: 10 }}
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <View
              style={{
                flex: 1,
                height: 110,
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 10,
                alignItems: "flex-start",
                marginBottom: 10,
                padding: 16,
                gap: 8,
              }}
            >
              <IconComponent size={24} color={theme.colors.icon} />
              <Text
                style={{
                  fontFamily: "Oswald_300Light",
                  fontSize: 16,
                  color: theme.colors.text,
                }}
              >
                {item.title}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
