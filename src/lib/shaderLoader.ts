export const particleVertexShader = `
     varying vec3 vColor;
     attribute float size;
     
     void main() {
       vColor = color;
       
       vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
       gl_Position = projectionMatrix * mvPosition;
       
       gl_PointSize = size * (300.0 / -mvPosition.z);
     }
   `;

   export const particleFragmentShader = `
     varying vec3 vColor;
     
     void main() {
       vec2 center = gl_PointCoord - vec2(0.5);
       float dist = length(center);
       
       float alpha = exp(-dist * dist * 8.0);
       
       gl_FragColor = vec4(vColor, alpha);
     }
   `;