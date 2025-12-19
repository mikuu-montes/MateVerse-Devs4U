// Revisa si hay un usuario logueado
const usuarioId = obtenerIdUsuarioLogueado() || 4;

//DESCOMENTAR AL TERMINAR.
//Si no esta logueado lo muevo a otro template.
//if (!usuarioId) {
//    window.location.href = "../Login Usuario/index.html";
//}


const urlPerfil = `http://localhost:3000/api/v1/usuarios/${usuarioId}`;
const urlCategorias = `http://localhost:3000/api/v1/usuarios/${usuarioId}/categorias-favoritas`;
const urlMemes = `http://localhost:3000/api/v1/usuarios/${usuarioId}/memes`;

// atrapo campos del DOM.
const nombreUsuario = document.getElementById("nombreUsuario");
const cambiarUsuario = document.getElementById("cambiarUsuario");
const nombreCompleto = document.getElementById("nombreCompleto");
const cambiarNombre = document.getElementById("cambiarNombre");
const mail = document.getElementById("mail");
const cambiarMail = document.getElementById("cambiarMail");
const clave = document.getElementById("clave");
const cambiarClave = document.getElementById("cambiarClave");;
const inputFoto = document.getElementById("inputFoto");

const fotoPerfil = document.querySelector(".fotoPerfil")
const filaPosts = document.querySelector(".filaPosts");
const contenedorCat = document.querySelector(".contenedorCat");
const botonEliminarUsuario = document.querySelector(".botonEliminarUsuario");

//Cargar los datos del usuario dentro del perfil
async function cargarUsuario() {
    try {
        //consigo la info
        const response = await fetch(urlPerfil);
        if (!response.ok){
            alert("No se pudo cargar el perfil (╥﹏╥)\n Intente recargar la página.");
            return;
        }
        const usuario = await response.json();

        nombreUsuario.textContent = `@${usuario.nombre_usuario}`;
        nombreCompleto.textContent = usuario.nombre_completo;
        mail.textContent = usuario.email;
        clave.textContent = "******";
        if (usuario.foto_perfil) fotoPerfil.src = usuario.foto_perfil;
    } catch (err) {
        console.error(err);
        alert("⚠️ Hubo un error, por favor recarga la página.⚠️ ");
    }
}

//Edita los campos si el usuario lo necesita.
function hacerEdicion(h2, input, campoNombre) {
    //oculta el contenido original del input
    h2.addEventListener("click", () => {
        input.value = campoNombre === "clave" ? "" : h2.textContent.replace("@", "");
        h2.style.display = "none";
        input.style.display = "block";
        input.focus();
    });

    //Modifico ls datos wue agregi el usuario
    input.addEventListener("keydown", async (e) => {
        if (e.key !== "Enter") return;

        h2.style.display = "block";
        input.style.display = "none";

        // Construimos el objeto completo con los valores actuales
        const datos = {
            nombre_usuario: cambiarUsuario.value || nombreUsuario.textContent.replace("@", ""),
            nombre_completo: cambiarNombre.value || nombreCompleto.textContent,
            email: cambiarMail.value || mail.textContent,
            contrasenia: cambiarClave.value || "123456"
        };

        // Si el campo que se edita es clave, reemplazamos
        if (campoNombre === "clave") datos.contrasenia = input.value;

        try {
            //Solicito la edicion del campo.
            const response = await fetch(urlPerfil, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!response.ok){
                alert("No se pudieron actualizar el campo (╥﹏╥)\n Intente recargar la página.");
                return;
            }

            //Modifico los datos de pantalla con los nuevos
            const usuarioActualizado = await response.json();
            nombreUsuario.textContent = `@${usuarioActualizado.nombre_usuario}`;
            nombreCompleto.textContent = usuarioActualizado.nombre_completo;
            mail.textContent = usuarioActualizado.email;
            if (campoNombre === "clave") clave.textContent = "******";

        } catch (err) {
            console.error(err);
            alert("⚠️ Hubo un error, por favor recarga la página.⚠️ ");
        }
    });

    //Si toca otra parte de la pantalla, se muestra el contenido original
    input.addEventListener("blur", () => {
        h2.style.display = "block";
        input.style.display = "none";
    });
}

//Muestra opcion de editar foto.
fotoPerfil.addEventListener("click", () => {
    inputFoto.style.display = "block";
    inputFoto.focus();
});

