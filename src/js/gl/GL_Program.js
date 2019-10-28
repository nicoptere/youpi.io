import GLInterface from './GL_interface'

const debug = false
export default class GLProgram  extends GLInterface{

    constructor(parent = null) {
        super(parent)
        //get a webgl context
        const gl = this.canvas.getContext3D()
        this.gl = gl

        //set clear color to opaque green
        this.clearColor = [0.0, 1.0, 0.0, 1.0]

        this.vertexSource = require( '../../glsl/quad_uv.glsl')
        this.fragmentSource = require( '../../glsl/default_fragment.glsl')

        this.ready = false;
        this.init()
    }

    init() {

        let gl = this.gl

        //create a program 
        this.createProgram(gl)

        //create a quad 
        this.createGeometry(gl)

        this.ready = true
        this.startTime = performance.now()

    }

    createProgram(gl){
            
        //create the program
        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexSource)
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentSource)

        let program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        let success = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (success) {

            // use the program (pair of shaders)
            this.program = program
            gl.useProgram(this.program)
            return this.program

        }
        let warning = gl.getProgramInfoLog(program)
        if( debug ) console.warn(warning)
        gl.deleteProgram(program)
        return warning
        
    }
    
    createShader(gl, type, source) {

        let shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }
        let warning = gl.getShaderInfoLog(shader)
        if( debug ) console.warn( warning )
        gl.deleteShader(shader)
        return warning

    }

    createGeometry(gl) {

        //create a buffer to hold vertices data
        let positionBuffer = gl.createBuffer()

        // bind it so that we can use it 
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        //describe 2 triangles covering the bi-unit square
        let positions = [
            -1, 1, 1, 1, -1, -1,
            1, 1, 1, -1, -1, -1,
        ]
        //assign geometry to buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        //get the position attribute location 
        let positionAttributeLocation = gl.getAttribLocation(this.program, "position")
        gl.enableVertexAttribArray(positionAttributeLocation)

        //activate the attribute
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    }

    updateUniforms(gl) {

        // set the time uniform
        var timeUniformLocation = gl.getUniformLocation(this.program, "time")
        gl.uniform1f(timeUniformLocation, (performance.now() - this.startTime) * 0.001)

    }

    render() {

        requestAnimationFrame( this.render.bind(this) )

        if( this.ready == false)return;

        let gl = this.gl;
        //updates the uniforms
        this.updateUniforms(gl)
        
        //set viewport size
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        //set clear color
        gl.clearColor.apply(gl, this.clearColor)

        //clears the context with specified color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        //draw call
        gl.drawArrays(gl.TRIANGLES, 0, 6)


    }
}


