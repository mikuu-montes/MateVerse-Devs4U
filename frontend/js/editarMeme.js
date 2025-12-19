document.addEventListener("DOMContentLoaded", () => {
    const botonGuardar = document.getElementById("guardado_de_cambios");

    botonGuardar.addEventListener("click", async () => {

        const memeId = "123"; // Cambiar por el ID real del meme (puede venir de la URL o de otra forma)
        const foto = document.getElementById("input_foto_meme").value;
        const titulo = document.getElementById("input_tiutlo_meme").value;
        const descripcion = document.getElementById("input_descripcion").value;
        const protagonista = document.getElementById("input_protagonista").value;
        const categoria = document.getElementById("input_categoria").value;
        const medio = document.getElementById("input_medio").value;
        const fechaSurgio = document.getElementById("input_fechaSurgio").value;

        const datosMeme = {
            foto,
            titulo,
            descripcion,
            protagonista,
            categoria,
            medio,
            fechaSurgio
        };

        try {
            const res = await fetch(`http://localhost:3000/api/v1/memes/${memeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosMeme)
            });

            const data = await res.json();

            if(res.ok){
                alert("Meme actualizado correctamente!");
                window.location.href = "../Visualizacion Meme/index.html";
            } else {
                alert(data.message || "Error al actualizar meme");
            }

        } catch (error) {
            console.error("Error al actualizar el meme:", error);
            alert("Ocurrió un error, revisá la consola.");
        }

    });

});
