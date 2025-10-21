"use client";

   import { useSession, signOut } from "next-auth/react";
   import { useRouter } from "next/navigation";
   import { useEffect } from "react";

   export default function Dashboard() {
     const { data: session, status } = useSession();
     const router = useRouter();

     useEffect(() => {
       if (status === "unauthenticated") {
         router.push("/");
       }
     }, [status, router]);

     if (status === "loading") {
       return (
         <div className="flex min-h-screen items-center justify-center bg-black">
           <div className="text-xl text-white">Loading...</div>
         </div>
       );
     }

     if (!session) {
       return null;
     }

     return (
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

           <div className="bg-gray-900 p-6 rounded-lg">
             <h2 className="text-2xl mb-4">Connection Status</h2>
             <p className="text-green-400 text-lg">✓ Connected to Spotify</p>
             <p className="text-gray-400 mt-2">
               Access Token: {session.accessToken?.substring(0, 20)}...
             </p>
           </div>

           <div className="mt-8 bg-gray-900 p-6 rounded-lg">
             <h2 className="text-2xl mb-4">Next Steps</h2>
             <p className="text-gray-300">
               Visual backdrop integration coming soon...
             </p>
           </div>
         </div>
       </div>
     );
   }