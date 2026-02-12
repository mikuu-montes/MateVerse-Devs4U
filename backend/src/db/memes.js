const { Pool } = require("pg");

const dbClient = new Pool({
  user: 'Devs4U',
  password: 'mate',
  host: 'db',
  port: 5432,
  database: 'mateverse',
});

// Función para traer todos los memes para la página de inicio
//COALESCE reemplza NULL por 0 si el meme no tiene puntaje
//Devuelve todos los memes, con el promedio de puntaje de cada y la cantidad de comentarios.
async function getAllMemes() {
  const query = `
    SELECT 
      m.id_meme,
      m.titulo,
      m.descripcion,
      m.imagen_url,
      m.fecha_publicacion,
    COALESCE(AVG(p.puntaje)::float, 0) AS promedio_puntaje, 
    COUNT(DISTINCT c.id_comentario) AS cantidad_comentarios
    FROM memes m
    LEFT JOIN puntuaciones_memes p ON m.id_meme = p.meme_id
    LEFT JOIN comentarios c ON m.id_meme = c.meme_id
    GROUP BY m.id_meme
    ORDER BY m.fecha_publicacion DESC, m.id_meme DESC;

  `;
  const result = await dbClient.query(query);
  return result.rows;
} 
//Consulta la tabla meme
async function obtenerContextoIdPorMeme(id_meme) {
    const result = await dbClient.query(
        'SELECT contexto_id FROM memes WHERE id_meme = $1',
        [id_meme]
    );
    return result.rows[0]?.contexto_id;
}

//Función para visualizar un meme 
//Devuelve todo el contenido del meme, si no existe devuelve null.
async function getMeme(id){
  const memeQuery = `
    SELECT 
      m.id_meme,
      m.titulo,
      m.descripcion,
      m.imagen_url,
      m.video_url,
      m.protagonistas,
      m.categoria_id,
      m.contexto_id,
      c.nombre AS categoria,
      ctx.origen,
      ctx.medio_fuente,
      ctx.fecha_original,
      m.fecha_publicacion
    FROM memes m
    JOIN categorias c ON m.categoria_id = c.id_categoria
    JOIN contextos ctx ON m.contexto_id = ctx.id_contexto
    WHERE m.id_meme = $1;
  `;

  const resultado = await dbClient.query(memeQuery, [id]);
  if (resultado.rows.length === 0) {
  return null;
  }
  const meme = resultado.rows[0];
  return meme;
}

//Trae todos los memes de un usuario. Desde los mas recientes hasta los mas viejos.
//Devuelve [] si no tiene memes.
async function getMemesDeUsuario(usuario_id) {
  const query = `
    SELECT 
      id_meme,
      titulo
    FROM memes
    WHERE usuario_id = $1
    ORDER BY fecha_publicacion DESC;
  `;

  const resultado = await dbClient.query(query, [usuario_id]);
  return resultado.rows;
}

// Devuelve hasta 3 categorias favortias del usuario segun los puntajes que dio. 
//Devuelve [] si no tine favoritos.
async function getCategoriasFavoritas(usuario_id) {
  const query = `
    SELECT 
      c.id_categoria,
      c.nombre AS categoria,
      COUNT(*) AS cantidad
    FROM puntuaciones_memes p
    JOIN memes m ON p.meme_id = m.id_meme
    JOIN categorias c ON m.categoria_id = c.id_categoria
    WHERE p.usuario_id = $1
    GROUP BY c.id_categoria, c.nombre
    ORDER BY cantidad DESC
    LIMIT 3;
  `;

  const resultado = await dbClient.query(query, [usuario_id]);
  return resultado.rows;
}

//Devuelve los 10 mejores memes segun las puntuaciones de los usuarios.
async function getRankingMemes() {
  const query = `
    SELECT 
      m.id_meme,
      m.titulo,
      m.imagen_url,
      COALESCE(AVG(p.puntaje), 0) AS promedio_puntaje,
      COUNT(p.puntaje) AS cantidad_votos
    FROM memes m
    LEFT JOIN puntuaciones_memes p ON m.id_meme = p.meme_id
    GROUP BY m.id_meme
    ORDER BY promedio_puntaje DESC, cantidad_votos DESC
    LIMIT 10;
  `;

  const resultado = await dbClient.query(query);
  return resultado.rows;
}

