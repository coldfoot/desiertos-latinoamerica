
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

    const dashboard = root.dataset.page;

    if (!dashboard) menu_paises = new MenuPaises(".menu-paises");

    const countries = ["Argentina", "Colombia", "Peru", "Chile", "Mexico"];

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

        map.fitBounds(overall_bbox, {
            padding:  {
                left: dashboard ? 50 : 500,
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

    steps = {

        

    };

    constructor() {

        gsap.registerPlugin(ScrollTrigger);

    

    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes


}

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

        update_infocard(provincia, provincia, this.country, "provincia");

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

        update_infocard(
            last_localidad_location_data[this.ut_menor.key_name],
            last_localidad_location_data[this.ut_menor.key_id],
            this.country,
            "localidad"
         );

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
        update_infocard(pais, pais, pais, "pais");
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

>>>>>>> Stashed changes
}