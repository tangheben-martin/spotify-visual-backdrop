import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getCurrentlyPlaying, getAudioFeatures } from "@/lib/spotifyApi";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Using Access Token:", session.accessToken ? session.accessToken.substring(0, 10) + "..." : "No Token"); // Log safely
  try {
    const currentTrack = await getCurrentlyPlaying(session.accessToken);

    if (!currentTrack || !currentTrack.item) {
      return NextResponse.json({ 
        isPlaying: false, 
        track: null,
        audioFeatures: null 
      });
    }

    // Type guard: Check if it's a track (not a podcast episode)
    if (currentTrack.item.type !== "track") {
      return NextResponse.json({
        isPlaying: currentTrack.is_playing,
        track: null,
        audioFeatures: null,
        message: "Podcasts are not supported"
      });
    }

    const item = currentTrack.item as SpotifyApi.TrackObjectFull;
    const trackId = item.id;
    
    console.log("Fetching audio features for track:", trackId); // Debug log
    const audioFeatures = await getAudioFeatures(session.accessToken, trackId);
    console.log("Audio features received:", audioFeatures); // Debug log

    return NextResponse.json({
      isPlaying: currentTrack.is_playing,
      progress_ms: currentTrack.progress_ms,
      track: {
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist) => ({
          name: artist.name,
        })),
        album: {
          name: item.album.name,
          images: item.album.images,
        },
        duration_ms: item.duration_ms,
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