const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");
const expand_button_mobile = document.querySelector(".expand-card-mobile");
const text_panel = document.querySelector(".text-panel-container");
const container_relato = document.querySelector("[data-tipo-conteudo='relato']");
const relato = document.querySelector("[data-relato-completo]");
const header = document.querySelector("header");
const btn_menu = document.querySelector(".btn-menu");
const place_summary = document.querySelector(".place-summary");
const search_container = document.querySelector(".seleccione-ubicacion-container");

btn_menu.addEventListener("click", e => {

    const state = btn_menu.dataset.state;

    if (state == "burger") {

        btn_menu.dataset.state = "close menu";
        header.classList.add("show-menu");

    } else if (state == "close menu") {

        btn_menu.dataset.state = "burger";
        header.classList.remove("show-menu");

    }

})

const breadcrumbs = document.querySelector(".breadcrumbs");

const colors_css = {
    'desierto' : '',
    'semidesierto' : '',
    'semibosque' : '',
    'bosque' : ''
}

const colours = Object.keys(colors_css);

const cores_argentina = {
    "#D27B51" : "desierto",
    "#DAB28D" : "semidesierto",
    "#EEC471" : "semibosque",
    "#99A860" : "bosque"
}

function converte_cores_argentina() {
    map.setPaintProperty(
        "Argentina-localidad", 
        "fill-color", 
        [ "case",

            ["==", ["get", "color_real"], "#D27B51"], "#F6CEAB", //desierto
            ["==", ["get", "color_real"], "#DAB28D"], "#EEAE7F", //semidesierto 
            ["==", ["get", "color_real"], "#EEC471"], "#85A573", //semibosque 
            ["==", ["get", "color_real"], "#99A860"], "#688E50", //semibosque 
            
            "gray"
        ])
}

function populate_colors() {

    const root = document.documentElement;

    colours.forEach(colour => {

        colors_css[colour] = getComputedStyle(root).getPropertyValue(`--color-${colour}`).trim();

    })

}

let last_country;
let last_provincia_location_data;
let last_localidad_location_data;

populate_colors();

const current_place = {
    country : '',
    provincia : '',
    localidad : ''
}

// object that will hold the Country objects instances
let countries = {};

breadcrumbs.addEventListener("click", e => {

    const breadcrumb_clicado = e.target.closest('.breadcrumbs > span');

    const tipo = breadcrumb_clicado.dataset.breadcrumb;

    let provincia_id = last_country == "Argentina" ? 'nam' : 'NAME';

    if (tipo == "pais") countries[last_country].render_pais();
    if (tipo == "ut-maior") countries[last_country].render_provincia(last_provincia_location_data[provincia_id]);
    //if (tipo == "ut-menor") render_localidad(last_localidad_location_data[this.key_name]); // na verdade nao precisa fazer nada, já está no local

})

menu_tipo_paisage.addEventListener("click", e => {

    const tipo_paisage_selected = menu_tipo_paisage.querySelector(".tipo-paisage-selected");

    menu_tipo_paisage.classList.add("tipo-paisage-has-selection");

    const div_tipo_paisage = e.target.closest('.menu-tipo-paisage > div[data-tipo-paisage]');

    if (div_tipo_paisage) {

        const tipo_paisage = div_tipo_paisage.dataset.tipoPaisage; 

        if (div_tipo_paisage == tipo_paisage_selected) {

            display_paisage("", last_country);

            menu_tipo_paisage.classList.remove("tipo-paisage-has-selection");

            div_tipo_paisage.classList.remove("tipo-paisage-selected");

            return
            
        }

        // remove selected class to current "selected" element
        if (tipo_paisage_selected) tipo_paisage_selected.classList.remove("tipo-paisage-selected");

        // adds the selected class to the clicked div
        div_tipo_paisage.classList.add("tipo-paisage-selected");

        display_paisage(tipo_paisage, last_country);

    }

})

menu_pais.addEventListener("click", e => {

    const div_pais = e.target.closest('.menu-pais-dash > div[data-pais]');

    if (div_pais) {
        
        const pais = div_pais.dataset.pais; 

        countries[pais].render_pais();

    }

})

// NAV BUTTONS

function control_nav_buttons(modo) {

    const container_btns = document.querySelector(".wrapper-btns-nav");
    const btns = document.querySelectorAll("[data-btn-nav]");

    let btns_to_show;

    if (modo == "localidad") {

        container_btns.dataset.modo = "localidad";

        btns_to_show = ["resumen", "datos"];

        show_conteudo("resumen");
        activate_button("resumen");

    }

    if (modo == "provincia" | modo == "pais") {

        container_btns.dataset.modo = "provincia";

        btns_to_show = ["relato", "medio", "datos"];

        show_conteudo("medio");
        activate_button("medio");

    }

    btns.forEach(btn => {

        if (btns_to_show.includes(btn.dataset.btnNav)) btn.classList.remove("btn-hidden");
        else btn.classList.add("btn-hidden");

    })

}

