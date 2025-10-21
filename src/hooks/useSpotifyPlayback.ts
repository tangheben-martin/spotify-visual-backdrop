import { useEffect, useRef } from "react";
   import { useSession } from "next-auth/react";
   import { usePlaybackStore } from "@/store/playbackStore";

   const POLLING_INTERVAL = 3000; // 3 seconds

   export function useSpotifyPlayback() {
     const { data: session } = useSession();
     const { setCurrentPlayback, setLoading, setError, resetPlayback } = usePlaybackStore();
     const intervalRef = useRef<NodeJS.Timeout | null>(null);

     const fetchCurrentTrack = async () => {
       if (!session?.accessToken) {
         return;
       }

       try {
         const response = await fetch("/api/spotify/current-track");
         
         if (!response.ok) {
           throw new Error("Failed to fetch current track");
         }

         const data = await response.json();
         setCurrentPlayback(data);
       } catch (error) {
         console.error("Error fetching playback state:", error);
         setError("Failed to fetch playback data");
       }
     };

     useEffect(() => {
       if (!session?.accessToken) {
         resetPlayback();
         return;
       }

       // Fetch immediately on mount
       setLoading(true);
       fetchCurrentTrack().finally(() => setLoading(false));

       // Set up polling
       intervalRef.current = setInterval(fetchCurrentTrack, POLLING_INTERVAL);

       // Cleanup
       return () => {
         if (intervalRef.current) {
           clearInterval(intervalRef.current);
         }
       };
     }, [session?.accessToken]);

     return {
       refetch: fetchCurrentTrack,
     };
   }