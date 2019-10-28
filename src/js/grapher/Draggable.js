let element,trigger, pos1, pos2, pos3, pos4;
let dragging = false;
export default class Draggable {

    constructor( domTrigger, domElement ){

        trigger = domTrigger;
        element = domElement ||trigger;
        trigger.addEventListener("mousedown", this.onDown  );
        trigger.addEventListener("mouseup", this.onUp );
        document.addEventListener("mousemove", this.onDrag );

    }

    onDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        dragging = true;
    }

    onDrag(e) {
        if( dragging === false )return;
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    onUp() {
        dragging = false;
    }

}