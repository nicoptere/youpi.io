import Interactive from './Interactive'


export default class Raymarching extends Interactive{
    constructor(parent){
        
        super(parent)
        
        this.vertex = require( '../../glsl/quad.glsl' )

        this.fragment = require( '../../glsl/raymarching.glsl' )


    }
}