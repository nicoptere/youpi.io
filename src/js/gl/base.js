


class BaseGL{

    constructor() {

        //create a canvas
        const canvas = new Canvas(null, null, document.body)

        //get a webgl context
        const gl = canvas.getContext("webgl");
        if (!gl) {
          console.error("no WebGL.");
          return null;
        }

        //set clear color to opaque red
        gl.clearColor(1.0, 0.0, 0.0, 1.0);

        //clears the context with specified color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    }

}
