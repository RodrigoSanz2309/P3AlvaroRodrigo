console.log("datos.js recibido");

function dmsADecimal(direccion, grados, minutos, segundos) {
    let decimal = parseFloat(grados) + (parseFloat(minutos) / 60) + (parseFloat(segundos) / 3600);
    if (direccion) {
        direccion = direccion.toUpperCase();
        if (direccion === 'S' || direccion === 'O' || direccion === 'W') {
            decimal = -decimal;
        }
    }
    return decimal;
}

function generarEnlaceGoogleMaps() {
    const inputGPS = document.getElementById("coordenadasGPS").value.trim();
    const enlaceMapa = document.getElementById("enlaceMapa");
    const errorGPS = document.getElementById("errorGPS");

    if (!enlaceMapa) return;

    if (inputGPS === "") {
        enlaceMapa.style.display = "none";
        if (errorGPS) errorGPS.style.display = "none";
        return;
    }

    let latitud = null;
    let longitud = null;

    const regexDMS = /([NSEOW])?\s*(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEOW])?\s*,\s*([NSEOW])?\s*(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEOW])?/i;
    const matchDMS = inputGPS.match(regexDMS);

    const regexDecimal = /^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/;
    const matchDecimal = inputGPS.match(regexDecimal);

    if (matchDMS) {
        const dirLat = matchDMS[1] || matchDMS[5] || 'N';
        const dirLon = matchDMS[6] || matchDMS[10] || 'E';

        latitud = dmsADecimal(dirLat, matchDMS[2], matchDMS[3], matchDMS[4]);
        longitud = dmsADecimal(dirLon, matchDMS[7], matchDMS[8], matchDMS[9]);
    } else if (matchDecimal) {
        latitud = parseFloat(matchDecimal[1]);
        longitud = parseFloat(matchDecimal[2]);
    }

    if (latitud !== null && longitud !== null && !isNaN(latitud) && !isNaN(longitud) &&
        latitud >= -90 && latitud <= 90 && longitud >= -180 && longitud <= 180) {

        const latFixed = parseFloat(latitud.toFixed(6));
        const lonFixed = parseFloat(longitud.toFixed(6));

        const urlGoogleMaps = `https://maps.google.com/maps?q=${latFixed},${lonFixed}`;

        enlaceMapa.href = urlGoogleMaps;
        enlaceMapa.textContent = `Ver posición (${latFixed}, ${lonFixed}) en Google Maps`;
        enlaceMapa.style.display = "inline";
        if (errorGPS) errorGPS.style.display = "none";
    } else {
        enlaceMapa.style.display = "none";
        if (errorGPS) errorGPS.style.display = "inline";
    }
}


function validarEmailCadenas() {
    const emailInput = document.getElementById("email").value.trim();
    const resultado = document.getElementById("resultadoEmail");

    if (emailInput === "") {
        resultado.style.color = "red";
        resultado.textContent = "Por favor, introduce un correo electrónico.";
        return;
    }

    // 1. No espacios
    if (emailInput.includes(" ")) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // 2. Debe contener exactamente una '@'
    const primeraArroba = emailInput.indexOf("@");
    const ultimaArroba = emailInput.lastIndexOf("@");

    if (primeraArroba === -1 || primeraArroba !== ultimaArroba) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // Dividir en usuario y dominio
    const usuario = emailInput.substring(0, primeraArroba);
    const dominio = emailInput.substring(primeraArroba + 1);

    // 3. El usuario no puede estar vacío
    if (usuario.length === 0) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // 4. El dominio debe tener al menos un punto y no empezar ni terminar con punto
    if (!dominio.includes(".") || dominio.startsWith(".") || dominio.endsWith(".")) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // 5. Comprobar que ninguna de las partes del dominio esté vacía (ej. dominio..es)
    const partesDominio = dominio.split(".");
    for (let i = 0; i < partesDominio.length; i++) {
        if (partesDominio[i].length === 0) {
            resultado.style.color = "red";
            resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
            return;
        }
    }

    // Si pasa todas las comprobaciones
    resultado.style.color = "green";
    resultado.textContent = "Resultado (Sin Regex): Dirección Válida";
}

