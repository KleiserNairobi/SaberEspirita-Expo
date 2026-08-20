import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaApiService } from "@/services/api/mediaApiService";
import { useAuthStore } from "@/stores/authStore";

/**
 * Hook de mutação para upload de foto de perfil (Avatar).
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useMutation({
    mutationFn: ({ imageUri, fileName }: { imageUri: string; fileName?: string }) =>
      mediaApiService.uploadAvatar(imageUri, fileName),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });
}

/**
 * Hook de mutação genérico para upload de imagens.
 */
export function useUploadMedia() {
  return useMutation({
    mutationFn: ({
      fileUri,
      fileName,
      folder,
    }: {
      fileUri: string;
      fileName?: string;
      folder?: string;
    }) => mediaApiService.uploadMedia(fileUri, fileName, folder),
  });
}
