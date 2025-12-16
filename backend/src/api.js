const express = require('express'); //importar express
const app = express();
const port = 3000;
const { getAllUsuarios, getUsuario, createUsuario, removeUsuario, updateUsuario} =require("./db/usuarios.js");
app.use(express.json());

//primer endpoint 
app.get('/', (req, res) => {
  res.send('MATE VERSE chicas \n');
});

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


//FUNCIONES ANONIMAS
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
