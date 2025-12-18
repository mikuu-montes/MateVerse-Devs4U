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
      const usuario = await getUsuario(idUsuario);
      if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
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
const { idUsuario } = req.body;

if(!idComentario){
    return res.status(400).json({ error: "Id de comentario inválido. "});
}
const comentario = await obtenerComentarioPorId(idComentario); // función que devuelve un solo comentario
if (!comentario) {
    return res.status(404).json({ error: "Comentario no encontrado" });
}
if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
}
const usuario = await getUsuario(idUsuario);
if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
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
const comentario = await obtenerComentarioPorId(idComentario); // función que devuelve un solo comentario
if (!comentario) {
    return res.status(404).json({ error: "Comentario no encontrado" });
}
if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
}
const usuario = await getUsuario(idUsuario);
if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
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
const comentario = await obtenerComentarioPorId(idComentario); // función que devuelve un solo comentario
if (!comentario) {
    return res.status(404).json({ error: "Comentario no encontrado" });
}

if(!idUsuario){
    return res.status(400).json({ error: "Id de usuario inválido. "});
}
const usuario = await getUsuario(idUsuario);
if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
}

try{    await darLikeComentario(idComentario, idUsuario);
    return res.json({ mensaje: "Like agregado."});
}catch(err){
    console.error(err);
    return res.status(500).json({ error: "Error al likear el comentario."});
}
});

//Sacar like de un comentario.
app.delete('/api/v1/comentarios/:idComentario/like', async (req, res) => {
const idComentario = req.params.idComentario;
const idUsuario = req.body;

//GET ALL USUARIOS
app.get('/api/v1/usuarios', async (req, res) => {
try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
}
});



//GET USUARIO
app.get('/api/v1/usuarios/nombre/:nombre_usuario', async (req, res) => {
const { nombre_usuario, contrasenia } = req.body;

if (!nombre_usuario || !contrasenia) {
    return res.status(400).json({ error: "Faltan datos" });
}

try {
    const usuario = await loginUsuario(nombre_usuario, contrasenia);
    if (!usuario) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    res.json({ mensaje: "Login exitoso", usuario });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
}
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


if (nombre_completo === undefined) {
    res.status(400).send("No se proporciono un nombre_completo");
    return
}
if (nombre_usuario === undefined) {
    res.status(400).send("No se proporciono un nombre_usuario");
    return
}
if (email === undefined) {
    res.status(400).send("No se proporciono un email");
    return
}
    if (contrasenia === undefined) {
    res.status(400).send("No se proporciono un email");
    return
}
    if (foto_perfil === undefined) {
    res.status(400).send("No se proporciono un email");
    return
}
const usuario = await createUsuario(
nombre_completo,
nombre_usuario,
email,
contrasenia,
foto_perfil
);

if (!usuario) {
return res.status(500).json({ error: "No se pudo crear el usuario" });
}

res.status(201).json(usuario);

});

//DELETE USUARIO
app.delete('/api/v1/usuarios/:id', async(req, res) => {
const usuario = await getUsuario(req.params.id);
if (usuario === undefined) {
    res.status(400)
    return
}
if (!(await removeUsuario(req.params.id))){
    return res.sendStatus(500);
}

res.status(201).json(usuario);

})

//PUT USUARIO
app.put('/api/v1/usuarios/:id', async(req, res) => {
let usuario = await getUsuario(req.params.id);
if (usuario === undefined) {
    res.status(400)
    return
}
if (req.body === undefined) {
    return res.status(400).send("No se proporciono un body");
}
const id = req.body.id;
const nombre_completo = req.body.nombre_completo;
const nombre_usuario = req.body.nombre_usuario;
const email = req.body.email;
if (nombre_completo === undefined) {
    res.status(400).send("No se proporciono un nombre_completo");
    return
}

if (nombre_usuario === undefined) {
    res.status(400).send("No se proporciono un nombre_usuario");
    return
}
if (email === undefined) {
    res.status(400).send("No se proporciono un email");
    return
}
//Actualizo put

usuario = await updateUsuario(req.params.id,nombre_completo,nombre_usuario,email);
if (usuario === undefined){
    res.sendStatus(500);
}
res.status(201).json(usuario);

})


//GUARDADO DE MEMES

//Si el suuario toca el boton de guardar revisa el estado del meme. Si el meme ya esta guardado lo quita de alli y si no, lo guarda.
//devuelve guardado : true o guardado: false para poder luego en el forntend poner el logo de guardado pintado o no segun corrresponda.

app.post('api/v1/meme/:id/guardar', async (req, res) => {
try {
    const id_meme = req.params.id;
    const id_usuario = req.body.usuario_id

    const estaGuardado = await usuarioGuardoMeme (id_usuario, id_meme)

    if (estaGuardado){
    await eliminarMemeGuardado (id_meme, id_usuario)
    return res.json({guardado: false});
    } else{
    await guardarMeme(id_meme, id_usuario)
    return res.json({guardado: true});
    }


} catch (err) {
    console.error(err);
    res.status(500).json({error: "Error al intenar gurdar/quitar meme"})
}
})

//Memes guardados por el usuario

app.get("/memes-guardados/:id", async (req, res) => {
try {
    const usuario_id = req.params.id;
    const memes = await obtenerMemesGuardados(usuario_id);
    res.json(memes);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener memes guardados" });
}
});


//FUNCIONES ANONIMAS
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

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

// Señales de salida
process.on('SIGINT', handleExit);   // CTRL+C
process.on('SIGTERM', handleExit);  // kill




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

//Se fija si el comentario fue likeado por el usuario.
app.get('/api/v1/comentarios/:idComentario/like/:idUsuario', async (req, res) => {
    const idComentario = req.params.idComentario;
    const idUsuario = req.params.idUsuario;

    if(!idComentario){
        return res.status(400).json({ error: "Id de comentario inválido. "});
    }
    const comentario = await obtenerComentarioPorId(idComentario); // función que devuelve un solo comentario
    if (!comentario) {
        return res.status(404).json({ error: "Comentario no encontrado" });
    }
    if(!idUsuario){
        return res.status(400).json({ error: "Id de usuario inválido. "});
    }
    const usuario = await getUsuario(idUsuario);
    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const comentarioLikeado = await usuarioLikeoComentario(idUsuario, idComentario);
    res.json({ Likeado: comentarioLikeado});
});