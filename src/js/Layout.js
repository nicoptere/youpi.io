const M = require("materialize-css")
import { CARD_TEMPLATE, SECTION_TEMPLATE } from "../html/templates"
import Grapher from "./grapher/Grapher";


/*---------------------------------------------------------

  UI

---------------------------------------------------------*/
let _locale
let _thumbs
let _images

let _editor
let _grapher
let _codePanel
let currentPage
let currentCard

export default class Layout {

    constructor( locale = "fr-fr", thumbs = "assets/thumbnails/", images = "assets/images/" ){

        _locale = locale
        _thumbs = thumbs
        _images = images

    } 

    get locale(){return _locale }
    get thumbs(){return _thumbs }
    get images(){return _images }
    get codePanel(){return _codePanel }


    init( editor) {

        _editor = editor

        /*------------
        
        init the code panel
        
        ------------*/

        _codePanel = M.Sidenav.init(document.querySelector('.sidenav'))

        let open_code = document.querySelector(".open-code-btn")
        open_code.addEventListener("mousedown", () => {
            _codePanel.open()
        })

        let close_code = document.querySelector(".close-code-btn")
        close_code.addEventListener("mousedown", () => {
            _editor.reset()
            _codePanel.close()
            this.updateUrl("")
        })

        /*------------
        
        init the theme selector
        
        ------------*/

        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
            constrainWidth: false,
        });
        document.querySelectorAll('#theme_selector li').forEach(node => {

            node.addEventListener('click', (e) => {

                let name = node.innerText
                console.log(name)
                if (name != "default") {
                    let css = document.createElement("link")
                    css.setAttribute('rel', "stylesheet")
                    css.setAttribute('href', "assets/css/" + name + ".css")
                    document.head.appendChild(css)
                }
                _editor.setOption('theme', name)

            })

        })

        /*------------
        
        init the function button in the code panel (to use the graph utility)
        
        ------------*/

        // document.querySelector(".functions").style.display = "none"
        // document.querySelector(".graph").parentNode.parentNode.style.display = "none"
        let graphDom = document.querySelector(".graphHolder")
        _grapher = new Grapher( graphDom, 512, 512 );

        let functions = document.querySelector('.functions')
        functions.addEventListener("mousedown", (e) => {
            
            console.log( "functions")
            if( graphDom.classList.contains( 'hidden' ) ){
                graphDom.classList.remove( 'hidden' )
                _grapher.start()
            }else{
                graphDom.classList.add( 'hidden' )
                _grapher.stop()
            }

        })


        /*------------
        
        init the next arrow in the code panel 
        
        ------------*/

        let forward = document.querySelector('.forward')
        forward.addEventListener("mousedown", (e) => {
            _editor.forward()
        })

        /*------------
        
        init the switch button in the code panel 
        
        ------------*/

        let switchBtn = document.querySelector('.switch-panels-btn')
        switchBtn.addEventListener("mousedown", (e) => {
            
            let c = document.querySelector('.code')
            let r = document.querySelector('.result')

            if( c.classList.contains( 'push-s6') ){
                c.classList.remove( 'push-s6')
                r.classList.remove( 'pull-s6')
            }else{
                c.classList.add( 'push-s6')
                r.classList.add( 'pull-s6')
            }

        })


        /*------------
        
        init the screenshot button
        
        ------------*/

        let save = document.querySelector('.save-code-btn')
        save.addEventListener("mousedown", (e) => {

            let win = _editor.display_frame.contentWindow
            let doc = win.document
            let ctx = doc.querySelector("canvas").getContext('2d')
            win.save(ctx, currentCard.replace(".png", ""))

        })


        /*------------

        adds lazy loading
        from : https://dev.to/ekafyi/lazy-loading-images-with-vanilla-javascript-2fbj

        ------------*/

        document.addEventListener("DOMContentLoaded", function () {

            var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

            if ("IntersectionObserver" in window) {

                let lazyImageObserver = new IntersectionObserver(function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            let lazyImage = entry.target;
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove("lazy");
                            lazyImageObserver.unobserve(lazyImage);

                        }

                    });
                });

                lazyImages.forEach(function (lazyImage) {
                    lazyImageObserver.observe(lazyImage);
                });

            }
        })
    }

    createSection( name, i) {
        
        let id = "section_" + name.replace(/\s/g, '_')

        const html = SECTION_TEMPLATE( name, id )
        document.querySelector(".cards").insertAdjacentHTML('beforeend', html);

        //this is used to choose the column in which cards are added (need fixing)
        let sectionElement = document.querySelector("." + id)
        sectionElement.cards = 0

        //adds the section link to the nav bar
        let tab = `<a href="#${ id }"><div class="btn black">${name}</div></a>`
        document.querySelector(".nav-tabs-list").insertAdjacentHTML('beforeend', tab)

        //remove back button for the first section
        let back = document.querySelector("#" + id + " a")
        if (i == 0) {
            back.parentNode.removeChild(back)
        }

        return sectionElement
    }

    createCard( section, card, index) {

        let cols = section.querySelectorAll('.col')
        let col = cols[section.cards++ % cols.length]

        //display onload
        let thumbnail = _thumbs + card.img
        let imageTag = '<img src="' + thumbnail + '" />'

        //lazy load
        if (index > 2) {
            imageTag = '<img class="lazy" data-src="' + thumbnail + '" />'
        }
        const html = CARD_TEMPLATE(card, imageTag)
        col.insertAdjacentHTML('beforeend', html)

    }

    /*------------
    
    bind the cards edit buttons 
    
    ------------*/
    bindButtons() {

        let btns = document.querySelectorAll('.btn-floating')
        btns.forEach((btn) => {

            btn.addEventListener("mousedown", (e) => {

                let url = e.target.getAttribute('data-url')
                if (url == null) return
                
                //window.location.hash = url
                currentPage = e.target.getAttribute('data-url')
                currentCard = e.target.getAttribute('data-img')
                this.gotoPage(currentPage)

            });
        })

    }

    gotoPage(url) {

        let root = url.split('/')
        root.pop()
        _editor.reset(_locale + "/" + url, _locale + "/" + root.join('/') + '/')
        _codePanel.open()
        this.updateUrl(url)

    }

    updateUrl(url){
        
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search)
            searchParams.set("page", escape( url ) );
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }

    }
}