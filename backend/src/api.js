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
    usuarioLikeoComentario
} = require("./db/comentarios.js");
const {
  buscarMemes
} = require("./db/busqueda.js");


//ENDPOINTS USUARIOS

//GET ALL USUARIOS
app.get('/api/v1/usuarios', async(req, res) => {
    const usuarios = await getAllUsuarios();
  res.json(usuarios);
});

//GET USUARIO
app.get('/api/v1/usuarios/:id', async(req, res) => {
  const id= await getUsuario(req.params.id);
  res.json(id);
});

//POST USUARIO
app.post('/api/v1/usuarios', async(req, res) => {
  if (req.body === undefined) {
    return res.status(400).send("No se proporciono un body");
  }
  const nombre_completo = req.body.nombre_completo;
  const nombre_usuario = req.body.nombre_usuario;
  const email = req.body.email;
  const contrasenia = req.body.contrasenia;
  const foto_perfil = req.body.foto_perfil;
  
 /*  if (getUsuario(id) !== undefined) {
    return res.status(409).send("EL usuario ya existe");
  } */
  if (nombre_completo === undefined) {
    res.status(404).send("No se proporciono un nombre_completo");
    return
  }
  if (nombre_usuario === undefined) {
    res.status(404).send("No se proporciono un nombre_usuario");
    return
  }
  if (email === undefined) {
    res.status(404).send("No se proporciono un email");
    return
  }
   if (contrasenia === undefined) {
    res.status(404).send("No se proporciono un email");
    return
  }
   if (foto_perfil === undefined) {
    res.status(404).send("No se proporciono un email");
    return
  }
  const usuario = await createUsuario(nombre_completo,nombre_usuario,email,contrasenia,foto_perfil);
 
  res.status(201).json(usuario);

});

//DELETE USUARIO
app.delete('/api/v1/usuarios/:id', (req, res) => {
  const usuario = getUsuario(req.params.id);
  if (usuario === undefined) {
    res.status(404)
    return
  }
  removeUsuario(req.params.id);
})

//PUT USUARIO
app.put('/api/v1/usuarios/:id', (req, res) => {
  let usuario = getUsuario(req.params.id);
  if (usuario === undefined) {
    res.status(404)
    return
  }
  if (req.body === undefined) {
    return res.status(400).send("No se proporciono un body");
  }
  const id = req.body.id;
  const nombre_completo = req.body.nombre_completo;
  const nombre_usuario = req.body.nombre_usuario;
  const email = req.body.email;

  if (getUsuario(id) !== undefined) {
    return res.status(409).send("EL usuario ya existe");
  }
  if (nombre_completo === undefined) {
    res.status(404).send("No se proporciono un nombre_completo");
    return
  }
  if (nombre_usuario === undefined) {
    res.status(404).send("No se proporciono un nombre_usuario");
    return
  }
  if (email === undefined) {
    res.status(404).send("No se proporciono un email");
    return
  }
  //Actualizo

  usuario = updateUsuario(req.params.id,nombre_completo,nombre_usuario,email);
 
  res.status(201).json(usuario);

})



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

    const meme= await getMemeConComentarios(id_meme);

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
    res.status(400).json({ error: err.message });
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
    res.status(403).json({ error: err.message });
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

//Dar like a un comentario.
app.put('/api/v1/comentarios/:idComentario/like', async (req, res) => {
  const idComentario = req.params.idComentario;
  const idUsuario = req.body;

  if(!idComentario){
    return res.status(400).json({ error: "Id de comentario inválido. "});
  }
  if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
  }

  try{
    await darLikeComentario(idComentario, idUsuario);
    return res.json({ mensaje: "Like agregado."});
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: "Error al likear el comentario."});
  }
});



//FUNCIONES ANONIMAS
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
