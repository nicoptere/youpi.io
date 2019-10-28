precision highp float;  
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 uv;
void main() {
    gl_FragColor = vec4( .5 + .5 * cos( time+uv.xyx + vec3(0,2,4) ), 1);
}