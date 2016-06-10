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

    $('#fuentes-btn').bind("click", function(e) {
        $('#fuentes').css({"visibility": "visible", "display": "block"});
        e.preventDefault();
    });

    $('#creditos-btn').bind("click", function(e) {
        $('#creditos').css({"visibility": "visible", "display": "block"});
        e.preventDefault();
    });
    
    // 'referencias-btn'
    // 'creditos-btn'

    //variables
    var CardTemplate = Handlebars.compile($('#card-template').html()),
        StoryTemplate = Handlebars.compile($('#story-template').html()),
        cardContent = [],
        nav,
        list,
        cards = 'https://docs.google.com/spreadsheets/d/1TysAY-MSLVmwuQEJZQqL_7Mfp8y6eV-pZw7bNp25Mh0/edit#gid=0',
        stories = 'https://docs.google.com/spreadsheets/d/1I990DgoSP3UBLnkq5YFOlkZsGcx8s3wWh2shXWfTrnU/edit#gid=725026563',
        cardsToStories = [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 1],
            [4, 1],
            [5, 1],
            [6, 1],
            [7, 2],
            [8, 2],
            [9, 2],
            [10, 3],
            [11, 3],
            [12, 4],
            [13, 4],
            [14, 5],
            [15, 5],
            [16, 5],
            [17, 6],
            [18, 6],
            [19, 6],
            [20, 7],
            [21, 7],
            [22, 7],
            [23, 8],
            [24, 8],
            [25, 8],
            [26, 9],
            [27, 9],
            [28, 10],
            [29, 10],
            [30, 11],
            [31, 11],
            [32, 11],
            [33, 11],
            [34, 11],
            [35, 12],
            [36, 12],
            [37, 12],
            [38, 13],
            [39, 13],
            [40, 13]
        ],
        bodyEl = document.body,
        docElem = window.document.documentElement,
        support = {
            transitions: Modernizr.csstransitions
        },
        transEndEventNames = { // transition end event name
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        onEndTransition = function(el, callback) {
            var onEndCallbackFn = function(ev) {
                if (support.transitions) {
                    if (ev.target != this) return;
                    this.removeEventListener(transEndEventName, onEndCallbackFn);
                }
                if (callback && typeof callback === 'function') {
                    callback.call(this);
                }
            };
            if (support.transitions) {
                el.addEventListener(transEndEventName, onEndCallbackFn);
            } else {
                onEndCallbackFn();
            }
        },
        gridEl = document.getElementById('theGrid'),
        sidebarEl = document.getElementById('theSidebar'),
        gridItemsContainer = gridEl.querySelector('section.grid'),
        contentItemsContainer = gridEl.querySelector('section.content'),
        gridItems, contentItems, xscroll, yscroll, currentCard, selectedStory, iso,
        closeCtrl = contentItemsContainer.querySelector('.close-button'),
        current = -1,
        lockScroll = false,
        isAnimating = false,
        menuCtrl = document.getElementById('menu-toggle'),
        menuCloseCtrl = sidebarEl.querySelector('.close-button'),
        filterCtrls = [].slice.call(document.querySelectorAll('.filter > button')),
        cardsContentNav = [],
        checkComma = /(,)/g;

    // @Abstract: Dado un axis saca el viewport del documento y lo devuelve para calcular el resize
    function getViewport(axis) {
        var client, inner;
        if (axis === 'x') {
            client = docElem['clientWidth'];
            inner = window['innerWidth'];
        } else if (axis === 'y') {
            client = docElem['clientHeight'];
            inner = window['innerHeight'];
        }

        return client < inner ? inner : client;
    }

    // @Abstract: devuelve el offser de X
    function scrollX() {
        return window.pageXOffset || docElem.scrollLeft;
    }

    // @Abstract: devuelve el offser de Y
    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }


    function currentNav() {

        // El criterio para crear esta funcion fue el siguiente:
        // Asumimos que en el spreadsheet "stories", hay una columna 'cards' y extraemos sus valores (separados por coma)
        // Iteramos desde el spreadshhet "cards" para matchear el contenido de la columna "cards" (spreadsheet stories) con
        // los objetos que necesitamos para la interfaz.

        // var nav, navegador cuyo contenido son los cards relacionados entre si atraves de una full story.
        nav = $(".content__item--show").find("#cardNav");
        // var list, placeholder donde van a ir en formato de lista el contenido de los cards relacionados/
        list = nav.find(".tabs-navigation");
        // getCambiador, select donde arrojaremos la lista de opciones basadas en los criterios a visualizar.
        var getCambiador = $("#cambiador");
        //console.log(getCambiador);

        // selectedNav, get de lista con los cards arrojados por mustache en story-template.
        var selectedNav = nav.data("cards");

        function createNav(i) {

            // Appendeo lista solo sino fue creada.
            var listItem;
            var dataValue1 = 'data-columnax=' + cardsContentNav[cardContent[i]][10] + ' ';
            var dataValue2 = 'data-columnay=' + cardsContentNav[cardContent[i]][11] + ' ';
            if (cardsContentNav[cardContent[i]][12] > 0) {
              var dataValue3 = 'data-radio=' + cardsContentNav[cardContent[i]][12] + ' ';
            } else {
              var dataValue3 = 'data-radio=\"\"';
            }
            var dataValue4 = 'data-filtro=\"' + cardsContentNav[cardContent[i]][7] + '\"';

            listItem = '<li class=\"card\">';
            listItem += '<a href=\"#\"';
            if (currentCard == cardsContentNav[cardContent[i]][0]) {
                listItem += 'class=\"activo\"';
            }
            listItem += dataValue1 + dataValue2 + dataValue3 + dataValue4 + '>' + cardsContentNav[cardContent[i]][9] + '</a></li>';
            $(listItem).appendTo(list);

            window.columnaX = cardsContentNav[cardContent[i]][10];
            window.columnaY = cardsContentNav[cardContent[i]][11];
            window.filtro = cardsContentNav[cardContent[i]][7];
            window.radio = cardsContentNav[cardContent[i]][12];


            //item.('click'

            $(list).find('a').bind("click", function(e) {
                $(list).find('.activo').removeClass('activo');
                $(this).addClass('activo');
                var values = e.currentTarget;
                columnaX = values.attributes["data-columnax"].value;
                columnaY = values.attributes["data-columnaY"].value;
                radio = values.attributes["data-radio"].value;
                // Check, if empty, breaks.
                filtro = values.attributes["data-filtro"].value;
                updateGraph();
                e.preventDefault();
            });
            return listItem;
        }

        if (selectedNav === 12) {
            // Alerta, bug en el Card 12 que es una card que no comparte Full Story.
            //Rompe el patron. Revisar y corregir.
            // console.log('No comma!');
            // Crear return de objeto para el menu.
            cardContent.push(12);
            createNav(0);
            manageGraph();
        } else {
            selectedNav = selectedNav.split(",");
        }

        for (var i = 0; i < selectedNav.length; i++) {
            var getCard = parseInt(selectedNav[i]);
            cardContent.push(getCard);
            var itemActivo = createNav(i);
            manageGraph();
        }
        // debo guardar los valores del activo porque en el bindeo los sobreescribe
        // con el ultimo valor del objeto que agregó
        columnaX = $(".activo").data()["columnax"];
        columnaY = $(".activo").data()["columnay"];
        radio = $(".activo").data()["radio"];
        filtro = $(".activo").data()["filtro"];
        updateGraph();
    }

    // @Abstract: carga el contenido de la card animandolo lockeando el scroll del body
    function loadContent(item) {
        // top-bar
        var dummy = document.createElement('div');
        dummy.className = 'placeholder';
        dummy.style.WebkitTransform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / getViewport('y') + ',1)';
        dummy.style.transform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth / gridItemsContainer.offsetWidth + ',' + item.offsetHeight / getViewport('y') + ',1)';
        classie.add(dummy, 'placeholder--trans-in');
        gridItemsContainer.appendChild(dummy);
        classie.add(bodyEl, 'view-single');

        setTimeout(function() {
            dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
            dummy.style.transform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
            window.addEventListener('scroll', noscroll);
        }, 25);

        onEndTransition(dummy, function() {
            classie.remove(dummy, 'placeholder--trans-in');
            classie.add(dummy, 'placeholder--trans-out');
            contentItemsContainer.style.top = scrollY() + 'px';

            classie.add(contentItemsContainer, 'content--show');
            classie.add(contentItems[current], 'content__item--show');
            classie.add(closeCtrl, 'close-button--show');
            classie.addClass(bodyEl, 'noscroll');
            classie.addClass(bodyEl, 'selectedStory' + selectedStory);
            classie.addClass(bodyEl, 'currentCard' + currentCard);
            currentNav();
            isAnimating = false;
        });
    }


    function initEvents() {


        // classie.add(sidebarEl, 'sidebar--open');

        // $('filter__reset')
        
        iso = new Isotope(gridItemsContainer, {
            getSortData: {
                prioridad: '[data-prioridad]'
            },
            isResizeBound: true,
            itemSelector: '.grid__item',
            percentPosition: false,
            //sortBy: 'prioridad',
            masonry: {
                columnWidth: '.grid__sizer'
            },
            transitionDuration: '0.6s'
        });

        gridItems = gridItemsContainer.querySelectorAll('.grid__item');
        contentItems = contentItemsContainer.querySelectorAll('.content__item');

        filterCtrls.forEach(function(filterCtrl) {

            filterCtrl.addEventListener('click', function() {
                classie.remove(filterCtrl.parentNode.querySelector('.filter__item--selected'), 'filter__item--selected');
                classie.add(filterCtrl, 'filter__item--selected');
                iso.arrange({
                    filter: filterCtrl.getAttribute('data-filter')
                });
                iso.layout();
            });
        });


        [].slice.call(gridItems).forEach(function(item, pos) {
            // grid item click event
            item.addEventListener('click', function(ev) {

                selectedStory = cardsToStories[pos][1];
                currentCard = cardsToStories[pos][0];

                ev.preventDefault();
                // if(isAnimating || current === pos) {
                if (isAnimating || current === currentCard) {
                    return false;
                }
                isAnimating = true;
                // index of current item
                current = selectedStory;

                // simulate loading time..
                classie.add(item, 'grid__item--loading');
                setTimeout(function() {
                    classie.add(item, 'grid__item--animate');
                    // reveal/load content after the last element animates out (todo: wait for the last transition to finish)
                    setTimeout(function() {
                        loadContent(item);
                    }, 200);
                }, 1000);
            });
        });

        closeCtrl.addEventListener('click', function() {
            // hide content
            hideContent();
            // hide graph
            removeGraph();
        });

        // keyboard esc - hide content
        document.addEventListener('keydown', function(ev) {
            if (!isAnimating && current !== -1) {
                var keyCode = ev.keyCode || ev.which;
                if (keyCode === 27) {
                    ev.preventDefault();
                    if ("activeElement" in document)
                        document.activeElement.blur();
                    hideContent();
                }
            }
        });

        // hamburger menu button (mobile) and close cross
        menuCtrl.addEventListener('click', function() {
            if (!classie.has(sidebarEl, 'sidebar--open')) {
                classie.add(sidebarEl, 'sidebar--open');
            }
        });

        menuCloseCtrl.addEventListener('click', function() {
            if (classie.has(sidebarEl, 'sidebar--open')) {
                classie.remove(sidebarEl, 'sidebar--open');
            }
        });
    }



    // @Abstract: oculta el contenido de la card animandolo y luego libera el scroll del body
    function hideContent() {
        var gridItem = gridItems[currentCard],
            contentItem = contentItems[current];

        classie.remove(contentItem, 'content__item--show');
        classie.remove(contentItemsContainer, 'content--show');
        classie.remove(closeCtrl, 'close-button--show');
        classie.remove(bodyEl, 'view-single');

        cardContent = [];
        list.empty();

        setTimeout(function() {
            var dummy = gridItemsContainer.querySelector('.placeholder');

            classie.removeClass(bodyEl, 'noscroll');

            classie.removeClass(bodyEl, 'selectedStory' + selectedStory);

            classie.removeClass(bodyEl, 'currentCard' + currentCard);


            dummy.style.WebkitTransform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / getViewport('y') + ',1)';
            dummy.style.transform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth / gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight / getViewport('y') + ',1)';

            onEndTransition(dummy, function() {
                // reset content scroll..
                contentItem.parentNode.scrollTop = 0;
                gridItemsContainer.removeChild(dummy);
                classie.remove(gridItem, 'grid__item--loading');
                classie.remove(gridItem, 'grid__item--animate');
                lockScroll = false;
                window.removeEventListener('scroll', noscroll);
            });

            // reset current
            current = -1;
        }, 25);
    }

    // @Abstract: al abrir un card lockea el scroll del usuario
    function noscroll() {
        if (!lockScroll) {
            lockScroll = true;
            xscroll = scrollX();
            yscroll = scrollY();
        }
        window.scrollTo(xscroll, yscroll);
    }

    function init() {
        cargaDatosNav();
        // Instancio y ejecuto las full stories desde el 2do. spreadsheet gestionado por sheetrock, concateno con funciones . Luego se ejecuta isotope
        $('.scroll-wrap').sheetrock({
            url: stories,
            headers: 1,
            query: "select *",
            rowHandler: StoryTemplate,
            callback: initEvents
        });
    }

    function cargaDatosNav() {
        var archivo = sheetrock({
            url: cards,
            headers: 1,
            query: "select A,B,D,E,F,G,H,I,K,M,O,P,Q",
            callback: cargarCardsEnArray
        });
    }

    var cargarCardsEnArray = function(error, options, response) {
        if (!error) {
            $.each(response.rows, function(index, value) {
                // las propiedades de las celdas son los titulos del spreadsheet
                // y son case sensitive (no usar espacios ni caracteres raros)
                var fila = [
                    value.cells.orden,
                    value.cells.dataviz_key,
                    value.cells.eje,
                    value.cells.eje_key,
                    value.cells.indicador_a,
                    value.cells.indicador_b,
                    value.cells.indicador_c,
                    value.cells.filtro,
                    value.cells.titulo,
                    value.cells.contenido,
                    value.cells.indicador_1,
                    value.cells.indicador_2,
                    value.cells.indicador_3

                ];
                if (index === 0) {
                    // console.log('Skipping header!');
                // } else if (index === 1) {
                //     console.log('Skipping zero value!');
                } else {
                    cardsContentNav.push(fila);
                }
            });
        } else {
            console.log(error);
        }
    };

    // Instancio y ejecuto las cards desde el spreadsheet gestionado por sheetrock,
    // luego ejecuto funcion para concatenar con la segundo generación de contenidos.
    $('.grid').sheetrock({
        url: cards,
        headers: 1,
        query: "select *",
        rowHandler: CardTemplate,
        callback: init
    });



})(window);