//Publica un nuevo meme en la base de datos, junto con su contexto.
//Retorna el meme recien creado o error si faltan campos oblgatorios.
async function publicarMeme({ 
  titulo, imagen_url, video_url, descripcion, protagonistas, categoria_id, 
  fecha_original, origen, medio_fuente, usuario_id
}){
  if (!titulo || !imagen_url || !descripcion || !categoria_id || !usuario_id) {
    throw new Error("Datos incompletos en publicarMeme");
  }

  try {
    const contextoQuery = `
      INSERT INTO contextos(origen, medio_fuente, fecha_original)
      VALUES ($1, $2, $3)
      RETURNING id_contexto;
    `;
    const ctxtResultado =  await dbClient.query(contextoQuery, [origen, medio_fuente, fecha_original])
    const contexto_id = ctxtResultado.rows[0].id_contexto;

    const memeQuery = `
      INSERT INTO memes (titulo, imagen_url, video_url, descripcion, 
      protagonistas, usuario_id, categoria_id, contexto_id, fecha_publicacion )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE)
      RETURNING *;
    `;
    const memeResultado = await dbClient.query(memeQuery, [titulo, imagen_url, video_url, descripcion, 
    protagonistas, usuario_id, categoria_id, contexto_id])

    return memeResultado.rows[0]; 
  } catch(err) {
    console.error("Error en publicarMeme:", err);
    throw err;
  }
}

//Edita un meme existente y su contexto asociado, solo si el usuario tiene permiso.
//Retorna el meme actualizado, en caso de falta de permisos retorna error 403, o error 404 si el meme no existe. 
async function editarMeme(id_meme, usuario_id,{
  titulo, imagen_url, video_url, descripcion, protagonistas,
  categoria_id, origen, medio_fuente,fecha_original}){

  // Obtener el meme y su contexto
  const memeResultado = await dbClient.query(
    `SELECT contexto_id, usuario_id FROM memes WHERE id_meme = $1`,
    [id_meme]
  );

  if (memeResultado.rows.length === 0) {
    const error = new Error("El meme no existe");
    error.status = 404
    throw error
  }
  const meme = memeResultado.rows[0];
  if (meme.usuario_id !== usuario_id) {
    const error = new Error("No tenés permiso para editar este meme");
    error.status = 403
    throw error
  }
  const contexto_id = meme.contexto_id;

  // Actualizar la tabla contextos
  await dbClient.query(
    `UPDATE contextos
     SET origen = $1,
         medio_fuente = $2,
         fecha_publicacion = $3
     WHERE id_contexto = $4`,
    [origen, medio_fuente,fecha_original, contexto_id]
  );

  // Actualizar la tabla memes
  const updateQuery = `
    UPDATE memes
    SET titulo = $1,
        imagen_url = $2,
        descripcion = $3,
        protagonistas = $4,
        categoria_id = $5,
        video_url = $6
    WHERE id_meme = $7
    RETURNING *;
  `;

  const result = await dbClient.query(updateQuery, [
    titulo,
    imagen_url,
    descripcion,
    protagonistas,
    categoria_id,
    video_url,
    id_meme
  ]);

  return result.rows[0];
}

//Elimina el meme, solo si el usuario tiene permiso.
//Devuelve un mensaje confirmacion, error 404 si el meme no existe o error 403 si el usuario no tiene permisos.
async function eliminarMeme(id_meme, usuario_id) {
  // Verificar que el meme pertenece al usuario
  const checkQuery = `
    SELECT id_meme, usuario_id
    FROM memes
    WHERE id_meme = $1 AND usuario_id = $2;
  `;
  const checkResultado = await dbClient.query(checkQuery, [id_meme, Number(usuario_id)]);

  if (checkResultado.rows.length === 0) {
    const error = new Error("El meme no existe o no tenes permisos");
    error.status = 403;
    throw error;
  }

  // Borrar el meme
  const deleteQuery = `
    DELETE FROM memes
    WHERE id_meme = $1;
  `;

  await dbClient.query(deleteQuery, [id_meme]);

  return { mensaje: "Meme eliminado correctamente" };
}

module.exports = { 
  getAllMemes, 
  getMeme, 
  getMemesDeUsuario, 
  getCategoriasFavoritas, 
  getRankingMemes,  
  publicarMeme, 
  editarMeme,
  obtenerContextoIdPorMeme, 
  eliminarMeme 
};