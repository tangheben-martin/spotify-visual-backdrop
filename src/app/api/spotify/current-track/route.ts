import { getServerSession } from "next-auth";
   import { NextResponse } from "next/server";
   import { getCurrentlyPlaying, getAudioFeatures } from "@/lib/spotifyApi";

   export async function GET() {
     const session = await getServerSession();

     if (!session || !session.accessToken) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }

     try {
       const currentTrack = await getCurrentlyPlaying(session.accessToken);

       if (!currentTrack || !currentTrack.item) {
         return NextResponse.json({ 
           isPlaying: false, 
           track: null,
           audioFeatures: null 
         });
       }

       const trackId = currentTrack.item.id;
       const audioFeatures = await getAudioFeatures(session.accessToken, trackId);

       return NextResponse.json({
         isPlaying: currentTrack.is_playing,
         progress_ms: currentTrack.progress_ms,
         track: {
           id: currentTrack.item.id,
           name: currentTrack.item.name,
           artists: currentTrack.item.artists.map((artist: any) => ({
             name: artist.name,
           })),
           album: {
             name: currentTrack.item.album.name,
             images: currentTrack.item.album.images,
           },
           duration_ms: currentTrack.item.duration_ms,
         },
         audioFeatures: audioFeatures,
       });
     } catch (error) {
       console.error("Error in current-track route:", error);
       return NextResponse.json(
         { error: "Failed to fetch track data" },
         { status: 500 }
       );
     }
   }