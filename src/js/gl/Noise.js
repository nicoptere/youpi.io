import Interactive from './Interactive'

export default class Noise extends Interactive{
    
    constructor(parent){
        super(parent)
        this.fragment = require( '../../glsl/noise.glsl')
    }

}
