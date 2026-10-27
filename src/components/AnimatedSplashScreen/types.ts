export interface AnimatedSplashScreenProps {
  /**
   * Indica se os recursos e o estado de autenticação já estão prontos
   */
  isReady: boolean;

  /**
   * Callback invocado quando a animação de fade-out de saída é concluída,
   * permitindo que o componente raiz desmonte a Splash.
   */
  onFinish: () => void;
}
