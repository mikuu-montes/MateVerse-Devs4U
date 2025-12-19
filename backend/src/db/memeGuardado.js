const { Pool } = require("pg");

const dbClient = new Pool({
    user: 'Devs4U',
    password: 'mate',
    host: 'db',
    port: 5432,
    database: 'mateverse',
});

//Guarda un meme en los guardados del usuario, si ya lo tenia guardado no hace nada.
async function guardarMeme(id_meme, id_usuario){
    await dbClient.query(`
        INSERT INTO usuarios_memes_guardados (meme_id, usuario_id)
        VALUES ($1, $2)
        ON CONFLICT (meme_id, usuario_id) DO NOTHING`, [id_meme, id_usuario]
    );
}

//Elimina un meme guardado po el usuario. No retorna nada 
async function eliminarMemeGuardado(id_meme, id_usuario) {
    await dbClient.query(`
        DELETE FROM usuarios_memes_guardados
        WHERE meme_id = $1
        AND usuario_id = $2`, [id_meme, id_usuario]
    );
}

//Devuelve todos los memes guardados por el usuario o un [] si no tiene ninguno.
async function obtenerMemesGuardados(usuario_id) {
    const resultado = await dbClient.query(`
        SELECT m.id_meme, m.titulo, m.imagen_url
        FROM usuarios_memes_guardados umg
        INNER JOIN memes m 
        ON umg.meme_id = m.id_meme
        WHERE umg.usuario_id = $1
        ORDER BY m.id_meme DESC`, [usuario_id]
    );
  
    return resultado.rows;
}

//Devuelve true si el usuario ya guardo el meme, false si no.
async function usuarioGuardoMeme(id_usuario, id_meme){
    const guardoMeme = await dbClient.query(`
        SELECT 1 FROM usuarios_memes_guardados
        WHERE meme_id = $1
        AND usuario_id = $2`, [id_meme, id_usuario]
    );

    return guardoMeme.rowCount > 0;
}

module.exports = {
    guardarMeme,
    eliminarMemeGuardado,
    obtenerMemesGuardados,
    usuarioGuardoMeme
}