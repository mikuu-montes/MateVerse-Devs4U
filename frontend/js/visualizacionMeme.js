window.addEventListener("DOMContentLoaded", async () => {
  const formCrearMeme = document.getElementById('formCrearMeme');
  const selectCategoria = document.getElementById('input_categoria');

  if (!formCrearMeme || !selectCategoria) {
    console.warn("Formulario de creación no encontrado. JS abortado.");
    return;
  }

 
  async function cargarCategorias() {
    try {
      const res = await fetch('http://localhost:3000/api/v1/categorias');
      if (!res.ok) throw new Error("Error cargando categorías");
      const categorias = await res.json();

      selectCategoria.innerHTML = `<option value="" disabled selected>Selecciona una categoría</option>`;
      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id_categoria;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando categorías:", err);
      alert("No se pudieron cargar las categorías. Recargá la página.");
    }
  }

  
  await cargarCategorias();


  formCrearMeme.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formCrearMeme);

    // --- Obtener usuario_id desde sessionStorage ---
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const usuario_id = usuario?.id_usuario; 
    if (!usuario_id) {
      alert("Usuario no autenticado. Iniciá sesión primero.");
      return;
    }

    // --- Determinar contexto dinámicamente ---
    // Por ahora usamos placeholder 1; reemplazar con tu lógica real si cambia según fecha/origen
    const contexto_id = 1;

    // --- Construir objeto a enviar ---
    const data = {
      titulo: formData.get('titulo'),
      imagen_url: formData.get('imagen_url'),
      video_url: formData.get('video_url') || null,
      descripcion: formData.get('descripcion'),
      protagonistas: formData.get('protagonista') || null,
      categoria_id: Number(formData.get('id_categoria')),
      usuario_id: Number(usuario_id),
      contexto_id,
      lugar_surgimiento: formData.get('lugar_surgimiento'),
      medio_fuente: formData.get('medio_fuente'),
      fecha_publicacion: formData.get('fecha')
    };

    console.log("Enviando al backend:", data);

    try {
      const res = await fetch('http://localhost:3000/api/v1/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const result = await res.json();
      console.log('Meme guardado:', result);
      alert('Meme publicado con éxito 🚀');
      formCrearMeme.reset();
    } catch (err) {
      console.error('Error al guardar el meme:', err);
      alert('Error al guardar el meme. Revisá la consola para más detalles.');
    }
  });
});
