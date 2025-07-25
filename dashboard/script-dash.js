///////////////////////
/// QUERY SELECTORS ///
///////////////////////

// Query selectors for all elements of the page
const body = document.querySelector("body");
const menu_tipo_paisage = document.querySelector(".menu-tipo-paisage");
const menu_pais         = document.querySelector(".menu-pais-dash");
const menu_nav_conteudo = document.querySelector(".wrapper-btns-nav");
const expand_button_mobile = document.querySelector(".expand-card-mobile");
const text_panel = document.querySelector(".text-panel-container");
const container_relato = document.querySelector("[data-tipo-conteudo='relato']");
const container_relato_colombia = document.querySelector(".relato-colombia-localidad");
const relato = document.querySelector("[data-relato-completo]");
const place_summary = document.querySelector(".place-summary");
const search_container = document.querySelector(".seleccione-ubicacion-container");
const btn_leer_provincia_from_localidad = document.querySelector(".leer-provincia");
const btn_close_modal = document.querySelector("button.close-modal");
const bg_modal = document.querySelector(".bg-modal-viz");
const modal = document.querySelector(".modal-viz");
const breadcrumbs = document.querySelector(".breadcrumbs");
const btn_leer_mas = container_relato.querySelector(".leer-mas");
const btn_leer_mas_colombia = container_relato_colombia.querySelector(".leer-mas");
const btns_leer_mas_subprovincia_argentina = document.querySelectorAll(".leer-mas-desplegable");

///////////////////////
/// STATE TRACKING ///
/////////////////////

// Initiates an object to store the current place
const current_place = {
    country : '',
    provincia : '',
    localidad : ''
}

///////////////////////////
/// MENUS FUNCTIONALITY ///
///////////////////////////

// Event listener for the breadcrumbs
breadcrumbs.addEventListener("click", e => {

    const breadcrumb_clicado = e.target.closest('.breadcrumbs > span');

    const tipo = breadcrumb_clicado ? breadcrumb_clicado.dataset.breadcrumb : null;

    if (tipo == "pais") countries[last_country].render_pais();
    if (tipo == "ut-maior") countries[last_country].render_provincia(last_provincia_location_data["NAME"]);
    if (tipo == "home") resetToInitialState();
    //if (tipo == "ut-menor") render_localidad(last_localidad_location_data[this.key_name]); // na verdade nao precisa fazer nada, já está no local

})

// Function to reset the paisage type menu
function resetPaisageMenu() {
    // Remove the "has selection" class
    menu_tipo_paisage.classList.remove("tipo-paisage-has-selection");
    
    // Remove "selected" class from all paisage options
    const selectedPaisage = menu_tipo_paisage.querySelector(".tipo-paisage-selected");
    if (selectedPaisage) {
        selectedPaisage.classList.remove("tipo-paisage-selected");
    }
    
    console.log("Paisage menu reset");
}

// Event listener for the tipo paisage button
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

// Event listener for the pais button
menu_pais.addEventListener("click", e => {

    const div_pais = e.target.closest('.menu-pais-dash > div[data-pais]');

    if (div_pais) {
        
        const pais = div_pais.dataset.pais; 

        search_container.querySelector("input[list]").value = "";
        populate_datalist(main_data, pais);

        countries[pais].render_pais();

    }

    resetPaisageMenu();

})

////////////////////////////////////
/// MODAL (POP-UP) FUNCTIONALITY ///
////////////////////////////////////

bg_modal.addEventListener("click", e => {
    toggle_modal("none");
});

btn_close_modal.addEventListener("click", e => {
    toggle_modal("none");
})

function toggle_modal(modal_option) {
    // none closes it
    modal.dataset.modalActive = modal_option;

}

/////////////////////////////
/// DATAVIZ FUNCTIONALITY ///
/////////////////////////////

// Function to get the current level
function get_current_level() {
    return body.dataset.view;
}

function set_current_level(level) {
    body.dataset.view = level;
}

function get_current_country() {
    return text_panel.dataset.country
}

