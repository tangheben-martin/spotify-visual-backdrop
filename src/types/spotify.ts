export interface SpotifyTrack {
     id: string;
     name: string;
     artists: { name: string }[];
     album: {
       name: string;
       images: { url: string }[];
     };
     duration_ms: number;
   }

   export interface AudioFeatures {
     valence: number;        // 0-1: happiness/positivity
     energy: number;         // 0-1: intensity
     danceability: number;   // 0-1: how danceable
     tempo: number;          // BPM
     loudness: number;       // dB, typically -60 to 0
     acousticness: number;   // 0-1: acoustic vs electronic
     instrumentalness: number;
     key: number;           // 0-11: pitch class
     mode: number;          // 0 or 1: minor or major
   }

   export interface CurrentPlayback {
     track: SpotifyTrack | null;
     audioFeatures: AudioFeatures | null;
     isPlaying: boolean;
     progress_ms: number;
   }