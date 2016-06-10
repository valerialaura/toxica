var objectGraph = ".content__item--show .grafico";
var radioDefault = 8; //el radio por default si no hay dato de radio
var svg;
var temp;

// From Nadieh Bremer, quick fix for resizing some things for mobile-ish viewers
var mobileScreen = ($( window ).innerWidth() < 500 ? true : false);

// globales que usa el grafico para armarse
// deben updatearse antes de llamar un grafico o updatearlo
var columnaX = 1;
var columnaY = 2;
var radio = 0;
var filtro = "";
var tasa = "";
var porcentaje = "";
var height = "";
var width = "";


var miles = d3.format(",d");

// console.log(tasa)

// Abstract: Cambio el array de datos a dibujar en el gráfico
// dependiendo los valores que estan en el select
// Param: @object = datos del spreadsheet  
function updateKeys() {
    //saco medidas para recalcular el grafico (RES)
    height = $(".grafico").height();
    width = $(".grafico").width();

    columnaX = parseInt(window.columnaX);
    columnaY = parseInt(window.columnaY);
    radio = parseInt(window.radio);
    tasa = parseInt(window.tasa);
    porcentaje = parseInt(window.porcentaje);

    // console.log(tasa)

    //estas variables deben popularse al seleccionar una historia o tarjeta
    // columnaX = Math.floor((Math.random() * 32) + 1);
    // columnaY = Math.floor((Math.random() * 32) + 1);
    // radio = Math.floor((Math.random() * 32) + 1);
    // filtro = "";
}

// Abstract: Cambio el array de datos a dibujar en el gráfico
// dependiendo los valores que estan en el select
// Param: @object = datos del spreadsheet  
function cambioDataset(datos) {

    var array_de_datos = [];

    labelX = reemplazar[datos[0][columnaX]].value;
    labelY = reemplazar[datos[0][columnaY]].value;
    if (tasa > 0) { 
        labelTasa = reemplazar[datos[0][tasa]].value;
    }
    if (porcentaje > 0) { 
        labelPorcentaje = reemplazar[datos[0][porcentaje]].value;
    }
    // console.log(reemplazar[datos[0][tasa]].value)


    for (var i = 1; i < datos.length; i++) {
        var nombrePartido = datos[i][0];
        var dato1TMP = +datos[i][columnaX];
        var dato2TMP = +datos[i][columnaY];
        if (radio > 0) {
            radioTMP = +datos[i][radio];
        } else {
            radioTMP = +radioDefault;
        }
        var dato3TMP = +datos[i][filtro];

        if (tasa > 0) {
            dato4TMP = +datos[i][tasa];
        } else {
            dato4TMP = 0;
        }

        if (porcentaje > 0) {
            dato5TMP = +datos[i][porcentaje];
        } else {
            dato5TMP = 0;
        }


        array_de_datos.push([nombrePartido, dato1TMP, dato2TMP, radioTMP, dato3TMP, dato4TMP, dato5TMP]);
        // console.log(nombrePartido, dato1TMP, dato2TMP, radioTMP, dato3TMP, dato4TMP, dato5TMP)
    }


    return array_de_datos;
}

