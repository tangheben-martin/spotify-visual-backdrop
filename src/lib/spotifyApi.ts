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
     } catch (error) {
       console.error("Error fetching currently playing track:", error);
       return null;
     }
   }

   export async function getAudioFeatures(accessToken: string, trackId: string) {
     const spotifyApi = createSpotifyApi(accessToken);

     try {
       const response = await spotifyApi.getAudioFeaturesForTrack(trackId);
       return response.body;
     } catch (error) {
       console.error("Error fetching audio features:", error);
       return null;
     }
   }