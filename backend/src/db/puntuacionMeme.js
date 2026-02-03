const { Pool } = require("pg");

const dbClient = new Pool({
    user: 'Devs4U',
    password: 'mate',
    host: 'db',
    port: 5432,
    database: 'mateverse',
});

//Guarda la puntuación que el usuario le da al meme, si el usuario ya habia hecho una puntuacion, se actualiza.
//No retorna nada.
async function puntuarMeme(id_meme, id_usuario, puntaje){
    await dbClient.query(`
        INSERT INTO puntuaciones_memes (meme_id, usuario_id, puntaje)
        VALUES ($1, $2, $3)
        ON CONFLICT (meme_id, usuario_id)
        DO UPDATE SET puntaje = EXCLUDED.puntaje`, [id_meme, id_usuario, puntaje]
    );
}

//Actualizar el puntaje que el usuario realizo al meme.
async function actualizarPuntajeMeme(id_meme, id_usuario, nuevoPuntaje) {
    await dbClient.query(`
        UPDATE puntuaciones_memes
        SET puntaje =$3
        WHERE meme_id = $1
        AND usuario_id = $2`, [id_meme, id_usuario, nuevoPuntaje]
    );
}

async function eliminarPuntajeMeme(id_meme, id_usuario){
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

    if (puntaje.rows.length === 0) {
        return null;
    }
    
    return puntaje.rows[0].puntaje;
}

module.exports = {
    puntuarMeme,
    actualizarPuntajeMeme,
    eliminarPuntajeMeme,
    usuarioPuntuoMeme
}