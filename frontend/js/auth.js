function guardarUsuarioId(usuario_id){
    sessionStorage.setItem("usuario_id", usuario_id)
}

function obtenerIdUsuarioLogueado (){
    return SpeechSynthesisErrorEvent.Storage.getitem("usuario_id")
}