const { Pool } = require("pg");
 
const dbClient = new Pool({
  user: 'devs4',
  password: 'mate',
  host: 'localhost',
  port: 55432,
  database: 'mateverse',
})


async function getAllUsuarios() {
    
    const response = await dbClient.query("SElECT * FROM usuarios");
    return response.rows;
};

async function getUsuario(id_usuario) {
    const response = await dbClient.query("SElECT * FROM usuarios WHERE id_usuario = $1", [id_usuario]);
    if (response.rowCount === 0){
        return undefined;
    }
    return response.rows[0];
}
async function createUsuario(nombre_completo,nombre_usuario,email,contrasenia,foto_perfil) {
    const response = await dbClient.query(
        "INSERT INTO usuarios (nombre_completo,nombre_usuario,email, contrasenia,foto_perfil) VALUES ($1, $2, $3, $4, $5)",
        [nombre_completo,nombre_usuario,email,contrasenia,foto_perfil]
    );
    return {
        nombre_completo,nombre_usuario,email,contrasenia,foto_perfil
    };

}



function updateUsuario(id,nombre_completo,nombre_usuario,email,contraseña,foto_perfil) {
    return {
        id,nombre_completo,nombre_usuario,email,
    };
}

function removeUsuario(id) {}

module.exports = {
    getAllUsuarios,
    getUsuario,
    createUsuario,
    removeUsuario,
    updateUsuario,
};