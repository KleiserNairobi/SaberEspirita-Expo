// Tipos para navegação type-safe
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  FAQ: undefined;
  Privacy: undefined;
  Terms: undefined;
  EmotionalChat: undefined;
};

export type TabParamList = {
  StudyTab: undefined;
  FixTab: undefined;
  MeditateTab: undefined;
  PrayTab: undefined;
  AccountTab: undefined;
};

export type PrayStackParamList = {
  PrayHome: undefined;
  PrayCategory: { id: string };
  Prayer: { id: string };
};

export type MeditateStackParamList = {
  MeditateHome: undefined;
  Reflection: { id: string };
};

// Tipos auxiliares para navegação
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
