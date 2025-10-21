"use client";

   import React, { Component, ReactNode } from "react";

   interface Props {
     children: ReactNode;
   }

   interface State {
     hasError: boolean;
     error?: Error;
   }

   export class ErrorBoundary extends Component<Props, State> {
     constructor(props: Props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       console.error("Error caught by boundary:", error, errorInfo);
     }

     render() {
       if (this.state.hasError) {
         return (
           <div className="flex min-h-screen items-center justify-center bg-black">
             <div className="text-center text-white">
               <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
               <p className="text-gray-400 mb-6">
                 {this.state.error?.message || "An unexpected error occurred"}
               </p>
               <button
                 onClick={() => window.location.reload()}
                 className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full"
               >
                 Reload Page
               </button>
             </div>
           </div>
         );
       }

       return this.props.children;
     }
   }