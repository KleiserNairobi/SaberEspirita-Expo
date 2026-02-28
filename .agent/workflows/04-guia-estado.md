---
description: Guia de Gerenciamento de Estado e Fetching para o SaberEspirita-Expo
---

# Guia de Estilo: Estado, Fetching e Boas Práticas

Este documento define os padrões de gerenciamento de estado e requisições assíncronas no **SaberEspirita-Expo**.

## Gerenciamento de Estado

### Zustand (Preferido)

Utilizar Zustand para controle de estado global e persistente na aplicação.

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "my-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
```

### Context API (Casos Específicos)

Usar apenas para **autenticação** e **providers globais**, evitando armazenar estados que mudam muito rápido.

## Data Fetching & Caching

### TanStack Query (Obrigatório)

Todo data fetching remoto (API, Firebase, etc.) **DEVE** ser feito utilizando **TanStack Query (React Query)**.
**NÃO** use `useEffect` + `useState` para buscar dados manualmente.

### Regra de Arquitetura: Firebase SDKs

No projeto **SaberEspirita-Expo**, temos a seguinte regra ESTRITA para os SDKs do Firebase:

- **Firebase Web SDK (`firebase`)**: OBRIGATÓRIO para **todo o backend, banco de dados e lógica da aplicação** (Firestore, Storage, Auth, Functions). Use sempre as importações modulares da web (`"firebase/firestore"`, etc).
- **React Native Firebase (`@react-native-firebase/...`)**: Utilizado **EXCLUSIVAMENTE PARA ANALYTICS**. Não utilize seus módulos de firestore ou auth para consultas de dados.

### Padrão de Custom Hooks

Crie custom hooks para encapsular as queries e mutações:

```typescript
// Hook de Query
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/services/firebase/courseService";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook de Mutation
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
```

## Tratamento Assíncrono e Erros

- Preferir `async/await` a `.then()/.catch()`.
- Sempre envolver chamadas em `try/catch`.
- Usar declarations para funções async nomeadas.

```typescript
async function fetchUserData(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}
```