function click_on_datos(e) {

    if (e.target.tagName == "LI") {

        toggle_modal("viz");

        const topic = e.target.dataset.datosTopic;

        const level = get_current_level();
        const country = get_current_country();

        if (level == "pais") {
            visualize_topic(country, topic, level);
        }

        if (level == "provincia") {
            const provincia = last_provincia_location_data.BASIC_INFO.NAME;
            visualize_topic(country, topic, level, provincia);
        }

        if (level == "localidad") {
            const provincia = last_provincia_location_data.BASIC_INFO.NAME;
            const localidad = last_localidad_location_data.BASIC_INFO.NAME;
            visualize_topic(country, topic, level, provincia, localidad);
        }

    }

}

/////////////////////////
/// NAVIGATOR BUTTONS ///
/////////////////////////

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

    if (modo == "provincia") {

        container_btns.dataset.modo = "provincia";

        btns_to_show = ["relato", "datos"];

        if (["Buenos Aires", "Córdoba", "Santa Fe"].includes(last_provincia_location_data.BASIC_INFO.NAME)) {
            show_conteudo("relato con desplegables");
        } else {
            show_conteudo("relato");

        }

        activate_button("relato");

    }

    if (modo == "pais" | modo == "latam") {

        container_btns.dataset.modo = "pais";

        btns_to_show = ["relato", "datos"];
        show_conteudo("relato");
        activate_button("relato");

    }

    btns.forEach(btn => {

        if (btns_to_show.includes(btn.dataset.btnNav)) btn.classList.remove("btn-hidden");
        else btn.classList.add("btn-hidden");

    })

}

