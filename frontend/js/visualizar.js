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
};

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
};

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
};

let modalComentario = null;
let comentarioActual = null;
let emojiSeleccionado = '☺';

//Abre las opciones de reaccion que puede agregar la persona
async function abrirModalEditarComentario(comentario) {
    comentarioActual = comentario;

    if (!modalComentario) {
        modalComentario = document.createElement('div');
        modalComentario.classList.add('modalEditarComentario');

        modalComentario.innerHTML = `
            <div class="modalContenido">
                <h4>Editar Comentario</h4>

                <label>Palabra descriptiva:</label>
                <input type="text" id="editarTituloComentario" />

                <label>Contenido:</label>
                <textarea id="editarContenidoComentario" rows="3"></textarea>

                <label>Reacción:</label>
                <div class="emojiSelectorEditar">
                    <button id="botonEmojiEditar">☺</button>
                    <div class="emojiDropdownEditar" style="display:none;">
                        <span class="emojieEditar" data-emojie="☺" title="Sin Reaccion">☺</span>
                        <span class="emojieEditar" data-emojie="👍" title="Me gusta">👍</span>
                        <span class="emojieEditar" data-emojie="❤️" title="Me encanta">❤️</span>
                        <span class="emojieEditar" data-emojie="😂" title="Divertido">😂</span>
                        <span class="emojieEditar" data-emojie="😢" title="Triste">😢</span>
                        <span class="emojieEditar" data-emojie="🔥" title="Epico">🔥</span>
                        <span class="emojieEditar" data-emojie="😮" title="Me sorprende">😮</span>
                        <span class="emojieEditar" data-emojie="🤔" title="Pensativo">🤔</span>
                        <span class="emojieEditar" data-emojie="💀" title="Muerto">💀</span>
                        <span class="emojieEditar" data-emojie="🙏" title="Respeto">🙏</span>
                        <span class="emojieEditar" data-emojie="🤭" title="Risita">🤭</span>
                        <span class="emojieEditar" data-emojie="😜" title="Alocado">😜</span>
                        <span class="emojieEditar" data-emojie="😏" title="Pícaro">😏</span>
                        <span class="emojieEditar" data-emojie="😲" title="Asombrado">😲</span>
                        <span class="emojieEditar" data-emojie="😶" title="Sin palabras">😶</span>
                        <span class="emojieEditar" data-emojie="😍" title="Enamorado">😍</span>
                        <span class="emojieEditar" data-emojie="🫣" title="Avergonzado">🫣</span>
                        <span class="emojieEditar" data-emojie="😡" title="Enojado">😡</span>
                        <span class="emojieEditar" data-emojie="😎" title="Canchero">😎</span>
                    </div>
                </div>

                <div class="modalBotones">
                    <button id="guardarCambiosComentario">Guardar</button>
                    <button id="cerrarModalComentario">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalComentario);

        // Botón cerrar
        modalComentario.querySelector('#cerrarModalComentario').addEventListener('click', () => {
            modalComentario.style.display = 'none';
        });

        // Selector de emojis
        const botonEmoji = modalComentario.querySelector('#botonEmojiEditar');
        const emojiDropdown = modalComentario.querySelector('.emojiDropdownEditar');

        botonEmoji.addEventListener('click', () => {
            emojiDropdown.style.display = emojiDropdown.style.display === 'block' ? 'none' : 'block';
        });

        modalComentario.querySelectorAll('.emojieEditar').forEach(emoji => {
            emoji.addEventListener('click', () => {
                emojiSeleccionado = emoji.dataset.emojie;
                botonEmoji.textContent = emojiSeleccionado;
                emojiDropdown.style.display = 'none';
            });
        });

        document.addEventListener('click', (e) => {
            if (!emojiDropdown.contains(e.target) && e.target !== botonEmoji) {
                emojiDropdown.style.display = 'none';
            }
        });

        // Guardar cambios del comentario
        modalComentario.querySelector('#guardarCambiosComentario').addEventListener('click', async () => {
            try {
                const nuevosDatos = {
                    nuevoContenido: modalComentario.querySelector('#editarContenidoComentario').value.trim(),
                    nueva_descripcion: modalComentario.querySelector('#editarTituloComentario').value.trim(),
                    nueva_reaccion: emojiSeleccionado === '☺' ? null : emojiSeleccionado,
                    usuario_id: idUsuarioLogueado
                };

                if (!nuevosDatos.nuevoContenido || !nuevosDatos.nueva_descripcion) {
                    alert('Palabra descriptiva y contenido son obligatorios');
                    return;
                }

                // Valida que la descripción sea solo una palabra (sin espacios)
                if (nuevosDatos.nueva_descripcion.includes(' ')) {
                    alert("La descripción debe ser una sola palabra");
                    return;
                }

                const respuesta = await fetch(`http://localhost:3000/api/v1/comentarios/${comentarioActual.id_comentario}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevosDatos)
                });

                if (!respuesta.ok) {
                    const errorJson = await respuesta.json();
                    throw new Error(errorJson.error || 'Error al editar el comentario');
                }

                const comentarioActualizado = await respuesta.json();

                // Actualizamos los datos en el objeto comentarioActual
                comentarioActual.contenido = comentarioActualizado.contenido;
                comentarioActual.descripcion_palabra = comentarioActualizado.descripcion_palabra;
                comentarioActual.reaccion = comentarioActualizado.reaccion;
                comentarioActual.editado = comentarioActualizado.editado;

                // Buscar el comentario en el DOM
                const item = document.querySelector(`#comentario_${comentarioActual.id_comentario}`);
                if (item) {
                    // Actualizar solo los elementos necesarios dentro del comentario
                    const tituloElem = item.querySelector('.comentarioTitulo');
                    const contenidoElem = item.querySelector('.comentarioTexto');
                    const estadoElem = item.querySelector('.comentarioEditadoHeader');
                    const emojiElem = item.querySelector('.comentarioEmoji');

                    if (tituloElem) tituloElem.textContent = comentarioActual.descripcion_palabra;
                    if (contenidoElem) contenidoElem.textContent = comentarioActual.contenido;
                    if (estadoElem) estadoElem.textContent = comentarioActual.editado ? 'Editado' : 'Original';

                    if (emojiElem) {
                        if (comentarioActual.reaccion === '☺' || comentarioActual.reaccion === null) {
                            emojiElem.style.display = 'none';
                        } else {
                            emojiElem.style.display = 'inline';
                            emojiElem.textContent = comentarioActual.reaccion || '';
                        }
                    }
                    
                }

                modalComentario.style.display = 'none';
            } catch (error) {
                console.error('Error al editar el comentario:', error);
                alert('No se pudo editar el comentario. Ver consola para más detalles.');
            }
        });


    }

    // Rellenar modal con datos más recientes
    const tituloInput = modalComentario.querySelector('#editarTituloComentario');
    const contenidoInput = modalComentario.querySelector('#editarContenidoComentario');
    const botonEmoji = modalComentario.querySelector('#botonEmojiEditar');

    if (tituloInput) tituloInput.value = comentarioActual.descripcion_palabra || '';
    if (contenidoInput) contenidoInput.value = comentarioActual.contenido || '';
    if (botonEmoji) {
        if (comentarioActual.reaccion === '☺') {
            botonEmoji.style.visibility = 'hidden';
        } else {
            botonEmoji.textContent = comentarioActual.reaccion || '☺';
            emojiSeleccionado = comentarioActual.reaccion || '☺';
        }
    }
    
    modalComentario.style.display = 'flex';
}

