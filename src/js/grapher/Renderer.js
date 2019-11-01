
import UI from "./UI";

let ctx, w, h, range, scale;

export default class Renderer{


    constructor( main, width = 512, height = 512) {

        let holder = document.createElement("div");
        holder.classList.add( 'row');
        holder.style.width = width + "px";
        holder.style.height = height + "px";
        this.holder = holder;

        const canvas = document.createElement("canvas");
        w = canvas.width = width;
        h = canvas.height = height;
        canvas.style.pointerEvents = "none";
        this.ctx = ctx = canvas.getContext('2d');
        holder.appendChild( canvas );

        main.container.appendChild( holder );
        this.container = main.container;

        this.canvas = canvas;
        this.margin = 20;

        this.ui = new UI(main, this.holder);

    }

    render( list ){

        ctx.save();
        ctx.lineWidth = .5;
        ctx.fillStyle = "#FFF";
        ctx.clearRect( 0, 0, w, h );
        ctx.strokeStyle = "#AAA";

        let range = this.ui.range;
        let size  = Math.min( w, h );
        scale = (range === 0) ? 1/size: 2/size;
        let one = (range === 0) ? size: size / 2;
        if( range === 0 ) {
            
            ctx.translate(w/2-size/2, h );
            ctx.rect( 0,0,one,-one);
            ctx.stroke()

        }else{

            ctx.translate( w/2, h/2 );
            ctx.rect( -one,one,one*2,-one*2 );
            ctx.stroke()

            ctx.beginPath();
            ctx.moveTo( 0, -one);
            ctx.lineTo( 0, one );
            ctx.moveTo( -one,  0);
            ctx.lineTo( one, 0 );
            ctx.stroke();
        }        

        ctx.lineWidth = 1;
        list.forEach( (item)=>{ this.renderItem( item, range ) } );

        ctx.restore();
    }


    lerp( t, a, b ){
        return a * (1-t) + b * t;
    }

    normalize( t, a, b ){
        return ( t - a ) / ( b - a );
    }

    remap( t, a0, b0, a1, b1 ){
        return this.lerp( this.normalize( t, a0, b0 ), a1, b1 );
    }

    renderItem(item, range){

        if( item.active === false )return;
        if( item.valid === false )return;

        var fc = functions[item.name];
        
        ctx.strokeStyle = item.color //Field.value || "#F00";

        ctx.beginPath();

        for( var i = -w/2; i <=w/2; i++  ){

            var x = (range === 0) ? this.normalize( i, -w/2, w/2 ) : this.remap( i, -w/2, w/2, -1, 1 );
            var y = - fc( x );

            if( isNaN( y ) || y === Math.POSITIVE_INFINITY || y === Math.NEGATIVE_INFINITY  ){
                ctx.lineTo( x / scale, 0 );
            }else{
                ctx.lineTo(x / scale, y /scale )
            }
        }
        ctx.stroke();

    }

}
