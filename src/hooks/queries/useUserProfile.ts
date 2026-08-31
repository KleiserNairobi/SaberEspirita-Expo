import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { authApiService, UserProfileDTO } from "@/services/api/authApiService";
import { useAuthStore } from "@/stores/authStore";

export function useUserProfile() {
  const { user, isGuest, setUser } = useAuthStore();

  const query = useQuery<UserProfileDTO | null>({
    queryKey: ["userProfile", user?.uid],
    queryFn: async () => {
      if (isGuest || !user) return null;
      return await authApiService.getProfile();
    },
    enabled: !isGuest && !!user,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });

  const refetch = query.refetch;
  const uid = user?.uid;

  // Dispara a atualização apenas quando o usuário realmente entra na tela de Conta
  useFocusEffect(
    useCallback(() => {
      if (!isGuest && uid) {
        void refetch();
      }
    }, [isGuest, uid, refetch])
  );

  useEffect(() => {
    if (query.data && user) {
      const rawPhoto = query.data.photoUrl || query.data.photoURL || null;
      const photoURL = rawPhoto && typeof rawPhoto === "string" && rawPhoto.trim().length > 0 ? rawPhoto.trim() : null;
      const displayName = query.data.displayName || query.data.userName || user.displayName;

      if (user.photoURL !== photoURL || user.displayName !== displayName) {
        console.log("useUserProfile: Atualizando authStore com foto:", photoURL);
        setUser({
          ...user,
          photoURL,
          displayName,
        });
      }
    }
  }, [query.data]);

  return query;
}
