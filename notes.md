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


# To-do

Mudar bbox para América do Sul?
remover textos do estilo?
Reflow quando hover nos itens do menu de paises do dashboard
Flashes no mapa? Que diabo é isso?

