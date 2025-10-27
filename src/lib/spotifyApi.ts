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
    console.error("Status:", error.statusCode);
    console.error("Message:", error.message);
    return null;
  }
}

export async function getAudioFeatures(accessToken: string, trackId: string) {
  const spotifyApi = createSpotifyApi(accessToken);
  console.log(`Attempting to fetch audio features for track ID: ${trackId}`); // Added log
  try {
    const response = await spotifyApi.getAudioFeaturesForTrack(trackId);
    console.log("Audio features received:", response.body); // Added log
    return response.body;
  } catch (error: any) { // Changed to any to access potential properties
    console.error(`Error fetching audio features for track: ${trackId}`);
    if (error.statusCode) { // Check if statusCode exists
      console.error(`Status Code: ${error.statusCode}`);
    }
    if (error.message) { // Check if message exists
      console.error(`Error Message: ${error.message}`);
    }
     if (error.body) { // Log the body if it exists
      console.error(`Details: ${JSON.stringify(error.body)}.`);
    }
    console.error("Full Error:", error); // Log the full error object
    return null;
  }
}