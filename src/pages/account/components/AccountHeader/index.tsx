import { View, Text, TouchableOpacity } from "react-native";
import { Edit2 } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AccountHeaderProps {
  displayName: string;
  email: string;
  onEditPress?: () => void;
}

export function AccountHeader({ displayName, email, onEditPress }: AccountHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.avatarSection} 
        onPress={onEditPress}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          <View style={styles.editBadge}>
            <Edit2 size={12} color={theme.colors.onPrimary} />
          </View>
        </View>
        
        <View style={styles.nameRow}>
          <Text style={theme.text("xxl", "semibold")}>{displayName}</Text>
        </View>
      </TouchableOpacity>

      <Text style={theme.text("lg", "semibold", theme.colors.textSecondary)}>
        {email}
      </Text>
    </View>
  );
}
