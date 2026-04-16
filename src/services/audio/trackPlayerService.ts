import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  IOSCategory,
  RatingType,
} from "react-native-track-player";

// Inicialização do Player com capacidades essenciais de Background e Lock Screen
export async function setupTrackPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.setupPlayer({
      iosCategory: IOSCategory.Playback,
    });
    isSetup = true;
  } catch (error: any) {
    if (error.code === "player_already_initialized") {
      isSetup = true;
    } else {
      console.error("[TrackPlayerService] Erro ao configurar player:", error);
      return false;
    }
  }

  try {
    await TrackPlayer.updateOptions({
      android: {
        // Se o usuário assassinar o app na aba de apps recentes, pare o áudio
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      // Configurações específicas para iOS para garantir estabilidade e background audio
      // Nota: Algumas propriedades podem não estar disponíveis dependendo da versão,
      // mas o updateOptions é flexível.

      // Capacidades visíveis na tela de bloqueio e central de controle
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      // Menos controles na notificação compacta do Android/iOS
      compactCapabilities: [Capability.Play, Capability.Pause],
      progressUpdateEventInterval: 1, // Feedback de 1 segundo para barras de progresso lisas
      ratingType: RatingType.Heart,
    });
  } catch (error) {
    console.error("[TrackPlayerService] Erro ao atualizar opções:", error);
  }

  return isSetup;
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
