
export default class UI{

    constructor( main, container ){

        let domElement = document.createElement('div');
        domElement.setAttribute("name", "UI");
        this.domElement = domElement;

        //starts a row
        let row = this.getRow(domElement,4)

        //add new button:
        let el = this.getColumn(row)
        el.classList.add( 'btn' )
        el.innerHTML = "add new";
        el.addEventListener("mousedown", ()=>{ main.addNew("x");}, false );

        //spacer
        this.getColumn(row, 1);
        
        //spaces types
        ["unit", "bi-unit"].forEach( (str,i,a) => {
            
            let range = this.getColumn(row, 3);
            let la = document.createElement("label");
            range.appendChild(la);
            
            let el = document.createElement("input");
            el.type = "radio";
            el.name = "range";
            el.value = i;
            el.setAttribute("id", str);
            el.checked = i === 0;
            la.appendChild(el);

            let sp = document.createElement("span");
            sp.innerHTML = str;
            la.appendChild(sp);

        });
        main.container.appendChild(domElement);

        //to create items
        this.itemRow = this.getRow(domElement)

    }

    createItem( item ){

        let row, c;
        row = this.getRow(this.itemRow);
        item.domElement = row;

        c = this.getColumn(row,1)

        let picto = this.getPicto( c, "warning", item, "show/hide" )
        picto.addEventListener("mousedown", ()=>{
            item.active = !item.active
        }, false)

        c = this.getColumn(row,1)
        let deleteBtn = this.getPicto( c, "close", item, "delete this function" )

        c = this.getColumn(row,1)
        let label = this.getLetter( c, item.name, "#000"  )

        c = this.getColumn(row,8)        
        let textField = document.createElement( 'input' );
        textField.style.height = "2.4em";
        textField.style.marginLeft = "16px";
        textField.type = "text";
        textField.tabIndex = item.id + 1;
        textField.value = item.method;
        c.appendChild(textField);
        
        c = this.getColumn(row,1)
        let inlineBtn = this.getPicto( c, "keyboard_return", item, "inline this function" )
        inlineBtn.classList.add('hidden');

        item.picto = picto
        item.label = label
        item.textField = textField
        item.deleteBtn = deleteBtn
        item.inlineBtn = inlineBtn
        return
    }

    getRow( parent ){
        let row = document.createElement('div')
        row.classList.add( "row" )
        parent.appendChild(row )
        return row     
    }

    getColumn( parent, size = 3 ){
        let col = document.createElement('div')
        col.classList.add( "col" )
        col.classList.add( "l" + size )
        col.classList.add( "m" + size )
        col.classList.add( "s" + size )
        parent.appendChild( col )
        return col
    }

    getLetter( parent, text, color="black" ){
        let el = document.createElement("div")
        el.classList.add( "btn" )
        el.style.backgroundColor =  "white"
        el.style.color =  color
        el.style.textTransform = "none"
        el.innerText = text.toLowerCase()
        parent.appendChild(el)
        return el
    }

    getPicto( parent, type, item, title="" ){

        let el = document.createElement("div")
        el.classList.add( "btn-floating" )
        el.classList.add( "btn-small" ) 
        el.style.backgroundColor = item.color
        parent.appendChild(el)
        
        let a = document.createElement("a")
        a.setAttribute("title", title)
        el.appendChild(a)

        let i = document.createElement("i")
        i.classList.add( "material-icons")
        i.innerText = type 
        a.appendChild(i)

        el.icon = i
        return el
    }


    get range(){
        return parseFloat( this.domElement.querySelector('input[name=range]:checked').value );
    }

}