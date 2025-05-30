const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");
const expand_button_mobile = document.querySelector(".expand-card-mobile");
const text_panel = document.querySelector(".text-panel-container");

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

function toggle_hightlight_border_provincia_argentina(provincia) {

    map.setFilter(
        'provincia-border', [
            '==',
            ['get', 'nam'],
            provincia
        ]
    );


}

function render_provincia_argentina(provincia) {

    update_breadcrumbs('ut-maior', provincia);

    console.log(provincia);

};

const provincias_argentina = {

    hoveredStateId : null,

    popup: new mapboxgl.Popup(
        {
            closeButton: false,
            loseOnClick: false
        }),

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

monitor_events("on");