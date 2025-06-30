let current_country;
// object that will hold the Country objects instances
let countries = {};

function plot_country(country, padding) {

    console.log(country);

    current_country = country;

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
                    ['get', 'classification'],
                    tipo_paisage.toUpperCase()
                ],
                colors_css[tipo_paisage],
                'transparent'
            ]
        )

    } else {

        map.setPaintProperty(
            country + '-localidad',
            'fill-color',
            [
                'match',
                ['get', 'classification'],
                ...Object.keys(colors_css).flatMap(key => [key, colors_css[key]]),
                'gray'
            ]
        );

    }

}

class Country {

    constructor(country_name, bbox_country, url_ut_maior, source_layer_ut_maior, url_ut_menor, source_layer_ut_menor) {

        this.country = country_name;
        this.bbox_country = bbox_country;
        this.ut_maior = new UTmaior(country_name, url_ut_maior, source_layer_ut_maior);
        this.ut_menor = new UTmenor(country_name, url_ut_menor, source_layer_ut_menor);

    }

    render_provincia() {

        const provincia_name = last_provincia_location_data.BASIC_INFO.NAME;
        const provincia_key = last_provincia_location_data.BASIC_INFO.KEY;

        update_breadcrumbs('ut-maior', provincia_name);

        const bbox_provincia = [
            last_provincia_location_data.BBOX.minx, last_provincia_location_data.BBOX.miny,
            last_provincia_location_data.BBOX.maxx, last_provincia_location_data.BBOX.maxy
        ]; 

        /*
        let bbox_provincia;

        if (last_provincia_location_data.BBOX) {

            if (last_provincia_location_data.bbox.minx) {

                bbox_provincia = [
                    last_provincia_location_data.bbox.minx, last_provincia_location_data.bbox.miny,
                    last_provincia_location_data.bbox.maxx, last_provincia_location_data.bbox.maxy
                ]; 

            } else {

                bbox_provincia = last_provincia_location_data.bbox;

            }

        } else {

            const provincia_data = main_data[country].larger_units.filter(d => d.NAME == provincia)[0];
            console.log(provincia, provincia_data);

            bbox_provincia = [
                provincia_data.bbox.minx, provincia_data.bbox.miny,
                provincia_data.bbox.maxx, provincia_data.bbox.maxy
            ]; 

            last_provincia_location_data.bbox = bbox_provincia;

        }*/

        map.fitBounds(

            bbox_provincia, 

            {
                linear : false, // false means the map transitions using map.flyTo()
                speed: 1, 
                padding: {top: 80, bottom: 100, left: 30, right: 30},
            }
        );

        this.ut_menor.toggle_borders("on");
        this.ut_maior.toggle_highlight_border(provincia_key);
        this.ut_menor.toggle_highlight('');

        this.ut_maior.monitor_events("off");
        this.ut_menor.monitor_events("on");

        update_infocard(provincia_name, provincia_key, this.country, "provincia");

    }

    render_localidad() {

        // aqui já se assume que o last_localidad_location_data já foi atualizado.

        const localidad_name = last_localidad_location_data.BASIC_INFO.NAME;

        const localidad_key = last_localidad_location_data.BASIC_INFO.KEY;

        const provincia_name = last_localidad_location_data.BASIC_INFO.PARENT;

        let last_provincia_name = last_provincia_location_data.BASIC_INFO.NAME;

        // no caso de o usuário clicar numa localidade de outra provincia!
        if (provincia_name != last_provincia_name) {

            // atualizo a provincia
            last_provincia_location_data = main_data[this.country].large_units.filter(d => d.BASIC_INFO.NAME == provincia_name)[0];

        }

        const provincia_key = last_provincia_location_data.BASIC_INFO.KEY;

        const bbox_provincia = [
            last_provincia_location_data.BBOX.minx, last_provincia_location_data.BBOX.miny,
            last_provincia_location_data.BBOX.maxx, last_provincia_location_data.BBOX.maxy
        ]; 

        map.fitBounds(

            bbox_provincia, 

            {
                linear : false, // false means the map transitions using map.flyTo()
                speed: 1, 
                padding: {top: 80, bottom: 100, left: 30, right: 30},
            }
        );

        update_breadcrumbs('ut-maior', provincia_name);
        update_breadcrumbs('ut-menor', localidad_name);

        this.ut_menor.toggle_borders("on");
        this.ut_maior.toggle_highlight_border(provincia_key);

        this.ut_menor.toggle_highlight(localidad_key);

        //this.ut_maior.monitor_events("off");
        //this.ut_menor.monitor_events("on");

        update_infocard(
            localidad_name,
            localidad_key,
            this.country,
            "localidad"
         );

    }

