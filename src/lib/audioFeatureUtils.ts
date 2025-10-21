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
     if (!features) return "neutral";

     const { valence, energy } = features;

     if (valence > 0.6 && energy > 0.6) return "energetic";
     if (valence > 0.6 && energy <= 0.6) return "happy";
     if (valence <= 0.4 && energy > 0.6) return "intense";
     if (valence <= 0.4 && energy <= 0.4) return "melancholic";
     
     return "calm";
   }

   export function normalizeLoudness(loudness: number): number {
     // Spotify loudness is typically -60 to 0 dB
     // Normalize to 0-1 range
     return Math.max(0, Math.min(1, (loudness + 60) / 60));
   }

   export function normalizeTempo(tempo: number): number {
     // Typical tempo range: 60-180 BPM
     // Normalize to 0-1 range
     return Math.max(0, Math.min(1, (tempo - 60) / 120));
   }