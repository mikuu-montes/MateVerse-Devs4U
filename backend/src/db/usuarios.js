const { Pool } = require("pg");

const dbClient = new Pool({
  user: 'Devs4U',
  password: 'mate',
  host: 'localhost',
  port: 55432,
  database: 'mateverse',
});

//Devuelve todos los usuarios registrados o [] si no hay usuarios.
async function getAllUsuarios() {
  const response = await dbClient.query("SELECT * FROM usuarios");
  return response.rows;
}

//Si existe un usuario con ese nombe y contraseña, devuelve todo el usuario, sino undefined.
async function getUsuario(nombre_usuario, contrasenia) {
  const response = await dbClient.query(
    "SELECT * FROM usuarios WHERE nombre_usuario = $1 AND contrasenia = $2",
    [nombre_usuario, contrasenia]
  );

  if (response.rows.length === 0) {
    return undefined; 
  }
  return response.rows[0];
}

//Si existe el usuario devuelve todo su contenido, sino devuelve undefined.
async function getUsuarioPorId(id_usuario) {
  const result = await dbClient.query(
    "SELECT * FROM usuarios WHERE id_usuario = $1",
    [id_usuario]
  );
  return result.rows[0] || undefined;
}

//Crea un nuevo usuario.
//Retorna el usuario recien creado, o error si el nombre de usuario o el email ya existen.
async function createUsuario(nombre_completo, nombre_usuario, email, contrasenia, foto_perfil) {
    console.log(nombre_usuario, email);
    try {

    const response = await dbClient.query(
      `INSERT INTO usuarios 
      (nombre_completo, nombre_usuario, email, contrasenia, foto_perfil) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [nombre_completo, nombre_usuario, email, contrasenia, foto_perfil]
    );

    return response.rows[0];

  } catch (err) {

    console.error("Error real en SQL:", err);  
    throw err; 

  }
}

//ELimina un usuario por su id.
//Retorna true si lo elimino correctamente o false en caso de error o si el usuario no existe.
async function removeUsuario(id_usuario) {
  try {

    const result = await dbClient.query(
      "DELETE FROM usuarios WHERE id_usuario = $1",
      [id_usuario]
    );
    return result.rowCount === 1;

  } catch {
    return false;
  }
}

//Actualiza al usuario
//Si el id existe, retorna el usuario actualizado, si el usuario no existe u ocurre un error retorna undefined
async function updateUsuario(id_usuario, nombre_completo, nombre_usuario, email) {
  try {
    const result = await dbClient.query(
      `UPDATE usuarios 
       SET nombre_completo = $2, nombre_usuario = $3, email = $4
       WHERE id_usuario = $1
       RETURNING *`,
      [id_usuario, nombre_completo, nombre_usuario, email]
    );

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows[0];
  } catch {
    return undefined;
  }
}

module.exports = {
  getAllUsuarios,
  getUsuario,
  getUsuarioPorId,
  createUsuario,
  removeUsuario,
  updateUsuario,
};