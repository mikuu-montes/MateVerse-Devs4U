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


//ENDPOINTS USUARIOS

//GET ALL USUARIOS
app.get('/usuarios', async(req, res) => {
    const usuarios = await getAllUsuarios();
  res.json(usuarios);
});

//GET USUARIO
app.get('/usuarios/:id', async(req, res) => {
  const id= await getUsuario(req.params.id);
  res.json(id);
});

//POST USUARIO
app.post('/usuarios', async(req, res) => {
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
app.delete('/usuarios/:id', (req, res) => {
  const usuario = getUsuario(req.params.id);
  if (usuario === undefined) {
    res.status(404)
    return
  }
  removeUsuario(req.params.id);
})

//PUT USUARIO
app.put('/usuarios/:id', (req, res) => {
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

// Todos los memes (faltaria agregar si se filtra para buscar)
app.get("/memes", async (req, res) => {
  try {



    const memes = await getAllMemes();
    res.json(memes);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los memes" });
  }
});

//Un solo meme (faltaria agregarle los comentarios)
app.get("/meme/:id", async (req, res) => {
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
app.get("/usuarios/:id/memes", async (req, res) => {
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
app.get("/usuarios/:id/categorias-favoritas", async (req, res) => {
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

app.get("/ranking", async (req, res) => {
  try {
    const ranking = await getRankingMemes();
    res.json(ranking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el ranking" });
  }
});

//Publicar meme

app.post("/memes", async (req, res) => {
    try{
        const memeCreado = await publicarMeme(req.body);
        res.status(201).json(memeCreado);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Error al publicar el meme"});
    }
});


//Editar meme
app.put("/meme/:id", async (req, res) => {
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

app.delete("/meme/:id", async (req, res) => {
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



//Endpoints comentarios
//ENDPOINTS COMENTARIOS:

//Crear comentario.
app.post('/api/v1/comentarios/:id_meme', async (req, res) => {
  try {
    const id_meme = req.params.id_meme;
    const { id_usuario, contenido } = req.body;
  } catch (err){

  }
});




//FUNCIONES ANONIMAS
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
