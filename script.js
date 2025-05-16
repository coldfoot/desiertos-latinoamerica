
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

            const screen_width = window.innerWidth;

            const padding = {
                right: screen_width / 2,
                left: 30,
                top: 30,
                bottom: 30
            }

            if (pais, plot_country(pais, padding));
        });

    }

    showCountry(country) {

    }

}

function plot_country(country, padding) {

    console.log(country);

    const bbox_highlighted = bboxes[country];

    map.fitBounds(
        bbox_highlighted, 
        {
            linear : false, // false means the map transitions using map.flyTo()
            speed: 1, 
            padding:  padding
        }
    );

    console.log(colors["accent"], colors["map"]);

    map.setPaintProperty(
        'countries-fills', 
        'fill-opacity',
        ['case',
            [
                '==',
                ['get', 'country_name'],
                country
            ],

            1,
            
            0
        ]

    );

    map.setPaintProperty(
        'countries-borders', 
        'line-opacity',
        ['case',
            [
                '==',
                ['get', 'country_name'],
                country
            ],

            1,
            
            0
        ]

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

//const bboxes = {};
const bboxes = {
    "Argentina" : [-73.57626953125, -55.03212890625, -53.6685546875, -21.8025390625],
    "Chile" : [-109.434130859375, -55.89169921875, -66.435791015625, -17.5060546875],
    "Colombia" : [-79.025439453125, -4.23593750000001, -66.876025390625, 12.434375],
    "Mexico" : [-118.4013671875, 14.54541015625, -86.6962890625, 32.71533203125],
    "Peru" : [-81.33662109375, -18.34560546875, -68.68525390625, -0.041748046875]
}

const overall_bbox = [-118.4013671875, -55.891699218750006, -53.66855468749999, 32.71533203125];

const colors = {};

function init() {

    console.log("init");

    // COLORS
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    colors["accent"] = rootStyles.getPropertyValue('--color-accent');
    colors["map"] = rootStyles.getPropertyValue('--color-map');


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

        /*
        let flag_start = true;

        map.on('sourcedata', () => { // para garantir que o source foi carregado
            if (flag_start) {
                console.log("Começou")
                countries.forEach(country => get_bbox(country));
                flag_start = false;
            }
        });
        */



        //map.querySourceFeatures("countries", {'sourceLayer' : 'data-blt69d'})

    });

}

init();

class Story {

    constructor() {

        gsap.registerPlugin(ScrollTrigger);

        


    }

}