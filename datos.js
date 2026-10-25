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

$(document.ready ? $(document) : $(window)).ready(function () {
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
   ========================================================= */

$(document).ready(function () {
    // 1. Formatear dinámicamente las tablas con selectores jQuery al cargar
    formatearTablasConJQuery();

    // 2. Evento clic sobre los botones de paginación
    $(".btn-pagina").click(function () {
        const numPagina = $(this).data("pagina");

        // Ocultar todas las páginas y quitar estado activo a botones
        $(".tabla-pagina").hide();
        $(".btn-pagina").removeClass("activo");

        // Mostrar solo el contenedor seleccionado y activar el botón
        $("#pagina-" + numPagina).fadeIn(300);
        $(this).addClass("activo");
    });
});

/**
 * Aplica estilos dinámicos a las tablas estáticas usando selectores jQuery
 */
function formatearTablasConJQuery() {
    // Formatear encabezados de todas las tablas
    $(".tabla-estaciones th").css({
        "background-color": "#e0e0e0",
        "font-weight": "bold",
        "border-bottom": "2px solid #555"
    });

    // Aplicar colores alternos (zebra striping) con selectores :even y :odd
    $(".tabla-estaciones tbody tr:even").css("background-color", "#ffffff");
    $(".tabla-estaciones tbody tr:odd").css("background-color", "#e8e8d8");

    // Dar formato visual a las celdas del "Color de Iluminación" (última columna)
    $(".tabla-estaciones tbody tr").each(function () {
        const celdaColor = $(this).find("td:last-child");
        const codigoHex = celdaColor.text().trim();
        
        // Asignar tipografía monoespaciada para la visualización del hexadecimal
        celdaColor.css({
            "font-family": "monospace",
            "font-weight": "bold"
        });
    });
}