import React from "react";
import { View, Text, Image } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "../styles";
import { ILeaderboardUser } from "@/types/leaderboard";

interface Props {
  player: ILeaderboardUser;
}

export function RankingList({ player }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const primaryColorHex = theme.colors.primary.replace("#", "");
  const avatarUrl =
    player.photoURL ||
    `https://ui-avatars.com/api/?background=${primaryColorHex}&color=fff&name=${player.userName}&bold=true&font-size=0.35`;

  return (
    <View style={[styles.listItem, player.isCurrentUser && styles.currentUserItem]}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{player.position}</Text>
      </View>
      <Image source={{ uri: avatarUrl }} style={styles.listAvatar} />
      <View style={styles.listContent}>
        <Text style={styles.listName} numberOfLines={1}>
          {player.userName}
        </Text>
        {!!player.level && <Text style={styles.listLevel}>{player.level}</Text>}
      </View>
      <Text style={styles.listScore}>{player.score}</Text>
    </View>
  );
}
