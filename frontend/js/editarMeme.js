console.log("JS cargado");


const params = new URLSearchParams(window.location.search);
const idMeme = params.get('id');

if (!idMeme) {
    console.error("No se recibió el ID del meme");
    alert("Error: meme no encontrado");
}


let currentMemeCategoriaId = null;
let meme = null;

// --- Función para cargar categorías ---
async function cargarCategorias() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/categorias');
        if (!res.ok) throw new Error("No se pudieron cargar las categorías");

        const categorias = await res.json();
        const select = document.getElementById('input_categoria');
        select.innerHTML = '';

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });

        if (meme && meme.categoria) {
            // Mostrar categoría en el H3
            document.getElementById('categoria_meme').textContent = meme.categoria;

            // Seleccionar opción correcta en el select
            const option = Array.from(select.options)
                .find(opt => opt.textContent === meme.categoria);

            if (option) select.value = option.value;
        }

    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}


// --- Función para cargar datos del meme ---
async function cargarMeme() {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/meme/${idMeme}`);
        const data = await response.json();

        if (!response.ok) {
            console.error("Error al obtener meme:", data);
            return;
        }

        meme = data.meme; 


        console.log("Datos del meme:", meme);
        

        document.querySelector('.fotoMeme').src =
            meme.imagen_url || "../imagenes/medallas.png";

        document.getElementById('input_foto_meme').value = meme.imagen_url || "";
        document.getElementById('nombreMeme').textContent = meme.titulo || "";
        document.getElementById('input_titulo_meme').value = meme.titulo || "";

        document.getElementById('descripcion').textContent = meme.descripcion || "";
        document.getElementById('input_descripcion').value = meme.descripcion || "";

        document.getElementById('protagonista').textContent = meme.protagonistas || "";
        document.getElementById('input_protagonista').value = meme.protagonistas || "";

        document.getElementById('categoria_meme').textContent = meme.categoria.nombre;
        await cargarCategorias();

        document.getElementById('medio_meme').textContent = meme.medio_fuente || "";
        document.getElementById('input_medio').value = meme.medio_fuente || "";

        document.getElementById('origen_meme').textContent = meme.origen || "";
        document.getElementById('input_origen').value = meme.origen || "";

        if (meme.fecha_original) {
            const fecha = new Date(meme.fecha_original).toISOString().split('T')[0];
            document.getElementById('fechaSurgio_meme').textContent = fecha;
            document.getElementById('input_fechaSurgio').value = fecha;
        }

        if (meme.fecha_publicacion) {
            document.getElementById('fechaCreacion_meme').textContent =
                new Date(meme.fecha_publicacion).toISOString().split('T')[0];
        }

    } catch (error) {
        console.error("Error cargando el meme:", error);
    }
}

// --- Guardar cambios ---
document.getElementById('guardado_de_cambios').addEventListener('click', async () => {
    try {
        const categoriaVal = parseInt(document.getElementById('input_categoria').value);

        if (!categoriaVal) {
            alert("Debes seleccionar una categoría");
            return;
        }

        const body = {
            imagen_url: document.getElementById('input_foto_meme').value,
            titulo: document.getElementById('input_titulo_meme').value,
            descripcion: document.getElementById('input_descripcion').value,
            protagonistas: document.getElementById('input_protagonista').value,
            categoria_id: categoriaVal,
            origen: document.getElementById('input_origen').value,
            medio_fuente: document.getElementById('input_medio').value,
            fecha_original: document.getElementById('input_fechaSurgio').value || null
        };

        const response = await fetch(`http://localhost:3000/api/v1/memes/${idMeme}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Meme actualizado correctamente');
            cargarMeme();
        } else {
            alert(result.message || "Error al actualizar");
        }

    } catch (error) {
        console.error("Error al guardar cambios:", error);
    }
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded");
    if (idMeme) cargarMeme();
});
