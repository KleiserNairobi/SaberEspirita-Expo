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
      console.log("useUserProfile: Disparando GET /users/me...");
      return await authApiService.getProfile();
    },
    enabled: !isGuest && !!user,
    staleTime: 1000 * 30, // Considera os dados atualizados por 30 segundos
  });

  const isFetching = query.isFetching;
  const isStale = query.isStale;
  const refetch = query.refetch;
  const uid = user?.uid;

  // Dispara a busca apenas quando a tela ganha foco E a query estiver stale/não estiver buscando
  useFocusEffect(
    useCallback(() => {
      if (!isGuest && uid && !isFetching && isStale) {
        console.log("useUserProfile: Aba Conta focada -> executando refetch de /users/me");
        void refetch();
      }
    }, [isGuest, uid, isFetching, isStale, refetch])
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