// Validar Email CON Expresiones Regulares
function validarEmailRegex() {
    const emailInput = document.getElementById("email").value.trim();
    const resultado = document.getElementById("resultadoEmail");

    if (emailInput === "") {
        resultado.style.color = "red";
        resultado.textContent = "Por favor, introduce un correo electrónico.";
        return;
    }

    // Expresión regular que valida: usuario@dominio.tld (con soporte para subdominios)
    const regexEmail = /^[^\s@]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (regexEmail.test(emailInput)) {
        resultado.style.color = "green";
        resultado.textContent = "Resultado (Con Regex): Dirección Válida";
    } else {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Con Regex): Dirección Inválida";
    }
}

/* =========================================================
   APARTADO 4: CALCULADORA DE TEMPERATURAS
   ========================================================= */

let expresionActual = "";
let unidadActual = "°C";

function presionarNumero(valor) {
    if (expresionActual === "0" && valor !== ".") {
        expresionActual = valor;
    } else {
        expresionActual += valor;
    }
    actualizarPantalla();
}

function presionarOperador(op) {
    if (expresionActual === "") return;
    expresionActual += " " + op + " ";
    actualizarPantalla();
}

function limpiarPantalla() {
    expresionActual = "";
    actualizarPantalla();
}

function actualizarPantalla() {
    const pantallaValor = document.getElementById("valorPantalla");
    const pantallaUnidad = document.getElementById("unidadPantalla");

    if (pantallaValor) {
        pantallaValor.textContent = expresionActual || "0";
    }
    if (pantallaUnidad) {
        pantallaUnidad.textContent = unidadActual;
    }
}

function calcularResultado() {
    try {
        if (!expresionActual) return;
        
        // Evaluar la expresión matemática
        let resultado = eval(expresionActual);
        
        if (isNaN(resultado) || !isFinite(resultado)) {
            expresionActual = "Error";
        } else {
            // Redondear a 2 decimales si no es entero
            expresionActual = Number.isInteger(resultado) ? resultado.toString() : parseFloat(resultado.toFixed(2)).toString();
        }
    } catch (e) {
        expresionActual = "Error";
    }
    actualizarPantalla();
}

/**
 * Convierte la cifra actual en pantalla entre Celsius (°C), Fahrenheit (°F) y Kelvin (K)
 */
function convertirA(nuevaUnidad) {
    // Si hay un cálculo pendiente, evaluarlo primero
    if (expresionActual && expresionActual !== "Error") {
        calcularResultado();
    }

    let valor = parseFloat(expresionActual);
    if (isNaN(valor)) return;

    // Si ya está en esa unidad, no hace nada
    let unifActualClean = unidadActual.replace("°", "");
    if (unifActualClean === nuevaUnidad) return;

    // 1. Convertir el valor actual a Celsius como base
    let enCelsius = valor;
    if (unifActualClean === "F") {
        enCelsius = (valor - 32) * (5 / 9);
    } else if (unifActualClean === "K") {
        enCelsius = valor - 273.15;
    }

    // 2. Convertir desde Celsius a la nueva unidad de destino
    let resultadoFinal = enCelsius;
    if (nuevaUnidad === "F") {
        resultadoFinal = (enCelsius * (9 / 5)) + 32;
        unidadActual = "°F";
    } else if (nuevaUnidad === "K") {
        resultadoFinal = enCelsius + 273.15;
        unidadActual = "K";
    } else if (nuevaUnidad === "C") {
        resultadoFinal = enCelsius;
        unidadActual = "°C";
    }

    expresionActual = parseFloat(resultadoFinal.toFixed(2)).toString();
    actualizarPantalla();
}


