

  document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.querySelector('.contenedorMemesGuardados');
    
    const idUsuarioLogueado = obtenerIdUsuarioLogueado()

    const url = `http://localhost:3000/api/v1/usuarios/${idUsuarioLogueado}/memes-guardados`;

  try {  
    
    const respuesta = await fetch(url);

     const memesGuardados = await respuesta.json();

  


    memesGuardados.forEach (meme => {

      const tarjeta = document.createElement('div');
      tarjeta.classList.add('memeTarjeta')
      tarjeta.innerHTML = `
        
        <img src = "${meme.imagen_url}" >
        <a href = "../Visualizacion Meme/index.html?id=${meme.id_meme}" class="nombreMeme">${meme.titulo}</a>

        `;

      contenedor.appendChild(tarjeta)
      
    });
  }catch (err){
    console.error(err);
    alert("Error al cargar memes guardados");
  }
});