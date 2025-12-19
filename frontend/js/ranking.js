// Revisa si hay un usuario logueado
const usuarioId = obtenerIdUsuarioLogueado();

//Si no esta logueado lo muevo a otro template.
if (!usuarioId) {
    window.location.href = "../Login Usuario/index.html";
}

const urlRanking = "http://localhost:3000/api/v1/ranking";
const containerInfoRanking = document.querySelector(".containerInfoRanking");

//Agrega el top 10 mejores memes, si se clickea uno se redirige junto con su id.
async function rellenarRanking() {
    try{
        //Obtengo los datos de la db
        const response = await fetch(urlRanking);
        if (!response.ok){
            alert("No se pudieron cargar los memes (╥﹏╥)\n Intente recargar la página.");
            return;
        }
        const memes = await response.json();
        
        // Limpiar contenido previo
        containerInfoRanking.innerHTML = `
            <div class="containerContextoRanking">
            <h1 class="contextoRanking">Ranking</h1>
            <h3 class="contextoRanking">Aquí encontrarás los 10 mejores memes de MateVerse 🧉</h3>
            </div>
        `;

        memes.forEach((meme, indice) => {
            const postRanking = `
                <h4 class="numeroRanking">${indice + 1}º Puesto:</h4>
                <a href="../Visualizacion Meme/index.html" class="linkContainerPost">
                    <div class="containerPostRanking">
                        <div class="postRanking">
                            <img src="${meme.imagen_url}" alt="Meme ${meme.titulo}">
                            <div class="tituloPostRanking">
                                <p class="tituloPost">${meme.titulo}</p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            //Insera el meme.
            containerInfoRanking.insertAdjacentHTML("beforeend", postRanking);
        
            // Tomamos todos los <a> y seleccionamos el último agregado
            const todosLinks = containerInfoRanking.querySelectorAll('a.linkContainerPost');
            const ultimoLink = todosLinks[todosLinks.length - 1];
        
            // Redirige el id del meme junto con la ventana de la página si hacen click sobre el.
            ultimoLink.addEventListener('click', (e) => {
                sessionStorage.setItem('idMemeSeleccionado', meme.id_meme);
                window.location.href = "../Visualizacion Meme/index.html";
            });
        });
        
    }catch(error){
        console.error(error);
        containerInfoRanking.innerHTML = '<p class="error">⚠️ Hubo un error, por favor recarga la página.⚠️ </p>';
    }
}

// Cargar todos los memes al inicio
window.addEventListener('DOMContentLoaded', rellenarRanking);