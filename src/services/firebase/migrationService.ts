import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { loadBoolean, saveBoolean, remove } from "@/utils/Storage";
import { useAuthStore } from "@/stores/authStore";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";

// Chaves do AsyncStorage (CLI)
const OLD_KEYS = {
  RESPONSES: "truthOrFalseResponses",
  STATS: "truthOrFalseStats",
  CURRENT_STREAK: "truthOrFalseCurrentStreak",
  LONGEST_STREAK: "truthOrFalseLongestStreak",
};

/**
 * Service para migrar dados do projeto CLI (AsyncStorage) para o Expo (Firestore + MMKV)
 */
export class MigrationService {
  /**
   * Verifica se a migração já foi realizada
   */
  static hasMigrated(): boolean {
    return loadBoolean("truthOrFalse_migrated") ?? false;
  }

  /**
   * Marca a migração como concluída
   */
  private static markAsMigrated(): void {
    saveBoolean("truthOrFalse_migrated", true);
  }

  /**
   * Migra dados do AsyncStorage (CLI) para Firestore
   */
  static async migrateFromAsyncStorage(): Promise<{
    success: boolean;
    migratedCount: number;
    errors: string[];
  }> {
    const userId = useAuthStore.getState().user?.uid;

    if (!userId) {
      return {
        success: false,
        migratedCount: 0,
        errors: ["Usuário não autenticado"],
      };
    }

    // Verificar se já migrou
    if (this.hasMigrated()) {
      console.log("Migração já foi realizada anteriormente");
      return {
        success: true,
        migratedCount: 0,
        errors: [],
      };
    }

    const errors: string[] = [];
    let migratedCount = 0;

    try {
      // 1. Buscar dados do AsyncStorage (CLI)
      const oldResponsesStr = await AsyncStorage.getItem(OLD_KEYS.RESPONSES);

      if (!oldResponsesStr) {
        console.log("Nenhum dado antigo encontrado para migrar");
        this.markAsMigrated();
        return {
          success: true,
          migratedCount: 0,
          errors: [],
        };
      }

      // 2. Parsear dados antigos
      const oldResponses: { [date: string]: IUserTruthOrFalseResponse } =
        JSON.parse(oldResponsesStr);

      // 3. Converter e enviar para Firestore em batch
      const batch = writeBatch(db);
      const responses = Object.values(oldResponses);

      responses.forEach((response) => {
        const docRef = doc(db, "users", userId, "truthOrFalseResponses", response.id);
        batch.set(docRef, response);
      });

      // 4. Executar batch
      await batch.commit();
      migratedCount = responses.length;

      console.log(`Migração concluída: ${migratedCount} respostas migradas`);

      // 5. Marcar como migrado
      this.markAsMigrated();

      // 6. Limpar AsyncStorage antigo (opcional - comentado por segurança)
      // await AsyncStorage.removeItem(OLD_KEYS.RESPONSES);
      // await AsyncStorage.removeItem(OLD_KEYS.STATS);
      // await AsyncStorage.removeItem(OLD_KEYS.CURRENT_STREAK);
      // await AsyncStorage.removeItem(OLD_KEYS.LONGEST_STREAK);

      return {
        success: true,
        migratedCount,
        errors: [],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro durante migração:", error);
      errors.push(errorMessage);

      return {
        success: false,
        migratedCount,
        errors,
      };
    }
  }

  /**
   * Reseta o status de migração (útil para testes)
   */
  static resetMigrationStatus(): void {
    remove("truthOrFalse_migrated");
  }

  /**
   * Verifica se existem dados antigos no AsyncStorage
   */
  static async hasOldData(): Promise<boolean> {
    try {
      const oldResponses = await AsyncStorage.getItem(OLD_KEYS.RESPONSES);
      return oldResponses !== null;
    } catch (error) {
      console.error("Erro ao verificar dados antigos:", error);
      return false;
    }
  }
}
