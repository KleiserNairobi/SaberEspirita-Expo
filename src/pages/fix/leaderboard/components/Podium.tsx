import React, { useEffect, useState } from "react";

import { Image, Text, View } from "react-native";

import { Crown } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ILeaderboardUser } from "@/types/leaderboard";
import { formatUserName } from "@/utils/formatName";

import { createStyles } from "../styles";

interface Props {
  players: ILeaderboardUser[];
}

export function LeaderboardPodium({ players }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  if (players.length === 0) return null;

  const first = players[0];
  const second = players[1];
  const third = players[2];

  const PodiumItem = ({
    player,
    rank,
  }: {
    player?: ILeaderboardUser;
    rank: 1 | 2 | 3;
  }) => {
    if (!player) return <View style={styles.podiumItem} />;

    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    const primaryColorHex = theme.colors.primary.replace("#", "");
    const formattedName = formatUserName(player.userName);
    
    /* TODO: Restaurar foto customizada do usuário no próximo release nativo
    const rawPhoto = player.photoURL || (player as any).photoUrl;
    const validPhoto =
      rawPhoto && typeof rawPhoto === "string" && rawPhoto.trim().length > 0
        ? rawPhoto.trim()
        : null;

    const [imageFailed, setImageFailed] = React.useState(false);

    React.useEffect(() => {
      setImageFailed(false);
    }, [player.userId, player.photoURL, (player as any).photoUrl]);
    */

    const avatarUrl = `https://ui-avatars.com/api/?background=${primaryColorHex}&color=fff&name=${encodeURIComponent(
      formattedName
    )}&bold=true&font-size=0.35&format=png`;

    return (
      <View style={[styles.podiumItem, isFirst && styles.podiumFirst]}>
        {/* Avatar positioned above the bar */}
        <View style={styles.avatarContainer}>
          {isFirst && (
            <View style={styles.crownBadgeContainer}>
              <Crown size={14} color="#7A5200" fill="#FFD700" />
            </View>
          )}
          <Image
            source={{ uri: avatarUrl }}
            style={[
              styles.avatar,
              isFirst && styles.avatarFirst,
              isSecond && styles.avatarSecond,
              isThird && styles.avatarThird,
            ]}
          />
        </View>

        {/* The Bar/Pedestal containing Score */}
        <View
          style={[
            styles.podiumBar,
            isFirst && styles.podiumBarFirst,
            isSecond && styles.podiumBarSecond,
            isThird && styles.podiumBarThird,
          ]}
        >
          <Text style={[styles.podiumScore, isFirst && styles.podiumScoreFirst]}>
            {player.score}
          </Text>
        </View>

        {/* Rank & Name below */}
        <Text style={styles.podiumRankText}>{rank}º</Text>
        <Text style={styles.podiumName} numberOfLines={1}>
          {formattedName.split(" ")[0]}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.podiumContainer}>
      <PodiumItem player={second} rank={2} />
      <PodiumItem player={first} rank={1} />
      <PodiumItem player={third} rank={3} />
    </View>
  );
}