function show_conteudo(tipo_conteudo) {

    if (tipo_conteudo == "relato") {
        container_relato.classList.remove("expandido");
        container_relato.classList.add("recolhido");

    }


    document.querySelectorAll("[data-tipo-conteudo]").forEach(div => {

        div.classList.remove("conteudo-active");

    })

    document.querySelector(`[data-tipo-conteudo="${tipo_conteudo}"]`).classList.add("conteudo-active");

}

function activate_button(tipo_conteudo) {

    document.querySelectorAll("[data-btn-nav]").forEach(div => {

        div.classList.remove("btn-nav-active");

    })

    document.querySelector(`[data-btn-nav="${tipo_conteudo}"]`).classList.add("btn-nav-active");

}

menu_nav_conteudo.addEventListener("click", e => {

    let tipo_conteudo;

    if (e.target.tagName == "BUTTON") {

        tipo_conteudo = e.target.dataset.btnNav;

        console.log(tipo_conteudo);

        //switch_conteudo()

        // conteúdos

        show_conteudo(tipo_conteudo);

        // botoes)

        activate_button(tipo_conteudo);

    }

})

expand_button_mobile.addEventListener("click", (e) => {

    text_panel.classList.toggle("expanded-mobile");

})

function display_paisage(tipo_paisage, country) {

    console.log(tipo_paisage);

    if (tipo_paisage != '') {

        map.setPaintProperty(
            country + '-localidad',
            'fill-color',
            [
                'case',
                [
                    '==',
                    ['get', 'CLASSIFICATION'],
                    tipo_paisage.toUpperCase()
                ],
                colors_css[tipo_paisage],
                'transparent'
            ]
        )

    } else {

        if (country == "Argentina") {

            map.setPaintProperty(
                country + '-localidad',
                'fill-color', 
                ['get', 'color_real']
            );

            converte_cores_argentina();

        } else {

            map.setPaintProperty(
                country + '-localidad',
                'fill-color',
                [
                    'match',
                    ['get', 'CLASSIFICATION'],
                    ...Object.keys(colors_css).flatMap(key => [key.toUpperCase(), colors_css[key]]),
                    'gray'
                ]
            );

        }

    }

}

function update_breadcrumbs(nivel, local) {

    const breadcrumbs = document.querySelector(".breadcrumbs");

    const bc_country = breadcrumbs.querySelector(".breadcrumb-country");
    const bc_ut_maior = breadcrumbs.querySelector(".breadcrumb-ut-maior");
    const bc_ut_menor = breadcrumbs.querySelector(".breadcrumb-ut-menor");

    if (nivel == "pais") {
        bc_ut_maior.classList.add("breadcrumb-inativo");
        bc_ut_menor.classList.add("breadcrumb-inativo");
        
        bc_country.textContent = local;
        //last_country = local;
    }

    if (nivel == "ut-maior") {
        bc_ut_maior.classList.remove("breadcrumb-inativo");
        bc_ut_menor.classList.add("breadcrumb-inativo");
        
        bc_ut_maior.textContent = local;
    }

    if (nivel == "ut-menor") {
        bc_ut_maior.classList.remove("breadcrumb-inativo");
        bc_ut_menor.classList.remove("breadcrumb-inativo");
        
        bc_ut_menor.textContent = local;
    }

}

function update_infocard(name, key, country, tipo) {

    console.log(name, key, country, tipo);

    document.querySelector("[data-infocard-field]").innerHTML = name;

    control_nav_buttons(tipo);

    if (tipo == "provincia" & country == "Chile") {

        const fields = ["TITLE", "DATE", "AUTHOR", "RELATO", "MEDIO"];

        const mini_data = main_data.larger_units.filter(d => d.NAME == name)[0];

        fields.forEach(field => {

            document.querySelector(`[data-relato-campo="${field}"]`).innerHTML = mini_data[field];

            if (field = "AUTHOR") {
                container_relato.classList.remove("expandido");
                container_relato.classList.add("recolhido");
            }

        })

        document.querySelector("[data-classification-localidad]").dataset.classificationLocalidad = "";

        const basic_info_data = mini_data.BASIC_INFO;

        update_place_summary(basic_info_data);

    }

    if (tipo == "localidad" & country == "Chile") {

        const existem_dados = main_data.smaller_units.filter(d => d.KEY == key).length > 0;

        let classification, basic_info_data;

        if (existem_dados) {

            basic_info_data = main_data.smaller_units.filter(d => d.KEY == key)[0].BASIC_INFO;
        
            classification = basic_info_data.classification;

            document.querySelector("[data-resumen-campo]").innerHTML = classification;
            
            document.querySelector("[data-classification-localidad]").dataset.classificationLocalidad = classification.toLowerCase();


        } else {

            basic_info_data = null;

            document.querySelector("[data-resumen-campo]").innerHTML = "SIN DATOS :(";
            
            document.querySelector("[data-classification-localidad]").dataset.classificationLocalidad = "sin datos";

        }

         update_place_summary(basic_info_data);

    }

}

