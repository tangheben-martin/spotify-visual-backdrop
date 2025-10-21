import NextAuth from "next-auth";
   import SpotifyProvider from "next-auth/providers/spotify";

   const scopes = [
     "user-read-email",
     "user-read-private",
     "user-read-playback-state",
     "user-read-currently-playing",
   ].join(" ");

   const params = {
     scope: scopes,
   };

   const LOGIN_URL = `https://accounts.spotify.com/authorize?${new URLSearchParams(params)}`;

   async function refreshAccessToken(token: any) {
     const params = new URLSearchParams({
       grant_type: "refresh_token",
       refresh_token: token.refreshToken,
     });

     const response = await fetch("https://accounts.spotify.com/api/token", {
       method: "POST",
       headers: {
         "Content-Type": "application/x-www-form-urlencoded",
         Authorization:
           "Basic " +
           Buffer.from(
             `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
           ).toString("base64"),
       },
       body: params,
     });

     const data = await response.json();

     return {
       ...token,
       accessToken: data.access_token,
       refreshToken: data.refresh_token ?? token.refreshToken,
       accessTokenExpires: Date.now() + data.expires_in * 1000,
     };
   }

   const handler = NextAuth({
     providers: [
       SpotifyProvider({
         clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
         clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
         authorization: LOGIN_URL,
       }),
     ],
     callbacks: {
       async jwt({ token, account }) {
         if (account) {
           token.accessToken = account.access_token;
           token.refreshToken = account.refresh_token;
           token.accessTokenExpires = account.expires_at! * 1000;
         }

         // Return previous token if the access token has not expired
         if (Date.now() < (token.accessTokenExpires as number)) {
           return token;
         }

         // Access token has expired, refresh it
         return await refreshAccessToken(token);
       },
       async session({ session, token }) {
         session.accessToken = token.accessToken as string;
         session.error = token.error as string;
         return session;
       },
     },
     pages: {
       signIn: "/",
     },
   });

   export { handler as GET, handler as POST };