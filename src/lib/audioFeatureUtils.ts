import { AudioFeatures } from "@/types/spotify";

export function normalizeAudioFeatures(features: AudioFeatures | null) {
  if (!features) {
    return {
      valence: 0.5,
      energy: 0.5,
      danceability: 0.5,
      tempo: 120,
      loudness: -10,
    };
  }

  return {
    valence: features.valence, // 0-1
    energy: features.energy, // 0-1
    danceability: features.danceability, // 0-1
    tempo: features.tempo, // BPM
    loudness: features.loudness, // dB (-60 to 0)
  };
}

export function classifyMood(features: AudioFeatures | null): string {
  if (!features) {
    console.log("No audio features - returning neutral");
    return "neutral";
  }

  console.log("Classifying mood with:", { 
    valence: features.valence, 
    energy: features.energy 
  });

  const { valence, energy } = features;

  if (valence > 0.6 && energy > 0.6) return "energetic";
  if (valence > 0.6 && energy <= 0.6) return "happy";
  if (valence <= 0.4 && energy > 0.6) return "intense";
  if (valence <= 0.4 && energy <= 0.4) return "melancholic";
  
  return "calm";
}

export function normalizeLoudness(loudness: number): number {
  return Math.max(0, Math.min(1, (loudness + 60) / 60));
}

export function normalizeTempo(tempo: number): number {
  return Math.max(0, Math.min(1, (tempo - 60) / 120));
}