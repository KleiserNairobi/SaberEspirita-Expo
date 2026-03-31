import { db } from "@/configs/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

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
          {
            ...userData,
            role: "user",
          },
          { merge: true }
        );
        
        console.log("UserService: Perfil e Scores criados para o usuário:", currentUser.uid);
      }
    } catch (error) {
      console.error("UserService: Erro ao sincronizar usuário no Firestore:", error);
      throw error;
    }
  },
};
