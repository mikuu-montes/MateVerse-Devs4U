const express = require('express'); //importar express
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const { 
  getAllMemes, 
  getMeme, 
  getMemesDeUsuario, 
  getCategoriasFavoritas, 
  getRankingMemes,  
  publicarMeme, 
  editarMeme, 
  eliminarMeme 
} = require("./db/memes.js");
const {
  getAllUsuarios,
  getUsuario,
  createUsuario,
  removeUsuario,
  updateUsuario,
} = require("./db/usuarios.js");
const {
    obtenerTodosLosComentariosPorMeme,
    crearComentarioEnMeme,
    eliminarComentario,
    editarComentario,
    darLikeComentario,
    sacarLikeComentario,
    contarLikesComentario,
    usuarioLikeoComentario
} = require("./db/comentarios.js");
const {
  buscarMemes
} = require("./db/busqueda.js");




//MEMES 

// Todos los memes , filtrados si hay busqueda
app.get("/api/v1/memes", async (req, res) => {
  try {

    const busqueda = req.query.busqueda;

    if (busqueda){

        const memes = await buscarMemes(`%${busqueda}%`);
        return res.json(memes);
    }


    const memes = await getAllMemes();
    res.json(memes);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los memes" });
  }
});

//Un solo meme con sus comentarios.
app.get("/api/v1/meme/:id", async (req, res) => {
  try {
    const id_meme = req.params.id;

    if(!id_meme){
      return res.status(400).json({ error: "Id de meme inválido. "});
    }

    const meme= await getMeme(id_meme);

    if (!meme){
        return res.status(404).json({error: "Meme no encontrado"})
    }

    const comentarios = await obtenerTodosLosComentariosPorMeme(id_meme);

    if (!comentarios){
      return res.status(404).json({Error: "Comentarios no encontrados." });
    }

    res.json({
      ...meme,
      comentarios
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el meme y sus comentarios." });
  }
});

// Memes publicados por un usuario particualr (para ponerlos en el perfil)
app.get("/api/v1/usuarios/:id/memes", async (req, res) => {
  try {
    const usuario_id = req.params.id;

    const memes = await getMemesDeUsuario(usuario_id);

    res.json(memes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los memes del usuario" });
  }
});


// Categorias favoritas para poner en el perfil
app.get("/api/v1/usuarios/:id/categorias-favoritas", async (req, res) => {
  try {
    const usuario_id = req.params.id;

    const categorias = await getCategoriasFavoritas(usuario_id);

    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener categorías favoritas" });
  }
});


//Ranking memes

app.get("/api/v1/ranking", async (req, res) => {
  try {
    const ranking = await getRankingMemes();
    res.json(ranking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking" });
  }
});

//Publicar meme

app.post("/api/v1/memes", async (req, res) => {
    try{
        const memeCreado = await publicarMeme(req.body);
        res.status(201).json(memeCreado);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Error al publicar el meme"});
    }
});


//Editar meme
app.put("/api/v1/meme/:id", async (req, res) => {
  try {
    const id_meme = req.params.id;
    const usuario_id = req.body.usuario_id; 

    const memeActualizado = await editarMeme(id_meme, usuario_id, req.body);
    res.json(memeActualizado);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

//Borrar meme

app.delete("/api/v1/meme/:id", async (req, res) => {
  try {
    const id_meme = req.params.id;
    const usuario_id = req.body.usuario_id;

    const resultado = await eliminarMeme(id_meme, usuario_id);

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});



//ENDPOINTS COMENTARIOS:

//Crear comentario.
app.post('/api/v1/comentarios/:idMeme', async (req, res) => {
  try {
    const idMeme = req.params.idMeme;
    const { idUsuario, contenido } = req.body;

    if(!idMeme){
      return res.status(400).json({ error: "Id de meme inválido. "});
    }
    if(!idUsuario){
      return res.status(400).json({ error: "Id de usuario inválido. "});
    }
    if(!contenido){
      return res.status(400).json({ error: "El contenido no puede estar vacío. "});
    }

    const comentario = await crearComentarioEnMeme(idMeme, idUsuario, contenido);
    comentario.likes = 0;
    res.status(201).json(comentario);

  } catch (err){
    console.error(err);
    return res.status(500).json({ error: "Error al crear el comentario."});
  }
});

//Eliminar un solo comentario.
app.delete('/api/v1/comentario/:idComentario', async (req, res) => {
  const idComentario = req.params.idComentario;
  const idUsuario = req.body;

  if(!idComentario){
    return res.status(400).json({ error: "Id de comentario inválido. "});
  }
  if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
  }

  try{
    const idComentarioEliminado = await eliminarComentario(idComentario, idUsuario);
    if (!idComentarioEliminado){
      return res.status(403).json({ Error: "No tienes permisos para eliminar este comentario."});
    }
    return res.json({idComentario: idComentarioEliminado, mensaje: "Comentario eliminado correctamente."});
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar el comentario."});
  }
});

//Editar un solo comentario.
app.put('/api/v1/comentarios/:idComentario', async (req, res) => {
  const idComentario = req.params.idComentario;
  const { idUsuario, nuevoContenido} = req.body;

  if(!idComentario){
    return res.status(400).json({ error: "Id de comentario inválido. "});
  }
  if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
  }
  if(!nuevoContenido){
    return res.status(400).json({ error: "Nuevo contenido inválido. "});
  }

  try {
    const comentarioModificado = await editarComentario(idComentario, idUsuario, nuevoContenido);
    if(!comentarioModificado){
      return res.status(403).json({ Error: "No tienes permisos para editar este comentario."});
    }
    return res.json(comentarioModificado);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: "Error al editar el comentario."});
  }
});

//Dar like o dis-like a un comentario. Retorna la cantidad de likes que tiene el comentario.
app.post('/api/v1/comentarios/:idComentario/like', async (req, res) => {
  const idComentario = req.params.idComentario;
  const { idUsuario } = req.body;

  if(!idComentario){
    return res.status(400).json({ error: "Id de comentario inválido. "});
  }
  if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
  }

  try{
    const comentarioYaLikeado = await usuarioLikeoComentario(idUsuario, idComentario);

    if (comentarioYaLikeado){
      await sacarLikeComentario(idComentario, idUsuario);
    } else {
      await darLikeComentario(idComentario, idUsuario);
    }
    const totalLikes = await contarLikesComentario(idComentario);

    return res.json({ 
      idAgregado: idComentario,
      likeado: !comentarioYaLikeado,
      totalLikes
    });

  }catch(err){
    console.error(err);
    return res.status(500).json({ error: "Error al likear/des-likear el comentario."});
  }
});

//FUNCIONES ANONIMAS
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
