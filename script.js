
class MenuPaises {

    constructor(ref) {

        this.ref = ref;
        this.el = document.querySelector(ref);

        console.log(this.el);

        this.el.addEventListener("click", e => {

            let pais;

            if (e.target.tagName == "IMG" || e.target.tagName == "SPAN") pais = e.target.parentElement.parentElement.dataset.pais;
            if (e.target.tagName == "A") pais = e.target.parentElement.dataset.pais;
            if (e.target.tagName == "LI") pais = e.target.dataset.pais;

            console.log(pais);

            if (pais, plot_country(pais));
        });

    }

    showCountry(country) {

    }

}

function plot_country(country) {

    console.log(country);

    const bbox_highlighted = bboxes[country];

    map.fitBounds(
        bbox_highlighted, 
        {
            linear : false, // false means the map transitions using map.flyTo()
            speed: 1, 
            padding:  {
                left: 500,
                top: 20,
                right: 50,
                bottom: 20
            }
        }
    );

}

function get_bbox(country) {

    console.log(country);

    let locations = map.querySourceFeatures("countries", {
        sourceLayer: 'data-blt69d'
    })
        
    let desired_features = locations.filter(d => d.properties.country_name == country)[0];

    console.log(desired_features);

    let bbox_highlighted = turf.bbox(desired_features)
    
    console.log(desired_features, bbox_highlighted);

    bboxes[country] = bbox_highlighted;

}

let map;

const bboxes = {};

const overall_bbox = [-118.4013671875, -55.891699218750006, -53.66855468749999, 32.71533203125];

function init() {

    console.log("initi");

    const selector = document.querySelector('select#countries');

    selector.addEventListener('change', function(e) {

        console.log("hi");

        const country = e.target.value;

        console.log(country);
        
        plot_country(country);
    });

    const menu_paises = new MenuPaises(".menu-paises");

    const countries = ["Argentina", "Colombia", "Peru", "Chile", "Mexico"];

    mapboxgl.accessToken = 'pk.eyJ1IjoidGlhZ29tYnAiLCJhIjoiY2thdjJmajYzMHR1YzJ5b2huM2pscjdreCJ9.oT7nAiasQnIMjhUB-VFvmw';

    map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/tiagombp/clgxtpl6400eg01p6dtzv8igv',
        center: [-76.8, -4.48],
        zoom: 2
    });
    
    let hoveredPolygonId = null;

    map.on('load', () => {

        map.addSource('countries', {
            'type': 'vector',
            'url': 'mapbox://tiagombp.bmw9axxy'
        });

        // The feature-state dependent fill-opacity expression will render the hover effect
        // when a feature's hover state is set to true.
        map.addLayer({
            'id': 'countries-fills',
            'type': 'fill',
            'source': 'countries',
            'source-layer' : 'data-blt69d',
            'layout': {},
            'paint': {
                'fill-color': "#FF571D",
                /*'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0.5
                ]*/
            }
        });

        map.addLayer({
            'id': 'countries-borders',
            'type': 'line',
            'source': 'countries',
            'source-layer' : 'data-blt69d',
            'layout': {},
            'paint': {
                'line-color': 'black',
                'line-width': 1
            }
        });

        map.fitBounds(overall_bbox, {
            padding:  {
                left: 500,
                top: 20,
                right: 50,
                bottom: 20
            }
        });

        let flag_start = true;

        map.on('sourcedata', () => { // para garantir que o source foi carregado
            if (flag_start) {
                console.log("Começou")
                countries.forEach(country => get_bbox(country));
                flag_start = false;
            }
        });



        //map.querySourceFeatures("countries", {'sourceLayer' : 'data-blt69d'})

    });

}

init();

class Story {

    constructor() {

        gsap.registerPlugin(ScrollTrigger);

        


    }

}