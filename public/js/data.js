// Carga datos para armar los gráficos
// y los storea en variables globales

'use strict'

//URL a las hojas de datos y var globales.
var urlSpreadsheet = "https://docs.google.com/spreadsheets/d/1DmE7yv8JmUIpQQ1lhEam6e33aslSg84Gws2VJbmjnQo/edit#gid=1860459801",
    datosTotales = [],
    centroides = [],
    mapaDatos,
    ejeActual = "",
    labelX = "",
    labelY = "",
    labelTasa = "",
    labelPorcentaje = "";

var reemplazar = {
    "indicador_poblacion" : { "value" : "Población"},
    "indicador_hogares" : { "value" : "Hogares"},
    "indicador_superficie" : { "value" : "Superficie"},
    "indicador_presupuesto_per_capita" : { "value" : "Presupuesto per cápita"},
    "salud_establecimientos" : { "value" : "Establecimientos de salud"},
    "salud_camas" : { "value" : "Camas de internación"},
    "salud_establecimientos_1000" : { "value" : "Establecimientos de salud"},
    "salud_establecimientos_10000" : { "value" : "Establecimientos de salud cada 10.000 habitantes"},
    "salud_camas_1000" : { "value" : "Camas de internación x 1.000 habitantes"},
    "salud_establecimientos_KM" : { "value" : "Establecimientos de salud x KM²"},
    "salud_tasa_mortalidad_infantil" : { "value" : "Tasa de mortalidad infantil"},
    "infraestructura_red_de_agua" : { "value" : "Hogares sin acceso a la red de agua potable"},
    "infraestructura_red_de_agua_porcentaje" : { "value" : "% hogares sin acceso a la red de agua potable"},
    "infraestructura_red_de_gas" : { "value" : "Hogares sin acceso a la red de gas"},
    "infraestrtuctura_red_de_gas_porcentaje" : { "value" : "% de hogares sin acceso a la red de gas"},
    "infraestructura_red_de_cloacas" : { "value" : "Hogares sin acceso a la red de cloacas"},
    "infraestructura_red_de_cloacas_porcentaje" : { "value" : "% de hogares sin acceso a la red de cloacas"},
    "educacion_total_unidades_educativas" : { "value" : "Unidades educativas (total)"},
    "educacion_total_alumnos" : { "value" : "Alumnos (total)"},
    "educacion_unidades_educativas" : { "value" : "Unidades educativas públicas"},
    "educacion_alumnos" : { "value" : "Alumnos unidades educativas públicas"},
    "educacion_porcentaje_unidades_educativas_estatales" : { "value" : "% unidades educativas públicas"},
    "educacion_porcentaje_asistencia_unidades_educativas_estatales" : { "value" : "% alumnos unidades educativas públicas"},
    "educacion_unidades_educativas_privadas" : { "value" : "Unidades educativas privadas"},
    "educacion_alumnos_privadas" : { "value" : "Alumnos unidades educativas privadas"},
    "educacion_porcentaje_unidades_educativas_privadas" : { "value" : "% unidades educativas privadas"},
    "educacion_porcentaje_asistencia_unidades_educativas_privadas" : { "value" : "% alumnos unidades educativas privadas"},
    "educacion_porcentaje_poblacion_asistencia_unidad_educativa" : { "value" : "% alumnos totales"},
    "educacion_cantidad_unidades_educativas_cada_10000" : { "value" : "Unidades educativas x 10.000 hab."},
    "educacion_cantidad_unidades_educativas_por_km2" : { "value" : "Unidades educativas x KM²"},
    "educacion_porcentaje_poblacion_edad3_uso_pc" : { "value" : "% población uso PC"},
    "educacion_analfabetismo_poblacion_edad10mas" : { "value" : "% analfabetismo"},
    "educacion_analfabetismo_nominal" : { "value" : "Analfabetismo (nominal)"}
}


// Abstract: Cargo datos de un spreadsheet y hace
// un callback que pasa esos datos a un array
function cargaDatos() {
    var dataTemporal = sheetrock({
        url: urlSpreadsheet,
        query: "select *",
        callback: cargoDatosEnArray
    });
    cargoMapa();
}

// Abstract: convierte un objeto de datos un array
var cargoDatosEnArray = function(error, options, response) {
    if (!error) {
        jQuery.each(response.rows, function(index, value) {
            var fila = [];
            for (var i = 0; i < value.cellsArray.length; i++) {
                fila.push(value.cellsArray[i])
            }
            datosTotales.push(fila);
        });
    }
};

// Abstract: carga topojson y lo deja listo en var global
function cargoMapa() {
    d3.json("data/gba.json", function(error, gba) {
        if (!error) {
            mapaDatos = gba;
        } else {
            console.log("no se pudo cargar json de mapa", error);
        }
    });
}

// carga los datos de la planilla
cargaDatos();
