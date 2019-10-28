
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

        // let crect = this.container.getBoundingClientRect();
        // let hrect = this.holder.getBoundingClientRect();
        // w = this.canvas.width   //= Math.min( crect.width, hrect.width );
        // h = this.canvas.height  //= Math.min( crect.height, hrect.height ) - 8;
        // // this.holder.style.width = (crect.width-2) + "px";
        // this.holder.style.height = (Math.min( crect.height, hrect.height )-2) + "px";

        // console.log (w,h )

        ctx.save();
        ctx.lineWidth = .5;
        ctx.fillStyle = "#FFF";
        ctx.clearRect( 0, 0, w, h );
        ctx.strokeStyle = "#AAA";

        let range = this.ui.range;
        let size  = Math.min( w, h ) - this.margin;
        scale = (range === 0) ? 1/size: 2/size;
        if( range === 0 ) {
            let one = size;
            ctx.translate(this.margin*.5, h-this.margin*.5);
            ctx.rect( 0,0,one,-one);
            ctx.stroke()
        }else{
            let one = size/2;
            ctx.translate( w/2, h/2 );
            ctx.rect( -one,one,one*2,-one*2 );
            ctx.stroke()
        }

        ctx.beginPath();
        ctx.moveTo( 0, -h);
        ctx.lineTo( 0, h );
        ctx.moveTo( -w,  0);
        ctx.lineTo( w, 0 );
        ctx.stroke();

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

        for( var i = -w/2-this.margin; i <=w/2+this.margin; i++  ){

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
