import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { AppBackground } from "@/components/AppBackground";
import { LegalHeader } from "@/components/LegalHeader";
import { LegalSection } from "@/components/LegalSection";
import { TERMS_OF_USE } from "./constants";
import { useAppTheme } from "@/hooks/useAppTheme";

export function TermsScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top"]}
    >
      <AppBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <LegalHeader
            title="Termos de Uso"
            icon={FileText}
            lastUpdate={TERMS_OF_USE.lastUpdate}
          />

          {TERMS_OF_USE.sections.map((section, index) => (
            <LegalSection
              key={section.id}
              icon={section.icon}
              title={section.title}
              summary={section.summary}
              content={section.content}
              isFirst={index === 0}
              isLast={index === TERMS_OF_USE.sections.length - 1}
            />
          ))}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: theme.colors.primary,
              marginHorizontal: 20,
              marginTop: 24,
              marginBottom: 32,
              paddingVertical: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={20} color={theme.colors.onPrimary} />
            <Text
              style={{ color: theme.colors.onPrimary, fontSize: 18, fontWeight: "600" }}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </AppBackground>
    </SafeAreaView>
  );
}
