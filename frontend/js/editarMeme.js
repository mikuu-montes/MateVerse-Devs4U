document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const memeId = urlParams.get("id");

    // Precargar datos
    try {
        const res = await fetch(`http://localhost:3000/api/v1/memes/${memeId}`);
        const meme = await res.json();
        document.getElementById("input_foto_meme").value = meme.imagen_url;
        document.getElementById("input_tiutlo_meme").value = meme.titulo;
        document.getElementById("input_descripcion").value = meme.descripcion;
        document.getElementById("input_protagonista").value = meme.protagonistas;
        document.getElementById("input_categoria").value = meme.categoria_id;
        document.getElementById("input_medio").value = meme.medio;
        document.getElementById("input_fechaSurgio").value = meme.fechaSurgio;
    } catch (error) {
        console.error("Error al cargar el meme:", error);
    }

    // Guardar cambios
    document.getElementById("guardado_de_cambios").addEventListener("click", async () => {
        const datosMeme = {
            foto: document.getElementById("input_foto_meme").value,
            titulo: document.getElementById("input_tiutlo_meme").value,
            descripcion: document.getElementById("input_descripcion").value,
            protagonista: document.getElementById("input_protagonista").value,
            categoria: document.getElementById("input_categoria").value,
            medio: document.getElementById("input_medio").value,
            fechaSurgio: document.getElementById("input_fechaSurgio").value
        };

        try {
            const res = await fetch(`http://localhost:3000/api/v1/memes/${memeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosMeme)
            });

            const data = await res.json();
            if (res.ok) alert("Meme actualizado correctamente!");
            else alert(data.message || "Error al actualizar meme");
        } catch (error) {
            console.error("Error al actualizar el meme:", error);
        }
    });
});