function show_conteudo(tipo_conteudo) {

    /*
    if (tipo_conteudo == "relato") {
        container_relato.classList.remove("expandido");
        container_relato.classList.add("recolhido");
    }*/

    // se for datos, monitora click!
    if (tipo_conteudo == "datos") {
        document.querySelector(".dashboard-datos-topics-container").addEventListener("click", click_on_datos);
    } else {

        if (document.querySelector(".dashboard-datos-topics-container")) {
            document.querySelector(".dashboard-datos-topics-container").removeEventListener("click", click_on_datos);
        }
        
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

function update_breadcrumbs(nivel, local) {

    const breadcrumbs = document.querySelector(".breadcrumbs");

    const bc_country = breadcrumbs.querySelector(".breadcrumb-country");
    const bc_ut_maior = breadcrumbs.querySelector(".breadcrumb-ut-maior");
    const bc_ut_menor = breadcrumbs.querySelector(".breadcrumb-ut-menor");

    if (nivel == "pais") {
        bc_ut_maior.classList.add("breadcrumb-inativo");
        bc_ut_menor.classList.add("breadcrumb-inativo");
        bc_country.classList.remove("breadcrumb-inativo"); // Show country and its pipe
        
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

    if (nivel == "home") {
        bc_ut_maior.classList.add("breadcrumb-inativo");
        bc_ut_menor.classList.add("breadcrumb-inativo");
        bc_country.classList.add("breadcrumb-inativo");
    }

}

function update_infocard(name, key, country, tipo) {

    set_current_level(tipo);//body.dataset.view = tipo;
    text_panel.dataset.country = country;

    document.querySelector("[data-infocard-field]").innerHTML = name;

    control_nav_buttons(tipo);

    // to fill the relato within the localidad view in the case of colombia
    if (country == "colombia" && tipo == "localidad") {

        const fields = ["TITLE", 
           	"TEASER", 
            "AUTHOR", 
            //"RELATO",
            //"MEDIO"
            ];

        const mini_data = last_localidad_location_data;
        const narrative_data = mini_data.NARRATIVE

        fields.forEach(field => {

            // While there is no data, we are adding a placeholder. We will remove this once we have data.
            if (!narrative_data[field]) narrative_data[field] = '¡Dentro de poco!';
            
            // Selects the data-value of the field and updates it with the relevant narrative data
            document.querySelector(`[data-relato-colombia-campo="${field}"]`).innerHTML = narrative_data[field];

            /*
            if (field = "AUTHOR") {
                container_relato_colombia.classList.remove("expandido");
                container_relato_colombia.classList.add("recolhido");
            }*/

        })


    }

    if (tipo == "provincia") {

        const fields = ["TITLE", 
            "TEASER", 
            "AUTHOR", 
            //"RELATO", 
            //"MEDIO"
            ];

        // Selects only the data for the current province
        const mini_data = main_data[country].large_units.filter(d => d.BASIC_INFO.NAME == name)[0]
        const narrative_data = mini_data.NARRATIVE;

        // logic for merged provincias
        if ((["Buenos Aires", "Córdoba", "Santa Fe"].includes(name))) {

            const sub_provincias = Object.keys(narrative_data);

            const desplegables_els = document.querySelectorAll(".desplegable-sub-provincia");

            // hides all desplegables
            desplegables_els.forEach(desplegable => desplegable.classList.add("desplegable-inactivo"));

            sub_provincias.forEach( (sub_provincia, i) => {

                // shows the respective desplegable
                desplegables_els[i].classList.remove("desplegable-inactivo");

                // sub_provincia title to show on collapsed view
                desplegables_els[i].querySelector("summary").innerHTML = sub_provincia;

                // updates sub_provincia information to data-attribute, to be used when the user clicks on "LEER MAS"
                desplegables_els[i].querySelector(".leer-mas-desplegable").dataset.subprovincia = sub_provincia;

                fields.forEach(field => {

                    const content = narrative_data[sub_provincia][field];

                    desplegables_els[i].querySelector(`[data-relato-campo-desplegable="${field}"]`).innerHTML = content;

                })

            })



        } else {

            fields.forEach(field => {

                // Updates each data-value field with the relevant narrative data
                document.querySelector(`[data-relato-campo="${field}"]`).innerHTML = narrative_data[field];

                /*
                if (field = "AUTHOR") {
                    container_relato.classList.remove("expandido");
                    container_relato.classList.add("recolhido");
                }*/

            })

        }


        document.querySelector("[data-classification-localidad]").dataset.classificationLocalidad = "";

        // Selects the basic info data and updates the place summary above the view
        const basic_info_data = mini_data.BASIC_INFO;
        update_place_summary(basic_info_data);

        // Computes the classification percentages and updates the barcharts
        const counts = compute_classification(country, name);
        update_classification_barcharts(counts);

    }

    if (tipo == "localidad") {

        // Boolean for detecting if data exists for the current localidad
        const existem_dados = main_data[country].small_units.filter(d => d.BASIC_INFO.KEY == key).length > 0;

        let classification, basic_info_data;

        // If there is data,update the relevant fields
        if (existem_dados) {

            basic_info_data = main_data[country].small_units.filter(d => d.BASIC_INFO.KEY == key)[0].BASIC_INFO;
        
            classification = basic_info_data.CLASSIFICATION;

            document.querySelector("[data-resumen-campo]").innerHTML = classification;
            
            document.querySelector("[data-classification-localidad]").dataset.classificationLocalidad = classification.toLowerCase();

            document.querySelector(`[data-relato-campo="PARENT"]`).innerHTML = basic_info_data.PARENT;


        } else {

            basic_info_data = null;

            document.querySelector("[data-resumen-campo]").innerHTML = "SIN DATOS :(";
            
            document.querySelector("[data-classification-localidad]").dataset.classificationLocalidad = "sin datos";

        }

         update_place_summary(basic_info_data);
         update_classification_barcharts("reset");

    } if (tipo == "pais") {

        // Updates the scope warning text on country change
        const scope_warnings = {

            "argentina" : "Explora las condiciones para el ejercicio del periodismo local en 560 departamentos de Argentina, distribuidos en 23 provincias y en la Ciudad Autónoma de Buenos Aires.",

            "chile" : "Explora las condiciones para el ejercicio del periodismo local en 314 comunas en Chile. El estudio cubre las 16 regiones del país, con cobertura parcial en la Región Metropolitana.",

            "peru" :  "Explora las condiciones para el ejercicio del periodismo local en 244 provincias de Perú, distribuidas en 26 regiones. El estudio incluye Lima Metropolitana, Lima Provincias y el Callao.",

            "mexico": "Explora las condiciones para el ejercicio del periodismo local en 351 municipios de México distribuidos en 31 estados. El estudio incluye 9 de las 16 alcaldías de Ciudad de México.",

            "colombia": "Explora las condiciones para el ejercicio del periodismo local en 34 municipios. La muestra incluye ciudades intermedias, capitales departamentales y municipios estratégicos."
        }

        document.querySelector("[data-tipo-conteudo='scope-warning']").innerHTML = `<p class='scope-warning-text'>${scope_warnings[country]}</p>`;

        const fields = ["TITLE", 
            "TEASER", 
            "AUTHOR", 
            // "RELATO", 
            // "MEDIO"
            ];

        const country_data = main_data[country].country[0];
        console.log(country_data);
        const basic_info_data = main_data[country].country[0].BASIC_INFO;
        const narrative_data = main_data[country].country[0].NARRATIVE;
        console.log(narrative_data);
        
        fields.forEach(field => {
            
            if (narrative_data[field]) {
                console.log("adding data for ", field);
                document.querySelector(`[data-relato-campo="${field}"]`).innerHTML = narrative_data[field];
            } else {
                document.querySelector(`[data-relato-campo="${field}"]`).innerHTML = "Dentro de poco";
            }
            
            if (field = "AUTHOR") {
                container_relato.classList.remove("expandido");
                container_relato.classList.add("recolhido");
            }

        })



        update_place_summary(basic_info_data);
        const counts = compute_classification(country);
        update_classification_barcharts(counts);

    }

}

function update_place_summary(basic_info_data) {

    if (basic_info_data == null) {
        place_summary.classList.add("sin-datos");
        return;
    }
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

// LEER MAS, SHOW RELATO

function show_modal_relato(sub_provincia = undefined) {

    toggle_modal("relato");

    // Get current level and country
    const currentLevel = get_current_level();
    const currentCountry = get_current_country();
   
    let mini_data;
    let narrative_data;
    let province;
    let children_city;

        // Determine which data to use based on current level
        if (currentLevel === "pais" || currentLevel === "latam") {
            // Use country-level data
            mini_data = main_data[currentCountry].country[0];
            narrative_data = mini_data.NARRATIVE;
        } 
        else if (currentCountry === "colombia") {

            mini_data = last_localidad_location_data;
            narrative_data = mini_data.NARRATIVE;
        }
        else {
            // Use province-level data (existing behavior)
            mini_data = last_provincia_location_data;

            narrative_data = mini_data.NARRATIVE;

            // checks if we're in a localidad that was flag as been in one of the merged provincias
            // this flag is set on the click_event_handler of the localidad layer
            if (countries[currentCountry].ut_menor.flag_localidad_in_subprovincia_argentina) {
                sub_provincia = countries[currentCountry].ut_menor.subprovincia_argentina_name;
            }

            if (["Buenos Aires", "Córdoba", "Santa Fe"].includes(last_provincia_location_data.BASIC_INFO.NAME)) {

                narrative_data = narrative_data[sub_provincia];

            }
            
        }

        const fields = ["AUTHOR", "TITLE","TEASER", "RELATO"];

        fields.forEach(field => {
            if (!narrative_data) document.querySelector(`[data-relato-modal-campo=${field}]`).innerHTML = '¡Dentro de poco!';
            else document.querySelector(`[data-relato-modal-campo=${field}]`).innerHTML = narrative_data[field];

        })




}

btn_leer_mas.addEventListener("click", e => {

    show_modal_relato();

    /*
    container_relato.classList.add("expandido");
    container_relato.classList.remove("recolhido");
    */
   

})

btn_leer_mas_colombia.addEventListener("click", e => {

    show_modal_relato();
    //container_relato_colombia.classList.add("expandido");
    //container_relato_colombia.classList.remove("recolhido");

})

btn_leer_provincia_from_localidad.addEventListener("click", e => {

    show_modal_relato();
    //countries[last_country].render_provincia();

})

btns_leer_mas_subprovincia_argentina.forEach(btn => {
    btn.addEventListener("click", e => {

        const sub_provincia = e.target.dataset.subprovincia;

        show_modal_relato(sub_provincia);

    })
})



function update_country_button(pais) {

    menu_pais.classList.add("pais-has-selection");

    const pais_ja_selecionado = menu_pais.querySelector(".pais-selected");

    // remove selected class to current "selected" element
    if (pais_ja_selecionado) pais_ja_selecionado.classList.remove("pais-selected");

    menu_pais.querySelector(`[data-pais="${pais}"]`).classList.add("pais-selected");

}

function compute_classification(country, provincia) {

    let localidads = main_data[country].small_units;

    if (provincia) localidads = localidads.filter(d => d.BASIC_INFO.PARENT == provincia);

    localidads = localidads
        .map(d => d.BASIC_INFO.CLASSIFICATION.toLowerCase())
        .filter(d => d != "sin datos")
    ;

    const n = localidads.length;

    const classifications = [
        //"sin datos", 
        "desierto", "semidesierto", "semibosque", "bosque"
    ];

    const counts = {};

    classifications.forEach(classification => {

        const count = localidads.filter(d => d == classification).length;

        counts[classification] = (100 * count / n).toFixed(1) + "%";

    })

    return counts;

}

function update_classification_barcharts(counts) {

    const barcharts = document.querySelectorAll("[data-barchart]");
    const container = document.querySelector(".place-paisage-composition");
    const container_width = +window.getComputedStyle(container).width.slice(0,-2);

    barcharts.forEach(bar => {

        const tipo = bar.dataset.barchart;
        const label = bar.querySelector("span.barchart-label");

        let value;

        label.classList.remove("displaced");

        if (counts == "reset") {

            bar.style.flexBasis = ""; // é diferente ser 0 (pq aí overrides o estilo da classe) de ""
            label.innerHTML = "";
            //label.classList.remove("displaced");

            return;

        }

        if (counts[tipo] == "0.0%") {

            bar.style.flexBasis = 0;
            label.innerHTML = "";
            //label.classList.remove("displaced");

        } else {

            value = counts[tipo];

            bar.style.flexBasis = value;
            label.innerHTML = value;

            // positioning

            const w_bar = (+value.slice(0,-1)) * container_width / 100;
            const w_label = +window.getComputedStyle(label).width.slice(0,-2);

            if (w_label > w_bar) {
                label.classList.add("displaced");
            }

        }

    })

}

function populate_datalist(data, country = null) {

    const ref_datalist = search_container.querySelector("datalist");

    // resets;
    ref_datalist.innerHTML = "";

    let countries;

    if (country == null) countries = Object.keys(data);
    else countries = [country];

    countries.forEach(country => {

        const country_name = country_names[country];//country[0].toUpperCase() + country.slice(1);

        const localidads = data[country].small_units;
        //const provincias = data[country].large_units;

        if (country != "colombia") {

            /*
            provincias.forEach(row => {

                const new_option = document.createElement("option");

                //const country = row.COUNTRY[0].toUpperCase() + row.COUNTRY.slice(1).toLowerCase();
                
                new_option.label = `${row.BASIC_INFO.NAME}, ${country_name}`
                //row.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                new_option.value = `${row.BASIC_INFO.NAME}, ${country_name}`
                new_option.dataset.tipoLocalidade = "provincia";
                new_option.dataset.key = row.BASIC_INFO.KEY;
                new_option.dataset.country = country;

                ref_datalist.appendChild(new_option);

            })
            */
            
            localidads.forEach(row => {

                const new_option = document.createElement("option");

                //const country = row.COUNTRY[0].toUpperCase() + row.COUNTRY.slice(1).toLowerCase();
                
                new_option.label = `${row.BASIC_INFO.NAME}, ${row.BASIC_INFO.PARENT}, ${country_name}`;
                //row.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                new_option.value = `${row.BASIC_INFO.NAME}, ${row.BASIC_INFO.PARENT}, ${country_name}`;
                new_option.dataset.tipoLocalidade = "localidad";
                new_option.dataset.key = row.BASIC_INFO.KEY;
                new_option.dataset.country = country;
                new_option.dataset.parent = row.BASIC_INFO.PARENT;

                ref_datalist.appendChild(new_option);

            })

        } else {
            // colombia

            localidads.forEach(row => {

                if (row.BASIC_INFO.CLASSIFICATION == "SIN DATOS") return;

                const new_option = document.createElement("option");

                //const country = row.COUNTRY[0].toUpperCase() + row.COUNTRY.slice(1).toLowerCase();
                
                new_option.label = `${row.BASIC_INFO.NAME}, ${row.BASIC_INFO.PARENT}, ${country_name}`;
                //row.text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                new_option.value = `${row.BASIC_INFO.NAME}, ${row.BASIC_INFO.PARENT}, ${country_name}`;
                new_option.dataset.tipoLocalidade = "localidad";
                new_option.dataset.key = row.BASIC_INFO.KEY;
                new_option.dataset.country = country;
                new_option.dataset.parent = row.BASIC_INFO.PARENT;

                ref_datalist.appendChild(new_option);

            })



        }

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

            if (last_country) {
                countries[last_country].clear_country_subnational();
            }

            last_country = country;

            update_country_button(country);
            update_breadcrumbs("pais", country);
            countries_events.monitor_events('off');
            map.setPaintProperty("countries-borders", "line-color", "transparent");
            map.setPaintProperty("countries-fills", "fill-color", "transparent");
            countries[country].paint_country_subnational("on");

            if (tipo == "localidad") {

                const parent = selectedOption.dataset.parent;

                last_localidad_location_data = main_data[country].small_units.filter(d => d.BASIC_INFO.KEY == key)[0];
                last_provincia_location_data = main_data[country].large_units.filter(d => d.BASIC_INFO.NAME == parent)[0];

                update_breadcrumbs('ut-maior', parent);


                countries[country].render_localidad();
                countries[country].ut_menor.monitor_events("on");


            }

            if (tipo == "provincia") {

                last_provincia_location_data = main_data[country].large_units.filter(d => d.BASIC_INFO.KEY == key)[0];
                countries[country].render_provincia();

            }

        }
    });

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

/* Handles the HOME breadcrumb click */

function resetToInitialState() {
    // Reset country selection
    document.querySelectorAll('[data-pais]').forEach(btn => {
        btn.classList.remove('pais-selected');
    });
    
    // Reset paisage selection  
    document.querySelectorAll('[data-tipo-paisage]').forEach(btn => {
        btn.classList.remove('tipo-paisage-selected');
    });
    
    // Clear breadcrumbs and hide country (which hides its pipe)
    update_breadcrumbs("home");

    // Reset text panel to initial state using data attributes
    const textPanel = document.querySelector('.text-panel-container');
    set_current_level("latam");
    textPanel.setAttribute('data-country', '');
    textPanel.setAttribute('data-classification-localidad', '');
    
    // Clear infocard title
    document.querySelector("[data-infocard-field='title']").innerHTML = 'Título del Informe Regional';
    // Reset scope warning to initial text
    document.querySelector('.scope-warning').innerHTML = '¿Tu comunidad vive en un desierto o en un bosque informativo? Haz clic en cualquier país para conocer la clasificación de sus territorios y el perfil de sus ecosistemas informativos.';
    // Set navigation buttons to latam mode
    const navButtons = document.querySelector('.wrapper-btns-nav');
    if (navButtons) {
        navButtons.setAttribute('data-modo', 'latam');
    }
    
    // Show only initial content
    show_conteudo("apresentacao");

    // Reset map to Latin America view
    plot_latam(true); // true = dashboard mode
    
    // Reset fill color back to original orange
    map.setPaintProperty('countries-fills', 'fill-color', '#FF571D');
    map.setPaintProperty('countries-borders', 'line-color', 'black');
    
        
    // Clear any country-specific layers
    if (current_country && countries[current_country]) {
        countries[current_country].clear_country_subnational();
    }
    
    // Reset current_country
    current_country = undefined;
    
    // Re-enable country click events
    countries_events.monitor_events("on");
    
    // Clear search input
    const searchInput = document.getElementById('dash-ubicacion');
    if (searchInput) {
        searchInput.value = '';
    }
}
