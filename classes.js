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
        const country_key = name.toLowerCase();

        let coordinates = [
            ( bboxes[country_key][0] + bboxes[country_key][2] ) / 2,
            ( bboxes[country_key][1] + bboxes[country_key][3] ) / 2
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

        this.hoveredStateId = name;//e.features[0].properties.country_name;

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

        const country = e.features[0].properties.country_name.toLowerCase();

        //if (country == "colombia") return;

        const local = {

            local : '',//localidad,
            tipo  : 'country',
            text  : '',//localidad_name,
            provincia : '',//provincia
            country: country

        };

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
       console.log(padding);

        map.fitBounds(

            bbox_provincia, 

            {
                linear : false, // false means the map transitions using map.flyTo()
                speed: 1, 
                padding: padding//{top: 80, bottom: 100, left: 30, right: 30},
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
                padding: padding//{top: 80, bottom: 100, left: 30, right: 30},
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

        this.paint_country_subnational("on");

        this.ut_maior.monitor_events("on");
        this.ut_maior.toggle_hover_border(); // será que não teria que estar junto com o monitor_events do ut_maior
        this.ut_menor.monitor_events("off");
        this.ut_menor.toggle_borders("off");
        this.ut_maior.toggle_highlight_border('');
        this.ut_menor.toggle_highlight('');

    }

    paint_country_subnational(mode) {

        if (mode == "on") {

            map.setPaintProperty(
                this.country + '-localidad',
                'fill-color',
                [
                    'match',
                    ['get', 'CLASSIFICATION'],
                    ...Object.keys(colors_css).flatMap(key => [key.toUpperCase(), colors_css[key]]),
                    'transparent'
                ]
            );


        } else {

            map.setPaintProperty(
                this.country + '-localidad',
                'fill-color', 
                'transparent'
            );

            /*
            map.setPaintProperty(
                this.country + '-provincia-border',
                'line-color',
                'transparent'
            );*/
            map.setFilter(
                this.country + '-provincia-border', [
                    '==',
                    'provincia',
                    ''
                ]
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

        plot_country(pais, padding);
        update_breadcrumbs("pais", country_names[pais]);
        update_infocard(country_names[pais], pais, pais, "pais");
        update_country_button(pais);

        console.log("Render pais, ", pais, this.country, last_country);
        this.render_country_subnational(pais); // os eventos do subnacional estao aqui dentro
        countries_events.monitor_events('off'); // desliga monitor de eventos no nível de país

        // no caso de troca de país
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

        this.key_id = 'KEY';

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
            'promoteId' : 'KEY'
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

        map.setFilter(
            this.country + '-provincia-border', [
                '==',
                ['get', 'KEY'],
                provincia_key // por causa
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

        let place_key = e.features[0].properties.KEY;

        const place_data = main_data[this.country].large_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];

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
    
        const place_key = e.features[0].properties.KEY; 
        
        // porque o key é tipo "__Nome".
        const place_data = main_data[this.country].large_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];

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

    //temp
    key_subprovincia_argentina;
    flag_localidad_in_subprovincia_argentina;
    subprovincia_argentina_name;

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
            'promoteId' : 'KEY'
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

    toggle_story_border(key) {

        map.setFilter(
            this.country + '-localidad-highlight', [
                '==',
                ['get', 'KEY'],
                key
            ]
        );

    }

    toggle_highlight(localidad) {

        // desnecessário isso aqui, melhorar.
        let local = (localidad != undefined) ? localidad : last_localidad_location_data.BASIC_INFO.KEY;

        // remove this when the data is fixed; 
        if (this.flag_localidad_in_subprovincia_argentina) local = this.key_subprovincia_argentina;

        map.setFilter(
            this.country + '-localidad-highlight', [
                '==',
                ['get', 'KEY'],
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
                    ['get', 'KEY'],
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

        let place_key = e.features[0].properties.KEY;

        // remove this when the data is fixed;
        if (current_country == "argentina") {

            const keys_provincias_merged = Object.keys(argentina_keys);

            keys_provincias_merged.forEach(key => {

                if (place_key.search(key) > -1) {

                    place_key = place_key.replace(key, argentina_keys[key]);

                    return;
                    
                }

            })

        }

        const place_data = main_data[this.country].small_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];
      
        if (!place_data) return;

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

        this.flag_localidad_in_subprovincia_argentina = false;
        let place_key = e.features[0].properties.KEY;

                // remove this when the data is fixed;
        if (current_country == "argentina") {

            const keys_provincias_merged = Object.keys(argentina_keys);

            keys_provincias_merged.forEach(key => {

                if (place_key.search(key) > -1) {

                    this.key_subprovincia_argentina = place_key; // to use in the toggle highlight, remove when the data is coherent
                    this.flag_localidad_in_subprovincia_argentina = true;
                    this.subprovincia_argentina_name = argentina_subprovincias_names[key];

                    place_key = place_key.replace(key, argentina_keys[key]);

                    return;
                    
                }

            })

        }

        const place_data = main_data[this.country].small_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];

        if (!place_data) return;
      
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

class Bubble {

    popup;
    hoveredStateId;

    constructor(country_name, bbox_country, bubble_data, bubble_layer) {

        this.country = country_name;
        this.bbox_country = bbox_country;
        this.data = bubble_data;
        this.source_layer_name = bubble_layer;

        this.hoveredStateId = null;

        this.popup = new mapboxgl.Popup(
            {
                closeButton: false,
                loseOnClick: false
            }
        );

        this.load();

    }

    load() {

        /*
        const symbols = ['BOSQUE', 'SEMIBOSQUE', 'DESIERTO', 'SEMIDESIERTO'];

        symbols.forEach(name => {

            let path = dashboard ? '../img/' : './img/';

            let filename = name.toLowerCase();
            filename = `${path}symbol-${filename}.png`;

            map.loadImage(
                filename, 
                (error, image) => {
                    if (error) throw error;
                    if (!map.hasImage(name)) {
                        map.addImage(name, image);
                    }
                }
            );
        }) */

        map.addSource(this.country + '-bubble', {
            type: 'vector',
            url : this.data,
            'promoteId' : 'KEY'
        });

        /*
        map.addLayer({
            'id': this.country + '-bubble',
            'type': 'symbol',
            'source': this.country + '-bubble',
            'source-layer' : this.source_layer_name,
            'layout' : {
                'icon-image' : ['get', 'CLASSIFICATION'],
                'icon-size' : .25,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
                'symbol-placement': 'point',
            },
            'paint' : {
                'icon-opacity' : 0
            }
        })

        map.addLayer({
            'id': this.country + '-bubble-highlight',
            'type': 'symbol',
            'source': this.country + '-bubble',
            'source-layer': this.source_layer_name,
            'layout' : {
                'icon-image' : ['get', 'CLASSIFICATION'],
                'icon-size' : .33
            },
            'paint' : {
                'icon-opacity' : 1
            },
            'filter': ['==', 'KEY', '']
        }); */

        map.addLayer({
            'id': this.country + '-bubble',
            'type': 'circle',
            'source': this.country + '-bubble',
            'source-layer' : this.source_layer_name,
            'paint': {
                'circle-color': "#EA4A26"/*[

                    'match',
                    ["get", "CLASSIFICATION"],
                    ...Object.keys(colors_css).flatMap(key => [key.toUpperCase(), colors_css[key]]),
                    'transparent'

                ]*/,
                'circle-opacity': 0,
                'circle-radius': 10
            }
        })

        map.addLayer({
            'id': this.country + '-bubble-highlight',
            'type': 'circle',
            'source': this.country + '-bubble',
            'source-layer': this.source_layer_name,
            'paint': {
                'circle-stroke-width': 3,
                'circle-color' : "#EA4A26",
                'circle-radius' : 10,
                'circle-opacity' : 1
            }, 
            'filter': ['==', 'KEY', '']
        }); 

    }

    toggle_highlight(KEY) {

        map.setFilter(
            this.country + '-bubble-highlight', [
                '==',
                ['get', 'KEY'],
                KEY
            ]
        );

        const opacity = KEY == '' ? 0 : .7;

        //map.setPaintProperty(this.country + '-bubble', 'icon-opacity', opacity);
        map.setPaintProperty(this.country + '-bubble', 'circle-opacity', opacity);

    }


    render_pais() {

        const pais = this.country;

        plot_country(pais, padding);
        update_breadcrumbs("pais", country_names[pais]);
        update_infocard(country_names[pais], pais, pais, "pais");
        update_country_button(pais);

        this.render_country_subnational();

        countries_events.monitor_events('off'); // desliga monitor de eventos no nível de país

        // troca de país
        if ( (pais != last_country) & (last_country != undefined) ) {

            countries[last_country].clear_country_subnational();

        }

        last_country = pais;

        this.monitor_events("on");  

    }

    render_country_subnational() {

        this.toggle_highlight('');
        map.setPaintProperty(this.country + "-bubble", "circle-opacity", 1);
        map.setPaintProperty("countries-fills", "fill-color", "transparent");
        //map.setPaintProperty(this.country + '-bubble', 'icon-opacity', 1);


    }

    clear_country_subnational() {

        console.log(this.country + ' to clear')

        /* using '' as parameter in toggle_highlight will already set opacity to 0.
        map.setPaintProperty(
            this.country + "-bubble", 
            "icon-opacity",
            0
        )*/

        this.toggle_highlight('');

        this.monitor_events("off");


    }

    render_bubble(key) {

        const place_data = main_data[this.country].small_units.filter(d => d.BASIC_INFO.KEY == key)[0];

        const localidad_name = place_data.BASIC_INFO.NAME;
        const province_name = place_data.BASIC_INFO.PARENT;

        last_localidad_location_data = place_data;

        let last_provincia_name = last_provincia_location_data ?  last_provincia_location_data.BASIC_INFO.NAME : null;

        // no caso de o usuário clicar numa localidade de outra provincia!
        if (province_name != last_provincia_name) {

            // atualizo a provincia
            last_provincia_location_data = main_data[this.country].large_units.filter(d => d.BASIC_INFO.NAME == province_name)[0];

        }

        /*

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
        );*/

        update_breadcrumbs('ut-maior', `${localidad_name} (${province_name})`);

        this.toggle_highlight(key);

        update_infocard(
            localidad_name,
            key,
            this.country,
            "localidad"
         );

    }

    mouse_enter_handler(e) {

        let place_key = e.features[0].properties.KEY;

        const place_data = main_data[this.country].small_units.filter(d => d.BASIC_INFO.KEY == place_key)[0];

        // pop up
        let coordinates = [
            //e.features[0].geometries.coordinates[0],
            //e.features[0].geometries.coordinates[1]
            place_data.CENTROID.xc,
            place_data.CENTROID.yc
        ]; 

        let name = place_data.BASIC_INFO.NAME;

        this.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        // precisa desse if aqui para fazer tirar o estado de hover da provincia anterior quando passa para outra provincia

        if (this.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: this.country + '-bubble',
                    sourceLayer: this.source_layer_name,
                    id: this.hoveredStateId
                },

                { hover : false }
            )

        }

        this.hoveredStateId = place_key;

        map.setFeatureState(
            { 
                source: this.country + '-bubble',
                sourceLayer: this.source_layer_name,
                id: this.hoveredStateId
            },

            { hover : true }
        )

        // algo mais a fazer aqui

    }

    mouse_leave_handler() {

        this.popup.remove();

        if (this.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: this.country + '-bubble', 
                    sourceLayer: this.source_layer_name,
                    id: this.hoveredStateId 
                },

                { hover: false }
            );
        }
    
        this.hoveredStateId = null;
    }

    click_event_handler(e) {
    
        const place_key = e.features[0].properties.KEY; 

        this.render_bubble(place_key);

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
                        source: this.country + '-bubble',
                        sourceLayer: this.source_layer_name,
                        id: this.hoveredStateId 
                    },

                    { hover: false }
                );
            }

            map.on('mousemove', this.country + '-bubble', this._bound_mouse_enter_handler);

            map.on('mouseleave', this.country + '-bubble', this._bound_mouse_leave_handler);

            map.on('click', this.country + '-bubble', this._bound_click_handler);

        } else {

            map.off('mousemove', this.country + '-bubble', this._bound_mouse_enter_handler);

            map.off('mouseleave', this.country + '-bubble', this._bound_mouse_leave_handler);

            map.off('click', this.country + '-bubble', this._bound_click_handler);

        }

    }


}

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

    if (tipo_paisage != '') {

        if (country == "colombia") {

            map.setPaintProperty(
                country + '-bubble',
                'icon-opacity',
                [
                    'case',
                    [
                        '==',
                        ['get', 'CLASSIFICATION'],
                        tipo_paisage.toUpperCase()
                    ],
                    1,
                    0
                ]
            )

            map.setFilter(
                country + '-bubble-highlight', [
                    '==',
                    ['get', 'KEY'],
                    ''
                ]
            );

        } else {

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

        }

    } else {

        if (country == "colombia") {

            map.setPaintProperty(
                country + '-bubble',
                'icon-opacity',
                1
            );

            map.setFilter(
                country + '-bubble-highlight', [
                    '==',
                    ['get', 'KEY'],
                    ''
                ]
            );

        } else {

            map.setPaintProperty(
                country + '-localidad',
                'fill-color',
                [
                    'match',
                    ['get', 'CLASSIFICATION'],
                    ...Object.keys(colors_css).flatMap(key => [key.toUpperCase(), colors_css[key]]),
                    'transparent'
                ]
            );

        }

    }

}

