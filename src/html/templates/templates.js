export const SECTION_TEMPLATE = function( section ){

    return `
<div class="section" id="${ section.id }" >
    <a href="#home"><div class="btn black"><i class="material-icons">arrow_upward</i></div></a> 
    <h5>${section.name}</h5>
    <p>${section.description}</p>      
</div>    
<div class="row ${ section.id }">
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