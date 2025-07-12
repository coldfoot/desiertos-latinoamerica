const topics = {

    "HIRING" : {

        title : '¿Qué tipo de vínculo laboral tienen los periodistas?',

        subtitle : "<span data-viz-subtitle-field='highest-pct'></span> de los <span data-viz-subtitle-field='higher-pct'></span> medios de <span data-viz-subtitle-field='unit name'></span> contratan periodistas por meio de <span data-viz-subtitle-field='highest-pct-category'></span>, enquanto en <span data-viz-subtitle-field='upper unit name'> esta porcentaje es de <span data-viz-subtitle-field='upper unit value'>",

    }

}

function visualize_topic(country, topic, level, unit) {

    const title = document.querySelector(".viz-main-title");
    const subtitle = document.querySelector(".viz-subtitle");
    const global_container = document.querySelector(".minicharts-global-container");

    title.innerHTML = topics[topic].title;
    subtitle.innerHTML = topics[topic].subtitle;
    global_container.innerHTML = "";

}

// will have access to main_data variable
function summarize_data(country, topic, level) {
    const startTime = performance.now();
    let summarized_data;
    let sub_level;

    if (level == "country") {

        sub_level = "large_units";

    } else {

        if (level == "large_units") {

            sub_level = "small_units";

        }

    }

    const prepared_data = {};

    const categories = Object.keys(main_data[country][sub_level][0][topic]);

    categories.forEach(category => {

        prepared_data[category] = main_data[country][sub_level].map(unit => ({

            "name" : unit.BASIC_INFO.NAME,
            "value" : unit[topic][category]

            })
        )

    })

    const endTime = performance.now();
    return (endTime - startTime);
    //return prepared_data;

}

class Chart {

    constructor(topic, category) {

        this.container = d3.select(".minicharts-global-container");

        this.category = category;
        this.topic = topic;

        this.prepare_elements();

    }

    prepare_elements() {

        this.chart = this.container.append("div");
        this.chart.classed("mini-chart-container", true);

        this.chart.append("h4").classed("mini-chart-title", true).text(this.category);

        this.svg = this.chart.append("svg");
        this.svg
            .classed("mini-chart", true)
            .attr("data-mini-chart-category", this.category)
        ;

    }

    draw() {



    }

}