const express = require('express'); //importar express
const app = express();
const port = 3000;
let usuarios = [{
  id: 1,
  nombre_completo: "Fernanda Rivera",
  nombre_usuario: "Ferchu",
  email: "mrivera@fi.uba.ar",
  },
  {
  id: 2,
  nombre_completo: "Micaela Montes",
  nombre_usuario: "Mica",
  email: "mmicaela@fi.uba.ar",
  },
  {
  id: 3,
  nombre_completo: "Abril Bornish",
  nombre_usuario: "Abru",
  email: "babril@fi.uba.ar",
  }
]
let meme = []
let categoria = []
let contexto = []
let comentario = []
let ranking = []
let usuario_categoria_fav = []
let usuario_meme_guardado = []
app.use(express.json())

//primer endpoint 
app.get('/', (req, res) => {
  res.send('MATE VERSE chicas \n')
})


app.get('/usuarios', (req, res) => {
  res.json(usuarios)
})
app.get('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find((element) => element.id == req.params.id)
  if (usuario === undefined) {
    res.sendStatus(404)
    return
  }
  res.json(usuario)
})


app.post('/usuarios', (req, res) => {

  const usuario={
    id: usuarios.length +1,
    nombre_completo: req.body.nombre_completo,
    nombre_usuario: req.body.nombre_usuario,
    email: req.body.email
  }
  
  usuarios.push(usuario)
  res.status(201).send(usuario)
})

app.delete('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find((element) => element.id == req.params.id)
  if (usuario === undefined) {
    res.sendStatus(404)
    return
  }
  usuarios=usuarios.filter((element) => element.id != req.params.id)
  res.send(usuario)
})

app.put('/usuarios/:id', (req, res) => {
  let usuario_index = usuarios.findIndex((element) => element.id == req.params.id)
  if (usuario_index === -1) { //si no encontro el indice de usuario
    res.sendStatus(404)
    return
  }
  usuarios[usuario_index].nombre_completo = req.body.nombre_completo ?? usuarios[usuario_index].nombre_completo
  usuarios[usuario_index].nombre_usuario = req.body.nombre_usuario ?? usuarios[usuario_index].nombre_usuario
  usuarios[usuario_index].email = req.body.email ?? usuarios[usuario_index].email
  res.send(usuarios[usuario_index])
})


//FUNCIONES ANONIMAS
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
