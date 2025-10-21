export async function getSpotifyAccessToken(sessionToken: string) {
     try {
       // Token is already managed by NextAuth
       // This function is a placeholder for additional token validation if needed
       return sessionToken;
     } catch (error) {
       console.error("Error getting Spotify access token:", error);
       throw error;
     }
   }

   export function isTokenExpired(expiresAt: number): boolean {
     return Date.now() >= expiresAt;
   }