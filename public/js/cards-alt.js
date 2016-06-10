/**
 * cards.js
 * http://www.codrops.com
 * Based on: http://tympanus.net/codrops/2015/04/15/grid-item-animation-layout/
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;
(function(window) {

    'use strict';

    $('.landing').find('.ingresar').bind("click", function(e) {
        $(this).parents('.landing').fadeOut("normal", function() {
            $(this).hide();
        });
        e.preventDefault();
    });

    $('.contenido').find('.close-button').bind("click", function(e) {
        $(this).parents('.contenido').parent().fadeOut("normal", function() {
            $(this).hide();
        });
        e.preventDefault();
    });


    $('#metodologia-btn').bind("click", function(e) {
        $('#metodologia').css({"visibility": "visible", "display": "block"});
        e.preventDefault();
    });

    $('#creditos-btn').bind("click", function(e) {
        $('#creditos').css({"visibility": "visible", "display": "block"});
        e.preventDefault();
    });
    
    function init() {
        console.log("cargue datos");
    }

    var cards = 'https://docs.google.com/spreadsheets/d/1TysAY-MSLVmwuQEJZQqL_7Mfp8y6eV-pZw7bNp25Mh0/edit#gid=0';

    var HRTemplate = Handlebars.compile($('#card-template').html());



    // Instancio y ejecuto las cards desde el spreadsheet gestionado por sheetrock,
    // luego ejecuto funcion para concatenar con la segundo generación de contenidos.
    $('.grid').sheetrock({
        url: cards,
        headers: 1,
        query: "select *",
        rowTemplate: HRTemplate,
        callback: init
    });



})(window);
