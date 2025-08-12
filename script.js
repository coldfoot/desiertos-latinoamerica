console.log('Defining plot_latam function');

let btnDescubra;

if (!dashboard) {
    
    document.querySelector("#opening").scrollIntoView({ behavior: "smooth" });

    btnDescubra = document.querySelector(".btn-descubra");
    btnDescubra.addEventListener("click", e => {

        document.querySelector("#country-selection").scrollIntoView({ behavior: "smooth" });

    });

}

const arrows = document.querySelectorAll(".wrapper-arrow > svg");
arrows.forEach(arrow => arrow.addEventListener("click", e => {

    const slide = arrow.parentElement.parentElement.parentElement.dataset.slide;

    const slide_no = story.steps.indexOf(slide);

    const next_slide = story.steps[slide_no + 1];

    const next_slide_element = document.querySelector(`[data-slide='${next_slide}']`);

    next_slide_element.scrollIntoView({ behavior: "smooth" });

}));


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

            if (pais == "colombia") return;

            populate_story(pais);

            showCountryStory(pais);

            block_scroll(false);

            document.querySelector("#page3").scrollIntoView({ behavior: "smooth" });

            console.log(pais);

        });

    }

}

let menu_paises;

class Story {

    step_actions = {

        "country selection" : (direction) => {

            block_scroll(true); // it will be unblocked by the click listener in the MenuPAises object

            if (direction == "forward") {

                console.log("Country. Going down...");

            } else {

                countries[current_country].clear_country_subnational();

                plot_latam();

                console.log("Country.Going up...");

            }

        },

        "random desierto" : (direction) => {

            block_scroll(false);

            if (direction == "forward" & current_country == undefined) {

                const pais = "argentina"

                current_country = pais;

                populate_story(pais);

                showCountryStory(pais);

            }

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
                current_country + '-localidad', 
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

        this.steps = Object.keys(this.step_actions);

        this.step_selector = step_selector;

        gsap.registerPlugin(ScrollTrigger);

        this.steps_elements = document.querySelectorAll(step_selector);

        this.monitora_scroller();

    }

    monitora_scroller() {

        this.steps_elements.forEach(step_element => {

            const step_name = step_element.dataset.slide;
            const selector = this.step_selector + '[data-slide="' + step_name + '"]';

            let start_parameter = "25% 60%";
            let end_parameter = "75% 40%";

            /*
            if (step_name == "country selection") {
                start_parameter = "90% bottom";
                end_parameter = "10% top";
            }*/


            console.log(step_name, selector);

            gsap.to(

                selector, // só para constar, não vamos fazer nada com ele, na verdade

                {
                    scrollTrigger : {
                        trigger: selector,
                        markers: false,
                        toggleClass: 'active',
                        pin: false,
                        start: start_parameter,
                        end: end_parameter, 

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

function block_scroll(toggle = true) {
    if (toggle) {
        document.body.style.overflow = 'hidden';
        document.querySelector("[data-slide='country selection']").scrollIntoView({ behavior: "smooth" });
    } else {
        document.body.style.overflow = '';
    }
    
}

function pick_specific_desierto(country) {

    console.log(country);

    let desiertos;
    if (country != 'colombia') {
        console.log('country is not colombia');
        desiertos = main_data[country].small_units.filter(d => d.BASIC_INFO.CLASSIFICATION == 'DESIERTO');
    }
    else {
        console.log('country is colombia');
        desiertos = main_data[country].small_units.filter(d => d.BASIC_INFO.CLASSIFICATION == 'SEMIDESIERTO');
    }

    const nof_desiertos = desiertos.length;

    let selected_index;
    let type_smaller_unit;
    if (country == 'argentina') {
        type_smaller_unit = 'un departamento';
        selected_index = desiertos.findIndex(d => d.BASIC_INFO.KEY == 'San-Luis-del-Palmar__Corrientes__argentina');

    } else if (country == 'chile') {

        type_smaller_unit = 'una comuna';
        selected_index = desiertos.findIndex(d => d.BASIC_INFO.KEY == 'Penaflor__Region-Metropolitana__chile');

    } else if (country == 'peru') {

        type_smaller_unit = 'una provincia'
        selected_index = desiertos.findIndex(d => d.BASIC_INFO.KEY == 'Aija__Ancash__peru');

    } else if (country == 'mexico') {   

        type_smaller_unit = 'un municipio';
        selected_index = desiertos.findIndex(d => d.BASIC_INFO.KEY == 'Celestun__Yucatan__mexico');

    } else if (country == 'municipio') {

        type_smaller_unit = 'un departamento';
        selected_index = desiertos.findIndex(d => d.BASIC_INFO.KEY == 'Maicao__La-Guajira__colombia');

    }

    const mini_data = desiertos[selected_index];

    const pais_formatado = country_names[country];//country[0].toUpperCase() + country.slice(1);

    const parent_data = main_data[country].large_units.filter(d => d.BASIC_INFO.NAME == mini_data.BASIC_INFO.PARENT)[0];

    const bbox_provincia = [
        parent_data.BBOX.minx, parent_data.BBOX.miny,
        parent_data.BBOX.maxx, parent_data.BBOX.maxy
    ]; 

    return {
        'type smaller unit': type_smaller_unit,
        'nof desiertos' : nof_desiertos,
        'name desierto' : mini_data.BASIC_INFO.NAME,
        'parent desierto' : mini_data.BASIC_INFO.PARENT,
        'pop desierto' : mini_data.BASIC_INFO.POPULATION,
        'key desierto' : mini_data.BASIC_INFO.KEY,
        'bbox provincia' : bbox_provincia,
        'name pais' : pais_formatado
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

    story_info = pick_specific_desierto(country);

    console.log(story_info);

    const spans = document.querySelectorAll("[data-story-text");

    spans.forEach(span => {

        const campo = span.dataset.storyText;

        span.innerHTML = campo == 'pop desierto' 
        ?   story_info[campo].toLocaleString('pt-BR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true
            })
        : story_info[campo]
        ;

    })

}

let padding;
const screen_width = window.innerWidth;
const screen_height = window.innerHeight;

function showCountryStory(pais) {

    const h_3 = screen_height / 3;


    const pad_right = screen_width < 900 ? 30 : screen_width / 2;
    const pad_bottom = screen_width < 900 ? screen_height / 3 : 30;

    padding = {
        right: pad_right,
        left: 30,
        top: 30,
        bottom: pad_bottom
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

    padding = {
            left: dashboard ? 50 : 500,
            top: 20,
            right: 50,
            bottom: screen_width > 500 ? 20 : screen_height/3
        };

    map.fitBounds(overall_bbox, {
        padding: padding

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