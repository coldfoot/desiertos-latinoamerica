const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");
const expand_button_mobile = document.querySelector(".expand-card-mobile");
const text_panel = document.querySelector(".text-panel-container");
const container_relato = document.querySelector(".container-relato");
const relato = document.querySelector("[data-relato-completo]")

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

    const div_tipo_paisage = e.target.closest('.menu-tipo-paisage > div[data-tipo-paisage]');

    if (div_tipo_paisage) {

        const tipo_paisage = div_tipo_paisage.dataset.tipoPaisage; 

        // remove selected class to current "selected" element
        menu_tipo_paisage.querySelector(".tipo-paisage-selected").classList.remove("tipo-paisage-selected");

        // adds the selected class to the clicked div
        div_tipo_paisage.classList.add("tipo-paisage-selected");

        display_paisage(tipo_paisage);

    }

})

menu_pais.addEventListener("click", e => {

    const div_pais = e.target.closest('.menu-pais-dash > div[data-pais]');

    if (div_pais) {
        
        const pais = div_pais.dataset.pais; 

        countries[pais].render_pais();

    }

})

menu_nav_conteudo.addEventListener("click", e => {

    let tipo_conteudo;

    if (e.target.tagName == "BUTTON") {

        tipo_conteudo = e.target.dataset.btnNav;

        console.log(tipo_conteudo);

        //switch_conteudo()

        // conteúdos

        document.querySelectorAll("[data-tipo-conteudo]").forEach(div => {

            div.classList.remove("conteudo-active");

        })

        document.querySelector(`[data-tipo-conteudo="${tipo_conteudo}"]`).classList.add("conteudo-active");

        // botoes

        document.querySelectorAll("[data-btn-nav]").forEach(div => {

            div.classList.remove("btn-nav-active");

        })

        document.querySelector(`[data-btn-nav="${tipo_conteudo}"]`).classList.add("btn-nav-active");

    }

})

expand_button_mobile.addEventListener("click", (e) => {

    text_panel.classList.toggle("expanded-mobile");

})

