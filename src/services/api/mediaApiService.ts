import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";

export interface MediaUploadResponse {
  url: string;
  path: string;
}

export const mediaApiService = {
  /**
   * Envia uma foto de avatar/perfil para o backend REST / Cloudflare R2.
   */
  async uploadAvatar(
    imageUri: string,
    fileName: string = "avatar.jpg"
  ): Promise<MediaUploadResponse> {
    const formData = new FormData();
    const type = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

    formData.append("file", {
      uri: imageUri,
      name: fileName,
      type,
    } as unknown as Blob);

    const response = await apiClient.post<MediaUploadResponse>(
      "/media/upload/avatar",
      formData,
      {
        headers: {
          Accept: "application/json",
        },
        transformRequest: (data) => data,
      }
    );

    return {
      ...response.data,
      url: resolveCdnUrl(response.data.url) || response.data.url,
    };
  },

  /**
   * Envia um arquivo de mídia genérico (imagem/áudio) para uma pasta específica.
   */
  async uploadMedia(
    fileUri: string,
    fileName: string = "upload.jpg",
    folder: string = "general"
  ): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: "image/jpeg",
    } as unknown as Blob);
    formData.append("folder", folder);

    const response = await apiClient.post<MediaUploadResponse>(
      "/media/upload",
      formData,
      {
        headers: {
          Accept: "application/json",
        },
        transformRequest: (data) => data,
      }
    );

    return {
      ...response.data,
      url: resolveCdnUrl(response.data.url) || response.data.url,
    };
  },
};
