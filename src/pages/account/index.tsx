import React from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Volume2,
  Bell,
  BellRing,
  Mail,
  HelpCircle,
  FileText,
  Shield,
  Star,
  Instagram,
  Share2,
} from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { SettingsItem } from "@/components/SettingsItem";
import { SettingsSection } from "@/components/SettingsSection";
import { AccountHeader } from "@/pages/account/components/AccountHeader";
import { LogoutButton } from "@/pages/account/components/LogoutButton";
import { APP_VERSION } from "@/pages/account/constants";
import { createStyles } from "@/pages/account/styles";
import { useAccountScreen } from "@/pages/account/hooks/useAccountScreen";

export default function AccountScreen() {
  const {
    theme,
    displayName,
    email,
    themeIcon,
    themeLabel,
    preferences,
    handleThemeChange,
    handleContactUs,
    handleFAQ,
    handleTerms,
    handlePrivacy,
    handleRateApp,
    handleInstagram,
    handleShareApp,
    handleLogout,
  } = useAccountScreen();

  const styles = createStyles(theme);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <AppBackground>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AccountHeader displayName={displayName} email={email} />

          {/* Grupo 1: Preferências */}
          <SettingsSection title="Preferências">
            <SettingsItem
              icon={themeIcon}
              title="Tema"
              subtitle={themeLabel}
              onPress={handleThemeChange}
              showDivider
              isFirst
            />
            <SettingsItem
              icon={Volume2}
              title="Efeitos Sonoros"
              isSwitch
              switchValue={preferences.soundEffects}
              onSwitchChange={preferences.setSoundEffects}
              showDivider
              isLast
            />
          </SettingsSection>

          {/* Grupo 2: Notificações */}
          <SettingsSection title="Notificações">
            <SettingsItem
              icon={Bell}
              title="Atualizações do App"
              subtitle="Receba notificações sobre novas versões"
              isSwitch
              switchValue={preferences.appUpdateNotifications}
              onSwitchChange={preferences.setAppUpdateNotifications}
              showDivider
              isFirst
            />
            <SettingsItem
              icon={BellRing}
              title="Notificações de Curso"
              subtitle="Lembretes sobre seus cursos em andamento"
              isSwitch
              switchValue={preferences.courseNotifications}
              onSwitchChange={preferences.setCourseNotifications}
              showDivider
              isLast
            />
          </SettingsSection>

          {/* Grupo 3: Suporte */}
          <SettingsSection title="Suporte">
            <SettingsItem
              icon={Mail}
              title="Fale Conosco"
              subtitle="Envie suas dúvidas ou sugestões"
              onPress={handleContactUs}
              showDivider
              isFirst
            />
            <SettingsItem
              icon={HelpCircle}
              title="Perguntas Frequentes"
              onPress={handleFAQ}
              showDivider
              isLast
            />
          </SettingsSection>

          {/* Grupo 4: Legal */}
          <SettingsSection title="Legal">
            <SettingsItem
              icon={FileText}
              title="Termos de Uso"
              onPress={handleTerms}
              showDivider
              isFirst
            />
            <SettingsItem
              icon={Shield}
              title="Política de Privacidade"
              onPress={handlePrivacy}
              showDivider
              isLast
            />
          </SettingsSection>

          {/* Grupo 5: Ações */}
          <SettingsSection title="Ações">
            <SettingsItem
              icon={Star}
              title="Avaliar App"
              subtitle="Ajude-nos com sua avaliação"
              onPress={handleRateApp}
              showDivider
              isFirst
            />
            <SettingsItem
              icon={Instagram}
              title="Siga-nos"
              subtitle="@comunidade.saberespirita"
              onPress={handleInstagram}
              showDivider
            />
            <SettingsItem
              icon={Share2}
              title="Compartilhar App"
              subtitle="Indique para seus amigos"
              onPress={handleShareApp}
              showDivider
              isLast
            />
          </SettingsSection>

          <LogoutButton onPress={handleLogout} />

          <Text
            style={[
              theme.text("sm", "regular", theme.colors.muted),
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            Saber Espírita v{APP_VERSION}
          </Text>
        </ScrollView>
      </AppBackground>
    </SafeAreaView>
  );
}
