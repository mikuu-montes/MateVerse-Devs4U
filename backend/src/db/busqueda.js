const { Pool } = require("pg");
 
const dbClient = new Pool({
  user: 'Devs4U',
  password: 'mate',
  host: 'localhost',
  port: 55432,
  database: 'mateverse',
})


//Buscar memes

async function buscarMemes(texto) {
        const query = `
        SELECT 
            m.id_meme,
            m.titulo,
            m.imagen_url,
            m.fecha_publicacion,
            COALESCE(AVG(p.puntaje), 0) AS promedio_puntaje, 
            COUNT( c.id_comentario) AS cantidad_comentarios
        FROM memes m
        LEFT JOIN puntuaciones_memes p ON m.id_meme = p.meme_id
        LEFT JOIN comentarios c ON m.id_meme = c.meme_id
        WHERE m.titulo ILIKE $1 
        OR m.descripcion ILIKE $1
        or m.categoria ILIKE $1
        GROUP BY m.id_meme
        ORDER BY m.fecha_publicacion DESC;
        `;
        const result = await dbClient.query(query, [`%${texto}%`]);
        return result.rows;
} 

module.exports= {buscarMemes}