function display_paisage(tipo_paisage) {

    console.log(tipo_paisage);

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

function update_infocard(local, country, tipo) {

    if (tipo == "provincia" & country == "Chile") {

        const fields = ["TITLE", "DATE", "AUTHOR", "MEDIO"];

        const mini_data = main_data.larger_units.filter(d => d.NAME == local)[0];

        document.querySelector("[data-relato-completo]").dataset.relatoCompleto = mini_data.RELATO;

        fields.forEach(field => {

            const element = document.querySelector(`[data-relato-campo="${field}"]`);
            
            element.innerHTML = mini_data[field];

            if (field = "AUTHOR") {
                container_relato.classList.remove("expandido");
                container_relato.classList.add("recolhido");
            }

        })

    }

}

const btn_leer_mas = document.querySelector(".leer-mas");

btn_leer_mas.addEventListener("click", e => {

    relato.innerHTML = relato.dataset.relatoCompleto;
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

class Country {

    constructor(country_name, bbox_country, url_ut_maior, source_layer_ut_maior, url_ut_menor, source_layer_ut_menor) {

        this.country = country_name;
        this.bbox_country = bbox_country;
        this.ut_maior = new UTmaior(country_name, url_ut_maior, source_layer_ut_maior);
        this.ut_menor = new UTmenor(country_name, url_ut_menor, source_layer_ut_menor);

    }

    render_provincia(provincia) { // desnecessario o argumento, melhorar


        update_breadcrumbs('ut-maior', provincia);

        let bbox_provincia;

        if (last_provincia_location_data.bbox) {

            bbox_provincia = last_provincia_location_data.bbox;

        } else {

            if (this.country == "Chile") {

                const provincia_data = main_data.larger_units.filter(d => d.NAME == provincia)[0];
                console.log(provincia, provincia_data);

                bbox_provincia = [
                    provincia_data.bbox.minx, provincia_data.bbox.miny,
                    provincia_data.bbox.maxx, provincia_data.bbox.maxy
                ]; 

            } else {
                        
                bbox_provincia = [
                    last_provincia_location_data.xmin, last_provincia_location_data.ymin,
                    last_provincia_location_data.xmax, last_provincia_location_data.ymax
                ]; 

            }

            last_provincia_location_data.bbox = bbox_provincia;

        }



        map.fitBounds(

            bbox_provincia, 

            {
                linear : false, // false means the map transitions using map.flyTo()
                speed: 1, 
                padding: {top: 80, bottom: 100, left: 30, right: 30},
            }
        );

        this.ut_menor.toggle_borders("on");
        this.ut_maior.toggle_hightlight_border(provincia);
        this.ut_menor.toggle_highlight('');

        this.ut_maior.monitor_events("off");
        this.ut_menor.monitor_events("on");

        update_infocard(provincia, this.country, "provincia");

    }

    render_localidad(localidad) { // desnecessario o argumento, melhorar

        let bbox_provincia;

        if (this.country == "Argentina") {

            bbox_provincia = [
                last_localidad_location_data.xmin, last_localidad_location_data.ymin,
                last_localidad_location_data.xmax, last_localidad_location_data.ymax
            ];

        } else {

            const provincia_data = main_data.larger_units.filter(d => d.NAME == last_localidad_location_data[this.ut_menor.key_parent])[0];
    
            console.log(provincia_data);

            bbox_provincia = [
                provincia_data.bbox.minx, provincia_data.bbox.miny,
                provincia_data.bbox.maxx, provincia_data.bbox.maxy
            ]; 

        }

        map.fitBounds(

            bbox_provincia, 

            {
                linear : false, // false means the map transitions using map.flyTo()
                speed: 1, 
                padding: {top: 80, bottom: 100, left: 30, right: 30},
            }
        );

        // no caso de o usuário clicar numa localidade de outra provincia!
        if (last_localidad_location_data[this.ut_menor.key_parent] != last_provincia_location_data[this.ut_maior.key_name]) {
            // updates a provincia

            const provincia_features = map.queryRenderedFeatures(
                { 
                    layers: [this.country + '-provincia'], 
                    filter : [
                        '==',
                        ['get', this.ut_maior.key_name],
                        last_localidad_location_data[this.ut_menor.key_parent]
                    ] 
                }
            );

            last_provincia_location_data = provincia_features[0].properties;
            last_provincia_location_data.bbox = bbox_provincia;
            console.log(last_provincia_location_data.bbox);

            update_breadcrumbs('ut-maior', last_localidad_location_data[this.ut_menor.key_parent]);


        }

        update_breadcrumbs('ut-menor', localidad);

        this.ut_menor.toggle_borders("on");
        this.ut_maior.toggle_hightlight_border(last_provincia_location_data[this.ut_maior.key_name]);

        this.ut_menor.toggle_highlight(localidad);

        //this.ut_maior.monitor_events("off");
        //this.ut_menor.monitor_events("on");

        update_infocard(localidad);

    }

    render_country_subnational() {

        map.setPaintProperty("countries-fills", "fill-color", "transparent");
        map.moveLayer(this.country + "-provincia-border-hover");
        map.moveLayer(this.country + "-provincia-border");

        if (["Argentina", "Chile"].includes(this.country)) {

            this.paint_country_subnational("on");

            this.ut_maior.monitor_events("on");
            this.ut_maior.toggle_hover_border(); // será que não teria que estar junto com o monitor_events do ut_maior
            this.ut_menor.monitor_events("off");
            this.ut_menor.toggle_borders("off");
            this.ut_maior.toggle_hightlight_border('');
            this.ut_menor.toggle_highlight('');


        } else {

            console.log("No data yet.")

            this.ut_maior.monitor_events("off");

        }

    }

    paint_country_subnational(mode) {

        if (mode == "on") {

            if (this.country == "Argentina") {

                map.setPaintProperty(
                    this.country + '-localidad',
                    'fill-color', 
                    ['get', 'color_real']
                );

                converte_cores_argentina();

            } else {

                map.setPaintProperty(
                    this.country + '-localidad',
                    'fill-color',
                    [
                        'match',
                        ['get', 'CLASSIFICATION'],
                        ...Object.keys(colors_css).flatMap(key => [key.toUpperCase(), colors_css[key]]),
                        'gray'
                    ]
                );

            }

        } else {

            map.setPaintProperty(
                this.country + '-localidad',
                'fill-color', 
                'transparent'
            );

            map.setPaintProperty(
                this.country + '-provincia-border',
                'line-color',
                'transparent'
            );

            map.setPaintProperty(
                this.country + '-provincia-border-hover',
                'line-color',
                'transparent'
            );

        }

    }

    clear_country_subnational() {

        console.log(this.country + ' to clear')

        this.paint_country_subnational("off");

        this.ut_menor.toggle_borders("off");
        this.ut_maior.toggle_hightlight_border('');
        this.ut_menor.toggle_highlight('');
        this.ut_menor.monitor_events("off");

        this.ut_maior.monitor_events("off");

    }

    render_pais() {

        const pais = this.country;

        plot_country(pais, 50);
        update_breadcrumbs("pais", pais);
        update_infocard(pais);
        update_country_button(pais);

        console.log("Render pais, ", pais, this.country, last_country);
        this.render_country_subnational(pais); // os eventos do subnacional estao aqui dentro
        countries_events.monitor_events('off'); // desliga monitor de eventos no nível de país

        console.log( (pais != last_country) & (last_country != undefined), (pais != last_country), last_country, pais);

        // troca de país
        if ( (pais != last_country) & (last_country != undefined) ) {

            console.log("Clear");
            countries[last_country].clear_country_subnational();


        }

        last_country = pais;

    }
}

class UTmaior {

    country;

    hoveredStateId;
    popup;

    constructor(country, url, source_layer_name) {

        this.country = country;
        this.source_layer_name = source_layer_name;

        if (this.country == "Argentina") {

            this.key_id = 'nam';
            this.key_name = 'local';

        } else {

            this.key_id = 'KEY';
            this.key_name = 'NAME';

        }

        this.load(country, url, source_layer_name);

        this.hoveredStateId = null;

        this.popup = new mapboxgl.Popup(
            {
                closeButton: false,
                loseOnClick: false
            }
        );

    }

    load(country, url, source_layer_name) {

        map.addSource(country + '-provincia', {
            type: 'vector',
            url : url,
            'promoteId' : this.key_id
        });

        map.addLayer({
            'id': country + '-provincia',
            'type': 'fill',
            'source': country + '-provincia',
            'source-layer': source_layer_name, // isso vai estar hardcoded no mapbox
            'layout': {},
            'paint': {
                'fill-color': 'transparent',
                'fill-opacity': [
                'case',
                [
                    'boolean', 
                    ['feature-state', 'hover'], 
                    false
                ],
                .1,
                0
            ]
            }
        }); 

        map.addLayer({
            'id': country + '-provincia-border-hover',
            'type': 'line',
            'source': country + '-provincia',
            'source-layer': source_layer_name,
            'layout': {},
            'paint': {
                'line-color': 'transparent',
                'line-width': [
                'case',
                [
                    'boolean', 
                    ['feature-state', 'hover'], 
                    false
                ],
                4,
                1
            ]
            }
        }); 

        map.addLayer({
            'id': country + '-provincia-border',
            'type': 'line',
            'source': country + '-provincia',
            'source-layer': source_layer_name,
            'layout': {},
            'paint': {
                'line-color': 'black',
                'line-width': 6
            },
            'filter': ['==', 'provincia', '']}); // puts behind road-label

    }

    toggle_hightlight_border(provincia) {

        console.log(provincia);

        map.setFilter(
            this.country + '-provincia-border', [
                '==',
                ['get', this.key_name],
                provincia
            ]
        );

    }

    toggle_hover_border() {

        map.setPaintProperty(
            this.country + '-provincia-border-hover',
            'line-color',
            '#666'
        );

    }

    mouse_enter_handler(e) {

        // pop up
        let coordinates = [
            e.features[0].properties.xc,
            e.features[0].properties.yc
        ]; 

        let name = e.features[0].properties[this.key_name];

        this.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        // precisa desse if aqui para fazer tirar o estado de hover da provincia anterior quando passa para outra provincia

        if (this.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: this.country + '-provincia',
                    sourceLayer: this.source_layer_name,
                    id: this.hoveredStateId
                },

                { hover : false }
            )

        }

        this.hoveredStateId = e.features[0].properties[this.key_name];

        map.setFeatureState(
            { 
                source: this.country + '-provincia',
                sourceLayer: this.source_layer_name,
                id: this.hoveredStateId
            },

            { hover : true }
        )

        //console.log('Hover no ', hoveredStateId)

        // algo mais a fazer aqui

    }

    mouse_leave_handler() {

        this.popup.remove();

        if (this.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: this.country + '-provincia', 
                    sourceLayer: this.source_layer_name,
                    id: this.hoveredStateId 
                },

                { hover: false }
            );
        }
    
        this.hoveredStateId = null;
    }

    click_event_handler(e) {

        const province_name = e.features[0].properties[this.key_name];

        last_provincia_location_data = e.features[0].properties;

        console.log(last_provincia_location_data);

        /* Para evitar re-renderizar quando clica na mesma província
        if (province_name != current_place[this.key_parent]) {

            const local = {

                local : province_name,
                tipo  : "provincia",
                text  : province_name

            };
        */

        // clears hover featureState
        // o id da da provincia é o nam. Só ver o 'promoteId' no addSource lá em cima.
        map.setFeatureState(
            { 
                source: this.country + '-provincia',
                sourceLayer: this.source_layer_name,
                id: province_name
            },

            { hover : false }
        );

        countries[this.country].render_provincia(province_name);

    }

    monitor_events(option) {

        // Bind handlers once and reuse them for on/off
        if (!this._bound_mouse_enter_handler) {
            this._bound_mouse_enter_handler = this.mouse_enter_handler.bind(this);
            this._bound_mouse_leave_handler = this.mouse_leave_handler.bind(this);
            this._bound_click_handler = this.click_event_handler.bind(this);
        }

        if (option == 'on') {

            if (this.hoveredStateId) {

                map.setFeatureState(
                    { 
                        source: this.country + '-provincia',
                        sourceLayer: this.source_layer_name,
                        id: this.hoveredStateId 
                    },

                    { hover: false }
                );
            }

            map.on('mousemove', this.country + '-provincia', this._bound_mouse_enter_handler);

            map.on('mouseleave', this.country + '-provincia', this._bound_mouse_leave_handler);

            map.on('click', this.country + '-provincia', this._bound_click_handler);

        } else {

            map.off('mousemove', this.country + '-provincia', this._bound_mouse_enter_handler);

            map.off('mouseleave', this.country + '-provincia', this._bound_mouse_leave_handler);

            map.off('click', this.country + '-provincia', this._bound_click_handler);

        }

    }

}

