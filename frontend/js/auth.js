function guardarUsuarioId(usuario_id){
    sessionStorage.setItem("usuario_id", usuario_id)
}

function obtenerIdUsuarioLogueado (){
    return sessionStorage.getItem("usuario_id")
}