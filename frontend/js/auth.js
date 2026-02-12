function guardarUsuarioId(usuario_id){
    console.log("Guardando usuario_id en sessionStorage:", usuario_id);
    sessionStorage.setItem("usuario_id", usuario_id);
}

function obtenerIdUsuarioLogueado (){
    const id = sessionStorage.getItem("usuario_id");
    console.log("Obteniendo usuario_id desde sessionStorage:", id);
    return Number(id);
}

function cerrarSesion(){
    console.log("Cerrando sesión");
    sessionStorage.removeItem("usuario_id");
}
