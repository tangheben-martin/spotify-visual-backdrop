"use client";

   import { useSession, signOut } from "next-auth/react";
   import { useRouter } from "next/navigation";
   import { useEffect } from "react";
   import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";
   import { usePlaybackStore } from "@/store/playbackStore";
   import { classifyMood } from "@/lib/audioFeatureUtils";
   import { ErrorBoundary } from "@/components/ErrorBoundary";
   import { LoadingSpinner } from "@/components/LoadingSpinner";

   export default function Dashboard() {
     const { data: session, status } = useSession();
     const router = useRouter();
     const { currentPlayback, isLoading, error } = usePlaybackStore();
     
     useSpotifyPlayback();

     useEffect(() => {
       if (status === "unauthenticated") {
         router.push("/");
       }
     }, [status, router]);

     if (status === "loading" || isLoading) {
       return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <LoadingSpinner size="lg" />
            </div>
        );
     }

     if (!session) {
       return null;
     }

     const { track, audioFeatures, isPlaying } = currentPlayback;
     const mood = classifyMood(audioFeatures);

     return (

      <ErrorBoundary>
       <div className="min-h-screen bg-black text-white p-8">
         <div className="max-w-4xl mx-auto">
           <div className="flex justify-between items-center mb-8">
             <h1 className="text-4xl font-bold">Dashboard</h1>
             <button
               onClick={() => signOut({ callbackUrl: "/" })}
               className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full transition-all"
             >
               Logout
             </button>
           </div>

           {error && (
             <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg mb-6">
               <p className="text-red-200">{error}</p>
             </div>
           )}

           <div className="bg-gray-900 p-6 rounded-lg mb-6">
             <h2 className="text-2xl mb-4">Now Playing</h2>
             
             {!track ? (
               <p className="text-gray-400">No track currently playing</p>
             ) : (
               <div className="flex gap-6">
                 {track.album.images[0] && (
                   <img
                     src={track.album.images[0].url}
                     alt={track.album.name}
                     className="w-32 h-32 rounded-lg"
                   />
                 )}
                 <div className="flex-1">
                   <h3 className="text-2xl font-bold mb-2">{track.name}</h3>
                   <p className="text-gray-400 mb-1">
                     {track.artists.map((a) => a.name).join(", ")}
                   </p>
                   <p className="text-gray-500 text-sm mb-4">{track.album.name}</p>
                   <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 rounded-full text-sm ${
                       isPlaying ? "bg-green-500" : "bg-gray-600"
                     }`}>
                       {isPlaying ? "▶ Playing" : "⏸ Paused"}
                     </span>
                     <span className="px-3 py-1 rounded-full text-sm bg-purple-500">
                       Mood: {mood}
                     </span>
                   </div>
                 </div>
               </div>
             )}
           </div>

           {audioFeatures && (
             <div className="bg-gray-900 p-6 rounded-lg">
               <h2 className="text-2xl mb-4">Audio Features</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="bg-gray-800 p-4 rounded">
                   <p className="text-gray-400 text-sm mb-1">Valence</p>
                   <p className="text-2xl font-bold">
                     {(audioFeatures.valence * 100).toFixed(0)}%
                   </p>
                   <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                     <div
                       className="bg-green-500 h-2 rounded-full"
                       style={{ width: `${audioFeatures.valence * 100}%` }}
                     />
                   </div>
                 </div>

                 <div className="bg-gray-800 p-4 rounded">
                   <p className="text-gray-400 text-sm mb-1">Energy</p>
                   <p className="text-2xl font-bold">
                     {(audioFeatures.energy * 100).toFixed(0)}%
                   </p>
                   <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                     <div
                       className="bg-red-500 h-2 rounded-full"
                       style={{ width: `${audioFeatures.energy * 100}%` }}
                     />
                   </div>
                 </div>

                 <div className="bg-gray-800 p-4 rounded">
                   <p className="text-gray-400 text-sm mb-1">Danceability</p>
                   <p className="text-2xl font-bold">
                     {(audioFeatures.danceability * 100).toFixed(0)}%
                   </p>
                   <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                     <div
                       className="bg-blue-500 h-2 rounded-full"
                       style={{ width: `${audioFeatures.danceability * 100}%` }}
                     />
                   </div>
                 </div>

                 <div className="bg-gray-800 p-4 rounded">
                   <p className="text-gray-400 text-sm mb-1">Tempo</p>
                   <p className="text-2xl font-bold">
                     {audioFeatures.tempo.toFixed(0)} BPM
                   </p>
                 </div>

                 <div className="bg-gray-800 p-4 rounded">
                   <p className="text-gray-400 text-sm mb-1">Loudness</p>
                   <p className="text-2xl font-bold">
                     {audioFeatures.loudness.toFixed(1)} dB
                   </p>
                 </div>

                 <div className="bg-gray-800 p-4 rounded">
                   <p className="text-gray-400 text-sm mb-1">Acousticness</p>
                   <p className="text-2xl font-bold">
                     {(audioFeatures.acousticness * 100).toFixed(0)}%
                   </p>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
       </ErrorBoundary>
     );
   }