/* =========================================================
   APARTADO 1.2: GALERÍA DE IMÁGENES Y DESPLAZAMIENTO (JQUERY)
   ========================================================= */

$(document).ready(function () {
    // 1. Mostrar información/nombre de la imagen al pasar el ratón (hover)
    $(".tarjeta-imagen").hover(
        function () {
            // MouseEnter: desvanecer hacia dentro la información
            $(this).find(".info-overlay").stop(true, true).fadeIn(100);
            $(this).css("border-color", "#0066cc");
        },
        function () {
            // MouseLeave: desvanecer hacia fuera
            $(this).find(".info-overlay").stop(true, true).fadeOut(200);
            $(this).css("border-color", "#808080");
        }
    );

    // 2. Desplazamiento horizontal de imágenes (Carrusel)
    let posicionActual = 0;
    const pasoDesplazamiento = 195; // Ancho de tarjeta (180px) + hueco gap (15px)

    $("#btnSiguiente").click(function () {
        const anchoVisor = $(".carrusel-visor").width();
        const anchoTotalTira = $("#tiraImagenes")[0].scrollWidth;
        const maxDesplazamiento = -(anchoTotalTira - anchoVisor);

        if (posicionActual > maxDesplazamiento) {
            posicionActual -= pasoDesplazamiento;
            if (posicionActual < maxDesplazamiento) {
                posicionActual = maxDesplazamiento;
            }
            $("#tiraImagenes").css("transform", "translateX(" + posicionActual + "px)");
        }
    });

    $("#btnAnterior").click(function () {
        if (posicionActual < 0) {
            posicionActual += pasoDesplazamiento;
            if (posicionActual > 0) {
                posicionActual = 0;
            }
            $("#tiraImagenes").css("transform", "translateX(" + posicionActual + "px)");
        }
    });
});

/* =========================================================
   APARTADO 1.3: MUESTRA DE TABLAS PAGINADAS Y FORMATEO JQUERY
   Las tablas están sin formato en el HTML. El formato se aplica
   con selectores jQuery en el momento de visualizar cada página.
   ========================================================= */

$(document).ready(function () {
    // Solo se ejecuta en tablas.html (si no hay paginador, no hace nada)
    if ($(".tabla-pagina").length === 0) return;

    // Apartado 2.3: fila de checkboxes "Mostrar histograma" en cada tabla
    crearFilaCheckboxes();

    // Al cargar, se muestra la primera página
    mostrarPagina(1);

    // Evento clic sobre los botones de paginación
    $(".btn-pagina").click(function () {
        mostrarPagina($(this).data("pagina"));
    });
});

/**
 * Oculta todas las páginas y muestra la pedida.
 * Las páginas 1 y 2 ya están en el HTML. Las páginas 3 y 4 se piden
 * al servidor con Ajax (apartado 2.2) y se muestran cuando llegan los datos.
 */
function mostrarPagina(numPagina) {
    const pagina = $("#pagina-" + numPagina);
    paginaActual = Number(numPagina);

    $(".tabla-pagina").hide();
    $(".btn-pagina").removeClass("activo");
    $(".btn-pagina[data-pagina='" + numPagina + "']").addClass("activo");

    // Lo que se hace cuando la tabla ya tiene sus filas
    function visualizar() {
        formatearTabla(pagina);
        pagina.fadeIn(300);
        actualizarHistograma();   // apartado 2.3
    }

    if (numPagina == 3) {
        cargarPaginaXML(pagina, visualizar);
    } else if (numPagina == 4) {
        cargarPaginaJSON(pagina, visualizar);
    } else {
        visualizar();
    }
}

/**
 * Aplica estilos a la tabla de un contenedor usando selectores jQuery
 */
