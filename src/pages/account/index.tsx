import { useRef, useState } from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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
  Trash,
} from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { SettingsItem } from "@/components/SettingsItem";
import { Button } from "@/components/Button";
import { SettingsSection } from "@/components/SettingsSection";
import { AccountHeader } from "@/pages/account/components/AccountHeader";
import { LogoutButton } from "@/pages/account/components/LogoutButton";
import { APP_VERSION } from "@/pages/account/constants";
import { createStyles } from "@/pages/account/styles";
import { useAccountScreen } from "@/pages/account/hooks/useAccountScreen";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";

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
    signOut,
    isGuest,
  } = useAccountScreen();

  const styles = createStyles(theme);

  // BottomSheet Logic for Logout and Delete Account
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  function handleLogoutPress() {
    if (isGuest) {
      setMessageConfig({
        type: "question",
        title: "Criar Conta / Entrar",
        message:
          "Deseja criar uma conta ou fazer login para salvar seu progresso e acessar todos os recursos?",
        primaryButton: {
          label: "Sim, conectar",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error("Erro ao sair do modo visitante:", error);
            }
          },
        },
        secondaryButton: {
          label: "Continuar como visitante",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
          },
        },
      });
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 100);
      return;
    }

    setMessageConfig({
      type: "question",
      title: "Sair",
      message: "Tem certeza que deseja sair da sua conta?",
      primaryButton: {
        label: "Sair",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Erro ao fazer logout:", error);
          }
        },
      },
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {
          bottomSheetRef.current?.dismiss();
        },
      },
    });
    // Pequeno delay para garantir que a config foi setada antes de abrir
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 100);
  }

  function handleDeleteAccountPress() {
    setMessageConfig({
      type: "question",
      title: "Excluir Conta",
      message:
        "Você será redirecionado para uma página onde poderá solicitar a exclusão da sua conta e de seus dados. Deseja continuar?",
      primaryButton: {
        label: "Continuar",
        onPress: () => {
          Linking.openURL("https://kleisernairobi.github.io/SaberEspirita-Exclusion/");
          bottomSheetRef.current?.dismiss();
        },
      },
      secondaryButton: {
        label: "Cancelar",
        onPress: () => {
          bottomSheetRef.current?.dismiss();
        },
      },
    });
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 100);
  }

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

          {!isGuest && (
            <SettingsSection title="Zona de Perigo">
              <SettingsItem
                icon={Trash}
                title="Excluir Conta"
                subtitle="Solicitar exclusão de conta e dados"
                onPress={handleDeleteAccountPress}
                showDivider={false} // Removing divider since it's the only item
                titleStyle={{ color: theme.colors.error }} // Optional: make it red
                isFirst
                isLast
              />
            </SettingsSection>
          )}

          {isGuest ? (
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <Button
                title="Criar Conta / Entrar"
                onPress={handleLogoutPress}
                fullWidth
              />
            </View>
          ) : (
            <LogoutButton onPress={handleLogoutPress} />
          )}

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

      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
