import CodeMirror from "codemirror"
import javascript from "codemirror/mode/javascript/javascript"
require("glsl-editor/glsl")(CodeMirror)
import {
    EventType
} from "./Events"

let snap = false
export default class Editor {

    get GL() {
        return "glsl"
    }
    get JS() {
        return "javascript"
    }

    constructor(editorDomElement, path, snapshot = false) {
        snap = snapshot
        
        //gets references to the dom
        this.textarea = editorDomElement.querySelector(".text-block")
        this.test_frame = editorDomElement.querySelector(".test-frame")
        this.display_frame = editorDomElement.querySelector(".display-frame")
        this.parameters = editorDomElement.querySelector(".parameters")
        this.auto = this.parameters.querySelector(".auto-compile")
        this.error = this.parameters.querySelector(".error-message")
        this.log = this.parameters.querySelector(".log-message")
        
        this.path = path

        //init the text editor

        this.editor = new CodeMirror(this.textarea, {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            mode: {
                name: this.JS,
                // globalVars: true,
            },
            theme: "custom",
            // lineWrapping: true,

            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
        })

        //bind change handlers
        this.editor.on("change", () => {

            if (this.auto.checked) {

                let text = this.editor.getValue()
                if (this.mode == this.JS) {
                    this.updateContent(text)
                } else {
                    this.error.innerText = ""
                    this.gl.fragment = text
                }

            }

        })

        //GL methods 
        this.gl = undefined
        this.onGLErrorHandler = this.onGLError.bind(this)
        this.resizeGLHandler = this.resizeGL.bind(this)

        //resize 
        window.addEventListener("resize", this.resize.bind(this))
        this.resize()

        //hook the console to get messages on screen
        var cons = this.display_frame.contentWindow.console;
        var original_log = cons['log'];
        cons['log'] = (...args)=>{
            this.log.innerText = args.join(' ')
            original_log.apply( cons, args )
        }

        // var main_console = console;
        // let original_error = main_console['error'];
        // main_console['error'] = (e)=>{
        //     this.error.innerText = e.message
        //     original_error.apply( main_console, args )
        // }
        

        this.mode = this.JS
        this.loading = false
        this.updating = false

    }


    onGLError(res) {
        let txt = res.data.split("\n")
        txt.pop()
        this.error.innerText = txt.join('\n')
    }

    resizeGL() {
        if (this.gl != null) {
            this.gl.canvas.resize()
        }
    }

    resize() {

        //fit height
        let h = window.innerHeight;
        let pr = this.parameters.getBoundingClientRect()
        let height = (h - pr.height) + 'px'

        this.display_frame.style.top = pr.height + "px"
        this.display_frame.style.height = height
        this.textarea.style.height = height
        
        let cm = this.textarea.querySelector('.CodeMirror')
        cm.style.borderBottom = "2px solid #CCCCCC"
        cm.style.height = height
        
        // to take screenshots
        if( snap ){
            this.display_frame.style.width = "512px"
            this.display_frame.style.height = "512px"
        }
    }

    forward(){
        
        let text = this.editor.getValue()
        let EOL = text.match(/\r\n/gm)?"\n\r":"\n";
        text = text.replace(/^\s.*(return|continue|break)[;\s]*$/mi, '//\t$1' + EOL )
        this.editor.setValue( text )

    }

    sanitize(text, path) {

        //remove duplicate empty lines 
        let EOL = text.match(/\r\n/gm)?"\n\r":"\n";
        var re = new RegExp("(^\s."+EOL+"){2,}", "gm");
        text = text.replace(re, EOL )

        //reformat tabs
        text = text.replace(/    /gm, '\t')
        text = text.replace(/^\t\t/gm, '\t')
        text = text.replace(/\t(<\/|<)script/gm, '$1script')

        //change PATH
        text = text.replace(/(href="|src=")/gm, '$1' + path)
        
        // bring return and continue statemetns to the beginning of line
        text = text.replace(/^\s.*(return|continue|break)[;\s]*$/gm, '\t$1'+EOL)

        //restores relatives path 
        re = new RegExp( path + '\.\.\/', 'gm' )
        if( re.test( text ) ){

            text = text.replace( re, this.path )

        }
        
        return text

    }

