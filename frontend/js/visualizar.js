let idUsuarioLogueado;
let idMeme;
let guardarMemeCheck;
let puntajeActualUsuario = null;
let enviandoPuntaje = false;

async function obtenerDatosUsuarioLogueado (idUsuario){

    try{
        const url = `http://localhost:3000/api/v1/usuarios/${idUsuario}`;

        const respuesta = await fetch (url);

        if (!respuesta.ok) {

            throw new Error('No se pudo obtener el usuario');
        }

        const usuarioLogueado = await respuesta.json();

        document.querySelector(`.fotoPerfil`).src = usuarioLogueado.foto_perfil;

        document.querySelector(`.nombreUsuario`).textContent = usuarioLogueado.nombre_usuario;

    } catch (error) {

        console.error(error);
        alert('Error al cargar los datos del usuario');

    }

    
}


document.addEventListener('DOMContentLoaded', async () => {
    
    
    idUsuarioLogueado = Number(obtenerIdUsuarioLogueado());
    console.log("id del usuario logueado:", idUsuarioLogueado);

    // Obtengo id del meme desde la URL
    const params = new URLSearchParams(window.location.search);
    idMeme = Number(params.get('id'));


    if (!idMeme) {
        idMeme = Number(sessionStorage.getItem('idMemeSeleccionado'));
    }

    console.log("id del meme:", idMeme);

    const url = `http://localhost:3000/api/v1/meme/${idMeme}`;

    try{

        const respuesta = await fetch(url);
        const info =  await respuesta.json();

        const meme = info.meme;

        console.log(meme);

        const comentarios =  info.comentarios;

        guardarMemeCheck = document.getElementById('guardarMemeCheck');

        cargarContenedores(meme,comentarios)
        
            
        
    } catch (err){
        console.error(err);
        alert("No se pudo cargar el meme y sus comentarios");
    }

});


async function  memeEstaGuardado (meme){
    
    //verifica si el meme esta guardado o no para poner el logo correcto
    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/v1/usuarios/${idUsuarioLogueado}/memes-guardados`
        );

        if (!respuesta.ok) {
            throw new Error("Error al buscar memes guardados");
        }

        const memesGuardados = await respuesta.json();

        const estaGuardado = memesGuardados.some(
            memeGuardado => memeGuardado.id_meme === meme.id_meme
        );

        guardarMemeCheck.checked = estaGuardado;

    } catch (error) {
        console.error(error);
    }
}

async function guardarMeme (meme){
    guardarMemeCheck.addEventListener('change', async () => {

        try {

            const respuesta = await fetch(

                `http://localhost:3000/api/v1/meme/${meme.id_meme}/guardar`,
                {
                    method: `POST`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: idUsuarioLogueado
                    })
                }
            );

            const data = await respuesta.json();
            guardarMemeCheck.checked = data.guardado;


            if (!respuesta.ok) {
                throw new Error('Error al guardar');
            }

        } catch (error) {
            guardarMemeCheck.checked = !guardarMemeCheck.checked;
            alert('No se pudo actualizar el guardado');
        }
    });
}