// Abstract: Crea el scatterplot
// Param: @Array = datos  
function addGraph() {
    var dataset = cambioDataset(datosTotales);

    console.table(dataset);

    if (!mobileScreen) {
        var padding = 50;
    } else {
        var padding = 30;
    }
    

    xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[1];
        })])
        .range([padding, width - padding]);

    yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return d[2];
        })])
        .range([height - padding, padding]);

    rScale = d3.scale.sqrt()
        .range([mobileScreen ? 1 : 3, mobileScreen ? 5 : 15])
        .domain([0, d3.max(dataset, function(d) {
            return d[3];
        })]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(mobileScreen ? 4 : 8);

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(mobileScreen ? 4 : 6, "s");

    /* Initialize tooltip */
    tip = d3.tip().attr('class', 'd3-tip').html(function(d) {



        var content = "Partido: <strong>" + d[0] +"</strong>";

            content += "<br>"+ labelX +": <strong>" + miles(d[1]) +"</strong>";
            content += "<br>"+ labelY +": <strong>" + d[2] +"</strong><br>";
            if (radio) {
                content += "Presupuesto per capita: <strong>" + miles(Math.floor(d[3])) +"</strong><br>";
            }
            if (tasa) {
                content += labelTasa +": <strong>" + d[5] +"</strong><br>";
            }
            if (porcentaje) {
                content += labelPorcentaje +": <strong>" + d[6] +"</strong>";
            }
            

        return content;

        // return  + '<br>'+labelX + '<br>'+labelY;
    });



    svg = d3.select(objectGraph).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox', '0 0 ' + Math.max(width, height) + ' ' + Math.min(width, height))
        .attr('preserveAspectRatio', 'xMinYMin');

    svg.call(tip);

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
        .attr("r", function(d) {
            if (radio) {
                return rScale(d[3]);
            } else {
                return radioDefault;
            }
        })
        .attr("value", function(d) {
            return d[0]
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       .attr("class", "label")
       .text(function(d) {
               return d[0];
        })
       .attr("x", function(d) {
           return xScale(d[1]) + 15;  // Returns scaled location of x
       })
       // .attr("text-anchor","middle")
       .attr("y", function(d) {
           return yScale(d[2])+3;  // Returns scaled circle y
       })
       .style("font-size", (mobileScreen ? 8 : 11) + "px")
       .attr("text-anchor", "start")
       .attr("class", function (d,i) {
            var filtros;
            try {
                filtros = filtro.split(",");
                for (var i = 0; i < filtros.length; i++) {
                    if (!filtros[i].trim().indexOf(d[0])) {
                        return "labelOn";
                    }
                }
            } catch (err) {
                return "circulo";
            }
            return "labelOff";
       })
       .attr("fill", "white");

    svg.append("g")
        .attr("class", "x axis")
        .attr("id", "xAxis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .style("font-size", (mobileScreen ? 7 : 12) + "px")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("id", "yAxis")
        .attr("transform", "translate(" + padding + ",0)")
        .style("font-size", (mobileScreen ? 7 : 12) + "px")
        .call(yAxis);

    svg.select("#xAxis")
        .append('text')
        .attr("id", "labelX")
        .attr('text-anchor', 'end')
        .attr("transform", "translate(" + (width - padding) + ", -10)")
        .text(labelX);

    svg.select("#yAxis")
        .append('text')
        .attr("id", "labelY")
        .attr('text-anchor', 'end')
        .attr("transform", "translate("+(mobileScreen ? 15 : 20)+","+(mobileScreen ? 30 : 50)+") rotate(-90)")        
//        .attr("transform", "translate(20,50) rotate(-90)")
        .text(labelY);


    // var voronoi = d3.geom.voronoi()
    //     .x(function(d) { return xScale(d[1]); })
    //     .y(function(d) { return yScale(d[2]); })
    //     .clipExtent([[0, 0], [width, height]]);

    // var voronoiGroup = svg.append("g")
    //     .attr("class", "voronoiWrapper");

    // voronoiGroup.selectAll("path")
    //     .data(voronoi(dataset)) //Use vononoi() with your dataset inside
    //     .enter().append("path")
    //     .attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
    //     .datum(function(d, i) { return d.point; })
    //     //Give each cell a unique class where the unique part corresponds to the circle classes
    //     // .attr("class", function(d,i) { return "voronoi " + d.CountryCode; })
    //     .style("stroke", "white") //I use this to look at how the cells are dispersed as a check
    //     .style("stroke-opacity", 0.5)
    //     .style("fill", "none")
    //     .style("pointer-events", "all");
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide);
};

// Abstract: Cambia la posicion de los puntos del scatterplot
// al value del select que esté seleccionado
function updateGraph() {

    var dataset = cambioDataset(datosTotales);

    xScale.domain([0, d3.max(dataset, function(d) {
        return d[1];
    })]);
    yScale.domain([0, d3.max(dataset, function(d) {
        return d[2];
    })]);

    rScale = d3.scale.sqrt()
        .range([mobileScreen ? 1 : 3, mobileScreen ? 5 : 15])
        .domain([0, d3.max(dataset, function(d) {
            return d[3];
        })]);

    svg.selectAll("text")
        .data(dataset)
        .transition()
        .duration(500)
        .each("start", function(){
            d3.select(this)
            .attr("class", function (d,i) {
                 var filtros;
                 try {
                     filtros = filtro.split(",");
                     for (var i = 0; i < filtros.length; i++) {
                         if (!filtros[i].trim().indexOf(d[0])) {
                             return "labelOn";
                         }
                     }
                 } catch (err) {
                     return "circulo";
                 }
                 return "labelOff";
            })
        })
        .call(arrangeLabels);

    svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(500)
        .each("start", function() {
            d3.select(this)
            .attr("class", function(d, i) {
                var filtros;
                try {
                    filtros = filtro.split(",");
                    for (var i = 0; i < filtros.length; i++) {
                        if (!filtros[i].trim().indexOf(d[0])) {
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
            .attr("r", function(d) {
                if (radio > 0) {
                    //console.log (d[3]);
                    return rScale(d[3]);
                } else {
                    return radioDefault;
                }

            });
    });

    svg.select(".x.axis")
        .transition()
        .duration(800)
        .call(xAxis);

    svg.select(".y.axis")
        .transition()
        .duration(800)
        .call(yAxis);

    svg.select("#labelX")
        .text(labelX);

    svg.select("#labelY")
        .text(labelY);

};

// da de baja el grafico
function removeGraph() {
    filtro = "";
    $("svg").remove();
};


// si existe el grafico lo updatea
// si NO existe lo genera
function manageGraph() {
    updateKeys();

    if ($(objectGraph + " svg").length > 0) {
        updateGraph();
    } else {
        addGraph();
        updateGraph();
        arrangeLabels();
    }

}

// From http://bl.ocks.org/larskotthoff/11406992

function arrangeLabels() {
  var move = 1;
  while(move > 0) {
    move = 0;
    svg.selectAll(".label")
       .each(function() {
         var that = this,
             a = this.getBoundingClientRect();
         svg.selectAll(".label")
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                   (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.02,
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
                  move += Math.abs(dx) + Math.abs(dy);
                
                  to.translate = [ to.translate[0] + dx, to.translate[1] + dy ];
                  tt.translate = [ tt.translate[0] - dx, tt.translate[1] - dy ];
                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
}