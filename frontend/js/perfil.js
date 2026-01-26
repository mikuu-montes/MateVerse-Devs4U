// Revisa si hay un usuario logueado
const usuarioId = obtenerIdUsuarioLogueado();

//Si no esta logueado lo muevo a otro template.
if (!usuarioId) {
    window.location.href = "../Login Usuario/index.html";
}

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

//Edita la foto de perfil si el usuario asi lo quisiera
function habilitarEdicionFotoPerfil() {

    fotoPerfil.addEventListener("click", (e) => {
        e.stopPropagation();
        inputFoto.style.display = "block";
        inputFoto.focus();
    });

    // Cerrar el input si se hace click fuera
    document.addEventListener("click", () => {
        inputFoto.style.display = "none";
        inputFoto.value = "";
    });

    // Evita que el click en el input lo cierre
    inputFoto.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    inputFoto.addEventListener("change", async () => {
        const nuevaUrl = inputFoto.value.trim();
        if (!nuevaUrl) return;

        if (!nuevaUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
            alert("La imagen debe ser JPG, PNG o WEBP");
            inputFoto.value = "";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/usuarios/${usuarioId}/foto`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ foto_perfil: nuevaUrl })
                }
            );

            if (!response.ok) {
                alert("No se pudo actualizar la foto de perfil");
                return;
            }

            const usuarioActualizado = await response.json();
            fotoPerfil.src = `${usuarioActualizado.foto_perfil}?t=${Date.now()}`;

            inputFoto.value = "";
            inputFoto.style.display = "none";

        } catch (err) {
            console.error(err);
            alert("Error al actualizar la foto");
        }
    });
}

//Edita los campos si el usuario lo necesita.
function hacerEdicion(texto, input, campoNombre) {

    let valorAnterior = "";

    texto.addEventListener("click", () => {
        valorAnterior = texto.textContent;

        if (campoNombre === "clave") {
            input.value = "";
        } else if (campoNombre === "nombre_usuario") {
            input.value = texto.textContent.replace("@", "");
        } else {
            input.value = texto.textContent;
        }
        texto.classList.add("oculto");
        input.classList.add("activo");
        input.focus();
    });

    input.addEventListener("keydown", async (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const nuevoValor = input.value.trim();
        if (!nuevoValor && campoNombre !== "clave") {
            alert("El campo no puede estar vacío");
            return;
        }

        const datos = {
            nombre_usuario: cambiarUsuario.value || nombreUsuario.textContent.replace("@", ""),
            nombre_completo: cambiarNombre.value || nombreCompleto.textContent,
            email: cambiarMail.value || mail.textContent,
            contrasenia: cambiarClave.value || "123456"
        };

        if (campoNombre === "clave") {
            datos.contrasenia = nuevoValor;
        } else if (campoNombre === "nombre_usuario") {
            datos.nombre_usuario = nuevoValor;
        } else if (campoNombre === "nombre_completo") {
            datos.nombre_completo = nuevoValor;
        } else if (campoNombre === "email") {
            datos.email = nuevoValor;
        }

        try {
            const response = await fetch(urlPerfil, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error("Error backend");
            }

            const usuarioActualizado = await response.json();

            if (campoNombre === "clave") {
                texto.textContent = "******";
            } else if (campoNombre === "nombre_usuario") {
                texto.textContent = `@${usuarioActualizado.nombre_usuario}`;
            } else {
                texto.textContent = usuarioActualizado[campoNombre];
            }

        } catch (err) {
            texto.textContent = valorAnterior;
            alert("No se pudo guardar el cambio");
        }
        texto.classList.remove("oculto");
        input.classList.remove("activo");
    });

    input.addEventListener("blur", () => {
        texto.classList.remove("oculto");
        input.classList.remove("activo");
    });
}

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
    habilitarEdicionFotoPerfil();
});
