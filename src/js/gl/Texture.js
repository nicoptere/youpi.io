import Interactive from './Interactive'

const debug = false
export default class Texture extends Interactive{

    constructor(parent, urls ){

        super(parent)
        this.ready = false

        this.fragment = require( '../../glsl/texture.glsl')

        this.images = []
        
        this.textures = []

        this.loadImages( urls )
    }

    updateUniforms(gl){

        super.updateUniforms(gl)

        let program = this.program

        //tex = { id, tid, texture, u_name }
        this.textures.forEach( ( tex )=>{
        
            let textureLocation = gl.getUniformLocation( program, tex.u_name);
            gl.uniform1i(textureLocation, tex.id); 
            gl.activeTexture(tex.tid);
            gl.bindTexture(gl.TEXTURE_2D, tex.texture);

        })
    }

    loadImages( urls ){
    
        if( urls.length == 0 ){
            return this.onLoadComplete()
        }
    
        let img = new Image()
        img.onload = ()=>{
            
            this.images.push( img )
            this.loadImages( urls )

        }
        img.src= urls.shift()

    }

    onLoadComplete(){
        
        let gl = this.gl
        console.log( this.images.length )
        
        this.images.forEach( ( img, id )=>{
            
            this.createTexture( gl, img, id )

        } )
        
        this.ready = true
    }
    
    isPowerOfTwo(x) {
        return Math.log2(x) % 1 === 0;
    }

    nearestPowerOf2(n) {
        return 1 << 31 - Math.clz32(n);
    }
      
    createPOTCanvas( img, w,h ){

        let canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h

        let ctx = canvas.getContext('2d')
        ctx.drawImage( img, 0,0, img.width, img.height, 0,0,w,h )
        return canvas;

    }

    createTexture( gl, img, id = 0 ){
        
        // Create a texture.
        var texture = gl.createTexture();        

        let u_name =  "texture" + id
        let tid = gl.TEXTURE0 + id

        // set which texture units to render with.
        let textureLocation = gl.getUniformLocation(this.program,  u_name );
        gl.uniform1i(textureLocation, id); 
        gl.activeTexture(tid);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        this.textures.push( {
            id:id, tid:tid, texture:texture, u_name:u_name
        })

        //make sure texture is a power of two 
        if( !this.isPowerOfTwo(img.width) || !this.isPowerOfTwo(img.height) ){
            
            let newWidth = this.nearestPowerOf2(img.width)
            let newHeight = this.nearestPowerOf2(img.height)
            let canvas = this.createPOTCanvas( img, newWidth, newHeight )
            
            // upload the canvas into the texture.               
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas );
            
            //also valid: pass the canvas' array buffer

                // let ctx = canvas.getContext("2d")
                // let data = ctx.getImageData(0,0,newWidth,newHeight).data
                // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, data ); 
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            if( debug ) console.log( "the image does not have Power Of Two dimensions, use canvas to resize texture." )
            if( debug ) console.log( "w :", img.width, "=>", newWidth )
            if( debug ) console.log( "h :", img.height, "=>", newHeight )

        }else{
            
            // upload the image into the texture as is 
            if( debug ) console.log( "the image has Power Of Two dimensions, use image to create texture." )
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
            
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            

        }
        
        return texture

    }
    
}
