const { Pool } = require("pg");

const dbClient = new Pool({
    user: 'Devs4U',
    password: 'mate',
    host: 'localhost',
    port: 55432,
    database: 'mateverse',
});

//Guarda la puntuación que el usuario le da al meme, si el usuario ya habua hecho una puntuacion, se actualiza.
//No retorna nada.
async function puntuarMeme(id_meme, id_usuario, puntaje){
    await dbClient.query(`
        INSERT INTO puntuaciones_memes (meme_id, usuario_id, puntaje)
        VALUES ($1, $2, $3)
        ON CONFLICT (meme_id, usuario_id)
        DO UPDATE SET puntaje = EXCLUDED.puntaje`, [id_meme, id_usuario, puntaje]
    );
}

//Devuelve el promedio de los puntajes que tiene el meme. Si no tiene puntajes devuelve null.
async function puntajePromedioMeme(id_meme) {
    const promedioMeme = await dbClient.query(`
        SELECT AVG(puntaje) AS promedio 
        FROM puntuaciones_memes
        WHERE meme_id = $1`, [id_meme]
    );

    return promedioMeme.rows[0].promedio;
}

//Eliminar el puntaje que el usuario realizo al meme.
async function eliminarPuntajeMeme(id_meme, id_usuario) {
    await dbClient.query(`
        DELETE FROM puntuaciones_memes
        WHERE meme_id = $1
        AND usuario_id = $2`, [id_meme, id_usuario]
    );
}

// Devuelve el puntaje que un usuario dio a un meme, o null si no tenia puntaje.
async function usuarioPuntuoMeme(id_meme, id_usuario) {
    const puntaje = await dbClient.query(`
        SELECT puntaje
        FROM puntuaciones_memes
        WHERE meme_id = $1 
        AND usuario_id = $2`, [id_meme, id_usuario]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0].puntaje;
}

module.exports = {
    puntuarMeme,
    puntajePromedioMeme,
    eliminarPuntajeMeme,
    usuarioPuntuoMeme
}