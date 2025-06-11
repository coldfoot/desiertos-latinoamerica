const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");
const expand_button_mobile = document.querySelector(".expand-card-mobile");
const text_panel = document.querySelector(".text-panel-container");

const breadcrumbs = document.querySelector(".breadcrumbs");

const colors_css = {
    'desierto' : '',
    'semidesierto' : '',
    'semibosque' : '',
    'bosque' : ''
}

const colours = Object.keys(colors_css);

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

let argentina;

breadcrumbs.addEventListener("click", e => {

    const breadcrumb_clicado = e.target.closest('.breadcrumbs > span');

    const tipo = breadcrumb_clicado.dataset.breadcrumb;

    if (tipo == "pais") render_pais(last_country);
    if (tipo == "ut-maior") render_provincia_argentina(last_provincia_location_data.local);
    //if (tipo == "ut-menor") render_localidad_argentina(last_localidad_location_data.nam); // na verdade nao precisa fazer nada, já está no local

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

        render_pais(pais);

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
        last_country = local;
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

function update_infocard(local) {

    const fields = ['title'];

    const mini_data = {
        'title' : local
    };

    fields.forEach(field => {

        document.querySelector(`[data-infocard-field="${field}"`).textContent = mini_data[field];

    })

}

function update_country_button(pais) {

    menu_pais.classList.add("pais-has-selection");

    const pais_ja_selecionado = menu_pais.querySelector(".pais-selected");

    // remove selected class to current "selected" element
    if (pais_ja_selecionado) pais_ja_selecionado.classList.remove("pais-selected");

    menu_pais.querySelector(`[data-pais="${pais}"]`).classList.add("pais-selected");

}

class Country {

    popup;
    hoveredStateId;

    constructor(country_name, bbox_country, url_ut_maior, url_ut_menor) {

        this.country = country_name;
        this.bbox_country = bbox_country;
        this.ut_maior = new UTmaior(country_name, url_ut_maior);
        this.ut_menor = new UTmenor(country_name, url_ut_menor);

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

    mouse_leave_handler() {

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

        const pais = e.features[0].properties.country_name;

        map.setFeatureState(
            { 
                source: 'countries',
                sourceLayer: 'data-blt69d', // countries-borders
                id: this.hoveredStateId
            },

            { hover : false }
        );

        this.render_pais(pais)


    }

    monitor_events(option) {
        
        if (option == 'on') {

            console.log('MONITORING COUNTRY EVENTS');

            this.hoveredStateId = null;

            map.on('mousemove', 'countries-fills', e => this.mouse_enter_handler(e));
                    
            map.on('mouseleave', 'countries-fills', e => this.mouse_leave_handler(e));

            map.on('click', 'countries-fills', e => this.click_handler(e));


        } else {

            console.log('turning off COUNTRY event monitor');

            map.off('mousemove', 'countries-fills', e => this.mouse_enter_handler(e));
                    
            map.off('click', 'countries-fills', e => this.click_handler(e));

            this.hoveredStateId = null;
            
        }

    }

    render_provincia_argentina(provincia) { // desnecessario o argumento, melhorar


        update_breadcrumbs('ut-maior', provincia);

        const bbox_provincia = [
            last_provincia_location_data.xmin, last_provincia_location_data.ymin,
            last_provincia_location_data.xmax, last_provincia_location_data.ymax
        ];  

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

        update_infocard(provincia);

    }

    render_localidad_argentina(localidad) { // desnecessario o argumento, melhorar

        const bbox_localidad = [
            last_localidad_location_data.xmin, last_localidad_location_data.ymin,
            last_localidad_location_data.xmax, last_localidad_location_data.ymax
        ];  

        map.fitBounds(

            bbox_localidad, 

            {
                linear : false, // false means the map transitions using map.flyTo()
                speed: 1, 
                padding: {top: 80, bottom: 100, left: 30, right: 30},
            }
        );

        // no caso de o usuário clicar numa localidade de outra provincia!
        if (last_localidad_location_data.provincia != last_provincia_location_data.nam) {
            // updates a provincia
            const provincia_features = map.queryRenderedFeatures(
                { 
                    layers: ['provincia'], 
                    filter : [
                        '==',
                        ['get', 'nam'],
                        last_localidad_location_data.provincia
                    ] 
                }
            );

            last_provincia_location_data = provincia_features[0].properties;

            update_breadcrumbs('ut-maior', last_provincia_location_data.local);


        }

        update_breadcrumbs('ut-menor', localidad);

        this.ut_menor.toggle_borders("on");
        this.ut_maior.toggle_hightlight_border(last_provincia_location_data.local);

        this.ut_menor.toggle_highlight(localidad);

        //this.ut_maior.monitor_events("off");
        //this.ut_menor.monitor_events("on");

        update_infocard(localidad);

    }

    render_country_subnational() {

        if (this.country == "Argentina") {

            map.setPaintProperty(
                this.country + '-localidad',
                'fill-color', 
                ['get', 'color_real']
            );

            map.setPaintProperty(
                this.country + '-provincia-border-hover',
                'line-color',
                '#666'
            );

            this.ut_maior.monitor_events("on");
            this.ut_menor.monitor_events("off");

            this.ut_menor.toggle_borders("off");
            this.ut_maior.toggle_hightlight_border('');
            this.ut_menor.toggle_highlight('');


        } else {

            console.log("No data yet.")

            map.setPaintProperty(
                'localidad',
                'fill-color', 
                'transparent'
            );

            map.setPaintProperty(
                'provincia-border-hover',
                'line-color',
                'transparent'
            );

            this.ut_maior.monitor_events("off");

        }

    }

    render_pais(pais) {

        plot_country(pais, 50);
        update_breadcrumbs("pais", pais);
        update_infocard(pais);
        update_country_button(pais);


        this.render_country_subnational(pais); // os eventos do subnacional estao aqui dentro
        this.monitor_events('off'); // desliga monitor de eventos no nível de país

    }
}

class UTmaior {

    country;

    hoveredStateId;
    popup;

    constructor(country, url) {

        this.country = country;

        this.load(country, url);

        this.hoveredStateId = null;

        this.popup = new mapboxgl.Popup(
            {
                closeButton: false,
                loseOnClick: false
            }
        );

    }

    load(country, url) {

        map.addSource(country + '-provincia', {
            type: 'vector',
            url : url,
            'promoteId' : 'nam'
        });

        map.addLayer({
            'id': country + '-provincia',
            'type': 'fill',
            'source': country + '-provincia',
            'source-layer': 'provincia', // isso vai estar hardcoded no mapbox
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
            'source-layer': 'provincia',
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
            'source-layer': 'provincia',
            'layout': {},
            'paint': {
                'line-color': 'black',
                'line-width': 4
            },
            'filter': ['==', 'provincia', '']}); // puts behind road-label

    }

    toggle_hightlight_border(provincia) {

        map.setFilter(
            this.country + '-provincia-border', [
                '==',
                ['get', 'nam'],
                provincia
            ]
        );

    }

    mouse_enter_handler(e) {

        // pop up
        let coordinates = [
            e.features[0].properties.xc,
            e.features[0].properties.yc
        ]; 

        let name = e.features[0].properties.nam;

        this.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        // precisa desse if aqui para fazer tirar o estado de hover da provincia anterior quando passa para outra provincia

        if (this.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: this.country + '-provincia',
                    sourceLayer: 'provincia',
                    id: this.hoveredStateId
                },

                { hover : false }
            )

        }

        this.hoveredStateId = e.features[0].properties.nam;

        map.setFeatureState(
            { 
                source: this.country + '-provincia',
                sourceLayer: 'provincia',
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
                    sourceLayer: 'provincia',
                    id: this.hoveredStateId 
                },

                { hover: false }
            );
        }
    
        this.hoveredStateId = null;
    }

    click_event_handler(e) {

        const province_name = e.features[0].properties.nam;

        last_provincia_location_data = e.features[0].properties;

        console.log(last_provincia_location_data);

        /* Para evitar re-renderizar quando clica na mesma província
        if (province_name != current_place.provincia) {

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
                sourceLayer: 'provincia',
                id: province_name
            },

            { hover : false }
        );

        render_provincia_argentina(province_name);

    }

    monitor_events(option) {

        if (option == 'on') {

            if (this.hoveredStateId) {

                map.setFeatureState(
                    { 
                        source: this.country + '-provincia',
                        sourceLayer: 'provincia',
                        id: this.hoveredStateId 
                    },

                    { hover: false }
                );
            }

            //dash.map.localidad.hoveredStateId = null;

            map.on('mousemove', this.country + '-provincia', e => this.mouse_enter_handler(e));

            map.on('mouseleave', this.country + '-provincia', e => this.mouse_leave_handler(e));

            map.on('click', this.country + '-provincia', e => this.click_event_handler(e));

            // como tem o layer aqui, dá para no handler pegar o e.features!

        } else {

            //console.log('turning off province event monitor');

            map.off('mousemove', this.country + '-provincia', e => this.mouse_enter_handler(e));

            map.off('mouseleave', this.country + '-provincia', e => this.mouse_leave_handler(e));

            map.off('click', this.country + '-provincia', e => this.click_event_handler(e));

            //dash.map.province.hoveredStateId = null;
            
        }

    }

}

class UTmenor {

    country;

    hoveredStateId;
    popup;

    constructor(country, url) {

        this.country = country;

        this.load(country, url);

        this.hoveredStateId = null;

        this.popup = new mapboxgl.Popup(
            {
                closeButton: false,
                loseOnClick: false
            }
        );

    }

    load(country, url) {

        map.addSource(country + '-localidad', {
            type: 'vector',
            url : 'mapbox://tiagombp.d8u3a43g',
            'promoteId' : 'randId'
        });

        map.addLayer({
            'id': country + '-localidad',
            'type': 'fill',
            'source': country + '-localidad',
            'source-layer': 'localidad',
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
            'source-layer': 'localidad',
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
            'source-layer': 'localidad',
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
            'source-layer': 'localidad',
            'layout': {},
            'paint': {
                'line-color': 'black',
                'line-width': 3,
            }, 'filter': ['==', 'local', '']
        }); 

    }

    toggle_highlight(localidad) {

        // desnecessário isso aqui, melhorar.
        let local;

        if (localidad == '') local = localidad;
        else local = last_localidad_location_data.local;

        map.setFilter(
            this.country + '-localidad-highlight', [
                '==',
                ['get', 'local'],
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
                    ['get', 'local'],
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

        let name = e.features[0].properties.nam;

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

        this.hoveredStateId = e.features[0].properties.randId;

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

        if (option == 'on') {

            //console.log('MONITORING LOCALIDAD EVENTS');

            this.hoveredStateId = null;

            map.on('mousemove', this.country + '-localidad', e => this.mouse_enter_handler(e));
                    
            map.on('mouseleave', this.country + '-localidad', e => this.mouse_leave_handler(e));

            map.on('click', this.country + '-localidad', e => this.click_event_handler(e));

            // como tem o layer aqui, dá para no handler pegar o e.features!

        } else {

            //console.log('turning off localidad event monitor');

            map.off('mousemove', this.country + '-localidad', e => this.mouse_enter_handler(e));
                    
            map.off('mouseleave', this.country + '-localidad', e => this.mouse_leave_handler(e));

            map.off('click', this.country + '-localidad', e => this.click_event_handler(e));

            this.hoveredStateId = null;
            
        }

    }

    click_event_handler(e) {


        const localidad = e.features[0].properties.local; //feature.properties.local;
        const localidad_name = e.features[0].properties.nam;
        const provincia = e.features[0].properties.provincia; //feature.properties.provincia;

        last_localidad_location_data = e.features[0].properties; // isso aqui provavelmente vai fazer todo o resto ser desnecessário

        console.log(last_localidad_location_data);

        const local = {

            local : localidad,
            tipo  : "localidad",
            text  : localidad_name,
            provincia : provincia

        };

        //console.log("Clicou em ", localidad, local, dash.vis.location_card.state.user_location_province);

        // clears hover featureState
        // o id da localidad é o randId. Só ver o 'promoteId' no addSource lá em cima.

        const id = e.features[0].properties.randId;

        map.setFeatureState(
            { 
                source: 'localidad',
                sourceLayer: 'localidad',
                id: id
            },

            { hover : false }
        );

        render_localidad_argentina(last_localidad_location_data.nam);

    }

    sets_opacity_on_hover(option) {

        if (option == 'off') {

            dash.map_obj.setPaintProperty('localidad', 'fill-opacity', 1);

        } else {

            dash.map_obj.setPaintProperty('localidad', 'fill-opacity', [
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

map.on("load", () => {

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

    argentina = new Country("Argentina", "", "mapbox://tiagombp.4fk72g1y", "mapbox://tiagombp.d8u3a43g");

    argentina.monitor_events("on");
    //load_localidads_argentina();
    //load_provincias_argentina();

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

