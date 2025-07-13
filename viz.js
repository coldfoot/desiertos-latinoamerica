const topics = {

    "HIRING" : {

        title : '¿Qué tipo de vínculo laboral tienen los periodistas?',

        subtitle : "<span data-viz-subtitle-field='highest-pct'></span> de los <span data-viz-subtitle-field='higher-pct'></span> medios de <span data-viz-subtitle-field='unit name'></span> contratan periodistas por meio de <span data-viz-subtitle-field='highest-pct-category'></span>, enquanto en <span data-viz-subtitle-field='upper unit name'> esta porcentaje es de <span data-viz-subtitle-field='upper unit value'>",

    },

    'PLATFORMS' : {

        title : 'Plataformas?',

        subtitle : 'Mergulho?'

    }

}

function visualize_topic(country, topic, level, provincia = undefined, localidad = undefined) {

    const title = document.querySelector(".viz-main-title");
    const subtitle = document.querySelector(".viz-subtitle");
    const global_container = document.querySelector(".minicharts-global-container");

    title.innerHTML = topics[topic].title;
    subtitle.innerHTML = topics[topic].subtitle;
    global_container.innerHTML = "";

    const summary = prepare_data(country, topic, level, provincia, localidad);

    const data = summary.data;
    const categories = summary.categories;

    categories.forEach(category => {

        console.log(topic, category, data, data[category]);

        const chart = new Chart(
            topic,
            category,
            data[category]
        )

    })



}

// will need access to main_data variable
function prepare_data(country, topic, level, provincia = undefined, localidad = undefined) {
    const startTime = performance.now();

    console.log(level);

    let pre_data;

    if (level == "country") {

        pre_data = main_data[country]["large_units"];

    } else {

        pre_data = main_data[country]["small_units"].filter(d => d.BASIC_INFO.PARENT == provincia);

    }

    const prepared_data = {};

    const categories = Object.keys(main_data[country].country[0][topic]).filter(d => d.slice(-3) == "PCT");

    categories.forEach(category => {

        prepared_data[category] = pre_data.map(
            function(unit) {

                // para destacar o próprio local
                let flag_self;

                if (level == "large_units") {
                    if (unit.BASIC_INFO.NAME == provincia) {
                        flag_self = true;
                    }
                }

                if (level == "small_units") {
                    if (unit.BASIC_INFO.NAME == localidad) {
                        flag_self = true;
                    }
                }

                return ({

                    "name" : unit.BASIC_INFO.NAME,
                    "value" : unit[topic][category],
                    "type" : flag_self ? "highlight" : ""

                })

            } 
        )

        // adiciona a media do país
        prepared_data[category].push({
            "name" : "Promedio " + country,
            "value" : main_data[country].country[0][topic][category],
            "type" : "promedio-country"
        })

        if (level == "small_units") {

            console.log(level, "por que estou aqui?")

            // adiciona a media da provincia
            prepared_data[category].push({
                "name" : "Promedio " + provincia,
                "value" : main_data[country].large_units.filter(d => d.BASIC_INFO.NAME == provincia)[0][topic][category],
                "type" : "promedio-provincia"
            })

        }

    })

    return {
        categories: categories,
        data: prepared_data
    }

}

class Chart {

    constructor(topic, category, data) {

        this.data = data;

        this.h = 100;
        this.w = 300;
        this.ml = 20; // lateral margin
        this.mtop = 15; // vertical margin
        this.strip_length = 40;
        this.gap = 5;

        this.y1 = this.mtop;
        this.y2 = this.mtop + this.strip_length;

        this.container = d3.select(".minicharts-global-container");

        this.category = category;

        this.topic = topic;

        this.prepare_elements();
        this.make_scales();
        this.make_background();
        this.draw();
        this.make_axis();
        this.adds_labels();

    }

    prepare_elements() {

        this.chart = this.container.append("div");
        this.chart.classed("mini-chart-container", true);

        this.chart.append("h4").classed("mini-chart-title", true).text(this.category);

        this.tooltipContainer = this.chart.append("div");
        this.tooltipContainer.classed("mini-chart-tooltip-container", true);

        this.svg = this.tooltipContainer.append("svg");
        this.svg
            .classed("mini-chart", true)
            .attr("data-mini-chart-category", this.category)
            .attr("viewBox", `0 0 ${this.w} ${this.h}`)
            .attr("width", this.w)
            .attr("height", this.h)
        ;

        this.promedio_country_label = this.tooltipContainer.append("span").classed("minichart-promedio-country-label", true);
        this.promedio_provincia_label = this.tooltipContainer.append("span").classed("minichart-promedio-provincia-label", true);

    }

    make_scales() {

        this.x = d3.scaleLinear()
            .domain([0, 1])
            .range([this.ml, this.w - this.ml])
        ;

    }

    make_background() {

        this.svg.append("rect")
           .classed("striplot-bg", true)
           .attr("x", this.x(0))
           .attr("width", this.x(1)-this.x(0))
           .attr("y", this.y1)
           .attr("height", this.strip_length)
        ;

    }

    draw() {

        this.strips = this.svg.selectAll("line.strip")
            .data(this.data)
            .join("line")
            .classed("strip", true)
            .attr("data-strip-type", d => d.type)
            .attr("x1", d => this.x(d.value))
            .attr("x2", d => this.x(d.value))
            .attr("y1", this.y1)
            .attr("y2", this.y2)
        ;

    }

    make_axis() {

        const ticks = [
            {
                value : 0,
                label : "0%"
             }, 
            {
                value : 1,
                label : "100%"
            }];

        this.ticks = this.svg.selectAll("line.tick")
            .data(ticks)
            .join("line")
            .classed("tick", true)
            .attr("x1", d => this.x(d.value))
            .attr("x2", d => this.x(d.value))
            .attr("y1", this.y2 + this.gap)
            .attr("y2", this.y2 + 2.5*this.gap)
        ;

        this.labels = this.svg.selectAll("text.label")
            .data(ticks)
            .join("text")
            .classed("label", true)
            .attr("x", d => this.x(d.value))
            .attr("y", this.y2 + 4 * this.gap)
            .text(d => d.label)
        ;        

    }

    adds_labels() {

        const strip_promedio_country = this.svg.select("[data-strip-type='promedio-country']");
        this.promedio_country_label
            .style("top", strip_promedio_country.attr("y1") + "px")
            .style("left", strip_promedio_country.attr("x1") + "px")
            .text(strip_promedio_country.datum().name.replace("Promedio ", ""))
        ;

        // first check if there is a strip for the provincia (There won't be one if the level is "country")
        if (this.svg.select("[data-strip-type='promedio-provincia']").nodes().length > 0) {

            const strip_promedio_provincia = this.svg.select("[data-strip-type='promedio-provincia']");
            this.promedio_provincia_label
                .style("top", strip_promedio_provincia.attr("y1") + "px")
                .style("left", strip_promedio_provincia.attr("x1") + "px")
                .text(strip_promedio_provincia.datum().name.replace("Promedio ", ""))
            ;

            // checks which one needs to go right or left

            if (strip_promedio_country.attr("x1") > strip_promedio_provincia.attr("x1")) {
                this.promedio_provincia_label.classed("make-left", true);
            } else {
                this.promedio_country_label.classed("make-left", true)
            }

        }

    }

    adds_interaction() {

        this.strips.on("hover", (d) => {

            console.log(d);

        })

    }

    showTooltip() {

    }

}