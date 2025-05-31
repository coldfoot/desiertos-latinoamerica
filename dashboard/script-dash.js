const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");
const expand_button_mobile = document.querySelector(".expand-card-mobile");
const text_panel = document.querySelector(".text-panel-container");

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

let last_provincia_location_data;
let last_localidad_location_data;

populate_colors();

const current_place = {
    country : '',
    provincia : '',
    localidad : ''
}

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

        // remove selected class to current "selected" element
        menu_pais.querySelector(".pais-selected").classList.remove("pais-selected");

        // adds the selected class to the clicked div
        div_pais.classList.add("pais-selected");

        render_place(pais);

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

    load_localidads_argentina();
    load_provincias_argentina();

})


// talvez definir uma classe, e criar uma instância para nível geográfico

const popup = new mapboxgl.Popup(

    {
        closeButton: false,
        loseOnClick: false
    }
);

let hoveredStateId = null;

function mouse_enter_handler(e) {
    
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
    ]


    //console.log(name, coordinates);



    //console.log('mouse enter fired ', coordinates, name);
        
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.

    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }
        
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(name).addTo(map);

    ////////////
    // highlight polygon

    if (hoveredStateId !== null) {

        map.setFeatureState(
            { 
                source: 'countries',
                sourceLayer: 'data-blt69d', // countries-borders
                id: hoveredStateId
            },

            { hover : false }
        )


    }

    hoveredStateId = e.features[0].properties.country_name;

    map.setFeatureState(
        { 
            source: 'countries',
            sourceLayer: 'data-blt69d', // countries-borders
            id: hoveredStateId
        },

        { hover : true }
    );
}

function mouse_leave_handler() {

    map.getCanvas().style.cursor = '';
    popup.remove();

    //console.log('fired mouse leave!!!!!!!', dash.map.localidad.hoveredStateId);

    if (hoveredStateId !== null) {
        map.setFeatureState(
            { 
                source: 'countries',
                sourceLayer: 'data-blt69d', // countries-borders
                id: hoveredStateId
            },

            { hover: false }
        );
    }

    hoveredStateId = null;

}

function click_handler(e) {


    //const localidad = e.features[0].properties.local; //feature.properties.local;
    //const localidad_name = e.features[0].properties.nam;
    //const provincia = e.features[0].properties.provincia; //feature.properties.provincia;
    const country = e.features[0].properties.country_name;

    const local = {

        local : '',//localidad,
        tipo  : 'country',
        text  : '',//localidad_name,
        provincia : '',//provincia
        country: country

    };

    //console.log("Clicou em ", localidad, local, dash.vis.location_card.state.user_location_province);

    // clears hover featureState
    // o id da localidad é o randId. Só ver o 'promoteId' no addSource lá em cima.

    const pais = e.features[0].properties.country_name;

    map.setFeatureState(
        { 
            source: 'countries',
            sourceLayer: 'data-blt69d', // countries-borders
            id: hoveredStateId
        },

        { hover : false }
    );

    render_place(pais)


}

function monitor_events(option) {
    
    if (option == 'on') {

        console.log('MONITORING COUNTRY EVENTS');

        hoveredStateId = null;

        map.on('mousemove', 'countries-fills', mouse_enter_handler);
                
        map.on('mouseleave', 'countries-fills', mouse_leave_handler);

        map.on('click', 'countries-fills', click_handler);


    } else {

        console.log('turning off COUNTRY event monitor');

        map.off('mousemove', 'countries-fills', mouse_enter_handler);
                
        map.off('click', 'countries-fills', click_handler);

        hoveredStateId = null;
        
    }

}

function render_place(pais) {

    plot_country(pais, 50);
    update_breadcrumbs("pais", pais);
    update_infocard(pais);

    render_country_subnational(pais); // os eventos do subnacional estao aqui dentro
    monitor_events('off'); // desliga monitor de eventos no nível de país

}

function render_country_subnational(pais) {

    if (pais == "Argentina") {

        map.setPaintProperty(
            'localidad',
            'fill-color', 
            ['get', 'color_real']
        );

        map.setPaintProperty(
            'provincia-border-hover',
            'line-color',
            '#666'
        );

        provincias_argentina.monitor_events("on");

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

        provincias_argentina.monitor_events("off");

    }

}

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

