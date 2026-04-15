import TrackPlayer, { 
  Event, 
  Capability, 
  AppKilledPlaybackBehavior,
  RatingType
} from 'react-native-track-player';

// Inicialização do Player com capacidades essenciais de Background e Lock Screen
export async function setupTrackPlayer() {
  let isSetup = false;
  try {
    // Evita inicialização dupla em ambientes de desenvolvimento (Fast Refresh)
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    
    await TrackPlayer.updateOptions({
      android: {
        // Se o usuário assassinar o app na aba de apps recentes, pare o áudio
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
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
      ratingType: RatingType.Heart
    });
    isSetup = true;
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
