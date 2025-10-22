"use client";

   import { useEffect, useRef } from "react";
   import * as THREE from "three";
   import { ParticleSystem } from "@/lib/particleSystem";

   export default function VisualCanvas() {
     const containerRef = useRef<HTMLDivElement>(null);
     const sceneRef = useRef<THREE.Scene | null>(null);
     const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
     const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
     const particleSystemRef = useRef<ParticleSystem | null>(null);
     const animationFrameRef = useRef<number | null>(null);
     const clockRef = useRef<THREE.Clock>(new THREE.Clock());

     useEffect(() => {
       if (!containerRef.current) return;

       // Scene setup
       const scene = new THREE.Scene();
       scene.background = new THREE.Color(0x000000);
       scene.fog = new THREE.Fog(0x000000, 5, 15);
       sceneRef.current = scene;

       // Camera setup
       const camera = new THREE.PerspectiveCamera(
         75,
         window.innerWidth / window.innerHeight,
         0.1,
         1000
       );
       camera.position.z = 8;
       cameraRef.current = camera;

       // Renderer setup
       const renderer = new THREE.WebGLRenderer({
         antialias: false,
         alpha: true,
       });
       
       const renderScale = 0.6;
       renderer.setSize(
         window.innerWidth * renderScale,
         window.innerHeight * renderScale,
         false
       );
       renderer.domElement.style.width = "100%";
       renderer.domElement.style.height = "100%";
       renderer.domElement.style.imageRendering = "pixelated";
       renderer.setPixelRatio(1);
       
       containerRef.current.appendChild(renderer.domElement);
       rendererRef.current = renderer;

       // Create particle system
       const particleSystem = new ParticleSystem({
         count: 5000,
         size: 0.1,
         spread: 15,
       });
       scene.add(particleSystem.getMesh());
       particleSystemRef.current = particleSystem;

       // Handle window resize
       const handleResize = () => {
         if (!cameraRef.current || !rendererRef.current) return;

         const renderScale = 0.6;
         cameraRef.current.aspect = window.innerWidth / window.innerHeight;
         cameraRef.current.updateProjectionMatrix();
         rendererRef.current.setSize(
           window.innerWidth * renderScale,
           window.innerHeight * renderScale,
           false
         );
       };

       window.addEventListener("resize", handleResize);

       // Animation loop
       const animate = () => {
         animationFrameRef.current = requestAnimationFrame(animate);

         const deltaTime = clockRef.current.getDelta();

         if (particleSystemRef.current) {
           particleSystemRef.current.update(deltaTime);
         }

         // Slowly rotate camera for dynamic view
         if (cameraRef.current) {
           cameraRef.current.position.x = Math.sin(Date.now() * 0.0001) * 2;
           cameraRef.current.position.y = Math.cos(Date.now() * 0.0001) * 2;
           cameraRef.current.lookAt(0, 0, 0);
         }

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

         if (particleSystemRef.current) {
           particleSystemRef.current.dispose();
         }

         if (rendererRef.current) {
           rendererRef.current.dispose();
           containerRef.current?.removeChild(rendererRef.current.domElement);
         }
       };
     }, []);

     return (
       <div
         ref={containerRef}
         className="fixed inset-0 -z-10"
         style={{ width: "100vw", height: "100vh" }}
       />
     );
   }