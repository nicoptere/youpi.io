/*
    
    c'est le début d'une petite série de datvisualisations.
    les exemples suivants utiliseront cette base pour rendre le jeu de données

    le CSV provient de:
    https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=90&id_rubrique=32
    c'est un relevé météo sur 51 stations en france métropolitaine

    on va utiliser uniquement deux variables: la température (t) et la vitesse du vent (ff)

*/
//on instantie l'utilitaire de dessin
var G = new Graphics(ctx);
var margin = 50

//on stockera nos données dans data
var data = [];

//tableau et bornes des valeurs de température
var temperatures = [];
var t_min, t_max;

//tableau et bornes des valeurs de la vitesse du vent
var winds = [];
var ff_min, ff_max;

//on charge le CSV
var loader = new CSVLoader();
loader.load("assets/data/synop.2015102115.csv", onCSVReady, ";");

function getBounds(data, key) {
    var min = Math.pow(2, 53);
    var max = -Math.pow(2, 53);

    data.forEach(function (obj) {

        min = Math.min(min, obj[key]);
        max = Math.max(max, obj[key]);

    });
    return [min, max];
}


//cette méthode sera appelée quand le CSV sera cahrgé
function onCSVReady(result) {

    data = result;

    var bounds = getBounds(data, 't');
    t_min = bounds[0];
    t_max = bounds[1];

    bounds = getBounds(data, 'ff');
    ff_min = bounds[0];
    ff_max = bounds[1];

    console.log('temperatures: t_min', t_min, 't_max', t_max);
    console.log('vent: ff_min', ff_min, 'ff_max', ff_max);

    resizeDataPoints()

    //enfin on va dessiner le résultat
    draw();

}

function resizeDataPoints(){
    temperatures = []
    winds = []
    // on va créer des points de données (data point) en les mappant entre 
    // leurs bornes min/max et la taille du canvas
    data.forEach(function (obj, i) {

        //espacement régulier en X

        var x = map(i, 0, data.length, margin, w - margin); // + ( width / data.length ) * .5;

        //mappe la valeur T de l'objet en cours entre t_min / t_max

        var y = map(obj.t, t_min, t_max, h - margin, margin);
        temperatures.push(new Point(x, y));

        //mappe la valeur FF de l'objet en cours entre ff_min / f_max
        y = map(obj.ff, ff_min, ff_max, h - margin, margin);
        winds.push(new Point(x, y));

    });

}
