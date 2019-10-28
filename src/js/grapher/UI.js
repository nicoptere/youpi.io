
export default class UI{

    constructor( main, container ){

        this.createCSS();

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
            el.checked = i === a.length - 1;
            la.appendChild(el);

            let sp = document.createElement("span");
            sp.innerHTML = str;
            la.appendChild(sp);

        });
        main.container.appendChild(domElement);

        //to create items
        this.itemRow = this.getRow(domElement)


        /*

        let c = this.getColumn(this.itemRow, 12)
        let tabs = document.createElement("ul")
        tabs.classList.add( "tabs" )
        this.tabs = tabs
        c.appendChild( tabs )
        this.addTab( "a", "value a" )
        this.addTab( "b", "value b" )
        M.Tabs.init(tabs);
        
    }

    addTab( name, value ){

        let id = this.tabs.querySelectorAll(".li").length

        let li = `<li class="tab col"><a href="#tab_${id}" data-value="${value}"><div class="btn">${name}</div></a></li>`
        this.tabs.insertAdjacentHTML('beforeend', li )
        
        let div = `<div id="tab_${id}" class="col s12">${value}</div>`
        this.tabs.parentNode.parentNode.insertAdjacentHTML('beforeend', div )
        //*/
        
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

    getPicto( parent, type, color="black" ){

        let el = document.createElement("div")
        el.classList.add( "btn-floating" )
        el.classList.add( "btn-small" ) 
        el.style.backgroundColor =  color
        parent.appendChild(el)
        
        let i = document.createElement("i")
        i.classList.add( "material-icons")
        i.innerText = type 
        el.appendChild(i)

        el.icon = i
        return el
    }


    createItem( item, name, str ){

        let row, c;
        let domElement = item.domeElement = row = this.getRow(this.itemRow);



        c = this.getColumn(row,1)
        let label = this.getLetter( c, name, item.color  )

        c = this.getColumn(row,1)
        let picto = this.getPicto( c, "warning", item.color )
        picto.addEventListener("mousedown", ()=>{
            item.active = !item.active
        }, false)

        c = this.getColumn(row,1)
        let deleteBtn = this.getPicto( c, "close", item.color )

        c = this.getColumn(row,1)
        let inlineBtn = this.getPicto( c, "keyboard_return", item.color )


        let textField = document.createElement( 'input' );
        textField.type = "text";
        textField.tabIndex = item.id + 1;
        textField.value = str;
        domElement.appendChild(textField);
        

        item.picto = picto
        item.label = label
        item.textField = textField
        item.deleteBtn = deleteBtn
        item.inlineBtn = inlineBtn
        return
    }

    get range(){
        return parseFloat( this.domElement.querySelector('input[name=range]:checked').value );
    }

    createCSS(){

        //this creates a CSS file, the hard way.
        var css = document.createElement('style');
        css.type = 'text/css';
        css.appendChild(document.createTextNode(`
        
            .graphHolder{
                overflow:hidden;
                resize: both;
                z-index: 10;
                position.absolute;
                border: 1px solid #EEE;
            }
            .graph-header{
                width : 100%;
                height : 8px;
                background-color : #eeeeee;
                display : block;
                color : #CCCCCC;
                z-index : 10;
            }
            .item{
                width:100%;
                display: flex;
                align-items: center;
            }
            .invalid{" +
                pointer-events: none;
                position:absolute;
                border-style: solid;
                border-width: 0 8px 16px 8px;
                border-color: transparent transparent #CC0000 transparent;
            }
            
            .resize{
                overflow:hidden;
                resize: vertical;
                border: 1px solid #EEE;
            }
            input[type=text]{
                -webkit-transition: all 0.5s;
                transition: all 0.5s;
            }
            input[type=text], input[type=button] {
                padding: 6px 10px;
                width: auto;
                margin: 4px 0;
                box-sizing: border-box;
                // border: 1px solid #EEE;
                outline: none;
            }
            
            input[type=color] {
                padding:2px;
                margin:0 8px 0 8px;
                height:30px;
                width:30px;
                border: 0;
            }
            
            input[type=text]:focus {
                width: 100%;
                border: 1px solid #AAA;
            }
            .highlight-text-idle{
                border: 1px solid #EEE;
            }
            
            .highlight-text-field{
                border: 1px solid #D00;
            }
            
            input[type=button]{
                background-color:#EEEEEE;
            }
            
            input[type=button]:hover {
                background-color:#F6F6F6;
            }`
        ));
        document.head.appendChild(css);
    }

}