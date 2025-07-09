
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

        "first paragraph" : (direction) => {

            if (direction == "forward") {

                console.log("First paragraph. Going down...");
                
                clear_latam();
                showCountryStory(current_country);
                countries[current_country].ut_maior.toggle_hover_border();


            } else {

                console.log("First paragraph. Going up...");

                map.setPaintProperty(current_country + '-localidad', "fill-color", "transparent");

            }

        },

         "second-desiertos" : (direction) => {

            if (direction == "forward") {

                display_paisage("desierto", current_country);


            } else {

                const bbox_highlighted = bboxes[current_country];

                map.fitBounds(
                    bbox_highlighted, 
                    {
                        linear : false, // false means the map transitions using map.flyTo()
                        speed: 1, 
                        padding:  padding
                    }
                );
                countries[current_country].ut_menor.toggle_highlight("");
    

            }

        },

        "desierto mas poblado" : (direction) => {

            last_localidad_location_data = story_info[current_country]["desierto-mas-poblado-data"];
            last_provincia_location_data = story_info[current_country]["desierto-mas-poblado-parent-data"];
            
            const localidad_key = last_localidad_location_data.BASIC_INFO.KEY;
            
            const bbox_provincia = [
                last_provincia_location_data.BBOX.minx, last_provincia_location_data.BBOX.miny,
                last_provincia_location_data.BBOX.maxx, last_provincia_location_data.BBOX.maxy
            ]; 

            map.fitBounds(

                bbox_provincia, 

                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding: padding
                }
            );

            //countries[current_country].ut_menor.toggle_borders("on");
            //this.ut_maior.toggle_highlight_border(provincia_key);
            map.moveLayer(current_country + "-provincia-border-hover");
            map.moveLayer(current_country + "-provincia-border");
            countries[current_country].ut_menor.toggle_highlight(localidad_key);


            if (direction == "forward") {


            } else {

                display_paisage("desierto", current_country);

            }

        },

        "todas las categorias" : (direction) => {

            if (direction == "forward") {

                const bbox_highlighted = bboxes[current_country];

                map.fitBounds(
                    bbox_highlighted, 
                    {
                        linear : false, // false means the map transitions using map.flyTo()
                        speed: 1, 
                        padding:  padding
                    }
                );
                countries[current_country].ut_menor.toggle_highlight("");
    

                display_paisage("", current_country);


            } else {


            }

        },

        "semidesiertos" : (direction) => {

            if (direction == "forward") {

                display_paisage("semidesierto", current_country);


            } else {

                const bbox_highlighted = bboxes[current_country];

                map.fitBounds(
                    bbox_highlighted, 
                    {
                        linear : false, // false means the map transitions using map.flyTo()
                        speed: 1, 
                        padding:  padding
                    }
                );
                countries[current_country].ut_menor.toggle_highlight("");
    
            }

        },

        "semidesierto mas poblado" : (direction) => {

            last_localidad_location_data = story_info[current_country]["semidesierto-mas-poblado-data"];
            last_provincia_location_data = story_info[current_country]["semidesierto-mas-poblado-parent-data"];
            
            const localidad_key = last_localidad_location_data.BASIC_INFO.KEY;
            
            const bbox_provincia = [
                last_provincia_location_data.BBOX.minx, last_provincia_location_data.BBOX.miny,
                last_provincia_location_data.BBOX.maxx, last_provincia_location_data.BBOX.maxy
            ]; 

            map.fitBounds(

                bbox_provincia, 

                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding: padding
                }
            );

            //countries[current_country].ut_menor.toggle_borders("on");
            //this.ut_maior.toggle_highlight_border(provincia_key);
            //map.moveLayer(current_country + "-provincia-border-hover");
            //map.moveLayer(current_country + "-provincia-border");
            countries[current_country].ut_menor.toggle_highlight(localidad_key);

            if (direction == "forward") {


            } else {

                display_paisage("semidesierto", current_country);

            }

        },

        "semibosques" : (direction) => {

            const bbox_highlighted = bboxes[current_country];

            map.fitBounds(
                bbox_highlighted, 
                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding:  padding
                }
            );
            countries[current_country].ut_menor.toggle_highlight("");

            display_paisage("semibosque", current_country);


            if (direction == "forward") {


            } else {


            }

        },

        "semibosque mas poblado" : (direction) => {

            last_localidad_location_data = story_info[current_country]["semibosque-mas-poblado-data"];
            last_provincia_location_data = story_info[current_country]["semibosque-mas-poblado-parent-data"];
            
            const localidad_key = last_localidad_location_data.BASIC_INFO.KEY;
            
            const bbox_provincia = [
                last_provincia_location_data.BBOX.minx, last_provincia_location_data.BBOX.miny,
                last_provincia_location_data.BBOX.maxx, last_provincia_location_data.BBOX.maxy
            ]; 

            map.fitBounds(

                bbox_provincia, 

                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding: padding
                }
            );

            //countries[current_country].ut_menor.toggle_borders("on");
            //this.ut_maior.toggle_highlight_border(provincia_key);
            //map.moveLayer(current_country + "-provincia-border-hover");
            //map.moveLayer(current_country + "-provincia-border");
            countries[current_country].ut_menor.toggle_highlight(localidad_key);

            if (direction == "forward") {


            } else {

                display_paisage("semibosque", current_country);

            }

        },

        "bosques" : (direction) => {

            const bbox_highlighted = bboxes[current_country];

            map.fitBounds(
                bbox_highlighted, 
                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding:  padding
                }
            );
            countries[current_country].ut_menor.toggle_highlight("");

            display_paisage("bosque", current_country);


            if (direction == "forward") {


            } else {


            }

        },

        "bosque mas poblado" : (direction) => {

            last_localidad_location_data = story_info[current_country]["bosque-mas-poblado-data"];
            last_provincia_location_data = story_info[current_country]["bosque-mas-poblado-parent-data"];
            
            const localidad_key = last_localidad_location_data.BASIC_INFO.KEY;
            
            const bbox_provincia = [
                last_provincia_location_data.BBOX.minx, last_provincia_location_data.BBOX.miny,
                last_provincia_location_data.BBOX.maxx, last_provincia_location_data.BBOX.maxy
            ]; 

            map.fitBounds(

                bbox_provincia, 

                {
                    linear : false, // false means the map transitions using map.flyTo()
                    speed: 1, 
                    padding: padding
                }
            );

            //countries[current_country].ut_menor.toggle_borders("on");
            //this.ut_maior.toggle_highlight_border(provincia_key);
            //map.moveLayer(current_country + "-provincia-border-hover");
            //map.moveLayer(current_country + "-provincia-border");
            countries[current_country].ut_menor.toggle_highlight(localidad_key);

            if (direction == "forward") {


            } else {

                display_paisage("bosque", current_country);

            }

        },

        "penultimo" : (direction) => {

            if (direction == "forward") {

                const bbox_highlighted = bboxes[current_country];

                map.fitBounds(
                    bbox_highlighted, 
                    {
                        linear : false, // false means the map transitions using map.flyTo()
                        speed: 1, 
                        padding:  padding
                    }
                );

                countries[current_country].ut_menor.toggle_highlight("");

                display_paisage("", current_country);

            }

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

function populate_story(country) {

    const spans = document.querySelectorAll("[data-story-text");

    spans.forEach(span => {

        const campo = span.dataset.storyText;

        span.innerHTML = story_info[country][campo];

    })

}

const story_info = {

    "chile" : {

        "pais" : "Chile",
        "gentilico" : "chilenos",
        "percentual-desiertos" : "47,5%",
        "percentual-pop-desiertos" : "22,9%",
        "nome-ut-menor" : "comunas",

        "desierto-mas-poblado" : "Talcahuano",
        "desierto-mas-poblado-parent" : "Biobío",
        "desierto-mas-poblado-population" : "147.322",
        "desierto-mas-poblado-data" : {
                "BASIC_INFO": {
                    "KEY": "Talcahuano__Biobio__chile",
                    "LEVEL": "smaller_unit",
                    "COUNTRY": "chile",
                    "NAME": "Talcahuano",
                    "PARENT": "Biob\u00edo",
                    "POPULATION": 147322.0,
                    "AREA": 92.0,
                    "NEWS_ORG_COUNT": 1.0,
                    "JOURNALIST_COUNT": 2.0,
                    "RATIO_POP_NEWS_ORG": 147322.0,
                    "RATIO_POP_JOURNALISTS": 73661.0,
                    "RATIO_AREA_JOURNALIST": 46.0,
                    "RATIO_JOURNALISTS_NEWS_ORG": 2.0,
                    "CLASSIFICATION": "DESIERTO"
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "small_unit": "Talcahuano",
                    "CONTRATO INDEFINIDO": 0,
                    "OTRAS": 0,
                    "TRABAJO INDEPENDIENTE": 0,
                    "PRACTICA PROFESIONAL": 0,
                    "CONTRATO LIMITADO": 0,
                    "CONTRATO POR PIEZAS": 0,
                    "EMPLEO INFORMAL": 0,
                    "COMISI\u00d3N": 0,
                    "TRABAJO VOLUNTARIO": 0,
                    "CUSTOM_ANSWERS": 0
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "small_unit": "Talcahuano",
                    "RADIO": 0,
                    "REVISTA": 0,
                    "X": 1,
                    "INSTAGRAM": 1,
                    "TIKTOK": 0,
                    "PRINT": 0,
                    "WHATSAPP": 0,
                    "NEWSLETTER": 0,
                    "FACEBOOK": 1,
                    "BLOG": 0,
                    "TWITCH": 0,
                    "TELEGRAM": 0,
                    "YOUTUBE": 0,
                    "PODCAST": 0,
                    "CUSTOM_ANSWERS": 0,
                    "WEBSITE": 1,
                    "TV": 1
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "small_unit": "Talcahuano",
                    "INVESTIGACI\u00d3N": 0,
                    "EMERGENCIAS": 0,
                    "MEDIO AMBIENTE": 0,
                    "SOCIAL": 0,
                    "SEGURIDAD": 0,
                    "ECONOM\u00cdA": 0,
                    "DERECHOS": 0,
                    "GOBIERNO": 0,
                    "SERVICIOS": 0,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "small_unit": "Talcahuano",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 0,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 0,
                    "AMENAZAS DIRECTAS": 0,
                    "NO RESPONDE": 0,
                    "ECON\u00d3MICAS": 0,
                    "AMENAZAS DIGITALES": 0,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -73.162598,
                    "miny": -36.79555,
                    "maxx": -73.009682,
                    "maxy": -36.604009
                },
                "CENTROID": {
                    "xc": -73.09844,
                    "yc": -36.71545
                }
        },
        "desierto-mas-poblado-parent-data" : {
            "BASIC_INFO": {
                    "KEY": "Biobio__chile",
                    "LEVEL": "larger_unit",
                    "COUNTRY": "chile",
                    "NAME": "Biob\u00edo",
                    "PARENT": "chile",
                    "POPULATION": 1613059.0,
                    "AREA": 23762.0,
                    "NEWS_ORG_COUNT": 73.0,
                    "JOURNALIST_COUNT": 264.0,
                    "RATIO_POP_NEWS_ORG": 22096.7,
                    "RATIO_POP_JOURNALISTS": 6110.1,
                    "RATIO_AREA_JOURNALIST": 90.0,
                    "RATIO_JOURNALISTS_NEWS_ORG": 3.6,
                    "CLASSIFICATION_COUNTS": {
                        "DESIERTO": 16,
                        "SEMIDESIERTO": 10,
                        "SEMIBOSQUE": 5,
                        "BOSQUE": 2,
                        "SIN DATOS": 0
                    }
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "CONTRATO INDEFINIDO": 14,
                    "OTRAS": 4,
                    "TRABAJO INDEPENDIENTE": 7,
                    "PRACTICA PROFESIONAL": 5,
                    "CONTRATO LIMITADO": 6,
                    "CONTRATO POR PIEZAS": 4,
                    "EMPLEO INFORMAL": 4,
                    "COMISI\u00d3N": 8,
                    "TRABAJO VOLUNTARIO": 6,
                    "CUSTOM_ANSWERS": 6
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "RADIO": 34,
                    "REVISTA": 0,
                    "X": 33,
                    "INSTAGRAM": 44,
                    "TIKTOK": 13,
                    "PRINT": 4,
                    "WHATSAPP": 14,
                    "NEWSLETTER": 5,
                    "FACEBOOK": 61,
                    "BLOG": 4,
                    "TWITCH": 6,
                    "TELEGRAM": 6,
                    "YOUTUBE": 26,
                    "PODCAST": 4,
                    "CUSTOM_ANSWERS": 5,
                    "WEBSITE": 50,
                    "TV": 17
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "INVESTIGACI\u00d3N": 13,
                    "EMERGENCIAS": 31,
                    "MEDIO AMBIENTE": 27,
                    "SOCIAL": 38,
                    "SEGURIDAD": 19,
                    "ECONOM\u00cdA": 22,
                    "DERECHOS": 20,
                    "GOBIERNO": 28,
                    "SERVICIOS": 22,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Biob\u00edo",
                    "CRIMEN ORGANIZADO": 1,
                    "NO RECIBE": 23,
                    "JUDICIAL": 4,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 5,
                    "AMENAZAS DIRECTAS": 5,
                    "NO RESPONDE": 3,
                    "ECON\u00d3MICAS": 5,
                    "AMENAZAS DIGITALES": 11,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -73.961427,
                    "miny": -38.492298,
                    "maxx": -70.983273,
                    "maxy": -36.445482
                },
                "CENTROID": {
                    "xc": -72.395276,
                    "yc": -37.499344
                }
            },

        "semidesierto-mas-poblado" : "Alto Hospicio",
        "semidesierto-mas-poblado-parent" : "Tarapacá",
        "semidesierto-mas-poblado-population" : "142.086",
        "semidesierto-mas-poblado-data" : {
                "BASIC_INFO": {
                    "KEY": "Alto-Hospicio__Tarapaca__chile",
                    "LEVEL": "smaller_unit",
                    "COUNTRY": "chile",
                    "NAME": "Alto Hospicio",
                    "PARENT": "Tarapac\u00e1",
                    "POPULATION": 142086.0,
                    "AREA": 573.0,
                    "NEWS_ORG_COUNT": 7.0,
                    "JOURNALIST_COUNT": 13.0,
                    "RATIO_POP_NEWS_ORG": 20298.0,
                    "RATIO_POP_JOURNALISTS": 10929.7,
                    "RATIO_AREA_JOURNALIST": 44.1,
                    "RATIO_JOURNALISTS_NEWS_ORG": 1.9,
                    "CLASSIFICATION": "SEMIDESIERTO"
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "small_unit": "Alto Hospicio",
                    "CONTRATO INDEFINIDO": 1,
                    "OTRAS": 0,
                    "TRABAJO INDEPENDIENTE": 3,
                    "PRACTICA PROFESIONAL": 0,
                    "CONTRATO LIMITADO": 0,
                    "CONTRATO POR PIEZAS": 0,
                    "EMPLEO INFORMAL": 0,
                    "COMISI\u00d3N": 1,
                    "TRABAJO VOLUNTARIO": 1,
                    "CUSTOM_ANSWERS": 1
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "small_unit": "Alto Hospicio",
                    "RADIO": 1,
                    "REVISTA": 0,
                    "X": 1,
                    "INSTAGRAM": 1,
                    "TIKTOK": 1,
                    "PRINT": 0,
                    "WHATSAPP": 1,
                    "NEWSLETTER": 0,
                    "FACEBOOK": 2,
                    "BLOG": 0,
                    "TWITCH": 0,
                    "TELEGRAM": 0,
                    "YOUTUBE": 1,
                    "PODCAST": 0,
                    "CUSTOM_ANSWERS": 1,
                    "WEBSITE": 6,
                    "TV": 1
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "small_unit": "Alto Hospicio",
                    "INVESTIGACI\u00d3N": 2,
                    "EMERGENCIAS": 2,
                    "MEDIO AMBIENTE": 3,
                    "SOCIAL": 7,
                    "SEGURIDAD": 4,
                    "ECONOM\u00cdA": 4,
                    "DERECHOS": 2,
                    "GOBIERNO": 5,
                    "SERVICIOS": 5,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "small_unit": "Alto Hospicio",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 5,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 0,
                    "AMENAZAS DIRECTAS": 0,
                    "NO RESPONDE": 2,
                    "ECON\u00d3MICAS": 0,
                    "AMENAZAS DIGITALES": 0,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -70.124381,
                    "miny": -20.351211,
                    "maxx": -69.890697,
                    "maxy": -20.049426
                },
                "CENTROID": {
                    "xc": -70.011161,
                    "yc": -20.1898
                }
            },
        "semidesierto-mas-poblado-parent-data" : {
                "BASIC_INFO": {
                    "KEY": "Tarapaca__chile",
                    "LEVEL": "larger_unit",
                    "COUNTRY": "chile",
                    "NAME": "Tarapac\u00e1",
                    "PARENT": "chile",
                    "POPULATION": 369806.0,
                    "AREA": 42226.0,
                    "NEWS_ORG_COUNT": 48.0,
                    "JOURNALIST_COUNT": 183.0,
                    "RATIO_POP_NEWS_ORG": 7704.3,
                    "RATIO_POP_JOURNALISTS": 2020.8,
                    "RATIO_AREA_JOURNALIST": 230.7,
                    "RATIO_JOURNALISTS_NEWS_ORG": 3.8,
                    "CLASSIFICATION_COUNTS": {
                        "DESIERTO": 2,
                        "SEMIDESIERTO": 3,
                        "SEMIBOSQUE": 1,
                        "BOSQUE": 1,
                        "SIN DATOS": 0
                    }
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "CONTRATO INDEFINIDO": 20,
                    "OTRAS": 4,
                    "TRABAJO INDEPENDIENTE": 14,
                    "PRACTICA PROFESIONAL": 2,
                    "CONTRATO LIMITADO": 4,
                    "CONTRATO POR PIEZAS": 3,
                    "EMPLEO INFORMAL": 2,
                    "COMISI\u00d3N": 6,
                    "TRABAJO VOLUNTARIO": 10,
                    "CUSTOM_ANSWERS": 4
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "RADIO": 18,
                    "REVISTA": 1,
                    "X": 17,
                    "INSTAGRAM": 16,
                    "TIKTOK": 6,
                    "PRINT": 4,
                    "WHATSAPP": 4,
                    "NEWSLETTER": 0,
                    "FACEBOOK": 27,
                    "BLOG": 1,
                    "TWITCH": 0,
                    "TELEGRAM": 0,
                    "YOUTUBE": 16,
                    "PODCAST": 1,
                    "CUSTOM_ANSWERS": 3,
                    "WEBSITE": 36,
                    "TV": 5
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "INVESTIGACI\u00d3N": 9,
                    "EMERGENCIAS": 23,
                    "MEDIO AMBIENTE": 16,
                    "SOCIAL": 42,
                    "SEGURIDAD": 28,
                    "ECONOM\u00cdA": 35,
                    "DERECHOS": 15,
                    "GOBIERNO": 33,
                    "SERVICIOS": 26,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Tarapac\u00e1",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 41,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 0,
                    "AMENAZAS DIRECTAS": 0,
                    "NO RESPONDE": 5,
                    "ECON\u00d3MICAS": 0,
                    "AMENAZAS DIGITALES": 2,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -70.285444,
                    "miny": -21.630212,
                    "maxx": -68.404871,
                    "maxy": -18.936666
                },
                "CENTROID": {
                    "xc": -69.393302,
                    "yc": -20.215749
                },
                "NARRATIVE": {
                    "TITLE": "Iquique es un bosque digital rodeado de sequ\u00eda informativa",
                    "MEDIO": "<p class=\"medio\">El medio m\u00e1s com\u00fan en la regi\u00f3n de Tarapac\u00e1 es un sitio web o una radio, emplea entre 3 y 4 periodistas, con una menor proporci\u00f3n de mujeres (s\u00f3lo un tercio del total), y el v\u00ednculo laboral m\u00e1s com\u00fan es el contrato indefinido. Entre el 80-100% de su contenido responde a temas de inter\u00e9s local. Su financiamiento proviene principalmente de contenido patrocinado/publireportajes, financiaci\u00f3n p\u00fablica y creaci\u00f3n de contenidos para clientes. Los temas m\u00e1s recurrentes en su agenda informativa est\u00e1n relacionados con asuntos sociales y calidad de vida; econom\u00eda y desarrollo local; gobierno y pol\u00edtica local; y seguridad y convivencia. Su propiedad es predominantemente privada y la mayor\u00eda publica informaci\u00f3n de manera diaria con actualizaciones en tiempo real. El medio tiene 18 a\u00f1os de antig\u00fcedad promedio.</p>",
                    "DATE": "07/04/2025",
                    "AUTHOR": "Indalicia Lagos Rojas",
                    "TEASER": "<p class=\"teaser\">La Regi\u00f3n de Tarapac\u00e1 se ubica en el extremo norte del pa\u00eds y en ella se contabilizaron 369.806 habitantes en el Censo de 2024. Su divisi\u00f3n pol\u00edtica contempla 2 provincias y 7 comunas. Existe una gran diversidad cultural, marcada por pueblos originarios (aymaras  y quechuas) y extranjeros (de India, Pakist\u00e1n, China e Ir\u00e1n, entre otros), vinculados a la actividad comercial de la Zona Franca de Iquique. La regi\u00f3n cuenta con tres universidades y tres centros de formaci\u00f3n t\u00e9cnica.</p>",
                    "RELATO": "<p class=\"relato\">La Regi\u00f3n de Tarapac\u00e1 se ubica en el extremo norte del pa\u00eds y en ella se contabilizaron 369.806 habitantes en el Censo de 2024. Su divisi\u00f3n pol\u00edtica contempla 2 provincias y 7 comunas. Existe una gran diversidad cultural, marcada por pueblos originarios (aymaras  y quechuas) y extranjeros (de India, Pakist\u00e1n, China e Ir\u00e1n, entre otros), vinculados a la actividad comercial de la Zona Franca de Iquique. La regi\u00f3n cuenta con tres universidades y tres centros de formaci\u00f3n t\u00e9cnica. \n</p>\n\n<p class=\"relato\">Tarapac\u00e1 es la \u00fanica regi\u00f3n del pa\u00eds donde los medios nativos digitales contabilizados para este estudio tienen una presencia similar a la de la radio. A ellos se suman las plataformas web que tienen los medios impresos y audiovisuales como segundo soporte informativo, amplificado por el uso de redes sociales.</p>\n\n<p class=\"relato\">En total se identificaron 48 medios y se contabilizaron 183 periodistas, es decir es un ecosistema donde en promedio hay 3,8 periodistas por medio. De \u00e9stos, s\u00f3lo un tercio son mujeres. En su mayor\u00eda los comunicadores cuentan con contrato indefinido o trabajan de manera independiente.</p>\n\n<p class=\"relato\">Los medios en general son de propiedad privada, con ingresos por contenido patrocinado o publireportajes y creaci\u00f3n de contenido para clientes. Tambi\u00e9n hay medios con una fuerte dependencia del financiamiento p\u00fablico, en parte por el Fondo de Medios del Ministerio Secretar\u00eda General de Gobierno. Si bien ning\u00fan medio se reconoce como estatal, uno pertenece a una universidad p\u00fablica \u2014y por lo tanto su presupuesto es p\u00fablico\u2014 y 9 declaran recibir el 90% y el 100% de financiamiento del Estado. Existe una alta dependencia de los medios respecto de contratos con empresas de sectores productivos como la miner\u00eda y Zona Franca, lo que en algunos casos los condiciona editorialmente.</p>\n\n<p class=\"relato\">La pauta informativa est\u00e1 dada por noticias locales, con un \u00e9nfasis en temas sociales y calidad de vida, la econom\u00eda y desarrollo local, gobierno y pol\u00edtica local. Tambi\u00e9n ocupan un lugar importante los temas de seguridad y convivencia, debido al aumento de delitos de alta connotaci\u00f3n p\u00fablica y a la ola migratoria que se inici\u00f3 durante la pandemia.</p>\n\n<p class=\"relato\">El ecosistema informativo de Tarapac\u00e1 presenta una alta concentraci\u00f3n de medios en Iquique, la capital regional (31 medios). Adem\u00e1s de sus propios medios, esa ciudad monopoliza la pauta informativa de otras comunas como Alto Hospicio, debido a que los servicios de gobierno y empresas se ubican all\u00ed.</p>\n\n<p class=\"relato\">Este escenario arroja una categorizaci\u00f3n con desigualdades respecto de la distribuci\u00f3n de medios en el territorio:</p>\n\n<ul class=\"relato\">\n  <li>2 (29%) comunas son desiertos informativos</li>\n  <li>3 (43%) comunas son semidesiertos</li>\n  <li>1 (14%) comuna es un semibosque</li>\n  <li>1 (14%) comuna es un bosque informativo</li>\n</ul>\n\n<p class=\"relato\">Durante el desarrollo de la investigaci\u00f3n, la mayor\u00eda de los medios accedi\u00f3 sin reparos a responder la encuesta, pero hubo un gran n\u00famero cuyos representantes no pudieron ser ubicados (por vacaciones y/o feriados). Como resultado, la informaci\u00f3n de 21 de los 48 medios analizados fue recolectada por la investigadora.</p>"
                }
            },

        "semibosque-mas-poblado" : "Arica",
        "semibosque-mas-poblado-parent" : "Arica y Parinacota",
        "semibosque-mas-poblado-population" : "241.653",
        "semibosque-mas-poblado-data" : {
                "BASIC_INFO": {
                    "KEY": "Arica__Arica-y-Parinacota__chile",
                    "LEVEL": "smaller_unit",
                    "COUNTRY": "chile",
                    "NAME": "Arica",
                    "PARENT": "Arica y Parinacota",
                    "POPULATION": 241653.0,
                    "AREA": 4799.0,
                    "NEWS_ORG_COUNT": 12.0,
                    "JOURNALIST_COUNT": 30.0,
                    "RATIO_POP_NEWS_ORG": 20137.8,
                    "RATIO_POP_JOURNALISTS": 8055.1,
                    "RATIO_AREA_JOURNALIST": 160.0,
                    "RATIO_JOURNALISTS_NEWS_ORG": 2.5,
                    "CLASSIFICATION": "SEMIBOSQUE"
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "small_unit": "Arica",
                    "CONTRATO INDEFINIDO": 4,
                    "OTRAS": 1,
                    "TRABAJO INDEPENDIENTE": 3,
                    "PRACTICA PROFESIONAL": 0,
                    "CONTRATO LIMITADO": 1,
                    "CONTRATO POR PIEZAS": 0,
                    "EMPLEO INFORMAL": 2,
                    "COMISI\u00d3N": 1,
                    "TRABAJO VOLUNTARIO": 0,
                    "CUSTOM_ANSWERS": 1
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "small_unit": "Arica",
                    "RADIO": 5,
                    "REVISTA": 0,
                    "X": 5,
                    "INSTAGRAM": 6,
                    "TIKTOK": 2,
                    "PRINT": 2,
                    "WHATSAPP": 1,
                    "NEWSLETTER": 2,
                    "FACEBOOK": 6,
                    "BLOG": 0,
                    "TWITCH": 1,
                    "TELEGRAM": 0,
                    "YOUTUBE": 7,
                    "PODCAST": 2,
                    "CUSTOM_ANSWERS": 2,
                    "WEBSITE": 8,
                    "TV": 1
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "small_unit": "Arica",
                    "INVESTIGACI\u00d3N": 4,
                    "EMERGENCIAS": 6,
                    "MEDIO AMBIENTE": 7,
                    "SOCIAL": 11,
                    "SEGURIDAD": 8,
                    "ECONOM\u00cdA": 9,
                    "DERECHOS": 8,
                    "GOBIERNO": 9,
                    "SERVICIOS": 8,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "small_unit": "Arica",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 6,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 1,
                    "AMENAZAS DIRECTAS": 0,
                    "NO RESPONDE": 3,
                    "ECON\u00d3MICAS": 1,
                    "AMENAZAS DIGITALES": 1,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -70.379125,
                    "miny": -18.903669,
                    "maxx": -69.490532,
                    "maxy": -18.04829
                },
                "CENTROID": {
                    "xc": -69.97372,
                    "yc": -18.532625
                }
            },
        "semibosque-mas-poblado-parent-data" : {
                "BASIC_INFO": {
                    "KEY": "Arica-y-Parinacota__chile",
                    "LEVEL": "larger_unit",
                    "COUNTRY": "chile",
                    "NAME": "Arica y Parinacota",
                    "PARENT": "chile",
                    "POPULATION": 244569.0,
                    "AREA": 16873.0,
                    "NEWS_ORG_COUNT": 13.0,
                    "JOURNALIST_COUNT": 31.0,
                    "RATIO_POP_NEWS_ORG": 18813.0,
                    "RATIO_POP_JOURNALISTS": 7889.3,
                    "RATIO_AREA_JOURNALIST": 544.3,
                    "RATIO_JOURNALISTS_NEWS_ORG": 2.4,
                    "CLASSIFICATION_COUNTS": {
                        "DESIERTO": 2,
                        "SEMIDESIERTO": 1,
                        "SEMIBOSQUE": 1,
                        "BOSQUE": 0,
                        "SIN DATOS": 0
                    }
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "CONTRATO INDEFINIDO": 4,
                    "OTRAS": 1,
                    "TRABAJO INDEPENDIENTE": 3,
                    "PRACTICA PROFESIONAL": 0,
                    "CONTRATO LIMITADO": 2,
                    "CONTRATO POR PIEZAS": 0,
                    "EMPLEO INFORMAL": 2,
                    "COMISI\u00d3N": 1,
                    "TRABAJO VOLUNTARIO": 0,
                    "CUSTOM_ANSWERS": 1
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "RADIO": 5,
                    "REVISTA": 0,
                    "X": 5,
                    "INSTAGRAM": 6,
                    "TIKTOK": 2,
                    "PRINT": 2,
                    "WHATSAPP": 1,
                    "NEWSLETTER": 2,
                    "FACEBOOK": 7,
                    "BLOG": 0,
                    "TWITCH": 1,
                    "TELEGRAM": 0,
                    "YOUTUBE": 7,
                    "PODCAST": 2,
                    "CUSTOM_ANSWERS": 2,
                    "WEBSITE": 8,
                    "TV": 1
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "INVESTIGACI\u00d3N": 4,
                    "EMERGENCIAS": 6,
                    "MEDIO AMBIENTE": 7,
                    "SOCIAL": 11,
                    "SEGURIDAD": 8,
                    "ECONOM\u00cdA": 9,
                    "DERECHOS": 8,
                    "GOBIERNO": 9,
                    "SERVICIOS": 9,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Arica y Parinacota",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 7,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 1,
                    "AMENAZAS DIRECTAS": 0,
                    "NO RESPONDE": 3,
                    "ECON\u00d3MICAS": 1,
                    "AMENAZAS DIGITALES": 1,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -70.379125,
                    "miny": -19.229342,
                    "maxx": -68.911655,
                    "maxy": -17.4984
                },
                "CENTROID": {
                    "xc": -69.628665,
                    "yc": -18.496977
                }
            },
            
        "bosque-mas-poblado" : "Antofagasta",
        "bosque-mas-poblado-parent" : "Antofagasta",
        "bosque-mas-poblado-population" : "401.096",
        "bosque-mas-poblado-data" : {
                "BASIC_INFO": {
                    "KEY": "Antofagasta__Antofagasta__chile",
                    "LEVEL": "smaller_unit",
                    "COUNTRY": "chile",
                    "NAME": "Antofagasta",
                    "PARENT": "Antofagasta",
                    "POPULATION": 401096.0,
                    "AREA": 30718.0,
                    "NEWS_ORG_COUNT": 18.0,
                    "JOURNALIST_COUNT": 81.0,
                    "RATIO_POP_NEWS_ORG": 22283.1,
                    "RATIO_POP_JOURNALISTS": 4951.8,
                    "RATIO_AREA_JOURNALIST": 379.2,
                    "RATIO_JOURNALISTS_NEWS_ORG": 4.5,
                    "CLASSIFICATION": "BOSQUE"
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "small_unit": "Antofagasta",
                    "CONTRATO INDEFINIDO": 8,
                    "OTRAS": 4,
                    "TRABAJO INDEPENDIENTE": 3,
                    "PRACTICA PROFESIONAL": 2,
                    "CONTRATO LIMITADO": 3,
                    "CONTRATO POR PIEZAS": 1,
                    "EMPLEO INFORMAL": 0,
                    "COMISI\u00d3N": 6,
                    "TRABAJO VOLUNTARIO": 4,
                    "CUSTOM_ANSWERS": 0
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "small_unit": "Antofagasta",
                    "RADIO": 5,
                    "REVISTA": 0,
                    "X": 11,
                    "INSTAGRAM": 13,
                    "TIKTOK": 6,
                    "PRINT": 2,
                    "WHATSAPP": 9,
                    "NEWSLETTER": 2,
                    "FACEBOOK": 13,
                    "BLOG": 2,
                    "TWITCH": 1,
                    "TELEGRAM": 2,
                    "YOUTUBE": 9,
                    "PODCAST": 6,
                    "CUSTOM_ANSWERS": 1,
                    "WEBSITE": 15,
                    "TV": 4
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "small_unit": "Antofagasta",
                    "INVESTIGACI\u00d3N": 14,
                    "EMERGENCIAS": 14,
                    "MEDIO AMBIENTE": 16,
                    "SOCIAL": 18,
                    "SEGURIDAD": 15,
                    "ECONOM\u00cdA": 15,
                    "DERECHOS": 13,
                    "GOBIERNO": 14,
                    "SERVICIOS": 13,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "small_unit": "Antofagasta",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 12,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 2,
                    "AMENAZAS DIRECTAS": 3,
                    "NO RESPONDE": 1,
                    "ECON\u00d3MICAS": 1,
                    "AMENAZAS DIGITALES": 2,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -70.628948,
                    "miny": -25.402962,
                    "maxx": -68.065038,
                    "maxy": -23.057928
                },
                "CENTROID": {
                    "xc": -69.405141,
                    "yc": -24.278257
                }
            },
        "bosque-mas-poblado-parent-data" : {
                "BASIC_INFO": {
                    "KEY": "Antofagasta__chile",
                    "LEVEL": "larger_unit",
                    "COUNTRY": "chile",
                    "NAME": "Antofagasta",
                    "PARENT": "chile",
                    "POPULATION": 607534.0,
                    "AREA": 126049.0,
                    "NEWS_ORG_COUNT": 31.0,
                    "JOURNALIST_COUNT": 115.0,
                    "RATIO_POP_NEWS_ORG": 19597.9,
                    "RATIO_POP_JOURNALISTS": 5282.9,
                    "RATIO_AREA_JOURNALIST": 1096.1,
                    "RATIO_JOURNALISTS_NEWS_ORG": 3.7,
                    "CLASSIFICATION_COUNTS": {
                        "DESIERTO": 5,
                        "SEMIDESIERTO": 1,
                        "SEMIBOSQUE": 2,
                        "BOSQUE": 1,
                        "SIN DATOS": 0
                    }
                },
                "HIRING": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "CONTRATO INDEFINIDO": 13,
                    "OTRAS": 7,
                    "TRABAJO INDEPENDIENTE": 3,
                    "PRACTICA PROFESIONAL": 3,
                    "CONTRATO LIMITADO": 5,
                    "CONTRATO POR PIEZAS": 2,
                    "EMPLEO INFORMAL": 3,
                    "COMISI\u00d3N": 7,
                    "TRABAJO VOLUNTARIO": 4,
                    "CUSTOM_ANSWERS": 0
                },
                "PLATFORMS": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "RADIO": 10,
                    "REVISTA": 0,
                    "X": 14,
                    "INSTAGRAM": 17,
                    "TIKTOK": 6,
                    "PRINT": 3,
                    "WHATSAPP": 12,
                    "NEWSLETTER": 3,
                    "FACEBOOK": 22,
                    "BLOG": 2,
                    "TWITCH": 1,
                    "TELEGRAM": 2,
                    "YOUTUBE": 14,
                    "PODCAST": 6,
                    "CUSTOM_ANSWERS": 1,
                    "WEBSITE": 25,
                    "TV": 6
                },
                "THEMES": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "INVESTIGACI\u00d3N": 16,
                    "EMERGENCIAS": 23,
                    "MEDIO AMBIENTE": 22,
                    "SOCIAL": 30,
                    "SEGURIDAD": 24,
                    "ECONOM\u00cdA": 20,
                    "DERECHOS": 16,
                    "GOBIERNO": 25,
                    "SERVICIOS": 19,
                    "CUSTOM_ANSWERS": 0
                },
                "THREATS": {
                    "country": "chile",
                    "large_unit": "Antofagasta",
                    "CRIMEN ORGANIZADO": 0,
                    "NO RECIBE": 16,
                    "JUDICIAL": 0,
                    "F\u00cdSICAS": 0,
                    "GOBIERNO": 2,
                    "AMENAZAS DIRECTAS": 3,
                    "NO RESPONDE": 1,
                    "ECON\u00d3MICAS": 1,
                    "AMENAZAS DIGITALES": 4,
                    "CUSTOM_ANSWERS": 0
                },
                "BBOX": {
                    "minx": -70.739923,
                    "miny": -26.061554,
                    "maxx": -66.990178,
                    "maxy": -20.934545
                },
                "CENTROID": {
                    "xc": -69.119672,
                    "yc": -23.536137
                }
            },


    }

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