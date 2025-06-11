
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

    render_pais(pais)


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
