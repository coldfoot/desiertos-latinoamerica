const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");

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

        plot_country(pais, 50);
        update_breadcrumbs("pais", pais);

    }

})

menu_nav_conteudo.addEventListener("click", e => {

    let tipo_conteudo;

    if (e.target.tagName == "BUTTON") {

        tipo_conteudo = e.target.dataset.btnNav;

        console.log(tipo_conteudo);

        //switch_conteudo()

        document.querySelectorAll("[data-tipo-conteudo]").forEach(div => {

            div.classList.remove("conteudo-active");

        })

        document.querySelector(`[data-tipo-conteudo="${tipo_conteudo}"]`).classList.add("conteudo-active");

    }

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

    console.log(e);
      
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


    console.log(name, coordinates);



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

function monitor_events(option) {
    
    if (option == 'on') {

        console.log('MONITORING COUNTRY EVENTS');

        hoveredStateId = null;

        map.on('mousemove', 'countries-fills', mouse_enter_handler);
                
        map.on('mouseleave', 'countries-fills', mouse_leave_handler);


    } else {

        console.log('turning off COUNTRY event monitor');

        map.off('mousemove', 'countries-fills', mouse_enter_handler);
                
        map.off('mouseleave', 'countries-fills', mouse_leave_handler);

        hoveredStateId = null;
        
    }

}