//Actualiza la foto de perfil.
inputFoto.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    fotoPerfil.src = inputFoto.value;

    try {
        //Edito foto
        const response = await fetch(urlPerfil, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                foto_perfil: inputFoto.value,
                nombre_usuario: nombreUsuario.textContent.replace("@", ""),
                nombre_completo: nombreCompleto.textContent,
                email: mail.textContent
            })
        });
        if (!response.ok){
            alert("No se pudieron actualizar la foto (╥﹏╥)\n Intente recargar la página.");
            return;
        }
    } catch (err) {
        console.error(err);
        alert("⚠️ Hubo un error, por favor recarga la página.⚠️");
    }

    inputFoto.style.display = "none";
});

//Muestra categorias favoritas
async function cargarCategorias() {
    try {
        //Obtengo la info
        const response = await fetch(urlCategorias);
        if (!response.ok){
            return;
        }

        const categorias = await response.json();
        contenedorCat.innerHTML = "";

        categorias.forEach((cat, indice) => {
            const h = document.createElement("h2");
            h.classList.add("categoria");
            h.id = `fav${indice + 1}`;
            h.textContent = `#${cat.nombre_categoria}`;
            contenedorCat.appendChild(h);
        });

        if (categorias.length === 0) contenedorCat.style.display = "none";

    } catch (err) {
        console.error(err);
        alert("⚠️ Hubo un error, por favor recarga la página.⚠️");
    }
}

//Carga los memes que publico el usurio.
async function cargarMemes() {
    try {
        //obtengo info
        const response = await fetch(urlMemes);
        if (!response.ok){
            alert("No se pudieron cargar los memes (╥﹏╥)\n Intente recargar la página.");
            return;
        }
        const memes = await response.json();

        // Limpio el contenedor
        filaPosts.innerHTML = "";

        memes.forEach((meme) => {
            const postMeme = document.createElement("div");
            postMeme.classList.add("memeBox");
            postMeme.innerHTML = `
                <a href="../Visualizacion Meme/index.html" class="nombreMeme">${meme.titulo}</a>
                <div class="botonesMeme">
                    <button class="editar">✏️</button>
                    <button class="eliminar">🗑️</button>
                </div>
            `;
            filaPosts.appendChild(postMeme);

            // Si se quiere editar, redirige a otra página junto con el id de meme.
            const botonEditar = postMeme.querySelector(".editar");
            botonEditar.addEventListener("click", (e) => {
                e.preventDefault();
                sessionStorage.setItem("idMemeSeleccionado", meme.id_meme);
                window.location.href = "../Editar Meme/index.html";
            });

            // Si se aprieta el tachito de basura, se elimina el meme.
            const botonEliminar = postMeme.querySelector(".eliminar");
            botonEliminar.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch(`http://localhost:3000/api/v1/meme/${meme.id_meme}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ usuario_id: usuarioId })
                    });
                    if (!response.ok){
                        alert("No se po eliminar el meme. (╥﹏╥)\n Intente recargar la página.");
                        return;
                    }
                    // Remuevo el meme del DOM
                    postMeme.remove();
                } catch (err) {
                    console.error(err);
                    alert("⚠️ Hubo un error, por favor recarga la página.⚠️");
                }
            });
        });

    } catch (err) {
        console.error(err);
        filaPosts.innerHTML = '<p class="error">⚠️ Hubo un error al cargar los memes, recarga la página.⚠️</p>';
    }
}

//limino el usuario
botonEliminarUsuario.addEventListener("click", async () => {
    if (!confirm("¿Seguro querés eliminar tu cuenta? Esta acción es irreversible.")) {
        return;
    }
    try {
        const response = await fetch(urlPerfil, { method: "DELETE" });
        if (!response.ok){
            alert("No se pudo eliminar el usuario(╥﹏╥)\n Intente recargar la página.");
            return;
        }
        alert("Usuario eliminado correctamente");
        window.location.href = "../Login Usuario/index.html";
    } catch (err) {
        console.error(err);
        alert("⚠️ Hubo un error, por favor recarga la página.⚠️");
    }
});

//Llamo a la edicion d elos campos
hacerEdicion(nombreUsuario, cambiarUsuario, "nombre_usuario");
hacerEdicion(nombreCompleto, cambiarNombre, "nombre_completo");
hacerEdicion(mail, cambiarMail, "email");
hacerEdicion(clave, cambiarClave, "clave");


window.addEventListener("DOMContentLoaded", () => {
    cargarUsuario();
    cargarCategorias();
    cargarMemes();
});
