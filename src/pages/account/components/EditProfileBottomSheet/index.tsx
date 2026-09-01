import React, { forwardRef, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
// import { Alert, TouchableOpacity } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Camera, Image as ImageIcon, Trash2 } from "lucide-react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { formatUserName } from "@/utils/formatName";

import { createStyles } from "./styles";

interface EditProfileBottomSheetProps {
  initialName: string;
  initialPhotoUrl?: string | null;
  onSave: (newName: string, newPhotoUri?: string | null) => Promise<void>;
}

export const EditProfileBottomSheet = forwardRef<
  BottomSheetModal,
  EditProfileBottomSheetProps
>(function EditProfileBottomSheet({ initialName, initialPhotoUrl, onSave }, ref) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const [name, setName] = useState(initialName);
  // const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  // const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const emailLikeRegex = /(@|\.com|\.br|\.net|\.org|gmail|hotmail|outlook|yahoo)/i;

  useEffect(() => {
    setName(initialName);
    // setSelectedPhotoUri(null);
    // setIsRemovingPhoto(false);
    setError("");
  }, [initialName, initialPhotoUrl]);

  function validateName(value: string): boolean {
    if (!value.trim()) {
      setError("Por favor, informe seu nome/apelido.");
      return false;
    }

    if (value.trim().length < 3) {
      setError("O nome/apelido deve ter no mínimo 3 caracteres.");
      return false;
    }

    if (emailLikeRegex.test(value.trim())) {
      setError("Por favor, não utilize um e-mail como nome/apelido.");
      return false;
    }

    setError("");
    return true;
  }

  /* TODO: Restaurar seleção de foto no próximo release com build nativo nas lojas
  async function handlePickGallery() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso às suas fotos para alterar sua foto de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhotoUri(result.assets[0].uri);
        setIsRemovingPhoto(false);
      }
    } catch (err) {
      console.warn("Erro ao selecionar imagem da galeria:", err);
    }
  }

  async function handleTakePhoto() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão da câmera para tirar uma foto de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhotoUri(result.assets[0].uri);
        setIsRemovingPhoto(false);
      }
    } catch (err) {
      console.warn("Erro ao tirar foto:", err);
    }
  }

  function handleRemovePhoto() {
    setSelectedPhotoUri(null);
    setIsRemovingPhoto(true);
  }
  */

  async function handleSave() {
    if (!validateName(name)) return;

    const isNameChanged = name.trim() !== initialName;
    // const isPhotoChanged = selectedPhotoUri !== null || isRemovingPhoto;

    if (!isNameChanged /* && !isPhotoChanged */) {
      // @ts-ignore
      ref.current?.dismiss();
      return;
    }

    setIsLoading(true);
    try {
      // const photoUriToSave = isRemovingPhoto ? "" : selectedPhotoUri;
      await onSave(name.trim(), undefined);
      // @ts-ignore
      ref.current?.dismiss();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setName(initialName);
    // setSelectedPhotoUri(null);
    // setIsRemovingPhoto(false);
    setError("");
    // @ts-ignore
    ref.current?.dismiss();
  }

  function renderBackdrop(props: any) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );
  }

  const activePhoto =
    initialPhotoUrl && initialPhotoUrl.trim().length > 0 ? initialPhotoUrl : null;

  const formattedName = formatUserName(name || initialName || "Usuário");
  const initialLetter = formattedName.charAt(0).toUpperCase();

  const isSaveDisabled =
    isLoading ||
    !name.trim() ||
    name.trim() === initialName ||
    !!error;

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) }]}
      >
        <View>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.description}>
            Altere seu nome ou apelido exibido nos placares e comunidade.
          </Text>
        </View>

        {/* Seção de Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              {activePhoto ? (
                <Image source={{ uri: activePhoto }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitials}>{initialLetter}</Text>
              )}
            </View>
            {/* 
            <View style={styles.cameraBadge}>
              <Camera size={14} color="#FFFFFF" />
            </View> 
            */}
          </View>

          {/* Opções de Foto (Comentadas para próximo release nativo)
          <View style={styles.photoOptionsRow}>
            <TouchableOpacity
              style={styles.photoOptionButton}
              onPress={handlePickGallery}
            >
              <ImageIcon size={14} color={theme.colors.primary} />
              <Text style={styles.photoOptionText}>Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoOptionButton} onPress={handleTakePhoto}>
              <Camera size={14} color={theme.colors.primary} />
              <Text style={styles.photoOptionText}>Câmera</Text>
            </TouchableOpacity>
          </View>

          {activePhoto && (
            <TouchableOpacity onPress={handleRemovePhoto} style={{ marginTop: 6 }}>
              <Text style={styles.removePhotoText}>Remover foto</Text>
            </TouchableOpacity>
          )}
          */}
        </View>

        {/* Input de Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome ou Apelido</Text>
          <BottomSheetTextInput
            style={[styles.input, !!error && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError("");
            }}
            onBlur={() => validateName(name)}
            placeholder="Digite seu nome ou apelido"
            placeholderTextColor={theme.colors.muted}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={handleCancel}
            disabled={isLoading}
            fullWidth
          />

          <Button
            title="Salvar Alterações"
            onPress={handleSave}
            loading={isLoading}
            disabled={isSaveDisabled}
            fullWidth
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
