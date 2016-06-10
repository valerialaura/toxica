// Abstract: En document.ready carga datos y los pone en un array


var spreadSheet ='https://docs.google.com/spreadsheets/d/1DmE7yv8JmUIpQQ1lhEam6e33aslSg84Gws2VJbmjnQo/edit#gid=1860459801';
var hayDatos = false;
var datos = [];
var centroides = [];
var xScale, yScale, svg, dataset, xAxis, yAxis, path, temp;
var radio = 5;
var divDeVizualizacion = ".content__item--show #grafico";

// Abstract: Crea el scatterplot
// Param: @Array = datos  
function dibujoGrafico(datos) {
    dataset = cambioDataset(datos);
    var canvas_width = $(divDeVizualizacion).width();
    var canvas_height = $(divDeVizualizacion).height();
    var padding = 50;

    xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[1];
        })])
        .range([padding, canvas_width - padding]);

    yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[2];
        })])
        .range([canvas_height - padding, padding]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    svg = d3.select("svg")
        .append("g")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox', '0 0 ' + Math.max(canvas_width, canvas_height) + ' ' + Math.min(canvas_width, canvas_height))
        .attr('preserveAspectRatio', 'xMinYMin');

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circulo")
        .attr("cx", function(d) {
            return xScale(d[1]);
        })
        .attr("cy", function(d) {
            return yScale(d[2]);
        })
        .attr("r", radio)
        .attr("value", function(d) {
            return d[2]
        })
        .on("mouseover", function(d) {
            console.log(d[0]);
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("id", "xAxis")
        .attr("transform", "translate(0," + (canvas_height - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("id", "yAxis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    d3.select(".content__item--show #cambiador")
        .on("change", function() {
            updateData();
        });
}

// Abstract: Mueve puntos del grafico al centroide del mapa
function dataToMap() {
    svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(500)
        .each("start", function() {
            d3.select(this);
        })
        .delay(function(d, i) {
            return i / dataset.length * 10;
        })
        .ease("variable")

    //sacar centroides y mover en funcion de eso.
    .attr("cx", function(d) {
            console.log (">>d",dataset);
            return centroides[centroides.indexOf(d[0]) - 1][0];
        })
        .attr("cy", function(d) {
            return centroides[centroides.indexOf(d[0]) - 1][1];
        })

    .each("end", function() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", radio + 7);
    });
};



// Abstract: Cambia la posicion de los puntos del scatterplot
// al value del select que esté seleccionado
function updateData() {
    dataset = cambioDataset(datos);

    xScale.domain([0, d3.max(dataset, function(d) {
        return d[1];
    })]);
    yScale.domain([0, d3.max(dataset, function(d) {
        return d[2];
    })]);

    svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(500)
        .each("start", function() {
            d3.select(this)
                .attr("class", function(d, i) {
                    var filtro;
                    try {
                        filtro = $(".content__item--show #cambiador option:selected").attr("filtro");
                        filtro = filtro.split(",");
                        for (var i = 0; i < filtro.length; i++) {
                            if (!filtro[i].trim().indexOf(d[0])) {
                                return "circulo";
                            }
                        }
                    } catch (err) {
                        return "circulo";
                    }
                    return "circuloDim";
                });
        })
        .delay(function(d, i) {
            return i / dataset.length * 10;
        })
        .ease("variable")
        .attr("cx", function(d) {
            return xScale(d[1]);
        })
        .attr("cy", function(d) {
            return yScale(d[2]);
        })

    .each("end", function() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", radio);
    });

    svg.select(".x.axis")
        .transition()
        .duration(800)
        .call(xAxis);

    svg.select(".y.axis")
        .transition()
        .duration(800)
        .call(yAxis);
};

// Abstract: convierte un objeto de datos a CSV  
// Param: @String; @Object, @Object  
var cargoDatosEnArray = function(error, options, response) {
    if (!error) {
        hayDatos = true;
        jQuery.each(response.rows, function(index, value) {
            // las propiedades de las celdas son los titulos del spreadsheet
            // y son case sensitive (no usar espacios ni caracteres raros)
            var fila = [
                value.cells.partido,
                value.cells.indicador_poblacion,
                value.cells.indicador_hogares,
                value.cells.indicador_superficie,
                value.cells.indicador_presupuesto_per_capita,
                value.cells.salud_establecimientos,
                value.cells.salud_camas,
                value.cells.salud_establecimientos_1000,
                value.cells.salud_establecimientos_10000,
                value.cells.salud_camas_1000,
                value.cells.salud_establecimientos_KM,
                value.cells.salud_tasa_mortalidad_infantil,
                value.cells.infraestructura_red_de_agua,
                value.cells.infraestructura_red_de_agua_porcentaje,
                value.cells.infraestructura_red_de_gas,
                value.cells.infraestrtuctura_red_de_gas_porcentaje,
                value.cells.infraestructura_red_de_cloacas,
                value.cells.infraestructura_red_de_cloacas_porcentaje,
                value.cells.educacion_total_unidades_educativas,
                value.cells.educacion_total_alumnos,
                value.cells.educacion_unidades_educativas,
                value.cells.educacion_alumnos,
                value.cells.educacion_porcentaje_unidades_educativas_estatales,
                value.cells.educacion_porcentaje_asistencia_unidades_educativas_estatales,
                value.cells.educacion_unidades_educativas_privadas,
                value.cells.educacion_alumnos_privadas,
                value.cells.educacion_porcentaje_unidades_educativas_privadas,
                value.cells.educacion_porcentaje_asistencia_unidades_educativas_privadas,
                value.cells.educacion_porcentaje_poblacion_asistencia_unidad_educativa,
                value.cells.educacion_cantidad_unidades_educativas_cada_10000,
                value.cells.educacion_cantidad_unidades_educativas_por_km2,
                value.cells.educacion_porcentaje_poblacion_edad3_uso_pc,
                value.cells.educacion_analfabetismo_poblacion_edad10mas,
                value.cells.educacion_analfabetismo_nominal
            ];

            datos.push(fila);
        });
    } else {
        //lleno con datos falsos y aviso
        alert("No se pudieron cargar los datos. Estos datos son genéricos");
        for (var i = 0; i < 30; i++) {
            var linea = [];
            for (var p = 0; p < 6; p++) {
                if (p === 0) {
                    linea.push("Partido " + i);
                } else {
                    linea.push((Math.random() * 100).toFixed() + 30);
                }
            }
            datos.push(linea);
        };
    }
    console.log(datos);
    dibujoGrafico(datos);
};

// Abstract: Cargo datos de un spreadsheet, dibuja la tabla y
// llama por callback a una funcion que pasa esos datos a un array
// Param: @String = ID de la tabla  
function cargaDatos() {
    if (!hayDatos){
        var archivo = sheetrock({
            url: spreadSheet,
            query: "select *",
            callback: cargoDatosEnArray
        });
    }else{
        dibujoGrafico(datos);
    }
}

// Abstract: Cambio el array de datos a dibujar en el gráfico
// dependiendo los valores que estan en el select
// Param: @object = datos del spreadsheet  
function cambioDataset(datos) {
    var valores = $(".content__item--show #cambiador").val();
    console.log(valores);
    var array_de_datos = [];
    for (var i = 1; i < datos.length - 1; i++) {
        var dato1 = +datos[i][valores.split(",")[0]];
        var dato2 = +datos[i][valores.split(",")[1]];
        var nombrePartido = datos[i][0];
        array_de_datos.push([nombrePartido, dato1, dato2]);
    }
    return array_de_datos;
}

// Abstract: Cambia el ancho y alto del svg del gráfico
// Esto no tiene mucho sentido si el div que
// lo contiene es de ancho y alto fijos.
function responsiveSVG() {
    $("svg").width($(divDeVizualizacion).width());
    $("svg").height($(divDeVizualizacion).height());
}


// Abstract: carga el mapa en el div de mapa.
function cargaMapa() {
    var width = $(divDeVizualizacion).width(),
        height = $(divDeVizualizacion).height();

    var projection = d3.geo.mercator()
        .center([-58.40000, -34.50500])
        .scale(15000)
        .translate([width / 2, height / 2]);

    path = d3.geo.path()
        .projection(projection);

    var svg = d3.select(divDeVizualizacion).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox', '-20 0 ' + Math.max(width, height) + ' ' + Math.min(width, height))
        .attr('preserveAspectRatio', 'xMinYMin');

    d3.json("data/gba.json", function(error, gba) {

        var data = topojson.feature(gba, gba.objects.conurbano).features;

        var g = svg.append("g").attr("id", "mapa").attr("class", "invisible");

        g.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", path)
            .datum(topojson.feature(gba, gba.objects.conurbano))
            .attr("value", function(d, i) {
                return d.features[i].properties["distrito"]
            })
            .on("mouseover", function(d, i) {
                console.log(d.properties.distrito);
            });


        calculoCentroide(data);
    });
    return true;
}

// Abstract: dado un array de paths saca el centroide
function calculoCentroide(data) {
    var paths = d3.selectAll(divDeVizualizacion + " path")
        .data(data);
    paths
        .each(function(d, i) {
            centroides.push(path.centroid(data[i].geometry), data[i].properties.distrito);
        });
}

//listeners
$(window).on("resize", function() {
    responsiveSVG();
});





// Abstract: Dibuja el grafico en el div especificado en la var global divDeVizualizacion
// Esta funcion se debe llamar al abrir el card.
function armaVisualizacion() {

    // bindeo click checkbox
    $(".content__item--show #verMapa").click(function() {
        if ($(this).prop('checked')) {
            $(".content__item--show #mapa").attr("class", "visible");
            $(".content__item--show #cambiador").attr("class", "invisible");
            $(".content__item--show #xAxis").attr("class", "x axis invisible");
            $(".content__item--show #yAxis").attr("class", "y axis invisible");
            dataToMap();
        } else {
            $(".content__item--show #mapa").attr("class", "invisible")
            $(".content__item--show #cambiador").attr("class", "visible");
            $(".content__item--show #xAxis").attr("class", "x axis visible");
            $(".content__item--show #yAxis").attr("class", "y axis visible");
            updateData(); // vuelven los circulos a scatterplot
        }

    });
    cargaMapa();
    cargaDatos();

};