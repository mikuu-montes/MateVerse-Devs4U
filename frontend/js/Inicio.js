// Revisa si hay un usuario logueado
const usuarioId = obtenerIdUsuarioLogueado();

//Si no esta logueado lo muevo a otro template.
if (!usuarioId) {
    window.location.href = "../Login Usuario/index.html";
}

const urlMeme = "http://localhost:3000/api/v1/memes";
const containerPosteos = document.getElementById('containerPosteos');
const buscador = document.getElementById('buscador');

function quitarTildes(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  
function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resaltarTexto(textoOriginal, busqueda) {
    if (!busqueda) return textoOriginal;

    const textoPlano = quitarTildes(textoOriginal);
    const palabras = quitarTildes(busqueda)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(escaparRegex);

    if (palabras.length === 0) return textoOriginal;

    const regex = new RegExp(palabras.join("|"), "gi");

    let resultado = "";
    let ultimoIndice = 0;

    textoPlano.replace(regex, (match, offset) => {
    resultado += textoOriginal.slice(ultimoIndice, offset);
    resultado += `<span class="highlight">${textoOriginal.substr(offset, match.length)}</span>`;
    ultimoIndice = offset + match.length;
    });

    resultado += textoOriginal.slice(ultimoIndice);
    return resultado;
}
  
//Si hay contenido para buscar, muestra todos los memes que coincidas, sino, muestra todos los memes.
//Si se hace click en un meme, se envie a traves de sessionStorage el id del meme seleccionado.
async function cargarMemes(contenidoABuscar = "") {
    try {
        //Si se manda contenido para buscar, se cambia la url agregandole una query.
        const urlQuery = contenidoABuscar ? `${urlMeme}?busqueda=${encodeURIComponent(contenidoABuscar)}` : urlMeme;

        //Obtiene los datos de la db
        const response = await fetch(urlQuery);
        if (!response.ok){
            alert("No se pudieron cargar los memes (╥﹏╥)\n Intente recargar la página.");
            return;
        }
        const memes = await response.json();

        //Sobreescrivoel innerHTML
        containerPosteos.innerHTML = "";

        memes.forEach((meme, indice) => {
            //Creo mi post con sus id's/clases
            const postMeme = document.createElement('a');
            postMeme.href = '../Visualizacion Meme/index.html';
            postMeme.className = 'linkContainerPost';
            
            // Redirige el id del meme junto con la ventana de la página si hacen click sobre el.
            postMeme.addEventListener('click', (e) => {
                sessionStorage.setItem('idMemeSeleccionado', meme.id_meme);
                window.location.href = "../Visualizacion Meme/index.html";
            });

            const posicionPost = indice % 2 === 0 ? 'postIzquierda' : 'postDerecha';

            const contenidoPost = document.createElement('div');
            contenidoPost.className = posicionPost;
            const porcentajeEstrellas = (meme.promedio_puntaje / 5) * 100;
            contenidoPost.innerHTML = `
                <div class="containerImgPost">
                    <img class="imgPost" alt="Imagen del Meme" src="${meme.imagen_url}">
                </div>
                <div class="containerInfoPost">
                    <h1 class="tituloPost">${resaltarTexto(meme.titulo, contenidoABuscar)}</h1>
                    <p class="infoPost">${resaltarTexto(meme.descripcion, contenidoABuscar)}</p>
                    <div class="conteinerComentarioPost">
                        <h6 class="fechaCreacion">Publicado: ${new Date(meme.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })}</h6>
                        <div class="containerEstrellas">
                            <div class="estrellasVacias">
                                <div class="estrellasLlenas" style="width:${porcentajeEstrellas}%"></div>
                            </div>
                        </div>
                        <h6 class="cantComentarios">${meme.cantidad_comentarios} comentarios</h6>
                    </div>
                </div>
            `;

            //Lo appendeo a su padre.
            postMeme.appendChild(contenidoPost);
            containerPosteos.appendChild(postMeme);
        });

        if (memes.length === 0) {
            containerPosteos.innerHTML = "<p class='error'>No se encontraron memes, disculpanos ;(</p>";
        }

    } catch (error) {
        console.error(error);
        containerPosteos.innerHTML = '<p class="error">Hubo un error, por favor recarga la página.</p>';
    }
}

// Busca los memes que coincidas, a medida que el susario escriba.
buscador.addEventListener('input', (texto) => {
    const contenido = texto.target.value.trim();
    sessionStorage.setItem('busquedaActual', contenido);
    cargarMemes(contenido);
});

// Cargar todos los memes al inicio
window.addEventListener('DOMContentLoaded', () => {
    // Revisamos si hay una búsqueda guardada
    const busquedaGuardada = sessionStorage.getItem("busquedaActual") || "";

    // Si hay una búsqueda guardada, usamos esa; si no, dejamos vacía
    buscador.value = busquedaGuardada;

    // Cargar memes según la búsqueda
    cargarMemes(busquedaGuardada);

    // Si querés que la búsqueda sea "solo una vez", la eliminamos
    // sessionStorage.removeItem("busquedaActual");
});
