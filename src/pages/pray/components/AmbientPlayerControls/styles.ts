import { StyleSheet } from "react-native";
import { Theme } from "@/types/theme";

export const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexDirection: "column",
    gap: 12,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackName: {
    fontFamily: "BarlowCondensed_600SemiBold",
    fontSize: 14,
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  controlsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  volumeGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  volumeButton: {
    padding: 4,
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
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stopButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
