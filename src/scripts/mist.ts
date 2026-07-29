/**
 * Hero mist — a WebGL2 fog layer, which is what the reference site actually
 * does: `tresmarescapital.com` runs a single full-viewport WebGL2 canvas behind
 * its hero (read off the live page: 1440x900 buffer, `DIV.canvas`, no video).
 *
 * Deliberately additive-only: this canvas draws *nothing but* paper-coloured
 * fog with alpha, over the hero image rather than instead of it. Two
 * consequences worth keeping:
 *   - No texture upload, so no CORS, no load ordering, no decode wait.
 *   - It degrades perfectly. No JS, no WebGL2, or reduced motion → the hero is
 *     simply the still image, which is a complete design on its own.
 *
 * It does not displace the image. Warping the peak reads as a wobbling
 * photograph; fog drifting *across* a static peak reads as weather.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uPaper;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes; // y is up
  vec2 p = vec2(uv.x * 2.2, uv.y * 1.35);
  float t = uTime * 0.011;

  // Two octave sets drifting at different rates and directions: the slower one
  // warps the faster one, which is what stops it reading as a sliding texture.
  float f1 = fbm(p * 1.55 + vec2(t, -t * 0.32));
  float f2 = fbm(p * 3.05 + vec2(-t * 1.6, t * 0.45) + f1 * 0.55);
  float fog = smoothstep(0.36, 0.96, f1 * 0.62 + f2 * 0.46);

  // Confine it to the lower-middle band. Fog at the very top of the frame looks
  // like haze on the lens; fog at the mountain's base looks like altitude.
  float band = smoothstep(0.0, 0.30, uv.y) * (1.0 - smoothstep(0.44, 0.96, uv.y));

  // Keep it off the copy. The headline and sub live in the left ~38%, and fog
  // rolling behind display type reads as dirt on the screen, not as weather.
  float clear = smoothstep(0.30, 0.62, uv.x);

  float a = fog * band * clear * 0.42;

  // Premultiplied: the context is premultipliedAlpha (the default) and the blend
  // below is ONE / ONE_MINUS_SRC_ALPHA. Emitting straight colour here instead is
  // what turned light haze into dark grey cloud — the compositor double-applied
  // alpha and darkened every fragment.
  outColor = vec4(uPaper * a, a);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[mist] shader compile failed:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * Starts the fog on a canvas. Returns a cleanup function, or null if WebGL2 is
 * unavailable — callers should treat null as "leave the still image alone".
 */
export function initMist(canvas: HTMLCanvasElement): (() => void) | null {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[mist] link failed:', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  // Fullscreen triangle pair.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uPaper = gl.getUniformLocation(prog, 'uPaper');
  gl.uniform3f(uPaper, 0.961, 0.949, 0.925); // --paper #f5f2ec

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied source
  gl.clearColor(0, 0, 0, 0);

  // Fog is low-frequency, so it does not need device pixels. Capping at 1.5
  // roughly halves the fragment count on a phone for no visible difference.
  const DPR_CAP = 1.5;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
  }
  resize();

  let raf = 0;
  let running = false;
  let start = 0;

  function frame(now: number) {
    if (!start) start = now;
    gl!.uniform1f(uTime, (now - start) / 1000);
    // Must clear: without it each frame blends onto the last and the fog
    // accumulates to opaque within a few seconds.
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  function play() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // Don't burn a GPU on a hero that has scrolled away, or on a hidden tab.
  const io = new IntersectionObserver((entries) => {
    entries[0].isIntersecting ? play() : pause();
  }, { threshold: 0 });
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', onVisibility);
  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  return () => {
    pause();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buf);
  };
}