function load_localidads_argentina() {

    map.addSource('localidad', {
        type: 'vector',
        url : 'mapbox://tiagombp.d8u3a43g',
        'promoteId' : 'randId'
    });

    map.addLayer({
        'id': 'localidad',
        'type': 'fill',
        'source': 'localidad',
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
        'id': 'localidad-border-hover',
        'type': 'line',
        'source': 'localidad',
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
        'id': 'localidad-border',
        'type': 'line',
        'source': 'localidad',
        'source-layer': 'localidad',
        'layout': {},
        'paint': {
            'line-color': '#666',
            'line-width': 0,
        }
    }); 

    map.addLayer({
        'id': 'localidad-highlight',
        'type': 'line',
        'source': 'localidad',
        'source-layer': 'localidad',
        'layout': {},
        'paint': {
            'line-color': 'black',
            'line-width': 3,
        }, 'filter': ['==', 'local', '']
    }); 

}

function load_provincias_argentina() {


    map.addSource('provincia', {
        type: 'vector',
        url : 'mapbox://tiagombp.4fk72g1y',
        'promoteId' : 'nam'
    });

    map.addLayer({
        'id': 'provincia',
        'type': 'fill',
        'source': 'provincia',
        'source-layer': 'provincia',
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
        'id': 'provincia-border-hover',
        'type': 'line',
        'source': 'provincia',
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
        'id': 'provincia-border',
        'type': 'line',
        'source': 'provincia',
        'source-layer': 'provincia',
        'layout': {},
        'paint': {
            'line-color': 'black',
            'line-width': 4
        },
        'filter': ['==', 'provincia', '']}); // puts behind road-label

}

function render_provincia_argentina(provincia) {

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

    localidads_argentina.toggle_borders("on");
    provincias_argentina.toggle_hightlight_border(provincia);

    provincias_argentina.monitor_events("off");
    localidads_argentina.monitor_events("on");

    update_infocard(provincia);

};

function render_localidad_argentina(localidad) {

    update_breadcrumbs('ut-menor', localidad);

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

    localidads_argentina.toggle_borders("on");
    provincias_argentina.toggle_hightlight_border(last_provincia_location_data.local);

    localidads_argentina.toggle_highlight(localidad);

    //provincias_argentina.monitor_events("off");
    //localidads_argentina.monitor_events("on");

    update_infocard(localidad);

};



const provincias_argentina = {

    hoveredStateId : null,

    popup: new mapboxgl.Popup(
        {
            closeButton: false,
            loseOnClick: false
        }
    ),

    toggle_hightlight_border: function(provincia) {

        map.setFilter(
            'provincia-border', [
                '==',
                ['get', 'nam'],
                provincia
            ]
        );

    },

    mouse_enter_handler : function (e) {

        // pop up
        let coordinates = [
            e.features[0].properties.xc,
            e.features[0].properties.yc
        ]; 

        let name = e.features[0].properties.nam;

        provincias_argentina.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        // precisa desse if aqui para fazer tirar o estado de hover da provincia anterior quando passa para outra provincia

        if (provincias_argentina.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: 'provincia',
                    sourceLayer: 'provincia',
                    id: provincias_argentina.hoveredStateId
                },

                { hover : false }
            )

        }

        provincias_argentina.hoveredStateId = e.features[0].properties.nam;

        map.setFeatureState(
            { 
                source: 'provincia',
                sourceLayer: 'provincia',
                id: provincias_argentina.hoveredStateId
            },

            { hover : true }
        )

        //console.log('Hover no ', hoveredStateId)

        // algo mais a fazer aqui

    },

    mouse_leave_handler : function () {

        provincias_argentina.popup.remove();

        if (provincias_argentina.hoveredStateId) {
            map.setFeatureState(
                { 
                    source: 'provincia', 
                    sourceLayer: 'provincia',
                    id: provincias_argentina.hoveredStateId 
                },

                { hover: false }
            );
        }
    
        provincias_argentina.hoveredStateId = null;
    },

    click_event_handler : function(e) {

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
                source: 'provincia',
                sourceLayer: 'provincia',
                id: province_name
            },

            { hover : false }
        );

        render_provincia_argentina(province_name);

    },

    monitor_events : function(option) {

        if (option == 'on') {

            if (provincias_argentina.hoveredStateId) {
                map.setFeatureState(
                    { 
                        source: 'provincia',
                        sourceLayer: 'provincia',
                        id: provincias_argentina.hoveredStateId 
                    },

                    { hover: false }
                );
            }

            //dash.map.localidad.hoveredStateId = null;

            map.on('mousemove', 'provincia', provincias_argentina.mouse_enter_handler);

            map.on('mouseleave', 'provincia', provincias_argentina.mouse_leave_handler);

            map.on('click', 'provincia', provincias_argentina.click_event_handler);

            // como tem o layer aqui, dá para no handler pegar o e.features!

        } else {

            //console.log('turning off province event monitor');

            map.off('mousemove', 'provincia', provincias_argentina.mouse_enter_handler);

            map.off('mouseleave', 'provincia', provincias_argentina.mouse_leave_handler);

            map.off('click', 'provincia', provincias_argentina.click_event_handler);

            //dash.map.province.hoveredStateId = null;
            
        }

    }

}

