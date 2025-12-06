import { auth } from "@/lib/firebase";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useCallback, useEffect } from "react";

const IOS_CLIENT_ID =
  "280205524209-mhj9prfs3dputh7k2aleio52peftpkl3.apps.googleusercontent.com";

// IDs do Android (Definidos no Google Cloud com o SHA-1)
const ANDROID_DEBUG_CLIENT_ID =
  "280205524209-dk5h0lblu0au4t8ilcvrvg5rdq23tbr1.apps.googleusercontent.com";
const ANDROID_RELEASE_CLIENT_ID =
  "280205524209-4s8j95g5m0sqo1ko68enr3im25ap98i9.apps.googleusercontent.com";

const ANDROID_CLIENT_ID = __DEV__
  ? ANDROID_DEBUG_CLIENT_ID
  : ANDROID_RELEASE_CLIENT_ID;

// O Web Client ID é necessário apenas se você estiver usando o Client ID da Web
// para algum motivo específico. Como a autenticação nativa falha, é melhor removê-lo
// ou usá-lo apenas para o desenvolvimento Web, mas não para o Android.
const WEB_CLIENT_ID =
  "280205524209-p42fbdrfivcjt01iescpvi8dlhu201i2.apps.googleusercontent.com";

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    // Adicionar o redirectUri com o esquema definido no app.json
    // redirectUri: makeRedirectUri({
    //   scheme: "saber-espirita", // Seu esquema definido no app.json
    //   // path: "auth", // Adicione isso se o seu esquema precisar de um path
    // }),
  });

  useEffect(() => {
    const signIn = async () => {
      console.log("RESPOSTA:", response);
      if (response?.type === "success") {
        console.log("TOKEN", response.params);
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
      }
    };
    signIn();
  }, [response]);

  // Usar useCallback para manter a referência estável da função
  const stablePromptAsync = useCallback(async () => {
    return await promptAsync();
  }, [promptAsync]);

  return { request, promptAsync: stablePromptAsync };
}