function formatearTabla(contenedor) {
    const tabla = contenedor.find("table");

    // Tabla general
    tabla.css({
        "width": "100%",
        "border-collapse": "collapse",
        "text-align": "center",
        "font-family": "Arial, sans-serif",
        "background-color": "#ffffff"
    });

    // Todas las celdas (cabecera y datos)
    tabla.find("th, td").css({
        "padding": "10px",
        "border": "1px solid #777"
    });

    // Cabecera
    tabla.find("thead th").css({
        "background-color": "#e0e0e0",
        "font-weight": "bold",
        "border-bottom": "2px solid #555"
    });

    // Filas alternas (zebra) con los filtros :even y :odd
    tabla.find("tbody tr").filter(":even").css("background-color", "#ffffff");
    tabla.find("tbody tr").filter(":odd").css("background-color", "#e8e8d8");

    // Columna "Color de Iluminación": código en monoespaciada y muestra del color
    tabla.find("tbody td:last-child").each(function () {
        const celda = $(this);
        const codigoHex = celda.text().trim();

        celda.css({ "font-family": "monospace", "font-weight": "bold" });

        // Se añade un cuadrado con el color (solo la primera vez que se formatea)
        if (celda.find(".muestra-color").length === 0) {
            $("<span>")
                .addClass("muestra-color")
                .css({
                    "display": "inline-block",
                    "width": "14px",
                    "height": "14px",
                    "margin-right": "6px",
                    "vertical-align": "middle",
                    "border": "1px solid #333",
                    "background-color": "#" + codigoHex
                })
                .prependTo(celda);
        }
    });
}


/* =========================================================
   APARTADO 2.1: SELECT DE CIUDADES CONDICIONADO AL PAÍS (AJAX)
   Cada país tiene un fichero de texto plano en ciudades/
   (espana.txt, francia.txt, ...) con una ciudad por línea.
   Al cambiar el país se pide su fichero al servidor con Ajax
   y se rellena el <select> de ciudades con la respuesta.
   ========================================================= */

$(document).ready(function () {
    // Solo se ejecuta en config.html
    if ($("select#pais").length === 0) return;

    $("#pais").change(function () {
        cargarCiudades($(this).val());
    });
});

function cargarCiudades(pais) {
    const selectCiudad = $("#ciudad");
    const estado = $("#estadoCiudades");

    // Se vacía el select antes de cada carga
    selectCiudad.empty();

    // Si no hay país elegido, se deja el select desactivado
    if (pais === "") {
        selectCiudad.append($("<option>").val("").text("-- Primero elige un país --"));
        selectCiudad.prop("disabled", true);
        estado.text("");
        return;
    }

    selectCiudad.prop("disabled", true);
    estado.text("Cargando ciudades...");

    // Petición Ajax al servidor: GET del fichero de texto del país
    $.ajax({
        url: "ciudades/" + pais + ".txt",
        type: "GET",
        dataType: "text",
        cache: false
    })
    .done(function (respuesta) {
        // La respuesta es el texto del fichero: una ciudad por línea
        const ciudades = respuesta.split("\n")
            .map(function (linea) { return linea.trim(); })
            .filter(function (linea) { return linea !== ""; });

        selectCiudad.append($("<option>").val("").text("-- Selecciona una ciudad --"));
        $.each(ciudades, function (i, ciudad) {
            selectCiudad.append($("<option>").val(ciudad).text(ciudad));
        });

        selectCiudad.prop("disabled", false);
        estado.text("");
    })
    .fail(function (xhr) {
        selectCiudad.append($("<option>").val("").text("-- Error al cargar --"));
        estado.text("No se pudieron cargar las ciudades (error " + xhr.status + ").");
    });
}



/* =========================================================
   APARTADO 2.2: TABLAS CON AJAX
   - Página 3: fichero XML, tratado SOLO con JavaScript
     (XMLHttpRequest + DOM, sin jQuery).
   - Página 4: fichero JSON, tratado con jQuery ($.ajax).
   Los datos recibidos se guardan en variables (datosXML, datosJSON)
   para poder consultarlos después (por ejemplo, para el histograma).
   ========================================================= */

