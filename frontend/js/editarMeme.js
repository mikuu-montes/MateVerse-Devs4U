console.log("JS cargado");

// --- Obtener ID del meme desde la URL ---
const params = new URLSearchParams(window.location.search);
const idMeme = params.get('id');
console.log("ID:", idMeme);

let currentMemeCategoriaId = null; // guardaremos la categoría actual del meme
let currentMemeContextoId = null;  // guardaremos el contexto actual del meme

// --- Función para cargar categorías ---
async function cargarCategorias() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/categorias');
        if (!res.ok) throw new Error("No se pudieron cargar las categorías");
        const categorias = await res.json();

        const select = document.getElementById('input_categoria');
        select.innerHTML = ''; // borramos opciones existentes

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });

        // Después de cargar todas las opciones, seleccionamos la categoría del meme
        if (currentMemeCategoriaId) {
            select.value = currentMemeCategoriaId;
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

        console.log("Datos del meme:", data);
        console.log("Contexto ID recibido del backend:", data.contexto_id);

        // Guardamos IDs para usar después
        currentMemeCategoriaId = data.categoria_id;
        currentMemeContextoId = data.contexto_id;

        const fotoMeme = document.querySelector('.fotoMeme');
        fotoMeme.src = data.imagen_url || "../imagenes/medallas.png";
        document.getElementById('input_foto_meme').value = data.imagen_url || "";
        
        document.getElementById('nombreMeme').textContent = data.titulo || "";
        document.getElementById('input_titulo_meme').value = data.titulo || "";

        document.getElementById('descripcion').textContent = data.descripcion || "";
        document.getElementById('input_descripcion').value = data.descripcion || "";

        document.getElementById('protagonista').textContent = data.protagonistas || "";
        document.getElementById('input_protagonista').value = data.protagonistas || "";

        await cargarCategorias();

        document.getElementById('medio_meme').textContent = data.medio_fuente || "";
        document.getElementById('input_medio').value = data.medio_fuente || "";

        document.getElementById('origen_meme').textContent = data.origen || "";
        document.getElementById('input_origen').value = data.origen || "";

        if (data.fecha_original) {
            const fecha = new Date(data.fecha_original);
            const fechaStr = fecha.toISOString().split('T')[0];
            document.getElementById('fechaSurgio_meme').textContent = fechaStr;
            document.getElementById('input_fechaSurgio').value = fechaStr;
        }

        if (data.fecha_publicacion) {
            const fechaCreacion = new Date(data.fecha_publicacion);
            document.getElementById('fechaCreacion_meme').textContent = fechaCreacion.toISOString().split('T')[0];
        }

    } catch (error) {
        console.error("Error cargando el meme:", error);
    }
}


// --- Guardar cambios ---
document.getElementById('guardado_de_cambios').addEventListener('click', async () => {
    try {
        const categoriaVal = parseInt(document.getElementById('input_categoria').value);

        console.log("Categoria seleccionada:", categoriaVal);
        
        if (!categoriaVal) {
            alert("Debes seleccionar una categoría");
            return;
        }

        const datosMeme = {
            imagen_url: document.getElementById('input_foto_meme').value,
            titulo: document.getElementById('input_titulo_meme').value,
            descripcion: document.getElementById('input_descripcion').value,
            protagonistas: document.getElementById('input_protagonista').value,
            categoria_id: categoriaVal,  
            contexto_id: currentMemeContextoId 
        };

        // Imprimir los datos para verificar antes de hacer el PUT
        console.log("Datos del meme a guardar:", datosMeme);
        console.log("Contexto ID enviado:", currentMemeContextoId);

        const datosContexto = {
            origen: document.getElementById('input_origen').value,
            medio_fuente: document.getElementById('input_medio').value,
            fecha_original: document.getElementById('input_fechaSurgio').value || null
        };

        const response = await fetch(`http://localhost:3000/api/v1/memes/${idMeme}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            ...datosMeme,
            ...datosContexto
        })

        });

        const result = await response.json();

        if (response.ok) {
            alert('Meme actualizado correctamente');
            await cargarMeme();  
        } else {
            alert(`Error al actualizar: ${result.message || 'Error desconocido'}`);
            console.error(result);
        }

    } catch (error) {
        console.error("Error al guardar cambios:", error);
    }
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOMContentLoaded");
    await cargarMeme();
});
