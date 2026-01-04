export interface IAmbientAudio {
  id: string;
  title: string;
  fileName: string;
  storagePath: string;
  icon: "music" | "waves" | "moon";
  localUri?: string; // URI local após cache
}

export type AmbientAudioIcon = "music" | "waves" | "moon";
