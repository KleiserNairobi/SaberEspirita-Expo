# Saber Espírita

Um aplicativo mobile multiplataforma (iOS e Android) dedicado ao estudo, prática e reflexão da Doutrina Espírita. Desenvolvido com **React Native** e **Expo**, o app integra funcionalidades modernas de áudio, gamificação e inteligência artificial.

## 🚀 Tecnologias e Frameworks

O projeto utiliza o que há de mais moderno no ecossistema mobile:

- **Core:** [React Native](https://reactnative.dev/) (v0.81.5) & [Expo](https://expo.dev/) (SDK 54)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & Services:**
  - [Firebase](https://firebase.google.com/) (Analytics, App, Auth)
  - [OneSignal](https://onesignal.com/) (Notificações Push)
  - [OpenAI API](https://openai.com/) (Integração com IA)
- **Gerenciamento de Estado & Dados:**
  - [Zustand](https://github.com/pmndrs/zustand) (Estado global)
  - [TanStack Query (React Query)](https://tanstack.com/query/latest) (Cache e requisições)
  - [MMKV](https://github.com/mrousavy/react-native-mmkv) (Armazenamento local de alta performance)
- **Navegação:** [React Navigation](https://reactnavigation.org/)
- **UI & Animações:**
  - [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
  - [Lucide React Native](https://lucide.dev/) (Ícones)
  - [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- **Mídia:** [React Native Track Player](https://react-native-track-player.js.org/) (Reprodução de áudio em background)

## 📂 Estrutura do Projeto

A arquitetura do projeto é organizada dentro da pasta `src/`:

- `assets/`: Recursos estáticos como imagens e sons.
- `components/`: Componentes de UI reutilizáveis (Input, Button, Cards, etc).
- `configs/`: Configurações de Firebase, Temas (Dark/Light) e constantes.
- `contexts/`: Contextos do React para estados compartilhados.
- `data/`: Dados estáticos, mocks e conteúdos locais.
- `hooks/`: Hooks customizados, incluindo a camada de `queries` (React Query).
- `pages/`: Telas principais do aplicativo organizadas por módulos:
  - `auth/`: Login e Registro.
  - `chat/`: Interfaces de conversa (Emocional e Científica).
  - `fix/`: Módulos de gamificação (Quiz, Desafios Diários, Leaderboard).
  - `meditate/`: Player de meditação e reflexões.
  - `pray/`: Orações e ambientes sonoros.
  - `study/`: Catálogo de cursos e currículos.
  - `glossary/`: Termos e definições espíritas.

## 🛠️ Scripts Disponíveis

No diretório raiz, você pode executar:

### Desenvolvimento

- `npm start`: Inicia o Expo Go / Metro Bundler.
- `npm run android`: Executa o app no emulador Android ou dispositivo conectado.
- `npm run ios`: Executa o app no simulador iOS.

### Qualidade de Código

- `npm run lint`: Executa o ESLint para verificar o código.
- `npm run type-check`: Verifica tipos com TypeScript.
- `npm run validate`: Executa verificação de tipos, lint e formatação.

### Build (Android)

- `npm run prebuild`: Gera as pastas nativas (`android/` e `ios/`).
- `npm run build:apk`: Gera o arquivo APK para testes.
- `npm run build:aab`: Gera o arquivo AAB para publicação na Play Store.

## 📱 Configuração Nativa

O projeto utiliza o **Expo Prebuild**, o que significa que as pastas `android` e `ios` são geradas dinamicamente. Configurações sensíveis e permissões são gerenciadas via plugins no `app.json`:

- Suporte a áudio em background.
- Notificações remotas.
- Autenticação Social (Google e Apple).
- Integração nativa com Firebase.

## �️ Customizações e Automação (Pasta `dev/`)

O projeto utiliza uma camada de automação para garantir que o **Expo Prebuild** gere as pastas nativas com todas as configurações necessárias:

- **Config Plugins Customizados**:
  - `withModularHeaders.js`: Resolve dependências de headers modulares no iOS para Firebase.
  - `withAndroidForegroundPermissions.js`: Configura permissões e serviços de foreground para Android 14+.
- **Scripts de Build**:
  - `patch-android-signature.js`: Automatiza a injeção de chaves de assinatura (JKS) no Gradle.
  - `rename-aab.js`: Organiza e renomeia os artefatos de saída do build.
- **Ambiente**: Scripts para definição de ambiente e coleta de versões automatizada.

## 🩹 Correções (Pasta `patches/`)

Utilizamos o `patch-package` para aplicar correções críticas em dependências externas sem perder a capacidade de atualização:

- **`react-native-track-player`**: Patches para compatibilidade de build e suporte a novos SDKs do Android.

## �📄 Licença

Este projeto é de uso privado. Todos os direitos reservados.
