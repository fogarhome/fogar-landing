/*
 * Cabecera GLSL común para los pases a pantalla completa encima del canvas del vídeo (la usa d/gl.ts).
 * Uniforms comunes:
 *   uFrame  textura del fotograma pintado (se sube solo cuando cambia)
 *   uRes    tamaño del lienzo en píxeles de dispositivo
 *   uMouse  ratón suavizado, en píxeles de dispositivo con el origen arriba a la izquierda
 *   uCover  (escala, centro x, centro y) de la transformación «cover» de la escena de 1920×1080, en px de dispositivo
 *   uTime   segundos
 * En el shader: `vec2 escena(vec2 p)` pasa de píxel (arriba-izquierda) a coordenadas de escena, igual que `Anclado`.
 */
export const CABECERA = /* glsl */ `
  uniform sampler2D uFrame;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uCover;
  uniform float uTime;
  vec2 pix() { return vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y); }
  vec2 escena(vec2 p) { return (p - uCover.yz) / uCover.x + vec2(960.0, 540.0); }
  vec3 frame(vec2 p) { return texture2D(uFrame, vec2(p.x / uRes.x, 1.0 - p.y / uRes.y)).rgb; }
  float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float grano(vec2 p) { return hash(floor(p) + floor(fract(uTime * 12.0) * 12.0) * 61.0) - 0.5; }
`;
