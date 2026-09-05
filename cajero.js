// --- VARIABLES PRINCIPALES ---
let listaUsuarios = [];
let usuarioActual = null;

// Cargamos los usuarios que ya estaban guardados
let datosGuardados = localStorage.getItem("usuarios_banco");

if (datosGuardados) {
    listaUsuarios = JSON.parse(datosGuardados);
}

// Función para guardar los usuarios
function guardarEnLocalStorage() {
    localStorage.setItem("usuarios_banco", JSON.stringify(listaUsuarios));
}


// Menú principal
function menuPrincipal() {
    let opcion = "";

    while (opcion !== "3") {
        opcion = prompt(
            "--- BANCO MI PLATA ---\n\n" +
            "1. Iniciar Sesión\n" +
            "2. Registrarse\n" +
            "3. Salir\n\n" +
            "Ingrese una opción:"
        );

        switch (opcion) {
            case "1":
                iniciarSesion();
                break;

            case "2":
                registrarUsuario();
                break;

            case "3":
            case null:
                alert("Gracias por usar nuestro banco. ¡Hasta luego!");
                opcion = "3";
                break;

            default:
                alert("Opción no válida, intente de nuevo.");
        }
    }
}

// Generar número de cuenta aleatorio
function generarNumeroCuenta() {
    let numero = Math.floor(1000000000 + Math.random() * 9000000000);
    return numero.toString();
}

// Opción 2 - Registrar usuario
function registrarUsuario() {
    alert("--- REGISTRO DE USUARIO ---");

    let id = prompt("Ingrese su número de documento:");
    let nombre = prompt("Ingrese su nombre de usuario:");
    let correo = prompt("Ingrese su correo:");

    // Revisamos que los datos no estén vacíos
    if (
        id === "" ||
        nombre === "" ||
        correo === "" ||
        id === null ||
        nombre === null ||
        correo === null
    ) {
        alert("Error: No puedes dejar campos vacíos.");
        return;
    }

    // Revisamos si el documento ya existe
    for (let i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].identificacion === id) {
            alert("Error: Esta identificación ya está registrada.");
            return;
        }
    }

    // Pedimos la contraseña dos veces
    let clave = prompt("Cree una contraseña:");
    let clave2 = prompt("Repita la contraseña:");

    if (clave !== clave2) {
        alert("Error: Las contraseñas no coinciden.");
        return;
    }

    // Pedimos el saldo inicial
    let saldo = parseFloat(prompt("Ingrese el saldo inicial:"));

    // Revisamos que el saldo sea válido
    if (isNaN(saldo) || saldo < 0) {
        alert("Error: El saldo debe ser un número positivo.");
        return;
    }

    let numCuenta = generarNumeroCuenta();

    // Confirmación de datos ingresados
    let confirmar = confirm(
        "=== CONFIRMACIÓN DE DATOS ===\n\n" +
        "Documento: " + id + "\n" +
        "Usuario: " + nombre + "\n" +
        "Correo: " + correo + "\n" +
        "Saldo inicial: $" + saldo + "\n" +
        "Número de cuenta asignado: " + numCuenta + "\n\n" +
        "¿Desea confirmar el registro de esta cuenta?"
    );

    if (confirmar === false) {
        alert("Registro cancelado.");
        return;
    }

    // Creamos el nuevo usuario
    let nuevoUsuario = {
        identificacion: id,
        numeroCuenta: numCuenta,
        usuario: nombre,
        correo: correo,
        clave: clave,
        saldo: saldo,
        intentos: 0,
        bloqueado: false,
        movimientos: []
    };

    // Agregamos el usuario a la lista
    listaUsuarios.push(nuevoUsuario);

    // Guardamos los cambios
    guardarEnLocalStorage();

    alert(
        "¡Usuario registrado con éxito!\n\n" +
        "Su número de cuenta es: " + numCuenta
    );
}

// --- INICIO DE SESIÓN ---
function iniciarSesion() {
    alert("--- INICIAR SESIÓN ---");

    let usuarioBuscar = prompt("Ingrese su nombre de usuario:");
    let usuarioEncontrado = null;

    // Buscamos el usuario
    for (let i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].usuario === usuarioBuscar) {
            usuarioEncontrado = listaUsuarios[i];
            break;
        }
    }

    // Si no existe el usuario
    if (usuarioEncontrado === null) {
        alert("El usuario no existe. Debe registrarse.");
        return;
    }

    // Revisamos si la cuenta está bloqueada
    if (usuarioEncontrado.bloqueado === true) {
        alert("Cuenta bloqueada por 24 horas, comunícate con tu banco");
        return;
    }

    let intentos = usuarioEncontrado.intentos;

    // Dejamos máximo 3 intentos
    while (intentos < 3) {
        let claveIngresada = prompt(
            "Ingrese su contraseña (Intento " +
            (intentos + 1) +
            " de 3):"
        );

        // Si la contraseña es correcta
        if (claveIngresada === usuarioEncontrado.clave) {
            alert("¡Bienvenido " + usuarioEncontrado.usuario + "!");

            // Reiniciamos los intentos
            usuarioEncontrado.intentos = 0;

            guardarEnLocalStorage();

            // Guardamos el usuario que inició sesión
            usuarioActual = usuarioEncontrado;

            // Abrimos el menú del cajero
            menuCajero();

            return;

        } else {

            // Sumamos un intento
            intentos = intentos + 1;
            usuarioEncontrado.intentos = intentos;

            guardarEnLocalStorage();

            alert("Contraseña incorrecta.");
        }
    }

    // Si falla 3 veces se bloquea la cuenta
    if (intentos >= 3) {
        usuarioEncontrado.bloqueado = true;

        guardarEnLocalStorage();

        alert("Cuenta bloqueada por 24 horas, comunícate con tu banco");
    }
}

