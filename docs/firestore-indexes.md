# Configuração de Índices no Firestore

## Instruções para Firebase Console

### Acesso

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto **SaberEspirita**
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Indexes**

---

## Índices Necessários

### 1. Índice para Histórico Ordenado por Data

**Coleção**: `users/{userId}/truthOrFalseResponses`

**Campos**:

- `date` (Descending)
- `__name__` (Descending)

**Configuração via Console**:

```
Collection ID: truthOrFalseResponses
Fields indexed:
  - date: Descending
  - Document ID: Descending
Query scope: Collection
```

**Ou via Firebase CLI**:

```bash
firebase firestore:indexes
```

Adicionar ao `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "truthOrFalseResponses",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "date",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

---

### 2. Índice para Filtro por Acertos/Erros

**Coleção**: `users/{userId}/truthOrFalseResponses`

**Campos**:

- `isCorrect` (Ascending)
- `date` (Descending)

**Configuração via Console**:

```
Collection ID: truthOrFalseResponses
Fields indexed:
  - isCorrect: Ascending
  - date: Descending
Query scope: Collection
```

**Ou via Firebase CLI**:

```json
{
  "collectionGroup": "truthOrFalseResponses",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "isCorrect",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "date",
      "order": "DESCENDING"
    }
  ]
}
```

---

### 3. Índice para Biblioteca (Salvos para Revisão)

**Coleção**: `users/{userId}/truthOrFalseResponses`

**Campos**:

- `savedToLibrary` (Ascending)
- `date` (Descending)

**Configuração via Console**:

```
Collection ID: truthOrFalseResponses
Fields indexed:
  - savedToLibrary: Ascending
  - date: Descending
Query scope: Collection
```

**Ou via Firebase CLI**:

```json
{
  "collectionGroup": "truthOrFalseResponses",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "savedToLibrary",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "date",
      "order": "DESCENDING"
    }
  ]
}
```

---

## Arquivo Completo: firestore.indexes.json

Criar arquivo `firestore.indexes.json` na raiz do projeto:

```json
{
  "indexes": [
    {
      "collectionGroup": "truthOrFalseResponses",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "date",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "truthOrFalseResponses",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "isCorrect",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "truthOrFalseResponses",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "savedToLibrary",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## Deploy dos Índices

### Via Firebase CLI

```bash
# 1. Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar projeto (se ainda não tiver)
firebase init firestore

# 4. Deploy dos índices
firebase deploy --only firestore:indexes
```

### Via Console (Manual)

1. Acesse **Firestore Database** → **Indexes**
2. Clique em **Create Index**
3. Preencha os campos conforme especificado acima
4. Clique em **Create**
5. Aguarde a criação (pode levar alguns minutos)

---

## Verificação

Após criar os índices, você pode verificar no console:

1. **Firestore Database** → **Indexes**
2. Verifique se todos os 3 índices estão com status **Enabled**

---

## Queries que Usarão os Índices

### 1. Histórico Ordenado

```typescript
firestore()
  .collection("users")
  .doc(userId)
  .collection("truthOrFalseResponses")
  .orderBy("date", "desc")
  .limit(30)
  .get();
```

### 2. Filtro por Acertos

```typescript
firestore()
  .collection("users")
  .doc(userId)
  .collection("truthOrFalseResponses")
  .where("isCorrect", "==", true)
  .orderBy("date", "desc")
  .get();
```

### 3. Biblioteca (Salvos)

```typescript
firestore()
  .collection("users")
  .doc(userId)
  .collection("truthOrFalseResponses")
  .where("savedToLibrary", "==", true)
  .orderBy("date", "desc")
  .get();
```

---

## Notas Importantes

> [!WARNING]
> **Índices Compostos**
>
> O Firestore requer índices compostos para queries que:
>
> - Ordenam por múltiplos campos
> - Filtram e ordenam por campos diferentes
> - Usam operadores de desigualdade em múltiplos campos

> [!TIP]
> **Criação Automática**
>
> Ao executar uma query que precisa de índice, o Firestore mostrará um erro com link direto para criar o índice automaticamente no console.
