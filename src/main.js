import "./css/index.scss"

const M = require("materialize-css")

import Editor from "./js/Editor";
import {
  CARD_TEMPLATE,
  SECTION_TEMPLATE
} from "./html/templates"



function createSection(section, i) {

  section.id = "section_" + section.name.replace(/\s/g, '_')

  const html = SECTION_TEMPLATE(section)
  document.querySelector(".cards").insertAdjacentHTML('beforeend', html);


  //this is used to choose the column in which cards are added (need fixing)
  let sectionElement = document.querySelector("." + section.id)
  sectionElement.cards = 0

  //adds the section link to the nav bar
  let tab = `<a href="#${ section.id }"><div class="btn black">${section.name}</div></a>`
  document.querySelector(".nav-tabs-list").insertAdjacentHTML('beforeend', tab)

  //remove back button for the first section
  if (i == 0) {
    let back = document.querySelector("#" + section.id + " a")
    back.parentNode.removeChild(back)
  }

  //dev only
  // if (i < 6) {
  //   section.style.display = "none"
  //   block.style.display = "none"
  // }
  return sectionElement
}

function createCard(section, card, index ) {

  let cols = section.querySelectorAll('.col')
  let col = cols[section.cards++ % cols.length]

  let thumbnail = THUMBS + card.img
  let imageTag = '<img src="'+thumbnail+'" />'  
  
  //lazy load
  if( index > 2 ){
    imageTag = '<img class="lazy" data-src="'+thumbnail+'" />'  
  }
  const html = CARD_TEMPLATE(card, imageTag)
  col.insertAdjacentHTML('beforeend', html)

}

function gotoPage(url) {

  let root = url.split('/')
  root.pop()
  editor.reset(LOCALE + "/" + url, LOCALE + "/" + root.join('/') + '/')
  codePanel.open()

}

/*---------------------------------------------------------

  UI

---------------------------------------------------------*/

/*------------

init the code panel

------------*/

let codePanel = M.Sidenav.init(document.querySelector('.sidenav'))

let open_code = document.querySelector(".open-code-btn")
open_code.addEventListener("mousedown", () => {
  codePanel.open()
})

let close_code = document.querySelector(".close-code-btn")
close_code.addEventListener("mousedown", () => {
  codePanel.close()
})

/*------------

init the theme selector

------------*/
M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
  constrainWidth: false,
});
document.querySelectorAll('#theme_selector li').forEach( node => {

  node.addEventListener( 'click', (e)=>{

    let name = node.innerText
    console.log(name)
    if (name != "default") {
        let css = document.createElement("link")
        css.setAttribute('rel', "stylesheet")
        css.setAttribute('href', "assets/css/" + name + ".css")
        document.head.appendChild(css)
      }
      editor.setOption('theme', name)
      
  } )

})

/*------------

init the next arrow in the code panel 

------------*/
let forward = document.querySelector('.forward')
forward.addEventListener("mousedown", (e) => {
  editor.forward()
})


/*------------

init the screenshot button

------------*/
let save = document.querySelector('.save-code-btn')
save.addEventListener("mousedown", (e) => {

  let win = editor.display_frame.contentWindow
  let doc = win.document
  let ctx = doc.querySelector("canvas").getContext('2d')
  win.save(ctx, currentCard.replace(".png", ""))

})


/*---------------------------------------------------------

  INIT 

---------------------------------------------------------*/

let LOCALE = "fr-fr"
let THUMBS = "assets/thumbnails/"
let IMAGES = "assets/images/"

let url = new URL(window.location)
let query = new URLSearchParams(url.search)
if (query.has('locale')) LOCALE = query.get('locale')


/*------------

create the editor

------------*/

let editorDomElement = document.getElementById("editor")
let editor = new Editor(editorDomElement, LOCALE + "/" ) 



/*------------

create the contents ( sections / cards ) 

------------*/
const contents = require("./contents.json")
const list = contents[LOCALE]

//create sections
list.sections.forEach((section, i) => {
  createSection({
    name: section,
    description: ""
  }, i)
});

//create cards 
let cardIndex = 0
list.cards.forEach(card => {
  
  let section = document.querySelector(".section_" + card.section )
  createCard( section, card, cardIndex++ );

});


/*------------

adds lazy loading
from : https://dev.to/ekafyi/lazy-loading-images-with-vanilla-javascript-2fbj

------------*/
document.addEventListener("DOMContentLoaded", function() {

  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    
    let lazyImageObserver = new IntersectionObserver( function( entries, observer) {

        entries.forEach(function(entry) {

          if (entry.isIntersecting) {

            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
            lazyImageObserver.unobserve(lazyImage);
            
          }

        });
    } );
    
    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });

  }
})

//bind the edit buttons 
let currentCard = null
let btns = document.querySelectorAll('.btn-floating')
btns.forEach((btn) => {

  btn.addEventListener("mousedown", (e) => {

    let url = e.target.getAttribute('data-url')
    console.log( url )
    if (url == null) return
    window.location.hash = url
    currentCard = e.target.getAttribute('data-img')
    gotoPage(url)

  });
})



//goto section if there's a #[section] in the url
if (url.hash != null) {
  let page = url.hash.replace("#", '')
  list.cards.forEach(card => {
    if (card.url == page) {
      gotoPage(page)
    }
  })
}



/*---------------------------------------------------------

  DEV / TESTS  

---------------------------------------------------------*/

//gl demos
/*
import Texture from "./js/gl/Texture"
import Interactive from "./js/gl/Interactive";

let urls = [
  IMAGES + "uv_grid.jpg",
  IMAGES + "volcano.jpg"
]
editor.reset(Interactive, urls)
codePanel.open()
//*/


//adds a graph utility 
document.querySelector(".functions").style.display = "none"
/*
import Grapher from "./js/grapher/Grapher";
let dom = document.querySelector(".log-message");
var grapher = new Grapher( dom, window.innerWidth, 512 );

function raf(){
  
  requestAnimationFrame(raf);
  grapher.update();
  
}
raf();
codePanel.open()
//*/