let datosXML = [];
let datosJSON = [];

/**
 * Página 3: pide datos/pagina3.xml con XMLHttpRequest y crea las filas con el DOM
 */
function cargarPaginaXML(pagina, alTerminar) {
    const tbody = pagina[0].querySelector("tbody");
    const xhr = new XMLHttpRequest();

    // Se añade la hora a la URL para que el navegador no use una copia en caché
    xhr.open("GET", "datos/pagina3.xml?t=" + Date.now(), true);

    xhr.onreadystatechange = function () {
        // readyState 4 = la respuesta ha llegado completa
        if (xhr.readyState !== 4) return;

        tbody.innerHTML = "";

        if (xhr.status === 200 && xhr.responseXML) {
            // responseXML es el documento XML ya convertido en un árbol DOM
            const estaciones = xhr.responseXML.getElementsByTagName("estacion");
            const campos = ["ciudad", "temperatura", "humedad", "ruido", "luz", "color"];
            datosXML = [];

            for (let i = 0; i < estaciones.length; i++) {
                const fila = document.createElement("tr");
                const registro = {};

                for (let j = 0; j < campos.length; j++) {
                    const valor = estaciones[i].getElementsByTagName(campos[j])[0].textContent;
                    const celda = document.createElement("td");
                    celda.textContent = valor;
                    fila.appendChild(celda);
                    registro[campos[j]] = valor;
                }

                tbody.appendChild(fila);
                datosXML.push(registro);
            }
        } else {
            tbody.innerHTML = "<tr><td colspan='6'>Error al cargar el XML (" + xhr.status + ")</td></tr>";
        }

        alTerminar();
    };

    xhr.send();
}

/**
 * Página 4: pide datos/pagina4.json con jQuery y crea las filas con jQuery
 */
function cargarPaginaJSON(pagina, alTerminar) {
    const tbody = pagina.find("tbody");

    $.ajax({
        url: "datos/pagina4.json",
        type: "GET",
        dataType: "json",   // jQuery convierte el texto JSON en un objeto JavaScript
        cache: false
    })
    .done(function (respuesta) {
        tbody.empty();
        datosJSON = respuesta.estaciones;

        $.each(datosJSON, function (i, est) {
            const fila = $("<tr>");
            fila.append($("<td>").text(est.ciudad));
            fila.append($("<td>").text(est.temperatura));
            fila.append($("<td>").text(est.humedad));
            fila.append($("<td>").text(est.ruido));
            fila.append($("<td>").text(est.luz));
            fila.append($("<td>").text(est.color));
            tbody.append(fila);
        });
    })
    .fail(function (xhr) {
        tbody.html("<tr><td colspan='6'>Error al cargar el JSON (" + xhr.status + ")</td></tr>");
    })
    .always(alTerminar);
}



/* =========================================================
   APARTADO 2.3: VISUALIZACIÓN DE DATOS CON UN HISTOGRAMA
   - Bajo la cabecera de cada tabla hay una fila con un checkbox
     por columna numérica. Solo puede haber uno marcado.
   - Al marcar uno se dibuja un histograma de esa columna con los
     datos de la página visible: una fila por ciudad, con una barra
     cuyo ancho depende del valor. Sin librerías externas.
   ========================================================= */

let paginaActual = 1;
let columnaSeleccionada = null;   // null = ningún checkbox marcado

// Columnas que se pueden representar (orden de las columnas de la tabla)
const COLUMNAS = [
    { clave: "temperatura", titulo: "Temperatura (ºC)" },
    { clave: "humedad",     titulo: "Humedad (%)" },
    { clave: "ruido",       titulo: "Ruido" },
    { clave: "luz",         titulo: "Nivel de luz" }
];

/**
 * Añade a la cabecera de cada tabla la fila "Mostrar histograma"
 * con un checkbox por columna numérica (la de color lleva un guion)
 */