//Cargar un comentario
async function cargarComentario(comentario){

    const contenedorComentarios = document.querySelector('.listaComentarios');

    const comentarioItem = document.createElement(`div`);
    comentarioItem.classList.add(`comentarioItem`);


    const contenidoComentario = document.createElement(`p`);
    contenidoComentario.classList.add(`comentarioTexto`);
    contenidoComentario.textContent = comentario.contenido;
    comentarioItem.appendChild(contenidoComentario);

    const accionesComentario = document.createElement(`div`);
    accionesComentario.classList.add(`comentarioAcciones`);
    comentarioItem.appendChild(accionesComentario);

    const indicadorEditado = document.createElement(`div`);
    indicadorEditado.classList.add(`indicadorEditado`);
    accionesComentario.appendChild(indicadorEditado);

    const textoEditado = document.createElement('p');
    textoEditado.classList.add(`textoEditado`);
    indicadorEditado.appendChild(textoEditado);

    const likeContenedor = document.createElement('div');
    likeContenedor.classList.add('likeContenedor');
    accionesComentario.appendChild(likeContenedor);

    const likeInput = document.createElement('input');
    likeInput.type = 'checkbox';
    likeInput.classList.add('likeInput');
    likeInput.id = `likeComentario_${comentario.id_comentario}`;
    likeInput.dataset.comentarioId = comentario.id_comentario;
    likeContenedor.appendChild(likeInput);

    const estrellaClikeable = document.createElement('label');
    estrellaClikeable.classList.add('likeEstrellas');
    estrellaClikeable.setAttribute('for', likeInput.id);
    estrellaClikeable.textContent = '★';
    estrellaClikeable.title = 'Me gusta';
    likeContenedor.appendChild(estrellaClikeable);

    const likeContador = document.createElement('span');
    likeContador.classList.add('likeContador');
    likeContador.textContent = comentario.likes;
    likeContenedor.appendChild(likeContador);


    const botonesComentario = document.createElement(`div`);
    botonesComentario.classList.add(`botonesComentario`);
    accionesComentario.appendChild(botonesComentario);


    const btnEditar = document.createElement(`button`);
    btnEditar.classList.add(`btnEditar`);
    btnEditar.textContent = 'Editar';
    botonesComentario.appendChild(btnEditar);


    const btnEliminar = document.createElement(`button`);
    btnEliminar.classList.add(`btnEliminar`);
    btnEliminar.textContent = 'Eliminar';
    botonesComentario.appendChild(btnEliminar);


    //Si el usuario que creo el comentario coincide con el usuario logueado muestra la opción de eliminar y borrar
    if (comentario.usuario_id === idUsuarioLogueado) {
        
        botonesComentario.style.display = `flex`;

    };

    //Verifica si el usuario likeo o no el comentario para mostrar la estrella pintada si lo hizo
    try {
        const respuesta = await fetch( 
            `http://localhost:3000/api/v1/comentarios/${comentario.id_comentario}/like/${idUsuarioLogueado}`
        );

        if (!respuesta.ok) {
            throw new Error('Error al cargar like del comentario');
        }

        const data = await respuesta.json();
        likeInput.checked = data.likeoComentario;

    } catch(error) {
        console.error(error);
        alert('No se pudo verificar el like');
    }

    //Si el usuario clickea la estrella, quita o agrega el like segun corresponda y actualiza el numero de likes
    likeInput.addEventListener('change', async () => {
        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/v1/comentarios/${comentario.id_comentario}/like`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: idUsuarioLogueado
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error('Error al dar like al comentario');
            }

            const data = await respuesta.json();

            likeContador.textContent = data.likes;
            likeInput.checked = data.likeado;

        } catch (error) {
            console.error(error);
            likeInput.checked = !likeInput.checked;
            alert('No se pudo procesar el like');
        }
    });


    //Si el usuario clickea el boton editar le permite editar su comentario
    btnEditar.addEventListener('click', async () => { 

        const nuevoContenido = prompt("Edita tu comentario:", comentario.contenido);
        

        if (nuevoContenido && nuevoContenido.trim() !== "") {

            try{
                const respuesta =  await fetch (`http://localhost:3000/api/v1/comentarios/${comentario.id_comentario}`,
                    {
                        method: 'PUT',
                        headers: {'Content-Type': `application/json`},
                        body: JSON.stringify({
                            usuario_id: idUsuarioLogueado,
                            nuevoContenido: nuevoContenido
                        })
                    }
                );

                

                if (respuesta.ok){

                    const nuevoComentario = await respuesta.json();

                    comentario.contenido = nuevoComentario.contenido;
                    contenidoComentario.textContent = nuevoComentario.contenido
                    comentarioItem.dataset.editado = "true"

                }else{
                    alert("Error al editar el comentario");
                    return;
                }
                
            

            } catch (error){
                console.error(error);
                alert('No se pudo editar el comentario');
            }
        }
    })


    //Si el usuario clickea eliminar le pregunta si queire borrar su comentario
    btnEliminar.addEventListener('click', async() => {
        
        const confirmarEliminacion = confirm("¿Desea eliminar el comentario?");

        if (!confirmarEliminacion) {
            return;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/v1/comentarios/${comentario.id_comentario}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: idUsuarioLogueado
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error('Error al eliminar comentario');
            }

            comentarioItem.remove();

        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el comentario');
        }
    })


    contenedorComentarios.appendChild(comentarioItem);

};   

//Nuevo Comentario
async function nuevoComentario(meme){

    const textareaComentario = document.getElementById('comentarioMeme');
    const botonComentar = document.querySelector('.comentarioBoton');
    

    botonComentar.addEventListener('click', async () => {

        const contenido = textareaComentario.value.trim();

        if (contenido === "") {
            alert("Escribí un comentario");
            return;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/v1/comentarios/${meme.id_meme}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contenido: contenido,
                        usuario_id: idUsuarioLogueado,
                        meme_id: meme.id_meme
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error("Error al publicar comentario");
            }

            const comentarioCreado = await respuesta.json();

            const mensaje = document.getElementById('mensajeSinComentarios');

            if (mensaje){
                mensaje.remove();
            }


            textareaComentario.value = "";

            cargarComentario(comentarioCreado);

        } catch (error) {
            console.error(error);
            alert("No se pudo publicar el comentario");
        }
    });
}