//Recibo todos los comentarios del backend
async function cargarComentarios(comentarios) {
    const contenedorComentarios = document.querySelector('.listaComentarios');
    contenedorComentarios.innerHTML = ''; 

    if (!comentarios || comentarios.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.id = "mensajeSinComentarios";
        mensaje.textContent = "No hay comentarios todavía :(";
        contenedorComentarios.appendChild(mensaje);
        return;
    }

    for (const comentario of comentarios) {
        await cargarComentario(comentario, false); 
    }
}

// Cargar un comentario
async function cargarComentario(comentario, esNuevo = false) {

    const contenedorComentarios = document.querySelector('.listaComentarios');

    // Evita duplicados por ID
    if (document.getElementById(`comentario_${comentario.id_comentario}`)) return;

    const comentarioItem = document.createElement('div');
    comentarioItem.classList.add('comentarioItem');
    comentarioItem.id = `comentario_${comentario.id_comentario}`;

    const comentarioHeader = document.createElement('div');
    comentarioHeader.classList.add('comentarioHeader');

    const comentarioTitulo = document.createElement('h4');
    comentarioTitulo.classList.add('comentarioTitulo');
    comentarioTitulo.textContent = comentario.descripcion_palabra;
    comentarioHeader.appendChild(comentarioTitulo);

    const emoji = comentario.reaccion || '☺'; 

    // Emoji
    const comentarioEmoji = document.createElement('span');
    comentarioEmoji.classList.add('comentarioEmoji');
    if(emoji !== '☺'){
        comentarioEmoji.textContent = emoji;
    }else{
        comentarioEmoji.textContent = '';
    }
    comentarioHeader.appendChild(comentarioEmoji);

    // Esta editado o es original
    const comentarioEstado = document.createElement('span');
    comentarioEstado.classList.add('comentarioEditadoHeader');
    comentarioEstado.textContent = comentario.editado ? 'Editado' : 'Original';
    comentarioHeader.appendChild(comentarioEstado);

    comentarioItem.appendChild(comentarioHeader);

    const comentarioBody = document.createElement('div');
    comentarioBody.classList.add('comentarioBody');

    const contenidoComentario = document.createElement('p');
    contenidoComentario.classList.add('comentarioTexto');
    contenidoComentario.textContent = comentario.contenido;
    comentarioBody.appendChild(contenidoComentario);

    //Likes
    const likeContenedor = document.createElement('div');
    likeContenedor.classList.add('likeContenedor');

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
    likeContador.textContent = comentario.likes ?? 0;
    likeContenedor.appendChild(likeContador);

    comentarioBody.appendChild(likeContenedor);
    comentarioItem.appendChild(comentarioBody);

    //Botones
    const accionesComentario = document.createElement('div');
    accionesComentario.classList.add('comentarioAcciones');

    const botonesComentario = document.createElement('div');
    botonesComentario.classList.add('botonesComentario');
    accionesComentario.appendChild(botonesComentario);

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btnEditar');
    btnEditar.textContent = 'Editar';
    botonesComentario.appendChild(btnEditar);

    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btnEliminar');
    btnEliminar.textContent = 'Eliminar';
    botonesComentario.appendChild(btnEliminar);

    if (comentario.usuario_id === idUsuarioLogueado) {
        botonesComentario.style.display = 'flex';
    }

    comentarioItem.appendChild(accionesComentario);

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

    //Boton editar comentario
    btnEditar.addEventListener('click', () => abrirModalEditarComentario(comentario));

    //Boton eliminar comentario
    btnEliminar.addEventListener('click', async () => {

        if (!confirm("¿Desea eliminar el comentario?")) return;

        try {
            await fetch(
                `http://localhost:3000/api/v1/comentarios/${comentario.id_comentario}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: idUsuarioLogueado })
                }
            );

            comentarioItem.remove();

        } catch (error) {
            console.error(error);
        }
    });

    //Forma en la que insertamos los comentarios en el template
    if (esNuevo) {
        //Si lo acaba de publicar, lo pone arriba del todo 
        contenedorComentarios.prepend(comentarioItem);
    } else {
        //Si ya estaba, los ponemos uno abajo del otro
        contenedorComentarios.append(comentarioItem);
    }
}

//NAgrega un unevo comentario
async function nuevoComentario(meme) {
    
    const textareaComentario = document.getElementById('comentarioMeme');
    const botonComentar = document.querySelector('.comentarioBoton');
    const inputDescripcion = document.getElementById('descripcionPalabra');
    const emojiSelectorContenedor = document.querySelector('.emojiSelectorContenedor');
    const botonEmoji = document.getElementById('emojieSeleccionado');
    const emojiDropdown = document.querySelector('.emojiDropdown');
    
    //Muestra o deha de mostrar la seleccion de meojie
    botonEmoji.addEventListener('click', () => {
        emojiDropdown.style.display = emojiDropdown.style.display === 'block' ? 'none' : 'block';
    });

    //Si se aprieta otra parte de la pantalla, se dejan de ver las opciones
    document.addEventListener('click', (event) => {
        if (!emojiSelectorContenedor.contains(event.target) && event.target !== botonEmoji) {
            emojiDropdown.style.display = 'none';
        }
    });

    let emojiSeleccionado = '☺'; 

    document.querySelectorAll('.emojie').forEach(emoji => {
        emoji.addEventListener('click', () => {
            emojiSeleccionado = emoji.dataset.emojie; 
            botonEmoji.textContent = emojiSeleccionado; 
            emojiDropdown.style.display = 'none';
        });
    });

    //FUncionalidad al botonz
    botonComentar.addEventListener('click', async () => {

        const contenido = textareaComentario.value.trim();
        const descripcion = inputDescripcion.value.trim();

        // Si el contenido del comentario está vacío
        if (contenido === "") {
            alert("Escribí un comentario");
            return;
        }

        // Si la palabra descriptiva está vacía
        if (descripcion === "") {
            alert("Agregá una palabra descriptiva para el meme");
            return;
        }

        //Si la palabra no es una sola
        if (descripcion.includes(' ')) {
            alert("La descripción debe ser una sola palabra");
            return;
        }

        // Si no se ha seleccionado ningún emoji 
        if (emojiSeleccionado === '☺' && !document.querySelector('.emojiDropdown').contains(document.querySelector('.emojie:hover'))) {
            emojiSeleccionado = null;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/v1/comentarios/${meme.id_meme}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contenido: contenido,
                        descripcion_palabra: descripcion,
                        reaccion: emojiSeleccionado,
                        usuario_id: idUsuarioLogueado
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error("Error al publicar comentario");
            }

            const comentarioCreado = await respuesta.json();

            // Quitar mensaje de "sin comentarios" si existe
            const mensaje = document.getElementById('mensajeSinComentarios');
            if (mensaje) mensaje.remove();

            textareaComentario.value = "";
            inputDescripcion.value = "";
            botonEmoji.textContent = '☺';

            // Cargar comentario en la lista
            cargarComentario(comentarioCreado, true);

        } catch (error) {
            console.error(error);
            alert("No se pudo publicar el comentario");
        }
    });
};

//Puntuar meme
async function puntuarMeme(meme){

    const estrellas = document.querySelectorAll(`.rating`);
    
    estrellas.forEach(estrella => {

        estrella.addEventListener ('click', async () =>{

            //evita doble request
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
};

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
};

async function cargarContenedores(meme, comentarios) {

    //Agrego info del meme
    document.querySelector(`.fotoMeme`).src = meme.imagen_url;
    document.querySelector(`.nombreMeme`).textContent = meme.titulo;
    document.getElementById(`descripcionMeme`).textContent = meme.descripcion;
    document.getElementById(`protagonistaMeme`).textContent = meme.protagonistas;
    document.getElementById(`categoria`).textContent = meme.categoria;
    document.getElementById(`origen`).textContent = meme.origen;
    document.getElementById(`medioSurgimiento`).textContent = meme.medio_fuente

    if (meme.fecha_original) {
    document.getElementById('fechaOriginal').textContent =
        meme.fecha_original.split('T')[0];
    }

    if (meme.fecha_publicacion) {
        document.getElementById('fechaPublicado').textContent =
            meme.fecha_publicacion.split('T')[0];
    }

    if (meme.video_url) {
        document.getElementById(`video`).href = meme.video_url;
        document.getElementById(`video`).textContent = "Video del meme";
    }

    // 2. Lógica de estado (Guardado y Puntaje previo)
    memeEstaGuardado(meme);
    guardarMeme(meme);
    puntajeMeme(meme.id_meme, idUsuarioLogueado);

    // 3. CARGA DE COMENTARIOS (Aquí estaba el error de duplicidad)
    // Solo llamamos a cargarComentarios. Esta función ya limpia el contenedor,
    // verifica si está vacío y usa append() para respetar el orden de tu DB.
    cargarComentarios(comentarios);

    // 4. Inicializar acciones de usuario
    obtenerDatosUsuarioLogueado(idUsuarioLogueado);
    nuevoComentario(meme);
    puntuarMeme(meme);
};