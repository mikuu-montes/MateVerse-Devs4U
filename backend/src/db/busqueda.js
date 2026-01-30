const { Pool } = require("pg");
 
const dbClient = new Pool({
  user: 'Devs4U',
  password: 'mate',
  host: 'db',
  port: 5432,
  database: 'mateverse',
})

//Buscar memes por texto en cualquier lado, sin distinguir mayusculas o minusculas.
//Devuelve un array de memes o un [] si no encuentra ninguno.
async function buscarMemes(texto) {
  if (!texto) {
    const todosQuery = `
      SELECT 
        m.id_meme,
        m.titulo,
        m.imagen_url,
        m.descripcion,
        m.fecha_publicacion,
        COALESCE(AVG(p.puntaje), 0) AS promedio_puntaje
      FROM memes m
      LEFT JOIN puntuaciones_memes p ON m.id_meme = p.meme_id
      GROUP BY m.id_meme
      ORDER BY m.fecha_publicacion DESC, m.id_meme DESC;
    `;
    const result = await dbClient.query(todosQuery);
    return result.rows;
  }

  // Separamos el texto en palabras
  const palabras = texto.split(/\s+/).filter(Boolean);

  // Creamos un array de patrones para cada palabra
  const params = palabras.map(p => `%${p}%`);

  // Construimos el WHERE simple con OR para todas las palabras usando unaccent
  let where = '';
  for (let i = 0; i < palabras.length; i++) {
    if (i > 0) where += ' OR ';
    where += `
      unaccent(lower(m.titulo)) ILIKE $${i + 1} 
      OR unaccent(lower(m.descripcion)) ILIKE $${i + 1} 
      OR unaccent(lower(m.protagonistas)) ILIKE $${i + 1} 
      OR unaccent(lower(cat.nombre)) ILIKE $${i + 1} 
      OR unaccent(lower(ctx.origen)) ILIKE $${i + 1} 
      OR unaccent(lower(ctx.medio_fuente)) ILIKE $${i + 1}
    `;
  }

  const query = `
    SELECT DISTINCT
      m.id_meme,
      m.titulo,
      m.imagen_url,
      m.descripcion,
      m.fecha_publicacion,
      COALESCE(AVG(p.puntaje), 0) AS promedio_puntaje
    FROM memes m
    LEFT JOIN puntuaciones_memes p ON m.id_meme = p.meme_id
    LEFT JOIN categorias cat ON m.categoria_id = cat.id_categoria
    LEFT JOIN contextos ctx ON m.contexto_id = ctx.id_contexto
    WHERE ${where}
    GROUP BY m.id_meme
    ORDER BY m.fecha_publicacion DESC, m.id_meme DESC;
  `;

  const result = await dbClient.query(query, params);
  return result.rows;
}



module.exports= {buscarMemes}