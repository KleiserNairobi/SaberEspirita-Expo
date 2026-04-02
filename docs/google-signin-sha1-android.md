# Google Sign-In Android — Problema de SHA-1 em Dispositivo Físico

**Data:** 2026-04-02  
**Contexto:** Login social com Google funcionava no emulador, mas falhava com "Erro no Google Login" em dispositivo físico Android.

---

## Causa Raiz

O Google Sign-In no Android valida o **SHA-1 do certificado** que assinou o APK instalado.

- O **emulador** usa o `debug.keystore` → SHA-1 já estava cadastrado no Firebase → ✅ funcionava
- O **dispositivo físico** rodava um APK assinado com o `release keystore` (`saber-espirita.jks`) → SHA-1 **não estava cadastrado** no Firebase → ❌ erro

---

## SHA-1 dos Keystores do Projeto

| Keystore | Arquivo | Alias | SHA-1 |
|---|---|---|---|
| **Debug** | `android/app/debug.keystore` | `androiddebugkey` | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` |
| **Release** | `android/app/saber-espirita.jks` | `saber-espirita-key` | `E8:86:23:AC:DA:2C:59:38:B4:32:77:E1:7A:84:6E:A3:A7:2F:BB:5D` |

> Para reextrair manualmente:
> ```bash
> # Debug
> keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
>
> # Release
> keytool -list -v -keystore android/app/saber-espirita.jks -alias saber-espirita-key -storepass kno140469 -keypass kno140469
> ```

---

## Solução Aplicada

### 1. Cadastrar ambos os SHA-1 no Firebase Console

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) → projeto **Saber Espírita**
2. Vá em ⚙️ **Configurações do projeto** → aba **Seus apps** → app Android (`app.saberespirita`)
3. Em **Impressões digitais do certificado SHA**, adicionar:
   - SHA-1 do **debug**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
   - SHA-1 do **release**: `E8:86:23:AC:DA:2C:59:38:B4:32:77:E1:7A:84:6E:A3:A7:2F:BB:5D`

### 2. Baixar e substituir o google-services.json

Após salvar no Firebase, baixar o novo arquivo e substituir em:
```
./dev/configs/google-services.json
```

### 3. Recompilar o app

O `google-services.json` é embutido no APK em tempo de compilação, então **sempre recompilar** após substituir:

```bash
npx expo run:android
```

---

## Atenção: Play Store (Play App Signing)

Se o app for publicado na Google Play com **Play App Signing** habilitado (padrão desde 2021), o Google Play **re-assina o APK** com uma chave própria gerenciada por eles. Nesse caso:

1. Acesse o **Google Play Console** → app → **Release > Setup > App Signing**
2. Copie o SHA-1 da **"App signing key certificate"** (não confundir com "Upload key certificate")
3. Cadastre esse SHA-1 **também** no Firebase Console

> ⚠️ Sem esse passo, o Google Sign-In falhará para todos os usuários que instalarem pela Play Store, mesmo com o release keystore cadastrado.

---

## Resumo do Fluxo de Assinatura

```
Desenvolvimento local  →  debug.keystore       →  SHA-1 debug
APK instalado via cabo →  saber-espirita.jks   →  SHA-1 release
Instalado pela Play    →  Chave gerenciada Play →  SHA-1 da Play Console
```

Todos os SHA-1 que forem usados precisam estar cadastrados no Firebase Console.
