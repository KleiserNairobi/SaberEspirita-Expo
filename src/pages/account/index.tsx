import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { httpsCallable } from "firebase/functions";

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
import { EditProfileBottomSheet } from "@/pages/account/components/EditProfileBottomSheet";
import { CommunityLevelInfoBottomSheet } from "@/pages/account/components/CommunityLevelInfoBottomSheet";
import { DeleteAccountBottomSheet } from "@/pages/account/components/DeleteAccountBottomSheet";
import { functions } from "@/configs/firebase/firebase";
import { useCommunityProgress } from "@/hooks/queries/useLessonForum";

export default function AccountScreen() {
  const {
    theme,
    displayName,
    email,
    photoURL,
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
    handleUpdateName,
    signOut,
    isGuest,
  } = useAccountScreen();

  const { data: communityProgress } = useCommunityProgress();

  const styles = createStyles(theme);

  // BottomSheet Logic
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const editProfileSheetRef = useRef<BottomSheetModal>(null);
  const communityLevelInfoSheetRef = useRef<BottomSheetModal>(null);
  const deleteAccountSheetRef = useRef<BottomSheetModal>(null);
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
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 100);
  }

  function handleDeleteAccountPress() {
    deleteAccountSheetRef.current?.present();
  }

  async function handleConfirmDeleteAccount(reason: string) {
    setMessageConfig({
      type: "info",
      title: "Excluindo...",
      message: "Aguarde enquanto removemos sua conta e seus dados.",
    });
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 100);

    try {
      const deleteFn = httpsCallable(functions, "deleteMyAccount");
      await deleteFn({ confirm: true, reason });

      setMessageConfig({
        type: "success",
        title: "Conta excluída",
        message: "Sua conta e seus dados foram removidos com sucesso.",
      });
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 100);

      setTimeout(() => {
        void signOut();
      }, 2000); // 2 segundos para o usuário conseguir ler o aviso de sucesso antes do logout/redirecionamento
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível excluir sua conta agora.";
      setMessageConfig({
        type: "error",
        title: "Erro ao excluir",
        message,
      });
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 100);
    }
  }

  function handleEditProfilePress() {
    if (isGuest) {
      handleLogoutPress();
      return;
    }
    editProfileSheetRef.current?.present();
  }

  function handleCommunityLevelInfoPress() {
    communityLevelInfoSheetRef.current?.present();
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
          <AccountHeader 
            displayName={displayName} 
            email={email}
            photoURL={photoURL}
            onEditPress={handleEditProfilePress}
            communityLevelId={
              (communityProgress?.communityLevelId as any) || "sementeiro"
            }
          />

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
              title="Como funciona meu nível?"
              subtitle="Critérios de reconhecimento simbólico"
              onPress={handleCommunityLevelInfoPress}
              showDivider
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
                showDivider={false}
                titleStyle={{ color: theme.colors.error }}
                isFirst
                isLast
              />
              <Text
                style={[
                  theme.text("xs", "regular", theme.colors.muted),
                  { paddingHorizontal: 16, marginTop: 8, lineHeight: 16, textAlign: "center" }
                ]}
              >
                Encontrou alguma resposta errada ou problema técnico? Por favor, nos envie um relato pelo suporte antes de apagar sua conta.
              </Text>
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
      
      <EditProfileBottomSheet 
        ref={editProfileSheetRef}
        initialName={displayName}
        onSave={handleUpdateName}
      />

      <CommunityLevelInfoBottomSheet
        ref={communityLevelInfoSheetRef}
        currentLevelId={
          (communityProgress?.communityLevelId as any) || "sementeiro"
        }
      />

      <DeleteAccountBottomSheet
        ref={deleteAccountSheetRef}
        onConfirm={handleConfirmDeleteAccount}
      />
    </SafeAreaView>
  );
}