//Puntuar meme
async function puntuarMeme(meme){

    const estrellas = document.querySelectorAll(`.rating`);
    
    estrellas.forEach(estrella => {

        estrella.addEventListener ('click', async () =>{

            // 🚫 evita doble request
            if (enviandoPuntaje) {
                console.log('BLOQUEADO: request en curso')
                return;
            }

            enviandoPuntaje = true;

            const valor = Number(estrella.value);


            try {
        
                //Si el usuario toca nuevamente el mismo puntaje que ya habia dado lo elimina
                if (puntajeActualUsuario === valor){

                    const respuesta = await fetch(
                        `http://localhost:3000/api/v1/meme/${meme.id_meme}/puntuar`,
                        {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                usuario_id: idUsuarioLogueado
                            })
                        }
                    );

                    if (!respuesta.ok){
                        throw new Error("Error al eliminar puntuación");
                    }

                    
                    estrellas.forEach(e => e.checked = false);

                    puntajeActualUsuario = null;

                    console.log('✅ puntaje eliminado');

                } else {
                    const respuesta = await fetch(
                        `http://localhost:3000/api/v1/meme/${meme.id_meme}/puntuar`,
                        {
                            method: `POST`,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                usuario_id: idUsuarioLogueado,
                                puntaje: valor
                            })
                        }

                    );

                    puntajeActualUsuario = valor;
                    if (!respuesta.ok){
                        throw new Error("Error al calificar meme");
                    }

                }


            }catch (error) {
                alert("No se pudo guardar la puntuación");
            }finally {
                enviandoPuntaje = false;
            }
        });

    });
}

//Cargar puntaje meme
async function puntajeMeme(memeId, usuarioId){
    try {
        const respuesta = await fetch (`http://localhost:3000/api/v1/usuario/${usuarioId}/meme/${memeId}/puntaje`);

        if (!respuesta.ok){
            throw new Error("Error al cargar calificacion del meme");
        }

        const data = await respuesta.json();

        if (data.puntaje !== undefined && data.puntaje !== null && puntajeActualUsuario === null){

            const estrella = document.querySelector(`.rating[value="${data.puntaje}"]`);

            if (estrella){
                estrella.checked = true;
                puntajeActualUsuario = data.puntaje;
            }

        } else {
            puntajeActualUsuario = null;
        }
    } catch (err){
        console.error(err);
    }
}



async function cargarContenedores(meme, comentarios) {

    //Agrego info del meme
    document.querySelector(`.fotoMeme`).src = meme.imagen_url;
    document.querySelector(`.nombreMeme`).textContent = meme.titulo;

    document.getElementById(`descripcionMeme`).textContent = meme.descripcion;
    document.getElementById(`protagonistaMeme`).textContent = meme.protagonistas;
    document.getElementById(`categoria`).textContent = meme.categoria;
    document.getElementById(`origen`).textContent = meme.origen;
    document.getElementById(`medioSurgimiento`).textContent = meme.medio_fuente
    document.getElementById(`fechaOriginal`).textContent = meme.fecha_original;
    document.getElementById(`fechaPublicado`).textContent = meme.fecha_publicacion;
    if (meme.video_url) {
        document.getElementById(`video`).href = meme.video_url;
        document.getElementById(`video`).textContent = "Video del meme";
    }

    //Pongo el logo guardado como corresponda
    memeEstaGuardado(meme);

    //Si el usuario clickea el logo de guardado, agrega o quita el meme de la lista de guardados
    guardarMeme(meme)

    //Si no hay comentarios aparece mensaje que lo indica si no cargo comentarios con sus botones y likes correspondientes. 

    if (comentarios.length === 0){

        const contenedorComentarios = document.querySelector('.listaComentarios');
        const mensaje = document.createElement('p');
        mensaje.id = "mensajeSinComentarios";
        mensaje.textContent = "No hay comentarios todavía :("
        contenedorComentarios.appendChild(mensaje);
    } else{
        for (const comentario of comentarios){

            cargarComentario(comentario);
        }

    }


    //Sector de nuevo comentario

    //Cargo foto y nombre del usuario logueado
    obtenerDatosUsuarioLogueado(idUsuarioLogueado);

    //Agrego nuevo comentario
    nuevoComentario(meme);

    //Cargar puntaje que el usuario previamente le dio al meme
    puntajeMeme(meme.id_meme, idUsuarioLogueado);

    //Puntuar meme
    puntuarMeme(meme);


};






    
    




