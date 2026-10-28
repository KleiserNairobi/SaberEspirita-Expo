import { useRef, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  FileText,
  HelpCircle,
  Instagram,
  Mail,
  Share2,
  Shield,
  Star,
  Trash,
  Volume2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBackground } from "@/components/AppBackground";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { Button } from "@/components/Button";
import { SettingsItem } from "@/components/SettingsItem";
import { SettingsSection } from "@/components/SettingsSection";
import { useCommunityProgress } from "@/hooks/queries/useLessonForum";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { authApiService } from "@/services/api/authApiService";
import { AccountHeader } from "@/pages/account/components/AccountHeader";
import { CommunityLevelInfoBottomSheet } from "@/pages/account/components/CommunityLevelInfoBottomSheet";
import { DeleteAccountBottomSheet } from "@/pages/account/components/DeleteAccountBottomSheet";
import { EditProfileBottomSheet } from "@/pages/account/components/EditProfileBottomSheet";
import { LogoutButton } from "@/pages/account/components/LogoutButton";
import { APP_VERSION } from "@/pages/account/constants";
import { useAccountScreen } from "@/pages/account/hooks/useAccountScreen";
import { createStyles } from "@/pages/account/styles";

export function AccountScreen() {
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
  const { isCompact } = useResponsiveLayout();
  const isTablet = !isCompact;

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
      // Exclusão lógica (LGPD/Anonimização) com pesquisa de churn via API REST Spring Boot
      await authApiService.deleteAccount(reason);
      console.log("AccountScreen: Conta excluída (anonimizada) via API REST Spring Boot com sucesso.");

      setMessageConfig({
        type: "success",
        title: "Conta excluída",
        message: "Sua conta e seus dados foram anonimizados com sucesso.",
      });
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 100);

      setTimeout(() => {
        void signOut();
      }, 2000); // 2 segundos para o usuário conseguir ler o aviso de sucesso antes do logout/redirecionamento
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir sua conta agora.";
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
          {(() => {
            const preferencesSection = (
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
            );

            const supportSection = (
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
            );

            const legalSection = (
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
            );

            const actionsSection = (
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
            );

            const dangerZoneAndLogout = (
              <>
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
                  </SettingsSection>
                )}

                {isGuest ? (
                  <View style={{ marginBottom: 24 }}>
                    <Button
                      title="Criar Conta / Entrar"
                      onPress={handleLogoutPress}
                      fullWidth
                    />
                  </View>
                ) : (
                  <LogoutButton onPress={handleLogoutPress} />
                )}
              </>
            );

            const versionBadge = (
              <View style={styles.versionBadge}>
                <View style={styles.versionDot} />
                <Text style={styles.versionBadgeText}>Saber Espírita v{APP_VERSION}</Text>
              </View>
            );

            if (isTablet) {
              return (
                <>
                  {/* Cabeçalho de Tablet Limpo */}
                  <View style={styles.tabletHeader}>
                    <View>
                      <Text style={styles.tabletTitle}>Minha Conta</Text>
                      <Text style={styles.tabletSubtitle}>
                        Gerencie suas preferências, avisos e detalhes de usuário.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tabletMainRow}>
                    {/* Coluna da Esquerda (~32%) */}
                    <View style={styles.tabletLeftColumn}>
                      <View style={styles.profileCard}>
                        <View style={{ width: "100%", alignItems: "center" }}>
                          <AccountHeader
                            displayName={displayName}
                            email={email}
                            photoURL={photoURL}
                            onEditPress={handleEditProfilePress}
                            communityLevelId={
                              (communityProgress?.communityLevelId as any) || "sementeiro"
                            }
                          />
                          <Text style={styles.profileBioText}>
                            Membro da comunidade Saber Espírita. Pratique orações, acompanhe estudos e fortaleça seu aprendizado diário.
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.editProfileButton}
                          onPress={handleEditProfilePress}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.editProfileButtonText}>
                            Editar Informações Pessoais
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {dangerZoneAndLogout}

                      {/* Versão realocada abaixo do botão Sair da Conta */}
                      <View style={styles.tabletVersionContainer}>
                        {versionBadge}
                      </View>
                    </View>

                    {/* Coluna da Direita (~68%) */}
                    <View style={styles.tabletRightColumn}>
                      {/* Preferências (altura alinha perfeitamente com ProfileCard) */}
                      {preferencesSection}

                      {/* Linha Central: Suporte em largura total */}
                      {supportSection}

                      {/* Ações e Legal em 1 coluna completa cada */}
                      {actionsSection}
                      {legalSection}
                    </View>
                  </View>
                </>
              );
            }

            return (
              <>
                <AccountHeader
                  displayName={displayName}
                  email={email}
                  photoURL={photoURL}
                  onEditPress={handleEditProfilePress}
                  communityLevelId={
                    (communityProgress?.communityLevelId as any) || "sementeiro"
                  }
                />
                {preferencesSection}
                {supportSection}
                {legalSection}
                {actionsSection}
                {dangerZoneAndLogout}

                <Text
                  style={[
                    theme.text("sm", "regular", theme.colors.muted),
                    { textAlign: "center", marginBottom: 20 },
                  ]}
                >
                  Saber Espírita v{APP_VERSION}
                </Text>
              </>
            );
          })()}
        </ScrollView>
      </AppBackground>

      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />

      <EditProfileBottomSheet
        ref={editProfileSheetRef}
        initialName={displayName}
        initialPhotoUrl={photoURL}
        onSave={handleUpdateName}
      />

      <CommunityLevelInfoBottomSheet
        ref={communityLevelInfoSheetRef}
        currentLevelId={(communityProgress?.communityLevelId as any) || "sementeiro"}
      />

      <DeleteAccountBottomSheet
        ref={deleteAccountSheetRef}
        onConfirm={handleConfirmDeleteAccount}
      />
    </SafeAreaView>
  );
}

export default AccountScreen;