// Map

let map;

// converte nomes
const country_names = {
    "argentina" : "Argentina",
    "chile" : "Chile",
    "colombia" : "Colombia",
    "mexico" : "México",
    "peru" : "Perú"
}

// to fix Argentina keys for the merged provincias
const argentina_keys = {
    "Cordoba-Sur__argentina" : "Cordoba__argentina",
    "Cordoba-Norte__argentina" : "Cordoba__argentina",
    "Santa-Fe-CentroSur__argentina" : "Santa-Fe__argentina",
    "Santa-Fe-Norte__argentina" : "Santa-Fe__argentina", 
    "Buenos-Aires-Conurbano__argentina" : "Buenos-Aires__argentina",
    "Buenos-Aires-Zona-2__argentina" : "Buenos-Aires__argentina",
    "Buenos-Aires-Zona-3__argentina" : "Buenos-Aires__argentina"
}

const argentina_subprovincias_names = {
    "Cordoba-Sur__argentina" : "Córdoba (Sur)",
    "Cordoba-Norte__argentina" : "Córdoba (Norte)",
    "Santa-Fe-CentroSur__argentina" : "Santa Fe (Centro-Sur)",
    "Santa-Fe-Norte__argentina" : "Santa Fe (Norte)", 
    "Buenos-Aires-Conurbano__argentina" : "Buenos Aires (Conurbano)",
    "Buenos-Aires-Zona-2__argentina" : "Buenos Aires (Zona 2)",
    "Buenos-Aires-Zona-3__argentina" : "Buenos Aires (Zona 3)"

}

