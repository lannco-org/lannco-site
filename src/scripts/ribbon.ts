/**
 * Animates only the red pixels in the approved hero artwork. The original image
 * remains underneath as the no-WebGL and reduced-motion fallback.
 */
const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uRes;
uniform vec2 uImageSize;
uniform float uTime;
out vec4 outColor;

float redMask(vec3 color) {
  float separation = color.r - max(color.g, color.b);
  return smoothstep(0.075, 0.34, separation) * smoothstep(0.18, 0.58, color.r);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float canvasAspect = uRes.x / uRes.y;
  float imageAspect = uImageSize.x / uImageSize.y;
  vec2 fit = canvasAspect > imageAspect
    ? vec2(imageAspect / canvasAspect, 1.0)
    : vec2(1.0, canvasAspect / imageAspect);
  vec2 local = (uv - 0.5) / fit + 0.5;

  if (local.x < 0.0 || local.x > 1.0 || local.y < 0.0 || local.y > 1.0) {
    outColor = vec4(0.0);
    return;
  }

  vec4 base = texture(uImage, local);
  float phase = uTime * 1.18;
  float longWave = sin(local.x * 16.0 - phase) * 0.62
                 + sin(local.x * 29.0 + phase * 0.73) * 0.25
                 + sin((local.x + local.y) * 41.0 - phase * 1.34) * 0.13;
  float breath = 0.78 + 0.22 * sin(uTime * 0.58);
  vec2 displacement = vec2(
    sin(local.y * 24.0 + phase * 0.72) * 0.0026,
    longWave * 0.0068 * breath
  );

  vec4 moved = texture(uImage, clamp(local + displacement, 0.0, 1.0));
  float mask = max(redMask(base.rgb), redMask(moved.rgb));
  mask *= smoothstep(0.20, 0.36, local.y) * (1.0 - smoothstep(0.72, 0.86, local.y));

  // The displaced source replaces only ribbon pixels. Everything else stays
  // transparent so the untouched approved image remains perfectly sharp below.
  vec3 ribbon = mix(base.rgb, moved.rgb, 0.94);
  outColor = vec4(ribbon, mask);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[ribbon] shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function initRibbon(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
): (() => void) | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  });
  if (!gl || !image.complete || !image.naturalWidth) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[ribbon] link failed:', gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0);
  gl.uniform2f(
    gl.getUniformLocation(program, 'uImageSize'),
    image.naturalWidth,
    image.naturalHeight,
  );
  const resolution = gl.getUniformLocation(program, 'uRes');
  const time = gl.getUniformLocation(program, 'uTime');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const DPR_CAP = 1.5;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(resolution, canvas.width, canvas.height);
  }
  resize();

  let raf = 0;
  let running = false;
  let start = 0;
  function frame(now: number) {
    if (!start) start = now;
    gl!.uniform1f(time, (now - start) / 1000);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  function play() {
    if (running || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const observer = new IntersectionObserver(([entry]) => {
    entry?.isIntersecting ? play() : pause();
  });
  observer.observe(canvas);
  const onVisibility = () => (document.hidden ? pause() : play());
  const onResize = () => resize();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize);

  return () => {
    pause();
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteBuffer(buffer);
    gl.deleteTexture(texture);
  };
}
