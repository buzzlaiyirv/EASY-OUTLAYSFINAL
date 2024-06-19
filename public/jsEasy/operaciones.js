document.getElementById('newOp-description').addEventListener('input', function() {
    if (this.value.length > 30) {
        this.value = this.value.slice(0, 30); // Limitar la longitud a 30 caracteres
    }
});

document.getElementById('newOp-amount').addEventListener('input', function() {
    // Reemplazar cualquier caracter que no sea un número con una cadena vacía
    this.value = this.value.replace(/\D/g, '');

    // Limitar la longitud a 10 caracteres
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});


document.getElementById('newOp-amount').addEventListener("keydown", function(event) {
    // Obtener el código de la tecla presionada
    var codigoTecla = event.which ? event.which : event.keyCode;

    // Permitir teclas especiales como la flecha arriba, abajo, etc.
    if (codigoTecla == 8 || codigoTecla == 9 || codigoTecla == 37 || codigoTecla == 39) {
        return true;
    }

    // Convertir el código de tecla a un carácter
    var caracter = String.fromCharCode(codigoTecla);

    // Verificar si el carácter es un número
    if (!/^\d+$/.test(caracter)) {
        event.preventDefault(); // Detener la acción predeterminada si no es un número
        return false;
    }

    return true;
});


var inputs = document.getElementsByClassName("newOp-amount");

// Iterar sobre cada elemento de entrada seleccionado
for (var i = 0; i < inputs.length; i++) {
    // Agregar un escuchador de eventos para el evento 'keydown'
    inputs[i].addEventListener("keydown", function(event) {
        // Obtener el código de la tecla presionada
        var codigoTecla = event.which ? event.which : event.keyCode;

        // Permitir teclas especiales como la flecha arriba, abajo, etc.
        if (codigoTecla == 8 || codigoTecla == 9 || codigoTecla == 37 || codigoTecla == 39) {
            return true;
        }

        // Convertir el código de tecla a un carácter
        var caracter = String.fromCharCode(codigoTecla);

        // Verificar si el carácter es un número
        if (!/^\d+$/.test(caracter)) {
            event.preventDefault(); // Detener la acción predeterminada si no es un número
            return false;
        }

        return true;
    });
}



var input = document.getElementById("newOp-amount");

// Agregar un escuchador de eventos para el evento 'keydown'
input.addEventListener("keydown", function(event) {
    // Obtener el código de la tecla presionada
    var codigoTecla = event.which ? event.which : event.keyCode;

    // Permitir teclas especiales como la flecha arriba, abajo, etc.
    if (codigoTecla == 8 || codigoTecla == 9 || codigoTecla == 37 || codigoTecla == 39) {
        return true;
    }

    // Convertir el código de tecla a un carácter
    var caracter = String.fromCharCode(codigoTecla);

    // Verificar si el carácter es un número
    if (!/^\d+$/.test(caracter)) {
        event.preventDefault(); // Detener la acción predeterminada si no es un número
        return false;
    }

    return true;
});