// countries bboxes
const bboxes = {
    "argentina" : [-73.57626953125, -55.03212890625, -53.6685546875, -21.8025390625],
    "chile" : [-109.434130859375, -55.89169921875, -66.435791015625, -17.5060546875],
    "colombia" : [-81.735610, -4.229406, -66.847215, 13.394496],
    "mexico" : [-118.4013671875, 14.54541015625, -86.6962890625, 32.71533203125],
    "peru" : [-81.33662109375, -18.34560546875, -68.68525390625, -0.041748046875]
}

const overall_bbox = [-118.4013671875, -55.891699218750006, -53.66855468749999, 32.71533203125];

// COLORS

const colors = {};

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

populate_colors();

const root = document.documentElement;
const rootStyles = getComputedStyle(root);
colors["accent"] = rootStyles.getPropertyValue('--color-accent');
colors["map"] = rootStyles.getPropertyValue('--color-map');

// Detect dashboard
const dashboard = root.dataset.page;

let current_country;

// object that will hold the Country objects instances
let countries = {};

let last_country;
let last_provincia_location_data;
let last_localidad_location_data;

const countries_events = new CountriesEvents();

let main_data;

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

 //   if (!dashboard) {
        
        countries["argentina"] = new Country(
            "argentina", "", 
            "mapbox://tiagombp.2c7pqb06", "large-units-argentina-9wj09y", 
            "mapbox://tiagombp.0fsztx9y", "small-units-argentina-dpc40y");

        countries["chile"]     = new Country(
            "chile", "", 
            "mapbox://tiagombp.0l57h9et", "chilelargeunits", 
            "mapbox://tiagombp.54kh6vm7", "chilesmallunits");

        countries["peru"] = new Country(
            "peru", "",
            "mapbox://tiagombp.d899dc8k", "large-units-peru-42epjp",
            "mapbox://tiagombp.3636aktg", "small-units-peru-3glt7j"
        );

        countries["colombia"] = new Bubble(
            "colombia", "", "mapbox://tiagombp.27ddvbx4", "colombia-centroids-61kfe7"
        );

        countries["mexico"] = new Country(
            "mexico", "",
            "mapbox://tiagombp.3fbhy8tn", "mexico-large-units-bzhqx5",
            "mapbox://tiagombp.4xdpwu31", "mexicosmallunits"
        );

        

});

// main function
map.on("load", () => {

    let path = dashboard ? '../' : './';

    fetch(path + "data.json").then(response => response.json()).then(data => {

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

        countries_events.monitor_events("on");

        // changes color if dashboard;
        if (dashboard) {
            populate_datalist(data);
            monitor_search_bar(data);
            map.setPaintProperty("water", "fill-color", "#F9F1E3");
            map.setPaintProperty("country-boundaries", "fill-color", "#F9F1E3");
        }
        
    })

})