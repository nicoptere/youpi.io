precision highp float;  
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 uv;
const float PI = acos( -1. );
void main() {

	//compute a vector between the mouse and the current fragment (pixel)
	vec2 p = ( gl_FragCoord.xy/resolution ) - mouse;
	
	//applies the image ratio
	p.x *= resolution.x / resolution.y;
	
	//compute a color
	vec4 col = vec4( .5 + .5 * cos( time + uv.yxy + vec3( 0,2,4 ) ), 1);

	//computes the invert length to the center 
	float d =  1. - length( p );

	//make it oscillate from 0 to 1
	d = sin( PI * fract( d + time * .5 ) );

	// combien with the distance
	gl_FragColor = col * d;
	
}