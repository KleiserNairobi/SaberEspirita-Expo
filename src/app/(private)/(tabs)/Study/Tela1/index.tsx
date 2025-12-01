import { Carousel } from "@/components/Carousel";
import { Biblioteca } from "@/data/Biblioteca";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

export default function Tela1() {
  const renderHeader = () => (
    <View>
      <Text
        style={{
          fontSize: 28,
          marginHorizontal: 20,
          fontFamily: "BarlowCondensed_600SemiBold",
        }}
      >
        Olá, Nairobi!
      </Text>
      <Text
        style={{
          fontSize: 20,
          color: "#565551",
          marginHorizontal: 20,
          fontFamily: "BarlowCondensed_400Regular",
        }}
      >
        Vamos começar sua jornada de conhecimento?
      </Text>
      <View
        style={[styles.rowBetween, { marginTop: 30, marginHorizontal: 20 }]}
      >
        <Text
          style={{
            fontSize: 26,
            marginBottom: 10,
            fontFamily: "Oswald_400Regular",
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
      style={{ flex: 1, backgroundColor: "#F0F6E8" }}
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
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E3E2DA",
                borderRadius: 10,
                alignItems: "flex-start",
                marginBottom: 10,
                padding: 16,
                gap: 8,
              }}
            >
              <IconComponent size={24} color="#839278" />
              <Text style={{ fontFamily: "Oswald_300Light", fontSize: 16 }}>
                {item.title}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
