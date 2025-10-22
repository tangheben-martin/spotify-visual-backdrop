import { useEffect, useRef } from "react";
   import { usePlaybackStore } from "@/store/playbackStore";
   import { classifyMood, normalizeAudioFeatures } from "@/lib/audioFeatureUtils";
   import { getPresetForMood } from "@/lib/visualPresets";

   export interface VisualParameters {
     mood: string;
     color: { r: number; g: number; b: number };
     intensity: number;
     speed: number;
     density: number;
   }

   export function useAudioVisualMapping() {
     const { currentPlayback } = usePlaybackStore();
     const parametersRef = useRef<VisualParameters>({
       mood: "neutral",
       color: { r: 0.5, g: 0.5, b: 0.5 },
       intensity: 0.5,
       speed: 1.0,
       density: 1.0,
     });

     useEffect(() => {
       const { audioFeatures } = currentPlayback;
       
       if (!audioFeatures) {
         parametersRef.current = {
           mood: "neutral",
           color: { r: 0.5, g: 0.5, b: 0.5 },
           intensity: 0.5,
           speed: 1.0,
           density: 1.0,
         };
         return;
       }

       const normalized = normalizeAudioFeatures(audioFeatures);
       const mood = classifyMood(audioFeatures);
       const preset = getPresetForMood(mood);

       // Select color based on valence
       const colorIndex = Math.floor(normalized.valence * (preset.colors.length - 1));
       const selectedColor = preset.colors[colorIndex];

       parametersRef.current = {
         mood,
         color: {
           r: selectedColor.r,
           g: selectedColor.g,
           b: selectedColor.b,
         },
         intensity: normalized.energy,
         speed: (normalized.tempo / 120) * preset.velocityMultiplier,
         density: normalized.danceability,
       };
     }, [currentPlayback]);

     return parametersRef.current;
   }