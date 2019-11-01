import Renderer from "./Renderer";
import Item from "./Item";
import functions from "./functions";
import storage from "./storage";
import Inline from "./parser/Inline";

let startTime, interval;
export default class Grapher {

    constructor( domElement, width = -1, height = -1 ){

        if( domElement === undefined ){
            domElement = document.body;
            width = 512;
            height = 512;
        }
        this.container = domElement;
        // this.container.classList.add("graphHolder");

        if( width === -1 && height === -1 ){

            let rect = domElement.getBoundingClientRect();
            var size = Math.min( rect.width, rect.height );
            width = size;
            height = size;

        }
        width -= 24
        height -= 24

        this.renderer = new Renderer( this, Math.max( 256, width ), Math.max( 256, height ) );
        this.items = [];

        functions.init();

        storage.init(this);

        this.startTime = performance.now();

    }

    addNew( x ){

        let item = new Item( this.renderer.ui, x );
        this.items.push( item );
        item.deleteBtn.addEventListener("mousedown", ()=>{this.dispose(item);} );
        item.inlineBtn.addEventListener("mousedown", ()=>{this.inline(item);} );
        this.container.appendChild(item.domElement);
        return item;

    }

    inline( toInline ){

        //check the item's the method uses custom function
        if( toInline.canInline ){

            //if so, inlines the item's method
            toInline.method = Inline.compute(toInline.method);
            toInline.update();
            
        }

    }

    dispose( toDelete ){

        let i = this.items.indexOf(toDelete);
        if( i === -1 )return;

        //new re-indexed list

        // console.log( this.items.map((i)=>{ return i.name + " "+ i.id + " " + i.color }) )
        let id = 0;
        let newItems = this.items.filter( (it)=>{

            it.textField.classList.remove("highlight-text-field");
            
            if( it.id !== toDelete.id ){

                //name is dynamically computed from the id
                let tmpId = it.id;

                //this performs a temporary change of id
                it.id = id++;

                //gets the new name
                it.newName = it.name;

                //stores the new id
                it.newId = it.id;

                //and resets the previous id
                it.id = tmpId;

                return it;

            }

        });
        
        //checks if the method to delete is used by other methods
        // let reg = new RegExp( "(?<![\w\d])" + toDelete.name + "(?![\w\d])", "g" );
        let reg = new RegExp( "\b(" + toDelete.name + ")\b", "g" );
        let usage = [];
        this.items.forEach((s)=>{
            console.log( toDelete.name, s.method , s.method.match( reg ) )
            if( s.name === toDelete.name ) return;
            if( reg.test( s.method ) === true ){
                
                usage.push( s );
            }
        });
        
        //if so, highlights the fields where it is used
        if( usage.length > 0 ){
            console.warn( "item in use, you should fix the usage of "+ toDelete.name +" before deleting");
            usage.forEach((it)=>{
                console.log(  'in ', it.name, ">", it.method );
                it.textField.classList.add("highlight-text-field");
                setTimeout(()=>{
                    it.textField.classList.remove("highlight-text-field");
                }, 750);
            });
            this.items.forEach((s)=>{
                delete s.newId;
                delete s.newName;
            });
            return;
        }

        //replace custom functions usage with new names

        Item.id = 0;
        newItems.forEach((s)=>{

            let reg = new RegExp( "\\b(" + s.name + ")\\b\\s*\\(", "gi" );
            newItems.forEach((o)=> {

                if( s === o )return;
                o.method = o.method.replace( reg, s.newName + "(");

            });
            s.id = s.newId;
            s.update()
            delete s.newId;
            delete s.newName;
            Item.id++;

        });
        this.container.removeChild( toDelete.domElement );

        this.items = newItems;
        storage.update(this.items);


    }

    start( ){
        this.update()
    }

    stop( ){
        cancelAnimationFrame(interval)
    }

    update(){

        interval = requestAnimationFrame( this.update.bind(this))

        window.time = ( performance.now() - this.startTime ) * .001;

        //evaluates everything
        
        // console.log( this.items.map((i)=>{ return i.name + " "+ i.id + " " + i.method }) )
        this.items.forEach( ( item )=>{
           let name = item.name;
           try{
               eval("window[name] = functions[name] = function(x){ return "+ item.method +"; }; " );
            }catch(e){
                return
            }
        })

        this.items.forEach( ( item )=>{
            item.update( time );
        } );

        storage.update(this.items);

        this.renderer.render( this.items );

    }

}
