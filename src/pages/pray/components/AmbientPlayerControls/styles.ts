import { StyleSheet } from "react-native";
import { Theme } from "@/types/theme";

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: 28, // Pill shape perfeitamente arredondada para 56px
    height: 56, // Força a barra a manter a exata mesma altura sempre
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  trackName: {
    ...theme.text("sm", "medium", theme.colors.text),
    flex: 1,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  volumeToggleBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  volumeGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  volumeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  volumeBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  volumeBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  closeVolumeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});