function update_place_summary(basic_info_data) {

    if (basic_info_data == null) place_summary.classList.add("sin-datos")
        else place_summary.classList.remove("sin-datos");

    place_summary.querySelectorAll('[data-summary-field]').forEach(div => {

        const field = div.dataset.summaryField;

        div.querySelector(".summary-value").innerHTML = basic_info_data[field] == null ? 0 : basic_info_data[field].toLocaleString('pt-BR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true
        });



        
    })

}

const btn_leer_mas = document.querySelector(".leer-mas");

btn_leer_mas.addEventListener("click", e => {

    container_relato.classList.add("expandido");
    container_relato.classList.remove("recolhido");

})

function update_country_button(pais) {

    menu_pais.classList.add("pais-has-selection");

    const pais_ja_selecionado = menu_pais.querySelector(".pais-selected");

    // remove selected class to current "selected" element
    if (pais_ja_selecionado) pais_ja_selecionado.classList.remove("pais-selected");

    menu_pais.querySelector(`[data-pais="${pais}"]`).classList.add("pais-selected");

}

function populate_datalist(data) {

    const ref_datalist = search_container.querySelector("datalist");

    const localidads = data.smaller_units;
    const provincias = data.larger_units;

    provincias.forEach(row => {

        const new_option = document.createElement("option");

        const country = row.COUNTRY[0].toUpperCase() + row.COUNTRY.slice(1).toLowerCase();
        
        new_option.label = `${row.NAME} (${country})`
        //row.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        new_option.value = `${row.NAME} (${country})`
        new_option.dataset.tipoLocalidade = "provincia";
        new_option.dataset.key = row.KEY;
        new_option.dataset.country = country;

        ref_datalist.appendChild(new_option);

    })
    
    localidads.forEach(row => {

        const new_option = document.createElement("option");

        const country = row.COUNTRY[0].toUpperCase() + row.COUNTRY.slice(1).toLowerCase();
        
        new_option.label = `${row.NAME} (${row.PARENT}, ${country})`;
        //row.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        new_option.value = `${row.NAME} (${row.PARENT}, ${country})`;
        new_option.dataset.tipoLocalidade = "localidad";
        new_option.dataset.key = row.KEY;
        new_option.dataset.country = country;
        new_option.dataset.parent = row.PARENT;

        ref_datalist.appendChild(new_option);

    })

}

function monitor_search_bar(data) {

    const datalist = search_container.querySelector("datalist");
    const datalist_options = Array.from(datalist.options);

    const search_input = search_container.querySelector("input[list]");

    /*
    search_input.addEventListener("input", (e) => {
        // Fires on every keystroke, can be used for live filtering or suggestions
        // Optionally, you can handle "input" events here if needed
    });*/

    search_input.addEventListener("change", (e) => {
        // Fires when the user selects an option from the datalist or manually changes the value
        const value = e.target.value;

        const selectedOption = datalist_options.find(
            option => option.value === value
        );

        if (selectedOption) {
            const tipo = selectedOption.dataset.tipoLocalidade;
            const key = selectedOption.dataset.key;
            const country = selectedOption.dataset.country;
            console.log("Selected option:", selectedOption, "Tipo:", tipo, "Key:", key);

            console.log(value, selectedOption, key, tipo, country);

            last_country = country;

            update_country_button(country);
            update_breadcrumbs("pais", country);
            countries_events.monitor_events('off');
            map.setPaintProperty("countries-borders", "line-color", "transparent");
            map.setPaintProperty("countries-fills", "fill-color", "transparent");
            countries[country].paint_country_subnational("on");

            if (tipo == "localidad") {

                const parent = selectedOption.dataset.parent;

                last_localidad_location_data = data.smaller_units.filter(d => d.KEY == key)[0];
                last_provincia_location_data = data.larger_units.filter(d => d.NAME == parent)[0];

                console.log(last_localidad_location_data);

                // encapsular?

                update_breadcrumbs('ut-maior', parent);

                countries[country].render_localidad(last_localidad_location_data[
                countries[country].ut_menor.key_name]);
                countries[country].ut_menor.monitor_events("on");


            }

            if (tipo == "provincia") {

                last_provincia_location_data = data.larger_units.filter(d => d.KEY == key)[0];
                countries[country].render_provincia(last_provincia_location_data[countries[country].ut_maior.key_name]);

            }

        }
    });

}

class CountriesEvents {

