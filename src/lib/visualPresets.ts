import * as THREE from "three";

   export interface VisualPreset {
     name: string;
     colors: THREE.Color[];
     particleCount: number;
     particleSize: number;
     spread: number;
     velocityMultiplier: number;
     cameraDistance: number;
   }

   export const visualPresets: Record<string, VisualPreset> = {
     energetic: {
       name: "Energetic",
       colors: [
         new THREE.Color(0xff0000), // Red
         new THREE.Color(0xff7700), // Orange
         new THREE.Color(0xffff00), // Yellow
       ],
       particleCount: 8000,
       particleSize: 0.12,
       spread: 18,
       velocityMultiplier: 2.5,
       cameraDistance: 8,
     },
     happy: {
       name: "Happy",
       colors: [
         new THREE.Color(0xffff00), // Yellow
         new THREE.Color(0xff66ff), // Pink
         new THREE.Color(0x00ffff), // Cyan
       ],
       particleCount: 6000,
       particleSize: 0.15,
       spread: 15,
       velocityMultiplier: 1.5,
       cameraDistance: 10,
     },
     calm: {
       name: "Calm",
       colors: [
         new THREE.Color(0x0088ff), // Blue
         new THREE.Color(0x00ffaa), // Teal
         new THREE.Color(0x88ffff), // Light blue
       ],
       particleCount: 3000,
       particleSize: 0.2,
       spread: 12,
       velocityMultiplier: 0.5,
       cameraDistance: 12,
     },
     intense: {
       name: "Intense",
       colors: [
         new THREE.Color(0xff0000), // Red
         new THREE.Color(0x880088), // Purple
         new THREE.Color(0xff0088), // Magenta
       ],
       particleCount: 10000,
       particleSize: 0.08,
       spread: 20,
       velocityMultiplier: 3.0,
       cameraDistance: 6,
     },
     melancholic: {
       name: "Melancholic",
       colors: [
         new THREE.Color(0x4444ff), // Deep blue
         new THREE.Color(0x8844ff), // Purple
         new THREE.Color(0x444488), // Dark blue
       ],
       particleCount: 4000,
       particleSize: 0.18,
       spread: 10,
       velocityMultiplier: 0.8,
       cameraDistance: 14,
     },
     neutral: {
       name: "Neutral",
       colors: [
         new THREE.Color(0x888888), // Gray
         new THREE.Color(0xaaaaaa), // Light gray
         new THREE.Color(0x666666), // Dark gray
       ],
       particleCount: 5000,
       particleSize: 0.1,
       spread: 15,
       velocityMultiplier: 1.0,
       cameraDistance: 10,
     },
   };

   export function getPresetForMood(mood: string): VisualPreset {
     return visualPresets[mood] || visualPresets.neutral;
   }