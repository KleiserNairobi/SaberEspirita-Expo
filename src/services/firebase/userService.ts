import { User, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "@/configs/firebase/firebase";
import { useAuthStore } from "@/stores/authStore";

export const userService = {
  /**
   * Atualiza o timestamp de última atividade do usuário de forma silenciosa.
   * @param uid ID do usuário no Firebase
   */
  async updateLastSeen(uid: string) {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        lastSeenAt: serverTimestamp(),
      });
      console.log("UserService: Timestamp de atividade atualizado.");
    } catch (error) {
      // Falha silenciosa para não atrapalhar o fluxo do usuário
      console.warn("UserService: Erro ao atualizar timestamp de atividade:", error);
    }
  },
  /**
   * Garante que o documento do usuário e seu score inicial existam no Firestore.
   * Útil para o primeiro login ou login social.
   */
  async ensureUserSync(currentUser: User) {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      // Se o documento raiz não existir, criamos o perfil básico e o score
      if (!userDoc.exists()) {
        const userData = {
          userId: currentUser.uid,
          userName: currentUser.displayName || "Usuário",
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalAllTime: 0,
          totalThisWeek: 0,
          totalThisMonth: 0,
          level: 1,
        };

        // Salvar em users_scores (para o ranking)
        await setDoc(doc(db, "users_scores", currentUser.uid), userData, {
          merge: true,
        });

        // Salvar em users (perfil principal)
        await setDoc(
          doc(db, "users", currentUser.uid),
          { ...userData, role: "user" },
          { merge: true }
        );

        console.log(
          "UserService: Perfil e Scores criados para o usuário:",
          currentUser.uid
        );
      } else {
        const data = userDoc.data();

        // Cenario 1: Firestore não tem o nome (ou é "Usuário"), mas o Auth TEM um nome real (ex: vindo do Google/Apple)
        // Solução: Atualiza o Firestore com o nome real
        if ((!data.userName || data.userName === "Usuário") && currentUser.displayName) {
          await setDoc(
            userDocRef,
            { userName: currentUser.displayName, updatedAt: new Date() },
            { merge: true }
          );
          await setDoc(
            doc(db, "users_scores", currentUser.uid),
            { userName: currentUser.displayName, updatedAt: new Date() },
            { merge: true }
          );
          console.log(
            "UserService: Nome do usuário atualizado no Firestore para:",
            currentUser.displayName
          );
        }

        // Cenario 2: O Auth NÃO tem o nome (ex: login Apple subsequente), mas o Firestore JÁ TEM o nome real guardado
        // Solução: Restaura o nome no Firebase Auth e atualiza o estado da UI
        else if (
          !currentUser.displayName &&
          data.userName &&
          data.userName !== "Usuário"
        ) {
          await updateProfile(currentUser, { displayName: data.userName });
          await currentUser.reload();
          // Evitamos usar {...currentUser} para não destruir os protótipos (User.reload(), etc)
          useAuthStore.getState().setUser(auth.currentUser || currentUser);
          console.log(
            "UserService: Nome restaurado do Firestore para o Auth:",
            data.userName
          );
        }
      }
    } catch (error) {
      console.error("UserService: Erro ao sincronizar usuário no Firestore:", error);
      throw error;
    }
  },

  /**
   * Atualiza o nome de exibição do usuário no Auth e no Firestore.
   * Esta versão é resiliente a falhas de inicialização do SDK do Firebase.
   */
  async updateUserName(user: User, newName: string) {
    const uid = user?.uid;

    if (!uid) {
      throw new Error("Sessão não identificada. Por favor, faça login novamente.");
    }

    try {
      // 1. Atualizar no Firestore (Users e Scores) - FUNDAMENTAL
      // Isso utiliza apenas o UID, que já temos disponível no MMKV da Store.
      // Funciona mesmo que o Firebase SDK ainda esteja em processo de boot.
      const updatedAt = new Date();
      await setDoc(
        doc(db, "users", uid),
        { userName: newName, updatedAt },
        { merge: true }
      );
      await setDoc(
        doc(db, "users_scores", uid),
        { userName: newName, updatedAt },
        { merge: true }
      );

      // 2. Tentar atualizar no Firebase Auth (Opcional/Bônus)
      // O updateProfile exige uma instância real ('class UserImpl') do SDK.
      // Se não tivermos agora, o Firestore já garantiu o dado.
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { displayName: newName });
          await auth.currentUser.reload();
        } catch (authError) {
          console.warn(
            "UserService: Não foi possível atualizar o Auth Profile agora, mas o Firestore foi atualizado."
          );
        }
      }

      // 3. Atualizar a Store global para refletir a mudança na UI imediatamente
      // Usamos o objeto user existente mesclado com o novo nome
      useAuthStore.getState().setUser({ ...user, displayName: newName } as User);

      console.log("UserService: Perfil atualizado com sucesso no Firestore.");
    } catch (error) {
      console.error("UserService: Erro crítico ao atualizar perfil:", error);
      throw error;
    }
  },
};
