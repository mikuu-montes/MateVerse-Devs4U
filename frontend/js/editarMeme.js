document.addEventListener('DOMContentLoaded', () => {

    console.log("JS cargado");

    //  OBTENER ID DEL MEME
    const params = new URLSearchParams(window.location.search);
    const idMeme = params.get('id');
    console.log("ID MEME:", idMeme);

    if (!idMeme) {
        console.error("No llegó el ID del meme por la URL");
        return;
    }

    let currentMemeCategoriaId = null;
    let currentMemeContextoId = null;

    // CARGAR CATEGORÍAS
    async function cargarCategorias() {
        try {
            const res = await fetch('http://localhost:3000/api/v1/categorias');
            if (!res.ok) throw new Error("Error cargando categorías");

            const categorias = await res.json();
            const select = document.getElementById('input_categoria');
            select.innerHTML = '';

            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id_categoria;
                option.textContent = cat.nombre;
                select.appendChild(option);
            });

            if (currentMemeCategoriaId) {
                select.value = currentMemeCategoriaId;
            }

        } catch (error) {
            console.error("Error categorías:", error);
        }
    }

    //  CARGAR MEME 
    async function cargarMeme() {
        try {
            const res = await fetch(`http://localhost:3000/api/v1/meme/${idMeme}`);
            if (!res.ok) throw new Error("Error obteniendo meme");

            const response = await res.json();
            const meme = response.meme; 

            console.log("MEME:", meme);

            currentMemeCategoriaId = meme.categoria_id;
            currentMemeContextoId = meme.contexto_id;

            document.getElementById('nombreMeme').textContent = meme.titulo || '';
            document.getElementById('descripcion').textContent = meme.descripcion || '';
            document.getElementById('protagonista').textContent = meme.protagonistas || '';
            document.getElementById('origen_meme').textContent = meme.origen || '';
            document.getElementById('medio_meme').textContent = meme.medio_fuente || '';


            // Imagen
            document.querySelector('.fotoMeme').src =
                meme.imagen_url || "../imagenes/medallas.png";

            
            // Fechas
            if (meme.fecha_original) {
                document.getElementById('fechaSurgio_meme').textContent =
                    meme.fecha_original.split('T')[0];
            }



            await cargarCategorias();

        } catch (error) {
            console.error("Error cargando meme:", error);
        }
    }

    // GUARDAR CAMBIOS
    async function guardarCambios() {
    try {
        const categoriaVal = parseInt(
            document.getElementById('input_categoria').value
        );

        if (!categoriaVal) {
            alert("Seleccioná una categoría");
            return;
        }

        const fotoElem = document.querySelector('.fotoMeme');
        if (!fotoElem) {
            alert("No se encontró la imagen del meme.");
            return;
        }
        const inputFotoElem = document.getElementById('input_foto_meme');
        const inputFoto = inputFotoElem ? inputFotoElem.value.trim() : null;

        const inputVideoElem = document.getElementById('input_video_meme');
        const inputVideo = inputVideoElem ? inputVideoElem.value.trim() : null;

        const datosMeme = {
            imagen_url: inputFoto || fotoElem.src, 
            video_url: inputVideo || null,
            titulo: document.getElementById('nombreMeme').textContent.trim(),
            descripcion: document.getElementById('descripcion').textContent.trim(),
            protagonistas: document.getElementById('protagonista').textContent.trim(),
            categoria_id: categoriaVal,
            contexto_id: currentMemeContextoId
        };


        const datosContexto = {
            origen: document.getElementById('origen_meme').textContent.trim(),
            medio_fuente: document.getElementById('medio_meme').textContent.trim(),
            fecha_original: document.getElementById('fechaSurgio_meme').textContent.trim() || null
        };

        console.log("ENVIANDO:", { ...datosMeme, ...datosContexto });

        const res = await fetch(
            `http://localhost:3000/api/v1/memes/${idMeme}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...datosMeme, ...datosContexto })
            }
        );

        const result = await res.json();

        if (res.ok) {
            alert("Meme actualizado correctamente");
            await cargarMeme();
        } else {
            alert(result.message || "Error al guardar");
            console.error(result);
        }

    } catch (error) {
        console.error("Error guardando:", error);
    }
}

   
    document
        .getElementById('guardado_de_cambios')
        .addEventListener('click', guardarCambios);

   
    cargarMeme();
});
