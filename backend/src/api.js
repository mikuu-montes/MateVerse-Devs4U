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
  getUsuarioPorId,
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
const {
  guardarMeme,
  eliminarMemeGuardado,
  obtenerMemesGuardados,
  usuarioGuardoMeme
} = require ("./db/memeGuardado.js")
const {
  puntuarMeme,
  actualizarPuntajeMeme,
  usuarioPuntuoMeme
} = require('./db/puntuacionMeme.js');

//MEMES 

// Todos los memes , filtrados si hay busqueda
app.get("/api/v1/memes", async (req, res) => {
  try {

    const busqueda = req.query.busqueda;
    if (busqueda){
      const memes = await buscarMemes(busqueda);
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

// Memes publicados por un usuario particular (para ponerlos en el perfil)
app.get("/api/v1/usuarios/:id/memes", async (req, res) => {
  try {
    const usuario_id = req.params.id;

    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }

    const usuario = await getUsuarioPorId(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

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

    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }

    const usuario = await getUsuarioPorId(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const categorias = await getCategoriasFavoritas(usuario_id);
    res.json(categorias);

  }catch(error) {
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
  try {
    const {titulo, imagen_url, descripcion, categoria_id, usuario_id} = req.body;

    if (!titulo || !imagen_url || !descripcion || !categoria_id || !usuario_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const usuario = await getUsuarioPorId(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const memeCreado = await publicarMeme(req.body);
    res.status(201).json(memeCreado);

  } catch (err) {
    console.error(err);

    if (err.message === "Datos incompletos") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Error al publicar el meme" });
  }
});

//Editar meme
app.put("/api/v1/meme/:id", async (req, res) => {
  try {
    const id_meme = req.params.id;
    const { usuario_id, titulo, descripcion, categoria_id, imagen_url } = req.body;

    if (!id_meme) {
      return res.status(400).json({ error: "Id de meme inválido" });
    }
    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id inválido" });
    }
    if (!titulo && !descripcion && !categoria_id && !imagen_url) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const memeActualizado = await editarMeme(id_meme, usuario_id, { titulo, descripcion, categoria_id, imagen_url });

    if (!memeActualizado) {
      return res.status(404).json({ error: "Meme no encontrado o sin permisos" });
    }

    res.json(memeActualizado);

  } catch (err) {
    console.error(err);

    if (err.message === "NO_AUTORIZADO") {
      return res.status(403).json({ error: "No tenés permisos para editar este meme" });
    }

    res.status(500).json({ error: "Error al editar el meme" });
  }
});

//Borrar meme
app.delete("/api/v1/meme/:id", async (req, res) => {
  try {
    const id_meme = req.params.id;
    const usuario_id = req.body.usuario_id;

    if (!id_meme) {
      return res.status(400).json({ error: "Id de meme inválido" });
    }
    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id inválido" });
    }

    const resultado = await eliminarMeme(id_meme, usuario_id);

    if (!resultado) {
      return res.status(404).json({ error: "Meme no encontrado" });
    }

    res.json(resultado);

  } catch (err) {
    console.error(err);

    if (err.status === 403) {
      return res.status(403).json({ error: "No tenés permiso para borrar este meme" });
    }

    if (err.status === 404) {
      return res.status(404).json({ error: "Meme no encontrado" });
    }

    res.status(500).json({ error: "Error al borrar el meme" });
  }
});


//ENDPOINTS USUARIO

//GET USUARIO
app.get('/api/v1/usuarios/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const usuario = await getUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    delete usuario.contrasenia;
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

//POST USUARIO (LOGIN)
app.post('/api/v1/usuarios', async (req, res) => {
  const {
    nombre_completo,
    nombre_usuario,
    email,
    contrasenia,
    foto_perfil
  } = req.body;

  if (!nombre_completo || !nombre_usuario || !email || !contrasenia) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const usuario = await createUsuario(
      nombre_completo,
      nombre_usuario,
      email,
      contrasenia,
      foto_perfil
    );

    delete usuario.contrasenia;
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: "Usuario o email ya existe" });
  }
});


// INICIAR SESION POST
app.post('/api/v1/login', async (req, res) => {
  const { nombre_usuario, contrasenia } = req.body;

  if (!nombre_usuario || !contrasenia) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const usuario = await getUsuario(nombre_usuario, contrasenia);

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    delete usuario.contrasenia;
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});


//DELETE USUARIO
app.delete('/api/v1/usuarios/:id', async (req, res) => {
  const id = req.params.id;

  const usuario = await getUsuarioPorId(id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const eliminado = await removeUsuario(id);
  if (!eliminado) {
    return res.status(500).json({ error: "No se pudo eliminar" });
  }

  res.json({ mensaje: "Usuario eliminado correctamente" });
});

//PUT USUARIO
app.put('/api/v1/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre_completo, nombre_usuario, email } = req.body;

  if (!nombre_completo || !nombre_usuario || !email) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const usuarioExistente = await getUsuarioPorId(id);
  if (!usuarioExistente) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const usuarioActualizado = await updateUsuario(
    id,
    nombre_completo,
    nombre_usuario,
    email
  );

  if (!usuarioActualizado) {
    return res.status(500).json({ error: "No se pudo actualizar" });
  }

  res.json(usuarioActualizado);
});

//GUARDADO DE MEMES

//Si el suuario toca el boton de guardar revisa el estado del meme. Si el meme ya esta guardado lo quita de alli y si no, lo guarda.
//devuelve guardado : true o guardado: false para poder luego en el forntend poner el logo de guardado pintado o no segun corrresponda.
app.post('/api/v1/meme/:id/guardar', async (req, res) => {
  try {
    const id_meme = req.params.id;
    const id_usuario = req.body.usuario_id;

    if (!id_meme || !id_usuario) {
      return res.status(400).json({ error: "Datos inválidos" });
    }
    const estaGuardado = await usuarioGuardoMeme(id_usuario, id_meme);

    if (estaGuardado) {
      const eliminado = await eliminarMemeGuardado(id_meme, id_usuario);
      if (!eliminado) {
        return res.status(500).json({ error: "No se pudo quitar el meme guardado" });
      }
      return res.json({ guardado: false });
    } else {
      const guardado = await guardarMeme(id_meme, id_usuario);
      if (!guardado) {
        return res.status(500).json({ error: "No se pudo guardar el meme" });
      }
      return res.json({ guardado: true });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar/quitar meme" });
  }
});

//Memes guardados por el usuario
app.get('/api/v1/usuarios/:id/memes-guardados', async (req, res) => {
  try {
    const usuario_id = req.params.id;
    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }
    const memes = await obtenerMemesGuardados(usuario_id);
    res.json(memes || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener memes guardados" });
  }
});

//PUNTUACION DE MEME

app.post("/api/v1/meme/:id/puntuar", async (req, res) => {
  try {
    const id_meme = req.params.id;
    const id_usuario = req.body.usuario_id;
    const puntaje = req.body.puntaje;
    if (!id_meme || !id_usuario || !puntaje) {
      return res.status(400).json({ error: "Datos inválidos" });
    }
    if (puntaje < 1 || puntaje > 5) {
      return res.status(400).json({ error: "El puntaje debe estar entre 1 y 5" });
    }
    const yaPuntuado = await usuarioPuntuoMeme(id_meme, id_usuario);
    if(!yaPuntuado){
      await puntuarMeme(id_meme, id_usuario, puntaje);
    } else {
      await actualizarPuntajeMeme(id_meme, id_usuario, puntaje);
    }

    res.json({ puntaje });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al puntuar el meme" });
  }
});

//ENDPOINTS COMENTARIOS:

//Crear comentario.
app.post('/api/v1/comentarios/:idMeme', async (req, res) => {
  try {
    const idMeme = req.params.idMeme;
    const { usuario_id, contenido } = req.body;

    if (!idMeme) {
      return res.status(400).json({ error: "Id de meme inválido" });
    }

    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }

    if (!contenido) {
      return res.status(400).json({ error: "El contenido no puede estar vacío" });
    }

    const usuario = await getUsuarioPorId(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const meme = await getMeme(idMeme);
    if (!meme) {
      return res.status(404).json({ error: "Meme no encontrado" });
    }

    const comentario = await crearComentarioEnMeme(idMeme,usuario_id, contenido);

    comentario.likes = 0;

    res.status(201).json(comentario);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
});

//Eliminar un solo comentario.
app.delete('/api/v1/comentarios/:idComentario', async (req, res) => {
  try {
    const idComentario = req.params.idComentario;
    const { usuario_id } = req.body;

    if (!idComentario) {
      return res.status(400).json({ error: "Id de comentario inválido" });
    }

    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }

    const comentario = await obtenerComentarioPorId(idComentario);
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    const idEliminado = await eliminarComentario(idComentario, usuario_id);

    if (!idEliminado) {
      return res.status(403).json({ error: "No tenés permiso para eliminar este comentario"});
    }

    res.json({
      idComentario: idEliminado,
      mensaje: "Comentario eliminado correctamente"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el comentario" });
  }
});

//Editar un solo comentario.
app.put('/api/v1/comentarios/:idComentario', async (req, res) => {
  try {
    const idComentario = req.params.idComentario;
    const { usuario_id, nuevoContenido } = req.body;

    if (!idComentario) {
      return res.status(400).json({ error: "Id de comentario inválido" });
    }

    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }

    if (!nuevoContenido) {
      return res.status(400).json({ error: "El contenido no puede estar vacío" });
    }

    const comentario = await obtenerComentarioPorId(idComentario);
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    const comentarioModificado = await editarComentario(
      idComentario,
      usuario_id,
      nuevoContenido
    );

    if (!comentarioModificado) {
      return res.status(403).json({error: "No tenés permiso para editar este comentario"});
    }

    res.json(comentarioModificado);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar el comentario" });
  }
});

//Dar like o dis-like a un comentario. Retorna la cantidad de likes que tiene el comentario.
app.post('/api/v1/comentarios/:idComentario/like', async (req, res) => {
  try {
    const idComentario = req.params.idComentario;
    const { usuario_id } = req.body;

    if (!idComentario) {
      return res.status(400).json({ error: "Id de comentario inválido" });
    }
    if (!usuario_id) {
      return res.status(400).json({ error: "Id de usuario inválido" });
    }
    const comentario = await obtenerComentarioPorId(idComentario);
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    const yaLikeado = await usuarioLikeoComentario(usuario_id, idComentario);
    if (yaLikeado) {
      await sacarLikeComentario(idComentario, usuario_id);
    } else {
      await darLikeComentario(idComentario, usuario_id);
    }
    const likes = await contarLikesComentario(idComentario);
    res.json({ Likeado: !yaLikeado, Likes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el like" });
  }
});

//Se fija si el comentario fue likeado por el usuario.
app.get('/api/v1/comentarios/:idComentario/like/:idUsuario', async (req, res) => {
  try {
    const idComentario = req.params.idComentario;
    const idUsuario = req.params.idUsuario;

    if (!idComentario || !idUsuario) {
      return res.status(400).json({ error: "id de comentario o del usuario inválidos" });
    }

    const likeoComentario = await usuarioLikeoComentario(idUsuario, idComentario);
    res.json({ likeoComentario });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al verificar like" });
  }
});

//ENDPOINT DE ESCUCHA
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

// Capturar cierre de Node (CTRL+C, kill, etc.) para liberar el puerto
function handleExit(signal) {
  console.log(`\nRecibido ${signal}. Cerrando servidor...`);
  server.close(() => {
    console.log('Servidor cerrado, puerto liberado');
    process.exit(0);
  });
}

//Señales de salida
process.on('SIGINT', handleExit); // CTRL+C 
process.on('SIGTERM', handleExit); // kill