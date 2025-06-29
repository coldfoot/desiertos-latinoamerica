
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

            current_country = pais;

            console.log(pais);

        });

    }

}

function showCountryStory(pais) {

    const screen_width = window.innerWidth;

    const pad_right = screen_width < 900 ? 30 : screen_width / 2;

    const padding = {
        right: pad_right,
        left: 30,
        top: 30,
        bottom: 30
    }

    plot_country(pais, padding);

}

const w_cutoff = 900;

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

function plot_latam(dashboard = false) {
    map.fitBounds(overall_bbox, {
        padding:  {
            left: dashboard ? 50 : 500,
            top: 20,
            right: 50,
            bottom: 20
        }
    });

    map.setPaintProperty(
        'countries-fills', 
        'fill-opacity',
        1

    );

    map.setPaintProperty(
        'countries-borders', 
        'line-opacity',
        1
    );
}

function clear_latam() {

    map.setPaintProperty(
        'countries-fills', 
        'fill-opacity',
        0

    );

    map.setPaintProperty(
        'countries-borders', 
        'line-opacity',
        0
    );
}

let map;
let story;

//const bboxes = {};
const bboxes = {
    "argentina" : [-73.57626953125, -55.03212890625, -53.6685546875, -21.8025390625],
    "chile" : [-109.434130859375, -55.89169921875, -66.435791015625, -17.5060546875],
    "colombia" : [-79.025439453125, -4.23593750000001, -66.876025390625, 12.434375],
    "mexico" : [-118.4013671875, 14.54541015625, -86.6962890625, 32.71533203125],
    "peru" : [-81.33662109375, -18.34560546875, -68.68525390625, -0.041748046875]
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

    const dashboard = root.dataset.page;

    if (!dashboard) {
        
        menu_paises = new MenuPaises(".menu-paises");

    }


    //const countries = ["Argentina", "Colombia", "Peru", "Chile", "Mexico"];

    mapboxgl.accessToken = 'pk.eyJ1IjoidGlhZ29tYnAiLCJhIjoiY2thdjJmajYzMHR1YzJ5b2huM2pscjdreCJ9.oT7nAiasQnIMjhUB-VFvmw';

    map = new mapboxgl.Map({
        container: dashboard ? 'map-dashboard' : 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/tiagombp/clgxtpl6400eg01p6dtzv8igv',
        center: [-76.8, -4.48],
        zoom: 2
    });

    map.on('load', () => {

        map.addSource('countries', {
            'type': 'vector',
            'url': 'mapbox://tiagombp.bmw9axxy',
            'promoteId' : 'country_name'
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

        plot_latam(dashboard);

        story = new Story(".scroller-step");

        //if (!dashboard) {
            
            countries["argentina"] = new Country("argentina", "", "mapbox://tiagombp.2c7pqb06", "large-units-argentina-9wj09y", "mapbox://tiagombp.0fsztx9y", "small-units-argentina-dpc40y");

            countries["chile"]     = new Country("chile", "", "mapbox://tiagombp.0l57h9et", "large-units-chile-9v7av2", "mapbox://tiagombp.54kh6vm7", "small-units-chile-auxnhe");

            countries["peru"] = new Country(
                "peru", "",
                "mapbox://tiagombp.d899dc8k", "large-units-peru-42epjp",
                "mapbox://tiagombp.3636aktg",
                "small-units-peru-3glt7j"
            )

        //}


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

    step_actions = {

        "country selection" : (direction) => {

            if (direction == "forward") {

                console.log("Country. Going down...");

            } else {

                plot_latam();
                countries[current_country].ut_maior.toggle_hover_border("disable");

                console.log("Country.Going up...");

            }

        },

        "first paragraph" : (direction) => {

            if (direction == "forward") {

                console.log("First paragraph. Going down...");

            } else {

                console.log("First paragraph. Going up...");

            }

            clear_latam();

            showCountryStory(current_country);

            countries[current_country].ut_maior.toggle_hover_border();


            

        }

    };

    constructor(step_selector) {

        this.step_selector = step_selector;

        gsap.registerPlugin(ScrollTrigger);

        this.steps_elements = document.querySelectorAll(step_selector);

        this.monitora_scroller();

    }

    monitora_scroller() {

        this.steps_elements.forEach(step_element => {

            const step_name = step_element.dataset.slide;
            const selector = this.step_selector + '[data-slide="' + step_name + '"]';

            console.log(step_name, selector);

            gsap.to(

                selector, // só para constar, não vamos fazer nada com ele, na verdade

                {
                    scrollTrigger : {
                        trigger: selector,
                        markers: false,
                        toggleClass: 'active',
                        pin: false,
                        start: "25% 60%",
                        end: "75% 40%", 

                        onEnter : () => this.step_actions[step_name]("forward"),
                        onEnterBack : () => this.step_actions[step_name]("back"),
                        //onLeave : () => v.scroller.linechart_regioes.render[step_name](forward = true),
                        //onLeaveBack : () => v.scroller.linechart_regioes.render[step_name](forward = false)

                    }

                })
            ;


        })


    }

}