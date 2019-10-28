
class Events{
    constructor(){
        this.__eventhandlers = {}
    }
    on(event, handler) {
        if (this.__eventhandlers[event] == undefined) {
            this.__eventhandlers[event] = [];
        }
        this.__eventhandlers[event].push(handler);
    }
    off(event, handler) {
        if (this.__eventhandlers[event] == undefined) {
            return
        }
        this.__eventhandlers[event].splice(handler, 1);
    }
    emit( type, data ) {
        if (type != undefined && this.__eventhandlers[type] != undefined) {
            this.__eventhandlers[type].forEach((h) => { h( {type:type, source:this, data:data} ); })
        }
    }
}

class EventType{

    static get VERTEX_COMPILE_ERROR() { return "VERTEX_COMPILE_ERROR";}
    static get FRAGMENT_COMPILE_ERROR() { return "FRAGMENT_COMPILE_ERROR";}
    
    static get MOUSE_DOWN() { return "MOUSE_DOWN";}
    static get MOUSE_MOVE() { return "MOUSE_MOVE";}
    static get MOUSE_UP() { return "MOUSE_UP";}
    static get MOUSE_DOUBLE_CLICK() { return "MOUSE_DOUBLE_CLICK";}

}

export {
    Events,
    EventType
}