const { Pool } = require("pg");

const dbClient = new Pool({
    user: 'Devs4U',
    password: 'mate',
    host: 'localhost',
    port: 55432,
    database: 'mateverse',
});

//Devuelve todos los comentarios que tiene un meme junto con la cantidad de likes que tienen cada uno.
async function obtenerTodosLosComentariosPorMeme(id_meme) {
    const comentarios = await dbClient.query(`
        SELECT c.id_comentario, c.contenido, c.fecha_creacion, c.editado, c.usuario_id, COUNT(lk.comentario_id) AS likes 
        FROM comentarios c
        LEFT JOIN likes_comentarios lk
        ON c.id_comentario = lk.comentario_id
        WHERE c.meme_id = $1 
        GROUP BY c.id_comentario,
        c.contenido,
        c.fecha_creacion,
        c.editado,
        c.usuario_id
        ORDER BY c.fecha_creacion ASC`, [id_meme]
    );
    return comentarios.rows;
}

//Crea un nuevo comentario en el meme con el id correspondiente, a nombre del usuario correspondiente, con el contenido que se quiere.
//Devuelve el comentario recien creado con todos sus datos.
async function crearComentarioEnMeme(id_meme, id_usuario, contenido) {
    const comentario_creado = await dbClient.query(`
        INSERT INTO comentarios (contenido, fecha_creacion, editado, meme_id, usuario_id)
        VALUES ($1, CURRENT_DATE, false, $2, $3)
        RETURNING *`, [contenido, id_meme, id_usuario]
    );     
    return comentario_creado.rows[0];
}

//Si el usuario es el dueño del comentario, elimina el comentario pedido junto con todos sus likes.
//Devuelve el id del comentario si es el dueño, si no devuelve null.
async function eliminarComentario(id_comentario, id_usuario){
    const id_comentario_eliminado = await dbClient.query(`
        DELETE FROM comentarios
        WHERE id_comentario = $1
        AND usuario_id = $2
        RETURNING id_comentario`, [id_comentario, id_usuario]
    );
    
    if (id_comentario_eliminado.rowCount === 0) {
        return null;
    }

    await dbClient.query(`
        DELETE FROM likes_comentarios
        WHERE comentario_id = $1`, [id_comentario]
    );
    
    return id_comentario_eliminado.rows[0].id_comentario;
}

//Edita el comentario solicitado con el nuevo contenido, solo si el comentario pertenece al usuario.
//Devuelve el comentario modificado si es del usuario, si no devuelve null.
async function editarComentario(id_comentario, id_usuario, nuevo_contenido) {
    const comentario_actualizado = await dbClient.query(`
        UPDATE comentarios
        SET contenido = $1, editado = true
        WHERE id_comentario = $2
        AND usuario_id = $3
        RETURNING *`, [nuevo_contenido, id_comentario, id_usuario]
    );

    if (comentario_actualizado.rowCount === 0){
        return null;
    }
    return comentario_actualizado.rows[0];
}

//Agrega un like al comentario. No devuelve nada.
async function darLikeComentario(id_comentario, id_usuario) {
    await dbClient.query(`
        INSERT INTO likes_comentarios (usuario_id, comentario_id)
        VALUES ($1, $2)`, [id_usuario, id_comentario]
    );
}

//Quita el like del comentario, solo si el usuario fue el que lo dio. No devuelve nada.
async function sacarLikeComentario(id_comentario, id_usuario) {
    await dbClient.query(`
        DELETE FROM likes_comentarios
        WHERE comentario_id = $1
        AND usuario_id = $2`, [id_comentario, id_usuario]
    );
}

// Devuelve la cantidad de likes de un comentario
async function contarLikesComentario(id_comentario) {
    const result = await dbClient.query(`
        SELECT COUNT(*) AS likes
        FROM likes_comentarios
        WHERE comentario_id = $1`, [id_comentario]
    );

    return result.rows[0].likes;
}

//Devuelve true si el usuario le dio like al comentario, false si no.
async function usuarioLikeoComentario(id_usuario, id_comentario) {
    const devolucion = await dbClient.query(`
    SELECT 1 FROM likes_comentarios
    WHERE comentario_id = $1
    AND usuario_id = $2`, [id_comentario, id_usuario]
    );

    return devolucion.rowCount > 0;
}

module.exports = {
    obtenerTodosLosComentariosPorMeme,
    crearComentarioEnMeme,
    eliminarComentario,
    editarComentario,
    darLikeComentario,
    sacarLikeComentario,
    contarLikesComentario,
    usuarioLikeoComentario
}