    constructor() {

        this.popup = new mapboxgl.Popup(

            {
                closeButton: false,
                loseOnClick: false
            }
        );

        this.hoveredStateId = null;

    }

    mouse_enter_handler(e) {
        
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        
        /*
        let coordinates = [
            e.features[0].properties.xc,
            e.features[0].properties.yc
        ]; */

        const name = e.features[0].properties.country_name;

        let coordinates = [
            ( bboxes[name][0] + bboxes[name][2] ) / 2,
            ( bboxes[name][1] + bboxes[name][3] ) / 2
        ];

        this.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        ////////////
        // highlight polygon

        if (this.hoveredStateId !== null) {

            map.setFeatureState(
                { 
                    source: 'countries',
                    sourceLayer: 'data-blt69d', // countries-borders
                    id: this.hoveredStateId
                },

                { hover : false }
            )


        }

        this.hoveredStateId = e.features[0].properties.country_name;

        map.setFeatureState(
            { 
                source: 'countries',
                sourceLayer: 'data-blt69d', // countries-borders
                id: this.hoveredStateId
            },

            { hover : true }
        );
    }

    mouse_leave_handler(e) {

        map.getCanvas().style.cursor = '';
        this.popup.remove();

        //console.log('fired mouse leave!!!!!!!', dash.map.localidad.hoveredStateId);

        if (this.hoveredStateId !== null) {

            map.setFeatureState(
                { 
                    source: 'countries',
                    sourceLayer: 'data-blt69d', // countries-borders
                    id: this.hoveredStateId
                },

                { hover: false }
            );
        }

        this.hoveredStateId = null;

    }

    click_handler(e) {

        const country = e.features[0].properties.country_name;

        const local = {

            local : '',//localidad,
            tipo  : 'country',
            text  : '',//localidad_name,
            provincia : '',//provincia
            country: country

        };

        console.log(country);

        map.setFeatureState(
            { 
                source: 'countries',
                sourceLayer: 'data-blt69d', // countries-borders
                id: this.hoveredStateId
            },

            { hover : false }
        );


        countries[country].render_pais();


    }

    monitor_events(option) {

        // Bind handlers once and reuse them for on/off
        if (!this._bound_mouse_enter_handler) {
            this._bound_mouse_enter_handler = this.mouse_enter_handler.bind(this);
            this._bound_mouse_leave_handler = this.mouse_leave_handler.bind(this);
            this._bound_click_handler = this.click_handler.bind(this);
        }

        if (option == 'on') {

            console.log('MONITORING COUNTRY EVENTS');

            this.hoveredStateId = null;

            map.on('mousemove', 'countries-fills', this._bound_mouse_enter_handler);
            map.on('mouseleave', 'countries-fills', this._bound_mouse_leave_handler);
            map.on('click', 'countries-fills', this._bound_click_handler);

        } else {

            console.log('turning off COUNTRY event monitor');

            map.off('mousemove', 'countries-fills', this._bound_mouse_enter_handler);
            map.off('mouseleave', 'countries-fills', this._bound_mouse_leave_handler);
            map.off('click', 'countries-fills', this._bound_click_handler);

            this.hoveredStateId = null;

        }

    }

}

const countries_events = new CountriesEvents();

let main_data;

// main function
map.on("load", () => {

    fetch("../chile.json").then(response => response.json()).then(data => {

        main_data = data;

        map.addLayer({

            'id': 'countries-border-hover',
            'type': 'line',
            'source': 'countries',
            'source-layer' : 'data-blt69d',
            'layout': {},

            'paint': {

                'line-color': [
                'case',
                [
                    'boolean', 
                    ['feature-state', 'hover'], 
                    false
                ],
                '#212121',
                '#666'
            ],

                'line-width': [
                'case',
                [
                    'boolean', 
                    ['feature-state', 'hover'], 
                    false
                ],
                3,
                0
            ]
            }
        }); 

        countries["Argentina"] = new Country("Argentina", "", "mapbox://tiagombp.4fk72g1y", "provincia", "mapbox://tiagombp.d8u3a43g", "localidad");
        countries["Chile"]     = new Country("Chile", "", "mapbox://tiagombp.af5egui6", "larger-units-chile-ctx9m7", "mapbox://tiagombp.5gi1do4b", "smaller-units-chile-81ipdl")

        countries_events.monitor_events("on");

        populate_datalist(data);
        monitor_search_bar(data);
        
    })

})


// talvez definir uma classe, e criar uma instância para nível geográfico



const levels = {

    provincia : {
        
        url: 'mapbox://tiagombp.4fk72g1y',
        opacity_hover    : .1,
        opacity_normal   : 0,
        linewidth_hover  : 4,
        linewidth_normal : 1,

    },

    localidad : 'mapbox://tiagombp.d8u3a43g'

}

