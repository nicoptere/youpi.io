import "./css/index.scss"

import Layout from "./js/Layout"
import Editor from "./js/Editor"

/*---------------------------------------------------------

  INIT 

---------------------------------------------------------*/


//collects the contents
const contents = require("./contents.json")

//global vars
let LOCALE = "fr-fr"
let THUMBS = "assets/thumbnails/"
let IMAGES = "assets/images/"

let currentPage = ""
if ('URLSearchParams' in window) {
  
  let availableLocales = []
  for (let key in contents) {
    availableLocales.push(key)
  }

  //switch to appropriate locale or fallback to french
  let searchParams = new URLSearchParams(window.location.search)

  if( searchParams.has( "locale" )){
    let locale = searchParams.get( "locale" )
    // console.log( 'detected locale:', locale, availableLocales)
    if( availableLocales.indexOf(locale) != -1 ){
      LOCALE = locale
    }
  }

  searchParams.set("locale", LOCALE );
  

  //tries to retrieve the current page being viewed
  if( searchParams.has( "page" ) ){
    currentPage = unescape( searchParams.get( "page" ) )
  }
}
console.log( LOCALE, contents[LOCALE] )




//  initialise DOM objects and layout 
let layout = new Layout(LOCALE, THUMBS, IMAGES)

//  create the editor
let thumbnails = false//fixes the window size to 512*512 to make the thumbnails
let editor = new Editor(LOCALE + "/", thumbnails)

//initialise the Layout (create the codepanel, binds interface buttons, etc. ):
layout.init(editor)


//create the sections
const list = contents[LOCALE]
list.sections.forEach((section, i) => {

  // if( i > 1 )return
  layout.createSection( section, i)

});
window.ed = editor.editor


//create the cards 
let cardIndex = 0
list.cards.forEach( card => {

  let section = document.querySelector(".section_" + card.section)
  if( section == null )return

  layout.createCard(section, card, cardIndex++);

});


//activate cards buttons

layout.bindButtons()


/*---------------------------------------------------------

  DEV / TESTS  

---------------------------------------------------------*/



if( currentPage != "" ){
  layout.gotoPage(currentPage)
}

document.body.removeChild(document.querySelector('.preload-container'))
document.querySelector('.content').classList.remove("hidden")


//gl demos
/*
import Texture from "./js/gl/Texture"
import Interactive from "./js/gl/Interactive";

let urls = [
  layout.images + "uv_grid.jpg",
  layout.images + "volcano.jpg"
]
editor.reset(Interactive, urls)
codePanel.open()
//*/