    reset(source, args) {

        if (this.loading == true) return
        this.loading = true

        this.clearIframe(this.display_frame, this.loopKeys)

        if (typeof source == "string") {

            this.mode = this.JS
            this.editor.setOption("mode", this.JS)

            let scope = this
            let xhr = new XMLHttpRequest()
            xhr.onload = function (e) {

                let content = scope.sanitize(e.target.responseText, args)

                scope.editor.setValue(content)

                scope.log.innerText = ""
                scope.loading = false

            }
            xhr.open('GET', source)
            xhr.send()

        } else {

            this.mode = this.GL
            this.editor.setOption("mode", this.GL)
            let frame_window = this.display_frame.contentWindow
            
            // dispose the GL
            if (this.gl != undefined) {

                frame_window.removeEventListener('resize', this.resize)
                this.gl.off(EventType.FRAGMENT_COMPILE_ERROR, this.onGLErrorHandler)
                this.gl.parent = null

            }

            let parent = frame_window.document.body
            this.gl = new source(parent, args)

            //display compile errors
            this.gl.on(EventType.FRAGMENT_COMPILE_ERROR, this.onGLErrorHandler)
            this.editor.setValue(this.sanitize(this.gl.fragment))
            this.gl.render()

            //monitor the display frame size to resize the 
            frame_window.addEventListener('resize', this.resizeGLHandler)

            this.loading = false
        }

    }

    destroyLoops(frame, loopKeys) {

        loopKeys.forEach(key => {

            if (key.indexOf("animation_") != -1) {
                frame.contentWindow.cancelAnimationFrame(frame.contentWindow[key])
            }
            if (key.indexOf("timeout_") != -1) {
                frame.contentWindow.clearTimeout(frame.contentWindow[key])
            }
            if (key.indexOf("interval_") != -1) {
                frame.contentWindow.clearInterval(frame.contentWindow[key])
            }

        });

    }

    flagLoops(txt) {

        let keys = []
        let tmp = txt.split("requestAnimationFrame")
        for (let i = 1; i < tmp.length; i++) {
            let key = 'animation_' + (i - 1)
            tmp[i] = 'window.' + key + " = requestAnimationFrame" + tmp[i]
            keys.push(key)
        }
        txt = tmp.join('')

        tmp = txt.split("setTimeout")
        for (let i = 1; i < tmp.length; i++) {
            let key = 'timeout_' + (i - 1)
            tmp[i] = 'window.' + key + " = setTimeout" + tmp[i]
            keys.push(key)
        }
        txt = tmp.join('')

        tmp = txt.split("setInterval")
        for (let i = 1; i < tmp.length; i++) {
            let key = 'interval_' + (i - 1)
            tmp[i] = 'window.' + key + " = setInterval" + tmp[i]
            keys.push(key)
        }
        return {
            text: tmp.join(''),
            keys: keys
        }

    }

    updateIframe(frame, content) {

        // https://stackoverflow.com/questions/8240101/set-content-of-iframe
        let document = frame.contentWindow.document
        frame.src = "about:blank";
        document.open();
        document.write(content);
        document.close();

        //applies default style
        let style = "head,body{width:100%;height:100%;overflow:hidden;margin:0;padding:0;}"
        let styleTag = document.head.querySelector("style")
        if( styleTag == null ){

            document.head.innerHTML = "<style>" + style + "</style>"
        }else{
            styleTag.innerHTML += style
        }

    }

    clearIframe(frame, loopKeys) {

        if (loopKeys != null) {
            this.destroyLoops(frame, loopKeys)
        }
        this.updateIframe(frame, '')

    }

    updateContent(content) {
        
        if (this.updating == true) return
        this.updating = true

        //tries to flag all the loop (so that we can destroy them later)
        let loops = this.flagLoops(content)

        this.loopKeys = loops.keys
        content = loops.text
        //TODO 
        // calback from within the function

        // create the HTML code inside the test iframe
        this.updateIframe(this.test_frame, content )
            
        //get the testframe's document
        let document = this.test_frame.contentWindow.document

        //store the script tags for evaluation 
        let scripts = []
        let scriptTags = this.test_frame.contentWindow.document.querySelectorAll("script")
        for (let i = 0; i < scriptTags.length; i++) {
            scripts.push( scriptTags[i] )
        }

        // //adds a callback function
        // let endScript = document.createElement( 'script' )
        // endScript.innerText = 'window.onload = function(){ console.log( "OH YEAH" ); }'
        // scripts.push(endScript)
        // console.log( scripts, scriptTags )

        //clears the loops started in the test frame
        this.clearIframe(this.test_frame, loops.keys)
        
        //now evaluate the script tags individually
        let valid = true
        let message = this.error.innerText = ""
        
        for (let i = 0; i < scripts.length; i++) {

            let txt = scripts[i].innerText
            if( txt == '' )continue
            try {
                this.test_frame.contentWindow.eval(txt)

            } catch (error) {

                message = error.message
                valid = false

            }

        }
        
        // clears the test frame again as the scripts were evaluated
        // there and may be running in the background
        this.clearIframe(this.test_frame, loops.keys)

        setTimeout( this.commitChanges.bind( this ), 1, content, valid, message )

    }

    commitChanges( content, valid, message ){
        
        if (valid == true) {

            //updates the content
            this.clearIframe(this.display_frame, this.loopKeys )
            this.updateIframe(this.display_frame, content)

        } else {

            //display the error message
            console.log( "error", message )
            this.error.innerText = message

        }
        this.updating = false

    }
}