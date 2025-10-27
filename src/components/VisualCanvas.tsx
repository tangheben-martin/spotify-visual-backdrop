"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ParticleSystem } from "@/lib/particleSystem";
import { useAudioVisualMapping } from "@/hooks/useAudioVisualMapping";
import { SmoothColor, SmoothValue } from "@/lib/smoothTransition";

export default function VisualCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  
  // Smooth transition refs
  const smoothColorRef = useRef(new SmoothColor(0.05));
  const smoothSpeedRef = useRef(new SmoothValue(1.0, 0.05));

  // Get audio-visual parameters
  const visualParams = useAudioVisualMapping();

  // First useEffect: Scene setup and animation
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 15);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    cameraRef.current = camera;

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

    const particleSystem = new ParticleSystem({
      count: 5000,
      size: 0.1,
      spread: 15,
    });
    scene.add(particleSystem.getMesh());
    particleSystemRef.current = particleSystem;

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

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const deltaTime = clockRef.current.getDelta();

      // Update smooth values
      const smoothColor = smoothColorRef.current.update();
      const smoothSpeed = smoothSpeedRef.current.update();

      if (particleSystemRef.current) {
        particleSystemRef.current.update(deltaTime);
        
        // Apply smoothed color
        const color = new THREE.Color(smoothColor.r, smoothColor.g, smoothColor.b);
        particleSystemRef.current.setColors(color);
      }

      if (cameraRef.current) {
        const time = Date.now() * 0.0001 * smoothSpeed;
        cameraRef.current.position.x = Math.sin(time) * 2 * visualParams.intensity;
        cameraRef.current.position.y = Math.cos(time) * 2 * visualParams.intensity;
        cameraRef.current.lookAt(0, 0, 0);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

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
  }, []); // Empty dependency array - runs once on mount

  // Second useEffect: Update smooth targets when visualParams change
  // ✅ THIS MUST BE INSIDE THE COMPONENT, BEFORE THE RETURN
  useEffect(() => {
    smoothColorRef.current.setTarget(
      visualParams.color.r,
      visualParams.color.g,
      visualParams.color.b
    );
    smoothSpeedRef.current.setTarget(visualParams.speed);
  }, [visualParams]); // Runs whenever visualParams changes

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}