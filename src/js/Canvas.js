class Canvas {

    constructor(w, h, parent = null) {

        this.domElement = document.createElement("canvas")
        
        this.resizeHandler = this.resize.bind(this)
        this.parent = parent


        this.resize(w, h)
    }

    set parent(parent = null) {

        if (this.domElement.parentNode != null) {
            this.domElement.parentNode.removeEventListener('resize', this.resizeHandler )
            this.domElement.parentNode.removeChild(this.domElement)
        }

        if (parent != null) {
                
            let r = parent.getBoundingClientRect()
            parent.appendChild(this.domElement)
            parent.addEventListener('resize', this.resizeHandler )
            this.resize()

        }

    }
    get parent() {
        return this.domElement.parentNode
    }

    resize(w, h) {

        let r = {width:null, height:null}
        if( this.domElement.parentNode != null ){
            r = this.domElement.parentNode.getBoundingClientRect()
        } 
        this.domElement.width = w || r.width || this.domElement.width
        this.domElement.height = (h || r.height || this.domElement.height) - 5

    }

    getContext2D() {
        return this.domElement.getContext("2d")
    }

    getContext3D() {
        let gl = this.domElement.getContext("webgl")
        if (!gl) {
            alert("no WebGL.")
            return null
        }
        return gl
    }


}
export {
    Canvas
}