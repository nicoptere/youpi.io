var recursive = require("recursive-readdir");
const fs = require('fs');

//list all the HTML pages

// recursive("./", ["*.js", "*.css", '*.txt', '*.csv', '*.jpg', '*.png', '*.ttf', '*.scss', '*.woff', '*.mp4', '*.png', "index.html"], function (err, urls) {
recursive("./", ["*.js", "index.html"], function (err, urls) {
   
    urls.sort()

    let json = {}, obj;

    for( let i = 0; i < urls.length ; i++ ){
        
        let url  = urls[i]

        //scoops only : [locale] / [folder] / XXX
        if( url.split('\\').length > 3 )continue
        
        //extracts the locale (fr-fr, en-en, ... )
        let locale = url.split('\\')[0];
        if( locale == "assets" )continue;

        if( json[locale] == null ){

            obj = {
                sections:[],
                cards:[]
            }
            json[locale] = obj        

        }else{
            obj = json[locale]
        }
        

        //strips the locale from the filepath
        let file = url.replace( locale + '\\', '')

        //get page folder name
        let folder = file.split('\\')[0].replace( /(\d.*)_/, '' ).replace( /_/g, ' ' ).replace('.html', '')
        
        if( obj.sections.indexOf( folder ) == -1 ){
            obj.sections.push( folder )
        }


        //parse the html page to collect the title and the description
        var html = fs.readFileSync( url, 'utf8');
        
        //tries to extract the title
        let re = new RegExp( "<title>(.*?)</title>", "gm" )
        let title = html.match( re )

        if( title == null )continue
        if( title != null && title.length > 0 ){

            //extract the title
            title = title[0].replace( /(<|<\/)(.*?)>/gm, '' )
            
        }
        if( title == "" ){

            //use the file name as title
            title = file.split('\\')[1].replace( /(\d*)_/, '' ).replace( /_/gi, ' ' ).replace('.html', '')

        }

        //tries to extract the description 

        let meta = html.match( /<meta\s*(.*?)name="description"(.*?)>/gmi )
        if (meta == null ){
            console.log( "no description", file )
            continue
        }
        
        let description = html.match( /<meta\s*name\s*=\s*"description"\s*content\s*=\s*"\s*(.|\s)*?\s*"/gmi )
        // let description = meta.match( /content\s*=\s*"\s*(.|\s)*?\s*"/gmi )
        
        if( description != null ){
            
            description = description[0].replace( /<meta\s*name\s*=\s*"description"\s*content\s*=\s*"\s*/gmi, '' )
            description = description.replace( /\s*"$/gmi, '' )

        }else{

            description = ""

        }

        let img = file.replace('.html', '').replace('\\', '_') + ".png"
        if( i == 0 ){
            console.log( "url: ", url )
            console.log( "locale: ", locale )
            console.log( "folder: ", folder )
            console.log( "file: ", file )
            console.log( "description: ", description )
            console.log( "image: ", img )
        }
        
        meta = meta[0]
        let fullscreen = meta.match( /\s*fullscreen\s*/gmi ) != null
        let externalUrl = meta.match( /url\s*=\s*"\s*(.|\s)*?\s*"/gmi )
        if( fullscreen){
            
            externalUrl = externalUrl[0].replace(/url\s*=\s*"/gmi, "" ).replace( /\s*"$/gmi, '' )
            console.log( fullscreen, externalUrl )

        } 

        obj.cards.push( { 
            section: folder,
            title: title,
            description: description,
            img: img,
            url: file.replace( /\\/, '/' ),
            fullscreen: fullscreen,
            externalUrl: externalUrl,
        } )

    }


    fs.writeFile("../src/contents.json", JSON.stringify(json), 
        function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("contents' list saved");
        }
    );
});
