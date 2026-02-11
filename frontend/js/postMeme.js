// Revisa si hay un usuario logueado
const usuarioId = obtenerIdUsuarioLogueado();

//Si no esta logueado lo muevo a otro template.
if (!usuarioId) {
    window.location.href = "../Login Usuario/index.html";
}

window.addEventListener("DOMContentLoaded", () => {
    const formCrearMeme = document.getElementById('formCrearMeme');
    const selectCategoria = document.getElementById('input_categoria');

    if (!formCrearMeme || !selectCategoria) {
        console.warn("Formulario de creación no encontrado. JS abortado.");
        return;
    }

    // --- Cargar categorías ---
    async function cargarCategorias() {
        try {
            const res = await fetch('http://localhost:3000/api/v1/categorias');
            const categorias = await res.json();

            selectCategoria.innerHTML = `
                <option value="" disabled selected>Selecciona una categoría</option>
            `;

            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id_categoria;
                option.textContent = cat.nombre;
                selectCategoria.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    }

    // --- Manejar envío del formulario ---
    formCrearMeme.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formCrearMeme);

        // Obtener usuario logueado
        const usuario_id = sessionStorage.getItem("usuario_id");
        if (!usuario_id) {
            alert("No se detecta un usuario logueado. Inicia sesión primero.");
            return;
        }

        // Obtener categoría seleccionada
        const categoria_id = Number(formData.get('id_categoria'));
        if (!categoria_id) {
            alert("Debes seleccionar una categoría válida");
            return;
        }

        // Crear objeto con los datos del meme
        const data = {
            titulo: formData.get('titulo'),
            imagen_url: formData.get('imagen_url'),
            video_url: formData.get('video_url') || null, 
            descripcion: formData.get('descripcion'),
            protagonistas: formData.get('protagonista'),
            categoria_id,
            usuario_id: Number(usuario_id),
            origen: formData.get('lugar_surgimiento'),
            medio_fuente: formData.get('medio_fuente'),
            fecha_original: formData.get('fecha')
        };

        console.log("Enviando meme:", data);

        try {
            const res = await fetch('http://localhost:3000/api/v1/memes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Error al publicar el meme");
            }

            const result = await res.json();
            console.log('Meme publicado:', result);
            alert('Meme publicado con éxito ');
            formCrearMeme.reset();
            window.location.href = "../Inicio/index.html";

        } catch (error) {
            console.error('Error al publicar meme:', error);
            alert(error.message);
        }
    });

    cargarCategorias();
});
