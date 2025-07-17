const topics = {

    "HIRING" : {

        title : '¿Qué tipo de vínculo laboral tienen los periodistas?',

        //subtitle : "<span data-viz-subtitle-field='highest-pct'></span> de los <span data-viz-subtitle-field='higher-pct'></span> medios de <span data-viz-subtitle-field='unit name'></span> contratan periodistas por meio de <span data-viz-subtitle-field='highest-pct-category'></span>, enquanto en <span data-viz-subtitle-field='upper unit name'> esta porcentaje es de <span data-viz-subtitle-field='upper unit value'>",
        subtitle: "Porcentaje de medios que contratan periodistas mediante…"
    },

    'PLATFORMS' : {

        title : '¿En qué plataforma publican los medios?',

        subtitle : 'Porcentaje de medios…'

    },

    "INCOME" : {

        title : '¿De dónde provienen sus ingresos?',

        subtitle : 'Porcentaje de medios que reciben ingresos provenientes de…'

    },

    "THEMES" : {

        title : '¿En qué plataformas publican?',

        subtitle : 'Porcentaje de medios que tienen presencia en…'

    },

    "THREATS" : {

        title : '¿Experimentaron agresiones o amenazas en 2024?',

        subtitle : 'Porcentaje de medios cuyos periodistas sufrieron….'

    }

    

}

function visualize_topic(country, topic, level, provincia = undefined, localidad = undefined) {

    const title = document.querySelector(".viz-main-title");
    const subtitle = document.querySelector(".viz-subtitle");
    const global_container = document.querySelector(".minicharts-global-container");

    console.log(country, topic, level, title);

    title.innerHTML = topics[topic].title;
    subtitle.innerHTML = topics[topic].subtitle;
    global_container.innerHTML = "";

    const summary = prepare_data(country, topic, level, provincia, localidad);

    const data = summary.data;
    const categories = summary.categories;

    categories.forEach(category => {

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

    let pre_data;

    if (level == "pais") {

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

                /*
                if (level == "provincia") {
                    if (unit.BASIC_INFO.NAME == provincia) {
                        flag_self = true;
                    }
                }*/

                if (level == "localidad") {
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

        if (level != "pais") {

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
        this.label_height = 15;
        this.mtop = 2 * this.label_height; // vertical margin
        this.strip_length = 40;
        this.gap = 5;

        this.strip_width = 3;
        this.strip_opacity = 0.2;

        this.y1 = this.mtop;
        this.y2 = this.mtop + this.strip_length;

        this.container = d3.select(".minicharts-global-container");

        this.category = category;
        this.category_adjusted = category.replace("_PCT", "").replace("_", " ");

        this.topic = topic;

        this.prepare_elements();
        this.make_scales();
        this.make_background();
        this.draw();
        this.make_axis();
        this.adds_labels();
        this.adds_interaction(this);

    }

    prepare_elements() {

        this.chart = this.container.append("div");
        this.chart.classed("mini-chart-container", true);

        this.chart.append("h4").classed("mini-chart-title", true).text(this.category_adjusted);

        this.tooltipContainer = this.chart.append("div");
        this.tooltipContainer.classed("mini-chart-tooltip-container", true);

        this.tooltip = this.tooltipContainer.append("span")
            .classed("mini-chart-tooltip", true)
            .style("top", 0)
        ;

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
            .attr("stroke-width", this.strip_width)
            .attr("opacity", this.strip_opacity)
            .attr("x1", d => this.x(d.value))
            .attr("x2", d => this.x(d.value))
            .attr("y1", d => (d.type.search("promedio") > -1 ) ? this.y1 - this.label_height : this.y1)
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

        // first check if there is a strip for the provincia (There won't be one if the level is "pais")
        if (this.svg.select("[data-strip-type='promedio-provincia']").nodes().length > 0) {

            const strip_promedio_provincia = this.svg.select("[data-strip-type='promedio-provincia']");
            this.promedio_provincia_label
                .style("top", strip_promedio_provincia.attr("y1") + "px")
                .style("left", strip_promedio_provincia.attr("x1") + "px")
                .text(strip_promedio_provincia.datum().name.replace("Promedio ", ""))
            ;

            // checks which one needs to go right or left

            if (+strip_promedio_country.attr("x1") > +strip_promedio_provincia.attr("x1")) {
                this.promedio_provincia_label.classed("make-left", true);
            } else {
                this.promedio_country_label.classed("make-left", true)
            }

        }

    }

    adds_interaction(self) {
        
        this.strips.on("mouseover", function(e) {

            const d = d3.select(this).datum();

            d3.select(this).transition().duration(100)
                .attr("y1", 0)
                .attr("stroke-width", 4)
                .attr("opacity", 1)
            ;

            self.showTooltip(true, d);



        })

        this.strips.on("mousemove", function(e) {

            const d = d3.select(this).datum();

            d3.select(this).transition().duration(100)
                .attr("y1", 0)
                .attr("stroke-width", 4)
                .attr("opacity", 1)
            ;

            self.showTooltip(true, d);

        })

        this.strips.on("mouseout", function(e) {

            const d = d3.select(this).datum();

            d3.select(this).transition().duration(100)
                .attr("y1", (d.type.search("promedio") > -1 ) ? self.y1 - self.label_height : self.y1)
                .attr("stroke-width", self.strip_width)
                .attr("opacity", self.strip_opacity)
            ;

            self.showTooltip(false);

        })

    }

    showTooltip(mode = true, d) {

        this.tooltip.classed("tooltip-visible", mode);
        
        if (d) {
            this.tooltip.text(d.name + ': ' + (d.value * 100).toFixed(2) + "%");
            this.tooltip
                .style("left", this.x(d.value) + "px")
                .classed("make-left", (this.x(d.value) > this.w/2) )
        }

    }

}
