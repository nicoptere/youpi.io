import { Events, EventType } from "./Events";

let mouseDown = false;
let latestTap = 0;

export default class Controls extends Events {

    constructor() {
        
        super()
        this.mouse = new Vec2(0,0);
        this.normal = new Vec2(.5,.5);
        this._enabled = true;
        
        this.onMoveHandler = this.onMove.bind(this)
        this.onUpHandler = this.onUp.bind(this)
        this.onDownHandler = this.onDown.bind(this)
        this.onDoubleClickHandler = this.onDoubleClick.bind(this)
    }

    get enabled() { return this._enabled; }
    set enabled(v) { this._enabled = v; }

    get mouseDown() { return mouseDown; }
    set mouseDown(v) { mouseDown = v; }

    getPosition(e) {

        this.mouse.set( 0,0 );
        this.normal.set( 0,0 );
        
        if ('ontouchstart' in window) {
            let touch = e.targetTouches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        } else {
            if (!e) e = window.event;
            if (e.pageX || e.pageY) {
                this.mouse.x = e.pageX;
                this.mouse.y = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                this.mouse.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                this.mouse.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
        }

        let r = e.target.getBoundingClientRect();
        this.mouse.x -= r.left;
        this.mouse.y -= r.top;

        this.normal.copy( this.mouse )
        this.normal.x /= r.width
        this.normal.y /= r.height
        this.normal.y = 1 - this.normal.y

        return this.mouse;

    }

    onDown(e) {

        if (!this.enabled) return false
        this.getPosition(e)
        mouseDown = true;
        this.emit(EventType.MOUSE_DOWN, this.mouse )
        return true
    }

    onUp(e) {
        
        if (!this.enabled) return false
        this.getPosition(e)
        mouseDown = false;
        this.emit(EventType.MOUSE_UP, this.mouse )
        return true
    }
    
    onMove(e) {
        if (!this.enabled) return false
        this.getPosition(e)
        this.emit(EventType.MOUSE_MOVE, this.mouse )
        return true
    }
    
    onDoubleClick(e) {
        
        if (!this.enabled) return false

        var timeDelta = performance.now() - latestTap;
        if ((timeDelta < 600) && (timeDelta > 0)) {

            // double tap   
            this.doubleTap(e)

        } else {
            // console.log("no tap", performance.now(), latestTap, timeDelta    )
        }

        latestTap = performance.now();

    }

    doubleTap(e) {

        if (!this.enabled) return false
        this.getPosition(e)
        this.emit(EventType.MOUSE_DOUBLE_CLICK, this.mouse )
        return true

    }


    removeListeners(element) {

        if ('ontouchstart' in window) {
            element.removeEventListener('touchmove', this.onMoveHandler, false);
            element.removeEventListener('touchend', this.onUpHandler, false);
            element.removeEventListener('touchstart', this.onDownHandler, false);
            element.removeEventListener("touchstart", this.onDoubleClickHandler, false);
        }
        else {
            element.removeEventListener('mousemove', this.onMoveHandler, false);
            element.removeEventListener('mouseleave', this.onUpHandler, false);
            element.removeEventListener('mouseup', this.onUpHandler, false);
            element.removeEventListener('mousedown', this.onDownHandler, false);
            element.removeEventListener("mousedown", this.onDoubleClickHandler, false);
        }
    }

    addListeners(element) {

        if ('ontouchstart' in window) {
            element.addEventListener('touchmove', this.onMoveHandler, false);
            element.addEventListener('touchend', this.onUpHandler, false);
            element.addEventListener('touchstart', this.onDownHandler, false);
            element.addEventListener("touchstart", this.onDoubleClickHandler, false);
        }
        else {
            element.addEventListener('mousemove', this.onMoveHandler, false);
            element.addEventListener('mouseleave', this.onUpHandler, false);
            element.addEventListener('mouseup', this.onUpHandler, false);
            element.addEventListener('mousedown', this.onDownHandler, false);
            element.addEventListener("mousedown", this.onDoubleClickHandler, false);
        }

        this.element = element;
    }

}

class Vec2 extends Array{

    constructor(x=0, y=0) {
        super(x,y)
    }
    get x(){ return this[0]; }
    set x(value){ this[0] = value; }
    
    get y(){ return this[1]; }
    set y(value){ this[1] = value; }

    set(x,y) {
        this[0] = x
        this[1] = y
        return this
    }
    copy(p) {
        this[0] = p[0]
        this[1] = p[1]
        return this
    }
    add(p) {
        this[0] += p[0]
        this[1] += p[1]
        return this
    }
    sub(p) {
        this[0] -= p[0]
        this[1] -= p[1]
        return this
    }
    clone() {
        return new Vec2(this[0], this[1])
    }
    dot(p){
        return this[0]*p[0]+this[1]*p[1];
    }
    length() {
        return Math.sqrt(this.reduce((a,v)=>{return a + v*v; }), 0)
    }
    normalize() {
        var l = this.length()
        this[0] /= l
        this[1] /= l
        return this
    }
    multiplyScalar(v) {
        this[0] *= v
        this[1] *= v
        return this
    }
}