const localidads_argentina = {

    hoveredStateId : null,

    popup: new mapboxgl.Popup(
        {
            closeButton: false,
            loseOnClick: false
        }),

    toggle_highlight : function(localidad) {

        const local = last_localidad_location_data.local;

        map.setFilter(
            'localidad-highlight', [
                '==',
                ['get', 'local'],
                local
            ]
        );

        map.setPaintProperty(
            
            'localidad', 
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

    },

    toggle_borders : function(option) {

        // option: on/off

        map.setPaintProperty(
            'localidad-border', 
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

    },

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


    mouse_enter_handler : function (e) {
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
        localidads_argentina.popup.setLngLat(coordinates).setHTML(name).addTo(map);

        ////////////
        // highlight polygon

        if (localidads_argentina.hoveredStateId !== null) {

            map.setFeatureState(
                { 
                    source: 'localidad',
                    sourceLayer: 'localidad',
                    id: localidads_argentina.hoveredStateId
                },

                { hover : false }
            )


        }

        localidads_argentina.hoveredStateId = e.features[0].properties.randId;

        map.setFeatureState(
            { 
                source: 'localidad',
                sourceLayer: 'localidad',
                id: localidads_argentina.hoveredStateId
            },

            { hover : true }
        )
    },

    mouse_leave_handler : function () {

        map.getCanvas().style.cursor = '';
        localidads_argentina.popup.remove();

        //console.log('fired mouse leave!!!!!!!', dash.map.localidad.hoveredStateId);

        // return circle to normal sizing and color
        if (localidads_argentina.hoveredStateId !== null) {
            map.setFeatureState(
                { 
                    source: 'localidad', 
                    sourceLayer: 'localidad', 
                    id: localidads_argentina.hoveredStateId 
                },

                { hover: false }
            );
        }
    
        localidads_argentina.hoveredStateId = null;

    },

    monitor_events : function(option) {

        if (option == 'on') {

            //console.log('MONITORING LOCALIDAD EVENTS');

            localidads_argentina.hoveredStateId = null;

            map.on('mousemove', 'localidad', localidads_argentina.mouse_enter_handler);
                    
            map.on('mouseleave', 'localidad', localidads_argentina.mouse_leave_handler);

            map.on('click', 'localidad', localidads_argentina.click_event_handler);

            // como tem o layer aqui, dá para no handler pegar o e.features!

        } else {

            //console.log('turning off localidad event monitor');

            map.off('mousemove', 'localidad', localidads_argentina.mouse_enter_handler);
                    
            map.off('mouseleave', 'localidad', localidads_argentina.mouse_leave_handler);

            map.off('click', 'localidad', localidads_argentina.click_event_handler);

            localidads_argentina.hoveredStateId = null;
            
        }

    },

    click_event_handler : function(e) {


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

    },

    sets_opacity_on_hover : function(option) {

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

monitor_events("on");