function crearFilaCheckboxes() {
    $(".tabla-estaciones thead").each(function () {
        const fila = $("<tr>").addClass("fila-checkboxes");
        fila.append($("<th>").text("Mostrar histograma"));

        $.each(COLUMNAS, function (i, col) {
            const checkbox = $("<input>")
                .attr("type", "checkbox")
                .addClass("chk-histograma")
                .attr("data-columna", col.clave)
                .attr("title", "Histograma de " + col.titulo);
            fila.append($("<th>").append(checkbox));
        });

        fila.append($("<th>").text("-"));
        $(this).append(fila);
    });

    // Evento: al marcar o desmarcar un checkbox de cualquier tabla
    $(".chk-histograma").change(function () {
        if ($(this).is(":checked")) {
            columnaSeleccionada = $(this).data("columna");
        } else {
            columnaSeleccionada = null;
        }
        actualizarHistograma();
    });
}

/**
 * Deja marcado solo el checkbox de la columna seleccionada
 * y dibuja (o esconde) el histograma
 */
function actualizarHistograma() {
    // Solo uno marcado: se marcan los de la columna elegida y se desmarcan los demás
    $(".chk-histograma").each(function () {
        $(this).prop("checked", $(this).data("columna") === columnaSeleccionada);
    });

    if (columnaSeleccionada === null) {
        $("#histograma").slideUp(200);
        return;
    }

    dibujarHistograma(columnaSeleccionada);
}

/**
 * Devuelve los datos de la página visible como una lista de objetos
 * { ciudad, temperatura, humedad, ruido, luz, color }.
 * Páginas 3 y 4: variables rellenadas por Ajax (datosXML, datosJSON).
 * Páginas 1 y 2: se leen de las filas de la tabla con jQuery.
 */
function obtenerDatosPagina(numPagina) {
    if (numPagina === 3) return datosXML;
    if (numPagina === 4) return datosJSON;

    const datos = [];
    $("#pagina-" + numPagina + " tbody tr").each(function () {
        const celdas = $(this).find("td");
        datos.push({
            ciudad:      celdas.eq(0).text(),
            temperatura: celdas.eq(1).text(),
            humedad:     celdas.eq(2).text(),
            ruido:       celdas.eq(3).text(),
            luz:         celdas.eq(4).text(),
            color:       celdas.eq(5).text().trim()
        });
    });
    return datos;
}

/**
 * Dibuja el histograma de una columna: cambia el título del contenedor
 * y crea una fila por ciudad con una barra de ancho proporcional al valor
 */
function dibujarHistograma(clave) {
    const datos = obtenerDatosPagina(paginaActual);
    const columna = COLUMNAS.find(function (c) { return c.clave === clave; });
    const contenedorBarras = $("#histograma-barras");

    // 1. Título del histograma
    $("#histograma-titulo").text(columna.titulo + " - Página " + paginaActual);

    // 2. Valor máximo, para que la barra más larga ocupe todo el ancho
    let maximo = 0;
    $.each(datos, function (i, est) {
        maximo = Math.max(maximo, parseFloat(est[clave]));
    });

    // 3. Una fila por ciudad: etiqueta + barra
    contenedorBarras.empty();
    $.each(datos, function (i, est) {
        const valor = parseFloat(est[clave]);
        const porcentaje = maximo > 0 ? (valor / maximo) * 100 : 0;

        const barra = $("<div>").addClass("barra-histograma").text(valor);
        const fila = $("<div>").addClass("fila-histograma")
            .append($("<span>").addClass("etiqueta-histograma").text(est.ciudad))
            .append($("<div>").addClass("pista-histograma").append(barra));

        contenedorBarras.append(fila);

        // El ancho de la barra crece con una animación de jQuery
        barra.animate({ width: porcentaje + "%" }, 500);
    });

    $("#histograma").slideDown(200);
}
