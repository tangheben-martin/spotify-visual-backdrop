"use client";

   import { signIn, signOut, useSession } from "next-auth/react";

   export default function AuthButton() {
     const { data: session, status } = useSession();

     if (status === "loading") {
       return <div className="text-gray-400">Loading...</div>;
     }

     if (session) {
       return (
         <button
           onClick={() => signOut({ callbackUrl: "/" })}
           className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all"
         >
           Logout
         </button>
       );
     }

     return (
       <button
         onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
         className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-all"
       >
         Login with Spotify
       </button>
     );
   }