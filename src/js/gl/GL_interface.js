import { Events, EventType } from "../Events"
import { Canvas } from "../Canvas"

export default class GLInterface extends Events {

    constructor(parent = null){

        super()
        this.canvas = new Canvas(null, null, parent)
        this.domElement = this.canvas.domElement

    }

    set parent(node){
        this.canvas.parent = node
    }
    get parent(){
        return this.canvas.parent
    }


    get vertex(){return this.vertexSource }
    set vertex(str){
        let result = this.createShader(this.gl, this.gl.VERTEX_SHADER, str )
        if( typeof result === "object" ){
            this.vertexSource = str;
            this.createProgram(this.gl)
        }else{
            this.emit( EventType.VERTEX_COMPILE_ERROR, result )
        }
    }

    get fragment(){return this.fragmentSource }
    set fragment(str){
        let result = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, str )
        if( typeof result === "object" ){
            this.fragmentSource = str;
            this.createProgram(this.gl)
        }else{
            this.emit( EventType.FRAGMENT_COMPILE_ERROR, result )
        }
    }

}
