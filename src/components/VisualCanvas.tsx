"use client";

   import { useEffect, useRef } from "react";
   import * as THREE from "three";
   import VisualCanvas from "@/components/VisualCanvas";

   export default function VisualCanvas() {
     const containerRef = useRef<HTMLDivElement>(null);
     const sceneRef = useRef<THREE.Scene | null>(null);
     const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
     const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
     const animationFrameRef = useRef<number | null>(null);

     useEffect(() => {
       if (!containerRef.current) return;

       // Scene setup
       const scene = new THREE.Scene();
       scene.background = new THREE.Color(0x000000);
       sceneRef.current = scene;

       // Camera setup
       const camera = new THREE.PerspectiveCamera(
         75,
         window.innerWidth / window.innerHeight,
         0.1,
         1000
       );
       camera.position.z = 5;
       cameraRef.current = camera;

       // Renderer setup
       const renderer = new THREE.WebGLRenderer({
         antialias: true,
         alpha: true,
       });
       renderer.setSize(window.innerWidth, window.innerHeight);
       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
       containerRef.current.appendChild(renderer.domElement);
       rendererRef.current = renderer;

       // Basic lighting
       const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
       scene.add(ambientLight);

       const pointLight = new THREE.PointLight(0xffffff, 1);
       pointLight.position.set(5, 5, 5);
       scene.add(pointLight);

       // Handle window resize
       const handleResize = () => {
         if (!cameraRef.current || !rendererRef.current) return;

         cameraRef.current.aspect = window.innerWidth / window.innerHeight;
         cameraRef.current.updateProjectionMatrix();
         rendererRef.current.setSize(window.innerWidth, window.innerHeight);
       };

       window.addEventListener("resize", handleResize);

       // Animation loop
       const animate = () => {
         animationFrameRef.current = requestAnimationFrame(animate);

         if (rendererRef.current && sceneRef.current && cameraRef.current) {
           rendererRef.current.render(sceneRef.current, cameraRef.current);
         }
       };

       animate();

       // Cleanup
       return () => {
         window.removeEventListener("resize", handleResize);
         
         if (animationFrameRef.current) {
           cancelAnimationFrame(animationFrameRef.current);
         }

         if (rendererRef.current) {
           rendererRef.current.dispose();
           containerRef.current?.removeChild(rendererRef.current.domElement);
         }
       };
     }, []);

     return (
        <>
         <VisualCanvas />
         <div className="min-h-screen text-white p-8 relative z-10">
            <div
                ref={containerRef}
                className="fixed inset-0 -z-10"
                style={{ width: "100vw", height: "100vh" }}
            />
         </div>
       </>
     );
   }