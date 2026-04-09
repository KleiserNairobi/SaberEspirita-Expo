import React, { useEffect } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";

/**
 * Componente Invisível que gerencia o ciclo de vida do áudio ambiente
 * de forma global no App, garantindo persistência entre trocas de tela.
 */
export function GlobalAmbientPlayer() {
  const { currentTrack, isPlaying, volume, setPlaying } = useAmbientPlayerStore();
  
  // O Player é recriado sempre que a trilha muda
  const player = useAudioPlayer(currentTrack || "");
  const status = useAudioPlayerStatus(player);

  // Sincronizar volume
  useEffect(() => {
    player.volume = volume;
  }, [volume, player]);

  // Sincronizar Play/Pause baseado no Store
  useEffect(() => {
    if (isPlaying && !status.playing && currentTrack) {
      player.play();
    } else if (!isPlaying && status.playing) {
      player.pause();
    }
  }, [isPlaying, status.playing, currentTrack, player]);

  // Loop infinito para sons de ambiente
  useEffect(() => {
    player.loop = true;
  }, [player]);

  return null; // Componente puramente lógico
}
