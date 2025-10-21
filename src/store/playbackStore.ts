import { create } from "zustand";
   import { CurrentPlayback, SpotifyTrack, AudioFeatures } from "@/types/spotify";

   interface PlaybackState {
     currentPlayback: CurrentPlayback;
     isLoading: boolean;
     error: string | null;
     setCurrentPlayback: (playback: CurrentPlayback) => void;
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     resetPlayback: () => void;
   }

   const initialPlayback: CurrentPlayback = {
     track: null,
     audioFeatures: null,
     isPlaying: false,
     progress_ms: 0,
   };

   export const usePlaybackStore = create<PlaybackState>((set) => ({
     currentPlayback: initialPlayback,
     isLoading: false,
     error: null,
     setCurrentPlayback: (playback) => set({ currentPlayback: playback, error: null }),
     setLoading: (loading) => set({ isLoading: loading }),
     setError: (error) => set({ error, isLoading: false }),
     resetPlayback: () => set({ currentPlayback: initialPlayback, error: null }),
   }));