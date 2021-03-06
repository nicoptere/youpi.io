export const SECTION_TEMPLATE = function( name, id ){

    return `
<div class="section" id="${ id }" >
    <a href="#home"><div class="btn black"><i class="material-icons">arrow_upward</i></div></a> 
    <h5>${name}</h5>   
</div>    
<div class="row ${ id }">
    <div class="col l4 m6 s12"></div>
    <div class="col l4 m6 s12"></div>
    <div class="col l4 m6 s12"></div>
</div>`;
}


export const CARD_TEMPLATE = function (card, imageTag) {

    return `
<div class="card hoverable">
    <div class="card-image">
        ${imageTag}
        <a class="btn-floating btn-small halfway-fab waves-effect waves-light red">
            <i class="material-icons" data-url="${ card.url }" data-img="${ card.img }">edit</i>
        </a>
    </div>
    <div class="card-content">
        <span class="card-title">${card.title}</span>
        <p>${card.description}</p>
    </div>
</div>`
}
export const LINK_TEMPLATE = function (card, locale ) {

    return `
<div class="card hoverable">
    <div class="card-image">
        <a class="btn-floating btn-small halfway-fab waves-effect waves-light blue" href="${ card.externalUrl }" target="_blank">
            <i class="material-icons" fullscreen data-url="${ card.externalUrl }" data-img="${ card.img }">open_in_new</i>
        </a>
    </div>
    <div class="card-content">
        <span class="card-title">${card.title}</span>
        <p>${card.description}</p>
    </div>
</div>`
}