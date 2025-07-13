Location: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

https://css-tricks.com/gooey-effect/

https://stackoverflow.com/questions/59828938/multi-line-padded-text-with-outer-and-inner-rounded-corners-in-css


```js
map.queryRenderedFeatures({target: {layerId: 'countries-fills'}})
```

Menu paisage
`tipo-paisage-has-selection`
``


Ter uma variável "local", com todos os dados para os breadcrumbs
E ter uma função `render_place()`, por exemplo.

# Úteis

```js
map.queryRenderedFeatures({ layers: ['Chile-localidad'], }).map(d => d.properties.CLASSIFICATION).filter((d,i,a) => a.indexOf(d) == i)
```

# Data structures

Mais organizado ou flat?

Mais genérico, ou um array para cada país, para cada provincia?

```js

const dados_versao_pais = {

    "Argentina" : {

        'uts-maiores' : [
            {
                name : '',

                center : '',

                bbox : '',

                avg_value_of_variable : '',

                'etc'
            }
        ]

    }


}

const dados_versao_generico_hierarquicos = [

    {

        id : '',

        level : '', // country / ut_maior / ut_menor

        name : '',

        center : [], // [lat, lon]

        bbox : [], // [lat0, lon0, lat1, lon1]

        breadcrumbs : {

            country : '',
            ut_mayor : '',
            ut_menor : ''

        },

        header_data : {

            pop : '',
            superficie : '',
            proyectos : '',
            periodistas : ''

        },

        type : '', // desierto / semidesierto / ...

        distribution_types : {
            'desiertos' : '',
            'semidesiertos' : '',
            'semibosques' : '',
            'bosques' : ''
        },

        main_data : {

            // no caso de uts maiores e paises, trazer as médias?

            plataforma : '',
            vinculo_laboral : '',
            temas: '',
            ...         

        },

        relato : [p, p, ...],

        medio : ''

    }
]

const summary_data = [];

```

Gooey Effect: https://css-tricks.com/gooey-effect/

# To-do

Deixar key, xc, yc, bbox?

[ ] Completar "topics"
[ ] Ajeitar relato
[ ] Estilizar "datos"
[ ] Download CSV
[ ] Download PNG

[x] Definit opacity, stroke-width no próprio svg com d3?

[x] Visualizações!
[ ] Trocar bolhas por símbolos.
[ ] Modal Relato
[ ] Refinar CSS Dash
[ ] Incluir caixas informativas.
[x] Ajustes no design, para aproximar
[x] visao inicial latam, pq esse zoom ridículo?
[x] textos dos países
[x] alterar render_provincia
[x] Passos da história
[x] Dash / Barras de percentuais
[x] Dash / Textos dos tipos de terreno
[ ] Dados demais países história
[ ] Evitar que a pessoa caia no meio da história
[ ] Ver o toggle_highlight do UT menor. Método parece precisar de melhora.

Mudar bbox para América do Sul?
remover textos do estilo?
Reflow quando hover nos itens do menu de paises do dashboard
Flashes no mapa? Que diabo é isso?
Incluir tipo na argentina.
Por a camada do hover acima.
Leer MAs: incluir uma animação?

# Perguntas

Faz sentido ter o botão de tipo de terreno na visão global de todos os países juntos?

# Problemas

Monitor de eventos não parece estar sendo desligado

# Ideias scroller

```js
            monitora_steps : () => {

                const steps = document.querySelectorAll('.linechart-steps-regioes');

                steps.forEach(step => {

                    const step_name = step.dataset.linechartStep;
                    const selector = '[data-linechart-step="' + step_name + '"]';

                    gsap.to(

                        selector, // só para constar, não vamos fazer nada com ele, na verdade

                        {
                            scrollTrigger : {
                                trigger: selector,
                                markers: false,
                                toggleClass: 'active',
                                pin: false,
                                start: "25% 60%",
                                end: "75% 40%", 

                                onEnter : () => v.scroller.linechart_regioes.render[step_name](forward = true),
                                onEnterBack : () => v.scroller.linechart_regioes.render[step_name](forward = false),
                                onLeave : () => v.scroller.linechart_regioes.render[step_name](forward = true),
                                onLeaveBack : () => v.scroller.linechart_regioes.render[step_name](forward = false)

                            }
        
                        })
                    ;


                })
```

