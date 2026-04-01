import { db, auth } from "@/configs/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User, updateProfile } from "firebase/auth";
import { useAuthStore } from "@/stores/authStore";

export const userService = {
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
        
        console.log("UserService: Perfil e Scores criados para o usuário:", currentUser.uid);
      } else {
        const data = userDoc.data();
        
        // Cenario 1: Firestore não tem o nome (ou é "Usuário"), mas o Auth TEM um nome real (ex: vindo do Google/Apple)
        // Solução: Atualiza o Firestore com o nome real
        if ((!data.userName || data.userName === "Usuário") && currentUser.displayName) {
          await setDoc(userDocRef, { userName: currentUser.displayName, updatedAt: new Date() }, { merge: true });
          await setDoc(doc(db, "users_scores", currentUser.uid), { userName: currentUser.displayName, updatedAt: new Date() }, { merge: true });
          console.log("UserService: Nome do usuário atualizado no Firestore para:", currentUser.displayName);
        }
        
        // Cenario 2: O Auth NÃO tem o nome (ex: login Apple subsequente), mas o Firestore JÁ TEM o nome real guardado
        // Solução: Restaura o nome no Firebase Auth e atualiza o estado da UI
        else if (!currentUser.displayName && data.userName && data.userName !== "Usuário") {
          await updateProfile(currentUser, { displayName: data.userName });
          await currentUser.reload();
          // Evitamos usar {...currentUser} para não destruir os protótipos (User.reload(), etc)
          useAuthStore.getState().setUser(auth.currentUser || currentUser);
          console.log("UserService: Nome restaurado do Firestore para o Auth:", data.userName);
        }
      }
    } catch (error) {
      console.error("UserService: Erro ao sincronizar usuário no Firestore:", error);
      throw error;
    }
  },
};
