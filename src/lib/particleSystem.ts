import * as THREE from "three";

   export interface ParticleSystemConfig {
     count: number;
     size: number;
     spread: number;
   }

   export class ParticleSystem {
     private particles: THREE.Points;
     private geometry: THREE.BufferGeometry;
     private material: THREE.PointsMaterial;
     private positions: Float32Array;
     private velocities: Float32Array;
     private colors: Float32Array;

     constructor(config: ParticleSystemConfig) {
       const { count, size, spread } = config;

       // Create geometry
       this.geometry = new THREE.BufferGeometry();
       
       // Initialize arrays
       this.positions = new Float32Array(count * 3);
       this.velocities = new Float32Array(count * 3);
       this.colors = new Float32Array(count * 3);

       // Initialize particle positions and velocities
       for (let i = 0; i < count; i++) {
         const i3 = i * 3;
         
         // Random positions
         this.positions[i3] = (Math.random() - 0.5) * spread;
         this.positions[i3 + 1] = (Math.random() - 0.5) * spread;
         this.positions[i3 + 2] = (Math.random() - 0.5) * spread;

         // Random velocities
         this.velocities[i3] = (Math.random() - 0.5) * 0.02;
         this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
         this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

         // Initial colors (white)
         this.colors[i3] = 1;
         this.colors[i3 + 1] = 1;
         this.colors[i3 + 2] = 1;
       }

       // Set geometry attributes
       this.geometry.setAttribute(
         "position",
         new THREE.BufferAttribute(this.positions, 3)
       );
       this.geometry.setAttribute(
         "color",
         new THREE.BufferAttribute(this.colors, 3)
       );

       // Create material
       this.material = new THREE.PointsMaterial({
         size: size,
         vertexColors: true,
         transparent: true,
         opacity: 0.8,
         blending: THREE.AdditiveBlending,
         sizeAttenuation: true,
       });

       // Create points
       this.particles = new THREE.Points(this.geometry, this.material);
     }

     update(deltaTime: number) {
       const positions = this.geometry.attributes.position.array as Float32Array;
       
       for (let i = 0; i < positions.length; i += 3) {
         // Update positions based on velocity
         positions[i] += this.velocities[i];
         positions[i + 1] += this.velocities[i + 1];
         positions[i + 2] += this.velocities[i + 2];

         // Wrap around boundaries
         const spread = 10;
         if (Math.abs(positions[i]) > spread) positions[i] *= -1;
         if (Math.abs(positions[i + 1]) > spread) positions[i + 1] *= -1;
         if (Math.abs(positions[i + 2]) > spread) positions[i + 2] *= -1;
       }

       this.geometry.attributes.position.needsUpdate = true;
     }

     setColors(color: THREE.Color) {
       const colors = this.geometry.attributes.color.array as Float32Array;
       
       for (let i = 0; i < colors.length; i += 3) {
         colors[i] = color.r;
         colors[i + 1] = color.g;
         colors[i + 2] = color.b;
       }

       this.geometry.attributes.color.needsUpdate = true;
     }

     setVelocityMultiplier(multiplier: number) {
       // Adjust particle movement speed
       for (let i = 0; i < this.velocities.length; i++) {
         this.velocities[i] = (Math.random() - 0.5) * 0.02 * multiplier;
       }
     }

     getMesh(): THREE.Points {
       return this.particles;
     }

     dispose() {
       this.geometry.dispose();
       this.material.dispose();
     }
   }