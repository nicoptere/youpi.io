
import Controls from '../Controls'
import GLProgram from './GL_Program'

export default class Interactive extends GLProgram {

    constructor(parent) {

        super(parent)
        
        this.fragment = require( '../../glsl/interactive.glsl')
console.log( this.fragment )
        this.controls = new Controls()
        this.controls.addListeners(this.gl.canvas)
        
    }

    updateUniforms(gl) {

        super.updateUniforms(gl)

        // set the resolution uniform
        var resolutionUniformLocation = gl.getUniformLocation(this.program, "resolution")
        gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height )
        
        // set the mouse uniform
        var mouseUniformLocation = gl.getUniformLocation(this.program, "mouse")
        gl.uniform2f(mouseUniformLocation, this.controls.normal.x, this.controls.normal.y)

    }

}

