import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useEffect, useRef } from "react";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
} from "react-native-track-player";

/**
 * Componente Invisível que gerencia o ciclo de vida do áudio ambiente
 * de forma global no App, garantindo persistência entre trocas de tela.
 *
 * Agora orquestra a biblioteca react-native-track-player, que roda imune
 * a recargas da Screen e não conflita com efeitos sonoros do Quiz.
 */
export function GlobalAmbientPlayer() {
  const { currentTrack, isPlaying, volume, setPlaying } = useAmbientPlayerStore();
  const playbackState = usePlaybackState();
  const previousTrackRef = useRef<string | null>(null);

  // 1. Sincronizar o volume
  useEffect(() => {
    TrackPlayer.setVolume(volume);
  }, [volume]);

  // 2. Sincronizar a Trilha (Track)
  useEffect(() => {
    async function syncTrack() {
      if (currentTrack && currentTrack !== previousTrackRef.current) {
        previousTrackRef.current = currentTrack;

        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: "ambient_track",
          url: currentTrack,
          title: "Som Ambiente",
          artist: "Oração",
          // O TrackPlayer exige esses metadados para não quebrar na tela de bloqueio
        });

        // Desativando modo Loop (o som encerra ao final da trilha)
        await TrackPlayer.setRepeatMode(RepeatMode.Off);

        if (isPlaying) {
          await TrackPlayer.play();
        }
      } else if (!currentTrack && previousTrackRef.current) {
        // Se a faixa for nula (ex: usuário cancelou Oração), desliga de vez
        await TrackPlayer.reset();
        previousTrackRef.current = null;
      }
    }
    syncTrack();
  }, [currentTrack]);

  // 3. Sincronizar Play/Pause direcional (Zustand -> TrackPlayer)
  useEffect(() => {
    async function syncPlayback() {
      // SÓ INTERFERIMOS SE A FAIXA ATUAL FOR O SOM AMBIENTE
      // Isso evita picotar/pausar Meditações Guiadas que rodam no mesmo Player
      const activeTrack = await TrackPlayer.getActiveTrack();
      if (activeTrack && activeTrack.id !== "ambient_track") {
        return;
      }

      // Impede re-execução ao final da música (corrida superada)
      if (isPlaying && playbackState.state === State.Ended) {
        return;
      }

      // Evita chamadas cegas. Só toca/pausa se houver dessincronia.
      if (
        isPlaying &&
        playbackState.state !== State.Playing &&
        playbackState.state !== State.Buffering
      ) {
        await TrackPlayer.play();
      } else if (
        !isPlaying &&
        (playbackState.state === State.Playing ||
          playbackState.state === State.Buffering ||
          playbackState.state === State.Ready)
      ) {
        await TrackPlayer.pause();
      }
    }
    syncPlayback();
  }, [isPlaying, playbackState.state]);

  // 4. Sincronizar eventos de hardware e fim de trilha (Hardware -> Zustand)
  useEffect(() => {
    const syncHardwareState = async () => {
      // SÓ INTERFERIMOS SE A FAIXA ATUAL FOR O SOM AMBIENTE
      const activeTrack = await TrackPlayer.getActiveTrack();
      if (activeTrack && activeTrack.id !== "ambient_track") {
        return;
      }

      // Se o áudio foi pausado externamente (ou acabou e mudou o estado)
      if (playbackState.state === State.Paused && isPlaying) {
        setPlaying(false);
      } else if (playbackState.state === State.Playing && !isPlaying) {
        setPlaying(true);
      }

      // DETECTAR FIM DA MÚSICA: Para no final, sem rebobinar e sem loop.
      if (playbackState.state === State.Ended && isPlaying) {
        console.log("[GlobalAmbientPlayer] Áudio finalizado naturalmente.");
        setPlaying(false);
        await TrackPlayer.pause();
      }
    };

    syncHardwareState();
  }, [playbackState.state]);

  return null; // Componente puramente lógico
}
