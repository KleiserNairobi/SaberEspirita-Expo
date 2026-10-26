import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  IOSCategory,
  RatingType,
} from "react-native-track-player";

// Estado de inicialização e Promise Singleton para idempotência
let setupPromise: Promise<boolean> | null = null;
let isPlayerSetup = false;

// Inicialização do Player com capacidades essenciais de Background e Lock Screen
export async function setupTrackPlayer(): Promise<boolean> {
  if (isPlayerSetup) {
    return true;
  }

  if (setupPromise) {
    return setupPromise;
  }

  setupPromise = (async () => {
    let isSetup = false;
    try {
      await TrackPlayer.setupPlayer({
        iosCategory: IOSCategory.Playback,
      });
      isSetup = true;
    } catch (error: any) {
      if (error?.code === "player_already_initialized") {
        isSetup = true;
      } else {
        console.error("[TrackPlayerService] Erro ao configurar player:", error);
        setupPromise = null;
        return false;
      }
    }

    try {
      await TrackPlayer.updateOptions({
        android: {
          // Se o usuário fechar o app na lista de recentes, interrompa o áudio e remova a notificação
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        // Capacidades visíveis na tela de bloqueio e central de controle
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        // Controles compactos na barra de notificações
        compactCapabilities: [Capability.Play, Capability.Pause],
        progressUpdateEventInterval: 1,
        ratingType: RatingType.Heart,
      });
    } catch (error) {
      console.error("[TrackPlayerService] Erro ao atualizar opções:", error);
    }

    isPlayerSetup = isSetup;
    return isSetup;
  })();

  return setupPromise;
}

/**
 * Garante que o TrackPlayer está devidamente inicializado antes de qualquer operação de áudio.
 * Chamada idempotente e segura para telas de reprodução (lazy loading).
 */
export async function ensureTrackPlayerReady(): Promise<boolean> {
  return setupTrackPlayer();
}

// O Serviço Mestre que roda C++ Side / Background
// É registrado globalmente para responder à tela de bloqueio
export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());

  // Tratamento de fones de ouvido desplutados ou sistema pedindo pausas de prioridade
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    const { paused, permanent } = event;
    if (paused || permanent) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });
}
