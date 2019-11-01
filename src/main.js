import "./css/index.scss"

import Layout from "./js/Layout"
import Editor from "./js/Editor"

/*---------------------------------------------------------

  INIT 

---------------------------------------------------------*/

//collects the contents

const contents = require("./contents.json")

let LOCALE = "fr-fr"
let THUMBS = "assets/thumbnails/"
let IMAGES = "assets/images/"

let availableLocales = []
for( let key in contents ){
  availableLocales.push( key )
}


//  initialise DOM objects and layout 

let layout = new Layout( LOCALE, THUMBS, IMAGES )



//  create the editor

let editor = new Editor( LOCALE + "/" ) 


//initialise the Layout (create the codepanel, binds interface buttons, etc. ):

layout.init( editor )


//create the sections

const list = contents[LOCALE]
list.sections.forEach((section, i) => {
  layout.createSection({
    name: section,
    description: ""
  }, i)
});


//create the cards 

let cardIndex = 0
list.cards.forEach(card => {
  
  let section = document.querySelector(".section_" + card.section )
  layout.createCard( section, card, cardIndex++ );

});


//activate cards buttons

layout.bindButtons()


/*---------------------------------------------------------

  DEV / TESTS  

---------------------------------------------------------*/


// layout.gotoPage("03_variables/5_easing.html")

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

