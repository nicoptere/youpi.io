import functions from "./functions";
import Grapher from "./Grapher";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e" ];

let _id = 0;
export default class Item {

    static set id(value){ _id = value; };
    static get id(){ return _id; };

    constructor( ui, str ){

        this.id = Item.id;

        let name = this.name;

        ui.createItem( this, name, str )

        this.active = true
        this.method = str;
        this.update();
        Item.id++;

    }

    update( ){

        let name = this.name;
        // this.label.innerText = "\t" + name + "\t";


        this.picto.style.visibility = "visible";
        this.picto.style.display = "block";
        this.picto.icon.innerText = ( this.active ) ? "visibility" : "visibility_off" ;

        this.selected = document.activeElement === this.textField;

        this.method = this.textField.value.replace( /\s\s+/g, ' ' );//remove duplicate spaces

        //prevent stack overflow (recursive call to self )
        var reg = new RegExp( "\\b(" + name + ")\\b\\s*\\(", "gi" );
        if( reg.test( this.method ) ){
            this.valid = false;
            return;
        }

        try{
            eval("window[name] = functions[name] = function(x){ return "+ this.method +"; }; " );
            functions[name]( 1 );
            this.valid = true;
        }catch(e){
            this.valid = false;
            return;
        }
        functions.dictionary[name] = this.method;

        this.canInline;
    }

    //accessors

    get name(){
        let num = ( this.id < ALPHABET.length ? '' : ~~( this.id/ALPHABET.length ) - 1  );
        return ALPHABET.charAt( this.id % ALPHABET.length ) + num;
    }
    get color(){ return COLORS[ this.id % COLORS.length]; }

    get active(){ return this._active; }
    set active( value ){
        this._active = value;
    }

    get method(){ return this._method; }
    set method( value ){
        this._method = value;
        this.textField.value = value;
    }

    get selected(){ return this._selected; }
    set selected( value ){ this._selected = value; }

    get valid(){ return this._valid; }
    set valid( value ){
        this._valid = value;
        if( !value )this.picto.icon.innerText = "warning"
        // this.picto.style.visibility = "hidden";
        // if( value ) {
        //     this.picto.style.visibility = "hidden";
        //     this.picto.style.display = "none";
        // }else{
        //     this.picto.style.visibility = "visible";
        //     this.picto.style.display = "block";
        // }
    }

    get canInline(){
        let reg = /\b[a-z]([0-9].*)?\b\s?\(/gi;
        if( reg.test( this.method ) === true ){
            this.inlineBtn.style.visibility = 'visible';
            return true;
        }
        this.inlineBtn.style.visibility = 'hidden';
        return false;
    }
}