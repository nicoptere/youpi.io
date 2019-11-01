
export default class storage {

    static init( main ){

        //rebuilds formulas if they were stored locally
        var storedItems = JSON.parse( localStorage.getItem('storedItems') );

        if( storedItems !== null && storedItems.length > 0 ){

            storedItems.forEach( function(it){
                let item = main.addNew(it.method)
                item.active = it.active
            });

        }else{
            ["mix( b(x), c(x ), d(x )) ", "smoothstep( .25,.75,abs(sin(x+time)))", "step( fract(abs(x)*20),.5 )", "sin(x*PI+time*2)*.25"]
            .forEach((x,i)=>{
                var item = main.addNew(x);
                item.active = i === 0;
            });
        }

    }

    static update(items){

        //saves the storedItems locally to display something on load
        
        let array = items.map( (item) => {
            return {
                 active:item.active,
                 method:item.method 
                } 
            } )
        let str = JSON.stringify( array );
        localStorage.setItem('storedItems', str );


    }

}