import type { Metadata } from "next";
   import { Inter } from "next/font/google";
   import "./globals.css";
   import Providers from "@/components/Providers";

   const inter = Inter({ subsets: ["latin"] });

   export const metadata: Metadata = {
     title: "Spotify Visual Backdrop",
     description: "AI-generated visual backdrops synced to your music",
   };

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body className={inter.className}>
           <Providers>{children}</Providers>
         </body>
       </html>
     );
   }