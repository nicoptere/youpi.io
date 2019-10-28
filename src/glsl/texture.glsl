precision highp float;  
uniform sampler2D texture0;
uniform sampler2D texture1;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 uv;
void main() {
    
    vec2 p = uv;

    vec4 c0 = texture2D( texture0, p );
    vec4 c1 = texture2D( texture1, p );
    
    gl_FragColor = mix( c0, c1, mouse.x );
    
}