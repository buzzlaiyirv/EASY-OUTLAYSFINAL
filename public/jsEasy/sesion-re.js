const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});


//MOSTRAR MENSAJE DE ERROR SI NO SE INGRESA NADA EN EL CAMPO EN EL INICIO DE SESIÓN
document.getElementById("sign-in-form1").addEventListener('submit', function(){

    var usuario = document.getElementById("usuario");
    var contraseña = document.getElementById("contraseña");
    var errorU = document.getElementById("usuario-error");
    var errrorC = document.getElementById("contraseña-error");

    let verificador = true;

    if(usuario.value.trim() === '' || contraseña.value.trim() === ''){
        event.preventDefault();
    }

    if(usuario.value.trim() === ''){
        errorU.textContent = "El campo usuario es requerido";
        errorU.style.display = "block";
        verificador = false
    }else{
        errorU.style.display = "none";
    }

    if(contraseña.value.trim() === ''){
        errrorC.textContent = "El campo contraseña es requerido"
        errrorC.style.display = "block";
        verificador = false;
    }else{
        errrorC.style.display = "none";
    }
})


//MOSTRAR MENSAJE DE ERROR SI NO SE INGRESA NADA EN EL CAMPO EN LA CREACIÓN DE CUENTA
document.getElementById("sign-up-form").addEventListener('submit', function(){


    var nombreU = document.getElementById("nombreU");
    var email = document.getElementById("email");
    var contraseña = document.getElementById("contra");
    var errorNU = document.getElementById("nombreU-error");
    var errorE = document.getElementById("email-error");
    var errorC = document.getElementById("contra-error");

    let verificador = true;

    if(nombreU.value.trim() === '' || email.value.trim() === '' || ontraseña.value.trim() === ''){
        event.preventDefault();
    }

    if(nombreU.value.trim() === ''){
        errorNU.textContent = "El campo nombre de usuario es requerido";
        errorNU.style.display = "block";
        verificador = false;
    }else{
        errorNU.style.display = "none";
    }

    if(email.value.trim() === ''){
        errorE.textContent = "El campo email es requerido";
        errorE.style.display = "block";
        verificador = false;
    }else{
        errorE.style.display = "none";
    }

    if(contraseña.value.trim() === ''){
        errorC.textContent = "El campo contraseña es requerido";
        errorC.style.display = "block";
        verificador = false;
    }else{
        errorC.style.display = "none";
    }
})