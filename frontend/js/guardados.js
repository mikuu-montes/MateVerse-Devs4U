
  document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.querySelector('.contenedorMemesGuardados');
    
    const idUsuarioLogueado = obtenerIdUsuarioLogueado()

    //Si no esta logueado lo muevo a otro template.
    if (!idUsuarioLogueado) {
      window.location.href = "../Login Usuario/index.html";
    }


    const url = `http://localhost:3000/api/v1/usuarios/${idUsuarioLogueado}/memes-guardados`;

  try {  
    
    const respuesta = await fetch(url);

     const memesGuardados = await respuesta.json();

  
    memesGuardados.forEach (meme => {

      const tarjeta = document.createElement('div');
      tarjeta.classList.add('memeTarjeta')
      tarjeta.innerHTML = `
        
        <img src = "${meme.imagen_url}" >
        <p>${meme.titulo}</p>

      `;

      tarjeta.addEventListener('click', () => {
        window.location.href = `../Visualizacion Meme/index.html?id=${meme.id_meme}`;
      });

      contenedor.appendChild(tarjeta)
      
    });
  }catch (err){
    console.error(err);
    alert("Error al cargar memes guardados");
  }
});