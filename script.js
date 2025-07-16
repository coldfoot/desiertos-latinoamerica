
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

            populate_story(pais);

            document.querySelector("#page3").scrollIntoView({ behavior: "smooth" });

            console.log(pais);

        });

    }

}

let menu_paises;

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

        "random desierto" : (direction) => {


            console.log("First paragraph. Going down...");
            
            clear_latam();
            //showCountryStory(current_country);
            
            map.fitBounds(

                story_info['bbox provincia'], 

                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding: padding
                }
            );

            map.moveLayer(current_country + "-provincia-border-hover");
            map.moveLayer(current_country + "-provincia-border");
            countries[current_country].ut_maior.toggle_hover_border();
            //countries[current_country].ut_menor.toggle_highlight(story_info['key desierto']);
            countries[current_country].ut_menor.toggle_story_border(story_info['key desierto']);

            map.setPaintProperty(            
                this.country + '-localidad', 
                'fill-color',
                [
                    'case',
                    [
                        '==',
                        ['get', 'KEY'],
                        story_info['key desierto']
                    ],
                    '#bc5006',
                    'transparent'
                ]
            );

        },

         "desiertos" : (direction) => {

            console.log("Desiertos...");

            if (direction == "forward") {

                countries[current_country].ut_menor.toggle_story_border('none');

                // goes to whole country
                const bbox_highlighted = bboxes[current_country];

                map.fitBounds(
                    bbox_highlighted, 
                    {
                        linear : false,
                        speed: 1, 
                        padding:  padding
                    }
                );


            } else {
    

            }

            display_paisage("desierto", current_country);

        },

        "semidesierto" : (direction) => {

            display_paisage("semidesierto", current_country);

            if (direction == "forward") {


            } else {


            }

        },

        "semibosque" : (direction) => {

            display_paisage("semibosque", current_country);

            if (direction == "forward") {


            } else {


            }

        },

        "bosques" : (direction) => {

            display_paisage("bosque", current_country);

            if (direction == "forward") {


            } else {

    
            }

        },

        "todas las categorias" : (direction) => {

            display_paisage("", current_country);


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

function picks_random_desierto(country) {

    const desiertos = main_data[country].small_units.filter(d => d.BASIC_INFO.CLASSIFICATION == 'DESIERTO');

    const nof_desiertos = desiertos.length;

    const selected_index = Math.floor(nof_desiertos * Math.random());

    const mini_data = desiertos[selected_index];

    const pais_formatado = country[0].toUpperCase() + country.slice(1);

    const parent_data = main_data[country].large_units.filter(d => d.BASIC_INFO.NAME == mini_data.BASIC_INFO.PARENT)[0];

    const bbox_provincia = [
        parent_data.BBOX.minx, parent_data.BBOX.miny,
        parent_data.BBOX.maxx, parent_data.BBOX.maxy
    ]; 

    return {
        'nof desiertos' : nof_desiertos,
        'name desierto' : mini_data.BASIC_INFO.NAME,
        'parent desierto' : mini_data.BASIC_INFO.PARENT,
        'pop desierto' : mini_data.BASIC_INFO.POPULATION,
        'key desierto' : mini_data.BASIC_INFO.KEY,
        'bbox provincia' : bbox_provincia,
        'name pais' : pais_formatado
    }


}

let story_info;

function populate_story(country) {

    story_info = picks_random_desierto(country);

    console.log(story_info);

    const spans = document.querySelectorAll("[data-story-text");

    spans.forEach(span => {

        const campo = span.dataset.storyText;

        span.innerHTML = story_info[campo];

    })

}

let padding;

function showCountryStory(pais) {

    const screen_width = window.innerWidth;

    const pad_right = screen_width < 900 ? 30 : screen_width / 2;

    padding = {
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


let story;


function init() {

    console.log("init");

    // defined on classes.js

    if (!dashboard) {
        
        menu_paises = new MenuPaises(".menu-paises");

    }

    story = new Story(".scroller-step");

    //const countries = ["Argentina", "Colombia", "Peru", "Chile", "Mexico"];

}

init();