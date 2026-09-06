export const vertexShader = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

export const fragmentShader = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
uniform vec4 uRipples[4];
uniform vec3 uNavy;
uniform vec3 uBlue;
uniform vec3 uYellow;
uniform vec3 uWhite;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
    mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float terrain(float x, float layer) {
  return noise(vec2(x*3.8+layer*7.0,layer))*0.065
    + noise(vec2(x*11.0,layer*4.0))*0.024
    + noise(vec2(x*28.0,layer))*0.009;
}
float dusk;
vec2 sun;
float aspect;
vec3 sky(vec2 uv) {
  float altitude = smoothstep(0.42, 1.0, uv.y);
  vec3 horizon = mix(mix(uYellow,uWhite,0.48),mix(uBlue,uWhite,0.24),dusk);
  vec3 zenith = mix(mix(uBlue,uNavy,0.64),uNavy,dusk*0.65);
  vec3 col = mix(horizon,zenith,pow(altitude,0.65));
  float distanceToSun = length((uv-sun)*vec2(aspect,1.0));
  col = mix(col,mix(uYellow,uWhite,0.35),exp(-distanceToSun*8.0)*(1.0-dusk)*0.48);
  float disc = 1.0-smoothstep(0.022,0.025,distanceToSun);
  col = mix(col,mix(uYellow,uWhite,0.78),disc*(1.0-dusk*0.7));
  float cloud = noise(vec2(uv.x*3.0+uTime*0.003,uv.y*24.0));
  cloud *= noise(vec2(uv.x*9.0-uTime*0.002,uv.y*38.0));
  col = mix(col,mix(uWhite,horizon,0.6),smoothstep(0.32,0.62,cloud)*0.20*altitude);
  return col;
}
void main() {
  vec2 uv = vUv;
  aspect = uResolution.x/uResolution.y;
  dusk = 0.5-0.5*cos(uTime*0.018);
  sun = vec2(0.79,0.585-dusk*0.065);
  float horizon = 0.43;
  vec3 col;
  if (uv.y >= horizon) {
    col = sky(uv);
    for (int i=0;i<3;i++) {
      float layer = float(i);
      float ridge = horizon+terrain(uv.x,layer+1.0)*(1.0-layer*0.20);
      ridge += pow(abs(uv.x-0.64),1.4)*(0.17-layer*0.035);
      vec3 mountain = mix(uNavy,uBlue,0.30-layer*0.09);
      mountain = mix(mountain,mix(uYellow,uWhite,0.3),0.16*(1.0-dusk)*(1.0-layer*0.35));
      col = mix(col,mountain,1.0-smoothstep(ridge-0.001,ridge+0.001,uv.y));
    }
  } else {
    float depth = (horizon-uv.y)/horizon;
    float perspective = 1.0/(depth+0.085);
    vec2 water = vec2((uv.x-0.5)*perspective*3.0,perspective*2.6);
    float wave = sin(water.x*3.5+water.y*2.8+uTime*0.75)*0.5;
    wave += sin(water.x*6.0-water.y*1.7-uTime*0.9)*0.25;
    wave += (noise(water*4.0+vec2(uTime*0.12,-uTime*0.23))-0.5)*0.7;
    float ripple = 0.0;
    for(int i=0;i<4;i++) {
      float age = uTime-uRipples[i].z;
      vec2 d = (uv-uRipples[i].xy)*vec2(aspect,2.0);
      float radius = length(d);
      float ring = radius-age*0.09;
      ripple += sin(ring*110.0)*exp(-ring*ring*180.0)*exp(-age*0.8)*uRipples[i].w;
    }
    wave += ripple*0.8;
    vec2 reflected = vec2(uv.x+wave*0.007*(0.2+depth),horizon+(horizon-uv.y)*0.72+wave*0.008);
    col = mix(sky(reflected),uNavy,0.38+depth*0.4);
    float reflectionWidth = 0.012+depth*0.12;
    float band = exp(-pow((uv.x-sun.x+wave*0.024)/reflectionWidth,2.0));
    float sparkle = smoothstep(0.18,0.83,wave*0.6+0.5);
    col = mix(col,mix(uYellow,uWhite,0.48),band*sparkle*(0.76-dusk*0.46));
    float lines = smoothstep(0.70,0.98,noise(vec2(water.x*1.6,water.y*13.0+uTime*0.5)));
    col += uBlue*lines*0.11*depth;
    col = mix(col,uBlue,clamp(ripple*0.1,-0.06,0.10));
    col = mix(col,mix(uBlue,uWhite,0.3),exp(-depth*70.0)*0.16);
  }
  col += (hash(gl_FragCoord.xy)-0.5)/255.0;
  outColor = vec4(col,1.0);
}
`
