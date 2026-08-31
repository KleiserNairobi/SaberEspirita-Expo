import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCurrentUserScore, useLeaderboard } from "@/hooks/queries/useLeaderboard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { EditProfileBottomSheet } from "@/pages/account/components/EditProfileBottomSheet";
import { authApiService } from "@/services/api/authApiService";
import { mediaApiService } from "@/services/api/mediaApiService";
import { useAuthStore } from "@/stores/authStore";
import { TimeFilter, TimeFilterEnum } from "@/types/leaderboard";
import { loadBoolean, saveBoolean } from "@/utils/Storage";
import { formatUserName } from "@/utils/formatName";

import { LeaderboardFilter } from "./components/LeaderboardFilter";
import { LeaderboardPodium } from "./components/Podium";
import { RankingList } from "./components/RankingList";
import { createStyles } from "./styles";

const HIDE_HINT_KEY = "@hide_leaderboard_hint";

export function LeaderboardScreen() {
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>(TimeFilterEnum.WEEK);
  const [showHint, setShowHint] = useState(false);
  const queryClient = useQueryClient();

  const { user, isGuest } = useAuthStore();
  const editProfileRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const isHintHidden = loadBoolean(HIDE_HINT_KEY);
    if (!isHintHidden && !isGuest) {
      setShowHint(true);
    }
  }, [isGuest]);

  function handleCloseHint() {
    setShowHint(false);
    saveBoolean(HIDE_HINT_KEY, true);
  }

  function handleEditName() {
    editProfileRef.current?.present();
  }

  async function handleUpdateProfile(newName: string, newPhotoUri?: string | null) {
    if (!user) return;
    try {
      let finalPhotoUrl = user.photoURL;

      if (newPhotoUri === "") {
        await authApiService.updateProfile({ userName: newName, photoUrl: "" });
        finalPhotoUrl = null;
      } else if (
        newPhotoUri &&
        (newPhotoUri.startsWith("file://") ||
          newPhotoUri.startsWith("content://") ||
          newPhotoUri.startsWith("ph://"))
      ) {
        const res = await mediaApiService.uploadAvatar(newPhotoUri, "avatar.jpg");
        finalPhotoUrl = res.url;
        await authApiService.updateProfile({ userName: newName, photoUrl: res.url });
      } else {
        await authApiService.updateProfile({ userName: newName });
      }

      useAuthStore.getState().setUser({
        ...user,
        displayName: newName,
        photoURL: finalPhotoUrl,
      });

      handleCloseHint();
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (error) {
      console.error("Erro ao atualizar perfil no placar:", error);
      throw error;
    }
  }

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Placar</Text>
        </View>
        <View
          style={[
            styles.content,
            { justifyContent: "center", alignItems: "center", padding: 20 },
          ]}
        >
          <Text
            style={[
              theme.text("lg", "semibold"),
              { textAlign: "center", marginBottom: 10 },
            ]}
          >
            Recurso exclusivo para membros
          </Text>
          <Text
            style={[
              theme.text("md", "regular", theme.colors.textSecondary),
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            Crie uma conta para participar do ranking junto com outros estudantes.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={() => {
              // @ts-ignore
              navigation.navigate("Tabs", { screen: "AccountTab" });
            }}
          >
            <Text style={{ ...theme.text("md", "medium"), color: "#FFFFFF" }}>
              Criar minha conta
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { data: rawPlayers = [], isLoading, refetch: refetchLeaderboard } = useLeaderboard(selectedFilter);
  const { data: myScoreData, refetch: refetchScore } = useCurrentUserScore();

  useFocusEffect(
    React.useCallback(() => {
      refetchLeaderboard();
      refetchScore();
    }, [refetchLeaderboard, refetchScore])
  );

  // Limitação estrita do placar ao Top 100
  const top100Players = rawPlayers.slice(0, 100);
  const topThree = top100Players.slice(0, 3);
  const others = top100Players.slice(3, 100);

  // Verifica se o usuário autenticado está entre os 100 primeiros colocados
  const isUserInTop100 = top100Players.some(
    (p) => p.isCurrentUser || (user?.uid && p.userId === user.uid)
  );

  // Card fixo do rodapé para o usuário logado caso NÃO esteja no Top 100
  const userFooterData =
    !isUserInTop100 && !isGuest && user
      ? myScoreData || {
          userId: user.uid,
          userName: user.displayName || "Você",
          photoURL: user.photoURL || undefined,
          score: 0,
          position: 0,
          isCurrentUser: true,
        }
      : null;

  const primaryColorHex = theme.colors.primary.replace("#", "");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Placar</Text>
      </View>

      {/* Hint Banner */}
      {showHint && (
        <View style={styles.hintContainer}>
          <View style={styles.hintIconContainer}>
            <User size={18} color={theme.colors.primary} />
          </View>
          <Text style={styles.hintText}>
            Quer alterar sua foto ou apelido no placar?{" "}
            <Text style={styles.hintAction} onPress={handleEditName}>
              Personalizar
            </Text>
          </Text>
          <TouchableOpacity style={styles.closeButtonHint} onPress={handleCloseHint}>
            <X size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter */}
      <LeaderboardFilter
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Content */}
      <View style={styles.content}>
        {isLoading && rawPlayers.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Carregando ranking...</Text>
          </View>
        ) : rawPlayers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={styles.emptyMessage}>
              {selectedFilter === TimeFilterEnum.WEEK
                ? "Seja o primeiro a responder um quiz esta semana!"
                : selectedFilter === TimeFilterEnum.MONTH
                  ? "Seja o primeiro a responder um quiz este mês!"
                  : "Ainda não há registros no ranking geral."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={others}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => <RankingList player={item} />}
            ListHeaderComponent={<LeaderboardPodium players={topThree} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={Platform.OS === "android"}
          />
        )}
      </View>

      {/* Card Fixo de Rodapé para Usuário Logado Fora do Top 100 */}
      {userFooterData && (
        <View style={styles.userFooterContainer}>
          <View style={styles.userFooterCard}>
            <View style={styles.footerRankContainer}>
              <Text style={styles.footerRankText}>
                {userFooterData.position > 0 ? `${userFooterData.position}º` : "-"}
              </Text>
            </View>
            <Image
              source={{
                uri:
                  userFooterData.photoURL?.trim() ||
                  `https://ui-avatars.com/api/?background=${primaryColorHex}&color=fff&name=${encodeURIComponent(
                    formatUserName(userFooterData.userName)
                  )}&bold=true&font-size=0.35&format=png`,
              }}
              style={styles.footerAvatar}
            />
            <View style={styles.footerContent}>
              <Text style={styles.footerLabel}>Sua Posição</Text>
              <Text style={styles.footerName} numberOfLines={1}>
                {formatUserName(userFooterData.userName)}
              </Text>
            </View>
            <Text style={styles.footerScore}>{userFooterData.score} pts</Text>
          </View>
        </View>
      )}

      <EditProfileBottomSheet
        ref={editProfileRef}
        initialName={user?.displayName || ""}
        initialPhotoUrl={user?.photoURL}
        onSave={handleUpdateProfile}
      />
    </SafeAreaView>
  );
}
