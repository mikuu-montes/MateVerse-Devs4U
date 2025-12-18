const { Pool } = require("pg");

const dbClient = new Pool({
  user: 'devs4',
  password: 'mate',
  host: 'localhost',
  port: 5432,
  database: 'mateverse',
});

async function getAllUsuarios() {
  const response = await dbClient.query("SELECT * FROM usuarios");
  return response.rows;
}

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

async function createUsuario(nombre_completo, nombre_usuario, email, contrasenia, foto_perfil) {
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
  createUsuario,
  removeUsuario,
  updateUsuario,
};