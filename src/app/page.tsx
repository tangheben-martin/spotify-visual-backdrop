"use client";

   import { signIn, useSession } from "next-auth/react";
   import { useRouter } from "next/navigation";
   import { useEffect } from "react";

   export default function Home() {
     const { data: session, status } = useSession();
     const router = useRouter();

     useEffect(() => {
       if (status === "authenticated") {
         router.push("/dashboard");
       }
     }, [status, router]);

     if (status === "loading") {
       return (
         <div className="flex min-h-screen items-center justify-center">
           <div className="text-xl">Loading...</div>
         </div>
       );
     }

     return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
         <div className="text-center space-y-8 p-8">
           <h1 className="text-6xl font-bold text-white mb-4">
             Spotify Visual Backdrop
           </h1>
           <p className="text-xl text-gray-300 mb-8">
             AI-generated visuals that dance with your music
           </p>
           <button
             onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
             className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
           >
             Connect with Spotify
           </button>
         </div>
       </div>
     );
   }