// --- MENÚ DEL CAJERO ---
function menuCajero() {
    let opcionCajero = "";

    while (opcionCajero !== "5") {
        opcionCajero = prompt(
            "=== CAJERO AUTOMÁTICO ===\n" +
            "Hola, " +
            usuarioActual.usuario +
            "\nN° Cuenta: " + usuarioActual.numeroCuenta + "\n\n" +
            "1. Consultar Saldo\n" +
            "2. Consignar Dinero\n" +
            "3. Retirar Dinero\n" +
            "4. Consultar Movimientos\n" +
            "5. Salir (Cerrar Sesión)\n\n" +
            "Seleccione una opción:"
        );

        switch (opcionCajero) {
            case "1":
                consultarSaldo();
                break;

            case "2":
                consignar();
                break;

            case "3":
                retirar();
                break;

            case "4":
                verMovimientos();
                break;

            case "5":
            case null:
                alert("Cerrando sesión...");

                usuarioActual = null;
                opcionCajero = "5";
                break;

            default:
                alert("Opción no válida.");
        }
    }
}

// --- CONSULTAR SALDO ---
function consultarSaldo() {
    alert(
        "N° de Cuenta: " + usuarioActual.numeroCuenta + "\n" +
        "Su saldo actual es: $" + usuarioActual.saldo
    );
}

// --- CONSIGNAR DINERO ---
function consignar() {
    let valor = parseFloat(
        prompt("Ingrese la cantidad a consignar:")
    );

    // Revisamos que el valor sea válido
    if (isNaN(valor) || valor <= 0) {
        alert("Monto no válido.");
        return;
    }

    // Sumamos el dinero al saldo
    usuarioActual.saldo = usuarioActual.saldo + valor;

    // Sacamos la fecha del movimiento
    let fecha = new Date().toLocaleString();

    // Guardamos los datos del movimiento
    let movimiento = {
        fecha: fecha,
        concepto: "Consignación",
        valor: valor,
        saldoNuevo: usuarioActual.saldo
    };

    // Agregamos el movimiento al historial
    usuarioActual.movimientos.push(movimiento);

    // Guardamos los cambios
    guardarEnLocalStorage();

    alert(
        "Consignación realizada con éxito. Nuevo saldo: $" +
        usuarioActual.saldo
    );
}

// --- RETIRAR DINERO ---
function retirar() {
    let valor = parseFloat(
        prompt("Ingrese la cantidad a retirar:")
    );

    // Revisamos que el valor sea válido
    if (isNaN(valor) || valor <= 0) {
        alert("Monto no válido.");
        return;
    }

    // Revisamos que haya suficiente saldo
    if (valor > usuarioActual.saldo) {
        alert("Fondos insuficientes para este retiro.");
        return;
    }

    // Restamos el dinero del saldo
    usuarioActual.saldo = usuarioActual.saldo - valor;

    // Sacamos la fecha del retiro
    let fecha = new Date().toLocaleString();

    // Guardamos los datos del movimiento
    let movimiento = {
        fecha: fecha,
        concepto: "Retiro",
        valor: valor,
        saldoNuevo: usuarioActual.saldo
    };

    // Agregamos el movimiento al historial
    usuarioActual.movimientos.push(movimiento);

    // Guardamos los cambios
    guardarEnLocalStorage();

    alert(
        "Retiro exitoso. Saldo restante: $" +
        usuarioActual.saldo
    );
}

// --- VER MOVIMIENTOS ---
function verMovimientos() {

    // Revisamos si tiene movimientos
    if (usuarioActual.movimientos.length === 0) {
        alert("No hay movimientos en esta cuenta.");
        return;
    }

    let texto = "--- HISTORIAL DE MOVIMIENTOS ---\n\n";

    // Recorremos los movimientos
    for (let i = 0; i < usuarioActual.movimientos.length; i++) {

        let m = usuarioActual.movimientos[i];

        // Vamos armando el texto del historial
        texto =
            texto +
            (i + 1) +
            ". [" +
            m.fecha +
            "]\n" +
            "   Tipo: " +
            m.concepto +
            "\n" +
            "   Monto: $" +
            m.valor +
            "\n" +
            "   Saldo: $" +
            m.saldoNuevo +
            "\n" +
            "-----------------------------\n";
    }

    // Mostramos el historial
    alert(texto);
}
menuPrincipal();