    render_country_subnational() {

        map.setPaintProperty("countries-borders", "line-color", "transparent");
        map.setPaintProperty("countries-fills", "fill-color", "transparent");
        map.moveLayer(this.country + "-provincia-border-hover");
        map.moveLayer(this.country + "-provincia-border");

        if (["argentina", "chile", "peru"].includes(this.country)) {

            this.paint_country_subnational("on");

            this.ut_maior.monitor_events("on");
            this.ut_maior.toggle_hover_border(); // será que não teria que estar junto com o monitor_events do ut_maior
            this.ut_menor.monitor_events("off");
            this.ut_menor.toggle_borders("off");
            this.ut_maior.toggle_highlight_border('');
            this.ut_menor.toggle_highlight('');


        } else {

            console.log("No data yet.")

            this.ut_maior.monitor_events("off");

        }

    }

    paint_country_subnational(mode) {

        if (mode == "on") {

            map.setPaintProperty(
                this.country + '-localidad',
                'fill-color',
                [
                    'match',
                    ['get', 'classification'],
                    ...Object.keys(colors_css).flatMap(key => [key.toUpperCase(), colors_css[key]]),
                    'gray'
                ]
            );


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
        this.ut_maior.toggle_highlight_border('');
        this.ut_menor.toggle_highlight('');
        this.ut_menor.monitor_events("off");

        this.ut_maior.monitor_events("off");

    }

    render_provincias_borders() {

        this.ut_maior.toggle_borders("on");

    }

    render_pais() {

        const pais = this.country;

        plot_country(pais, 50);
        update_breadcrumbs("pais", pais);
        update_infocard(pais[0].toUpperCase() + pais.slice(1), pais, pais, "pais");
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

    update_provincia_data(provincia_name) {

    }
}

class UTmaior {

    country;

    hoveredStateId;
    popup;

    constructor(country, url, source_layer_name) {

        this.country = country;
        this.source_layer_name = source_layer_name;

        this.key_id = 'key';

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
            'promoteId' : 'key'
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
                'line-width': 4
            },
            'filter': ['==', 'provincia', '']}); // puts behind road-label

    }

    toggle_highlight_border(provincia_key) {

        console.log(provincia_key);

        map.setFilter(
            this.country + '-provincia-border', [
                '==',
                ['get', 'key'],
                '__' + provincia_key // por causa
            ]
        );

    }

    toggle_hover_border(disable) {

        let color = "#666";

        if (disable) color = "transparent";

        map.setPaintProperty(
            this.country + '-provincia-border-hover',
            'line-color',
            color
        );

    }

    mouse_enter_handler(e) {

        let place_key = e.features[0].properties.key;

        const place_data = main_data[this.country].large_units.filter(d => "__" + d.BASIC_INFO.KEY == place_key)[0];

        // pop up
        let coordinates = [
            place_data.CENTROID.xc,
            place_data.CENTROID.yc
        ]; 

        let name = place_data.BASIC_INFO.NAME;

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

        this.hoveredStateId = place_key;

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
    
        const place_key = e.features[0].properties.key; 
        
        // porque o key é tipo "__Nome".
        const place_data = main_data[this.country].large_units.filter(d => "__" + d.BASIC_INFO.KEY == place_key)[0];

        const province_name = place_data.BASIC_INFO.NAME;

        last_provincia_location_data = place_data;

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
                id: place_key
            },

            { hover : false }
        );

        countries[this.country].render_provincia();

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

        if (this.country == "argentina") {

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
            'promoteId' : "key"
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
        else local = last_localidad_location_data.BASIC_INFO.KEY;

        map.setFilter(
            this.country + '-localidad-highlight', [
                '==',
                ['get', 'key'],
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
                    ['get', 'key'],
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

        const place_key = e.features[0].properties.key;

        const place_data = main_data[this.country].small_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];
      
        let coordinates = [
            place_data.CENTROID.xc,
            place_data.CENTROID.yc
        ]; //e.features[0].geometry.coordinates.slice();

        let name = place_data.BASIC_INFO.NAME;

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

        this.hoveredStateId = place_key;

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

        const place_key = e.features[0].properties.key;

        const place_data = main_data[this.country].small_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];
      
        const localidad_name = place_data.BASIC_INFO.NAME;
        
        const provincia = place_data.BASIC_INFO.PARENT;

        last_localidad_location_data = place_data; // isso aqui provavelmente vai fazer todo o resto ser desnecessário

        //console.log("Clicou em ", localidad, local, dash.vis.location_card.state.user_location_province);

        // clears hover featureState
        // o id da localidad é o randId. Só ver o 'promoteId' no addSource lá em cima.

        const id = place_key;

        map.setFeatureState(
            { 
                source: this.country + '-localidad',
                sourceLayer: 'localidad',
                id: id
            },

            { hover : false }
        );

        countries[this.country].render_localidad(place_key);

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