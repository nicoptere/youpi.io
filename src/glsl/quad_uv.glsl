precision highp float;  
attribute vec2 position;
varying vec2 uv;
void main() {
    uv = .5 + position * .5;
    uv.y = 1. - uv.y;
    gl_Position = vec4( position, 0.,1. );
}