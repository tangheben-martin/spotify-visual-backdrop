import SpotifyWebApi from "spotify-web-api-node";

export function createSpotifyApi(accessToken: string) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(accessToken);

  return spotifyApi;
}

export async function getCurrentlyPlaying(accessToken: string) {
  const spotifyApi = createSpotifyApi(accessToken);

  try {
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    return response.body;
  } catch (error: any) {
    console.error("Error fetching currently playing track:", error);
    return null;
  }
}

// NEW: Use ReccoBeats instead of Spotify for audio features
export async function getAudioFeatures(accessToken: string, trackId: string) {
  try {
    console.log("Fetching audio features from ReccoBeats for track:", trackId);
    
    // Call ReccoBeats API (no authentication needed!)
    const response = await fetch(
      `https://api.reccobeats.com/v1/track/${trackId}/audio-features`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ReccoBeats API error (${response.status}):`, errorText);
      
      // If track not found in ReccoBeats, return mock data
      if (response.status === 404) {
        console.warn("Track not found in ReccoBeats, using fallback values");
        return generateFallbackAudioFeatures();
      }
      
      throw new Error(`ReccoBeats API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully fetched audio features from ReccoBeats:", data);
    
    // ReccoBeats returns the same format as Spotify
    return data;
    
  } catch (error: any) {
    console.error("Error fetching audio features from ReccoBeats:", error);
    
    // Fallback to reasonable mock data if API fails
    return generateFallbackAudioFeatures();
  }
}

// Helper function for fallback data
function generateFallbackAudioFeatures() {
  return {
    valence: 0.3 + Math.random() * 0.4, // 0.3-0.7
    energy: 0.3 + Math.random() * 0.4,
    danceability: 0.4 + Math.random() * 0.3,
    tempo: 90 + Math.random() * 60, // 90-150 BPM
    loudness: -15 + Math.random() * 10,
    acousticness: Math.random(),
    instrumentalness: Math.random(),
    speechiness: Math.random() * 0.5,
    liveness: Math.random() * 0.3,
    key: Math.floor(Math.random() * 12),
    mode: Math.random() > 0.5 ? 1 : 0,
  };
}