class UTmenor {

    country;

    hoveredStateId;
    popup;

    constructor(country, url, source_layer_name) {

        this.country = country;
        this.source_layer_name = source_layer_name;

        if (this.country == "Argentina") {

            this.key_id = 'randId';
            this.key_name = 'nam';
            this.key_parent = 'provincia'

        } else {

            this.key_id = 'KEY';
            this.key_name = 'NAME';
            this.key_parent = 'PARENT';

        }

        this.load(country, url, source_layer_name);

        this.hoveredStateId = null;

        this.popup = new mapboxgl.Popup(
            {
                closeButton: false,
                loseOnClick: false
            }
        );

    }

    load(country, url, source_layer_name) {

        map.addSource(country + '-localidad', {
            type: 'vector',
            url : url,
            'promoteId' : this.key_id
        });

        map.addLayer({
            'id': country + '-localidad',
            'type': 'fill',
            'source': country + '-localidad',
            'source-layer': source_layer_name,
            'layout': {},
            'paint': {
                'fill-color': 'transparent',
                'fill-outline-color' : 'transparent',
                'fill-opacity': [
                'case',
                [
                    'boolean', 
                    ['feature-state', 'hover'], 
                    false
                ],
                1,
                .8
                ]
            }
        }); 

        map.addLayer({
            'id': country + '-localidad-border-hover',
            'type': 'line',
            'source': country + '-localidad',
            'source-layer': source_layer_name,
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

        map.addLayer({
            'id': country + '-localidad-border',
            'type': 'line',
            'source': country + '-localidad',
            'source-layer': source_layer_name,
            'layout': {},
            'paint': {
                'line-color': '#666',
                'line-width': 0,
            }
        }); 

        map.addLayer({
            'id': country + '-localidad-highlight',
            'type': 'line',
            'source': country + '-localidad',
            'source-layer': source_layer_name,
            'layout': {},
            'paint': {
                'line-color': 'black',
                'line-width': 3,
            }, 'filter': ['==', this.key_id, '']
        }); 

    }

    toggle_highlight(localidad) {

        // desnecessário isso aqui, melhorar.
        let local;

        if (localidad == '') local = localidad;
        else local = last_localidad_location_data[this.key_id];

        map.setFilter(
            this.country + '-localidad-highlight', [
                '==',
                ['get', this.key_id],
                local
            ]
        );

        map.setPaintProperty(
            
            this.country + '-localidad', 
            'fill-opacity',
            [
                'case',
                [
                    '==',
                    ['get', this.key_id],
                    local
                ],
                1,
                .8
            ]
        );

    }

    toggle_borders(option) {

        // option: on/off

        map.setPaintProperty(
            this.country + '-localidad-border', 
            'line-width', option == 'on' ? 1 : 0
            // [
            //     'case', [
            //         'boolean', 
            //         ['feature-state', 'hover'], 
            //         false
            //     ], 
            //     option == 'on' ? 2 : 0,
            //     option == 'on' ? 1 : 0
            // ]
        );

    }

    /*
    color_map_category : function(category) {

        if (category != '') {

            const cat = dash.utils.get_numeric_category_from_name(category);

            dash.map_obj.setPaintProperty(
                'localidad', 'fill-color',
                [
                    'case',
                    [
                        '==',
                        ['get', 'categoria'],
                        cat
                    ],
                    ['get', 'color_real'],
                    '#f0e9df'
                ]
            );

        } else {

            dash.map_obj.setPaintProperty(
                'localidad', 'fill-color', ['get', 'color_real']
            );

        }

    },*/


    mouse_enter_handler(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        //console.log(e);
            
        let coordinates = [
            e.features[0].properties.xc,
            e.features[0].properties.yc
        ]; //e.features[0].geometry.coordinates.slice();

        let name = e.features[0].properties[this.key_name];

        //console.log('mouse enter fired ', coordinates, name);
            
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.

        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }
            
        // Populate the popup and set its coordinates
        // based on the feature found.
        this.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        ////////////
        // highlight polygon

        if (this.hoveredStateId !== null) {

            map.setFeatureState(
                { 
                    source: this.country + '-localidad',
                    sourceLayer: 'localidad',
                    id: this.hoveredStateId
                },

                { hover : false }
            )


        }

        this.hoveredStateId = e.features[0].properties[this.key_id];

        map.setFeatureState(
            { 
                source: this.country + '-localidad',
                sourceLayer: 'localidad',
                id: this.hoveredStateId
            },

            { hover : true }
        )
    }

    mouse_leave_handler() {

        map.getCanvas().style.cursor = '';
        this.popup.remove();

        //console.log('fired mouse leave!!!!!!!', dash.map.localidad.hoveredStateId);

        // return circle to normal sizing and color
        if (this.hoveredStateId !== null) {
            map.setFeatureState(
                { 
                    source: this.country + '-localidad', 
                    sourceLayer: 'localidad', 
                    id: this.hoveredStateId 
                },

                { hover: false }
            );
        }
    
        this.hoveredStateId = null;

    }

    monitor_events(option) {

        // Bind handlers once and reuse them for on/off
        // Otherwise I couldn't use the `this` reference inside the handler functions, because if I 
        // use arrow functions in the .on, .off handlers, JS will create a new function each time
        // I would not be able to turn the event listener off.
        //
        // Since all properties that reference the handlers are created together, I just need to check one of them.
        // the .bind(this) sorta passes the `this` object (that refers to the class instance object) to the event handler function
        if (!this._bound_mouse_enter_handler) {
            this._bound_mouse_enter_handler = this.mouse_enter_handler.bind(this);
            this._bound_mouse_leave_handler = this.mouse_leave_handler.bind(this);
            this._bound_click_handler = this.click_event_handler.bind(this);
        }

        // to avoid duplicating the listeners;
        if (this.last_option == option) return;

        this.last_option = option;

        if (option == 'on') {

            console.log("Turning on MONITORING for LOCALIDADS in " + this.country);

            this.hoveredStateId = null;

            map.on('mousemove', this.country + '-localidad', this._bound_mouse_enter_handler);

            map.on('mouseleave', this.country + '-localidad', this._bound_mouse_leave_handler);

            map.on('click', this.country + '-localidad', this._bound_click_handler);

        } else {

            console.log("Turning off MONITORING for LOCALIDAS events in " + this.country)

            map.off('mousemove', this.country + '-localidad', this._bound_mouse_enter_handler);

            map.off('mouseleave', this.country + '-localidad', this._bound_mouse_leave_handler);

            map.off('click', this.country + '-localidad', this._bound_click_handler);

            this.hoveredStateId = null;

        }

    }
    click_event_handler(e) {


        //const localidad = e.features[0].properties.local; //feature.properties.local;
        const localidad_name = e.features[0].properties[this.key_name];
        const provincia = e.features[0].properties[this.key_parent]; //feature.properties[this.key_parent];

        last_localidad_location_data = e.features[0].properties; // isso aqui provavelmente vai fazer todo o resto ser desnecessário

        console.log(last_localidad_location_data);

        const local = {

            //local : localidad,
            tipo  : "localidad",
            text  : localidad_name,
            provincia : provincia

        };

        //console.log("Clicou em ", localidad, local, dash.vis.location_card.state.user_location_province);

        // clears hover featureState
        // o id da localidad é o randId. Só ver o 'promoteId' no addSource lá em cima.

        const id = e.features[0].properties[this.key_id];

        map.setFeatureState(
            { 
                source: this.country + '-localidad',
                sourceLayer: 'localidad',
                id: id
            },

            { hover : false }
        );

        countries[this.country].render_localidad(last_localidad_location_data[this.key_name]);

    }

    sets_opacity_on_hover(option) {

        if (option == 'off') {

            dash.map_obj.setPaintProperty(this.country + '-localidad', 'fill-opacity', 1);

        } else {

            dash.map_obj.setPaintProperty(this.country + '-localidad', 'fill-opacity', [
                'case',
                [
                    'boolean', 
                    ['feature-state', 'hover'], 
                    false
                ],
                1,
                .8
                ])
        }

    }

}

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

