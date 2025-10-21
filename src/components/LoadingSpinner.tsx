export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
     const sizeClasses = {
       sm: "w-6 h-6",
       md: "w-12 h-12",
       lg: "w-16 h-16",
     };

     return (
       <div className="flex items-center justify-center">
         <div
           className={`${sizeClasses[size]} border-4 border-gray-700 border-t-green-500 rounded-full animate-spin`}
         />
       </div>
     );
   }