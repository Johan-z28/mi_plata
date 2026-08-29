// Estructura menu principal
function menuPrincipal() {
    let opcion;
    
    do {
        opcion = prompt(
            "=== SISTEMA BANCARIO MI PLATA ===\n\n" +
            "1. Iniciar Sesión\n" +
            "2. Registrarse\n" +
            "3. Salir\n\n" +
            "Seleccione una opción (1-3):"
        );

        switch (opcion) {
            case "1":
                iniciarSesion();
            break;

            case "2":
                registrarUsuario();
            break;

            case "3":
                alert("Gracias por usar Mi Plata. ¡Hasta pronto!");
            break;

            default:
                alert("Opción no válida. Por favor, ingrese 1, 2 o 3.")
        }
    } while (opcion !== "3");
}

// Obtiene la lista de usuarios guardada en localStorage (o un arreglo vacío si no hay nada)
function obtenerUsuarios () {
    let usuariosGuardados = localStorage.getItem("usuarios_banco");
    if (usuariosGuardados){
        return JSON.parse(usuariosGuardados) // Convierte el texto guardado a un Array  
    } else {
        return []; // Si está vacío, retorna un arreglo listo para llenar
    }
}

// Guarda la lista actualizada de usuarios en localStorage
function guardarUsuariosBD (usuarios) {
    localStorage.setItem("usuarios_banco", JSON.stringify(usuarios)); // Convierte el Array a texto
}

// Se cra una función para registrar al usuario
function registrarUsuario () {
    alert("-- REGISTRO DE NUEVO CLIENTE ---");
    
    let identificacion = prompt("Ingrese su número de Identificación:");
    let usuario = prompt("Ingrese su nombre de usuario:");
    let correo = prompt("Ingrese su correo electrónico:");
    let clave = prompt("Ingrese su clave:");
    let repetirClave = prompt("Repita su clave:");

    // Se valida que ambas contraseñas coincidan para poder continuar
    if (clave !== repetirClave){
        alert("Error: las contraseñas no coinciden. Intentelo de nuevo.");
        return;
    }

    // Se valida que todos los campos esten llenos
    if (!identificacion || !usuario || !correo) {
    alert("Error: Todos los campos son obligatorios.");
    return;
    }   

    // Verificar si la identificación ya existe
    let listaUsuarios = obtenerUsuarios();
    let existe = listaUsuarios.some(u => u.identificacion === identificacion);

    if (existe) {
        alert("Error: Ya existe un usuario registrado con esa identificación.");
        return;
    }

    let saldoInicial = parseFloat(prompt("Ingrese su saldo inicial:"));

    if (isNaN(saldoInicial) || saldoInicial <0) {
        alert("Error: Ingrese un saldo inicial válido.");
        return;
    }

    // Objeto con la estructura completa requerida
    let nuevoUsuario = {
        identificacion: identificacion,
        usuario: usuario,
        correo: correo,
        clave: clave,
        saldo: saldoInicial,
        intentos: 0,
        bloqueado: false,
        movimientos: []
    };

    listaUsuarios.push(nuevoUsuario);
    guardarUsuariosBD(listaUsuarios);

    alert(`¡Cuenta creada exitosamente para ${usuario}! 
        Saldo inicial: $${saldoInicial}`);
}

// Inicio de sesión
function iniciarSesion () {
    alert("--- INICIO DE SESIÓN ---");

    let usuarioIngresado = prompt("Ingrese su usuario");
    let listaUsuarios = obtenerUsuarios();

    // Buscamos al usuario en el arreglo cargado de localStorage
    let usuarioEncontrado = listaUsuarios.find(u => u.usuario === usuarioIngresado);

    // 1. Validar si el usuario existe
    if (!usuarioEncontrado) {
        alert("Error: El usuario no existe. Debe registrarse primero.");
        return;
    }

    // 2. Validar si la cuenta ya está bloqueada
    if (usuarioEncontrado.bloqueado) {
        alert("Cuenta bloqueada por 24 horas, comunícate con tu banco");
        return;
    }

    // 3. Ciclo de intentos para la contraseña (máximo 3 intentos)
    let intentosMaximos = 3;

    while (usuarioEncontrado.intentos < intentosMaximos) {
        let claveIngresada = prompt(`Ingrese su clave (Intentos usados: ${usuarioEncontrado.intentos}/${intentosMaximos}):`);

        if (claveIngresada == usuarioEncontrado.clave) {
            alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.usuario}!`)

            // Reiniciamos los intentos fallidos al entrar con éxito
            usuarioEncontrado.intentos = 0;
            guardarUsuariosBD(listaUsuarios);

            // Entramos al menú del cajero
            menuTransacciones(usuarioEncontrado);
            return;
        } else {
            usuarioEncontrado.intentos++;
            alert(`Clave incorrecta. Intentos fallidos: ${usuarioEncontrado.intentos} de ${intentosMaximos}`);
        }
    }

    // 4. Si supera los 3 intentos fallidos, bloqueamos la cuenta
    if (usuarioEncontrado.intentos >= intentosMaximos) {
        usuarioEncontrado.bloqueado = true;
        guardarUsuariosBD(listaUsuarios);
        alert("Cuenta bloqueada por 24 horas, comunícate con tu banco");
    }
}


menuPrincipal();