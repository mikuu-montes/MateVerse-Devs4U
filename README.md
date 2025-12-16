Mateverse es un sitio web colaborativo donde los usuarios pueden descubrir, subir y comentar memes del "lore argentino" (memes históricos, políticos, televisivos, deportivos, etc.), con su trasfondo y contexto sociocultural.

# Entidades
## Usuarios
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_usuario</td>
    <td>SERIAL PRIMARY KEY</td>
    <td>Identificador único del usuario autogenerado.</td>
  </tr>
  <tr>
    <td>nombre_completo</td>
    <td>VARCHAR(100) NOT NULL</td>
    <td>Nombre y apellido del usuario, no nulo.</td>
  </tr>
  <tr>
    <td>nombre_usuario</td>
    <td>VARCHAR(100) NOT NULL UNIQUE</td>
    <td>Nombre de usuario o nickname, no nulo y único.</td>
  </tr>
  <tr>
    <td>email</td>
    <td>VARCHAR(100) NOT NULL UNIQUE</td>
    <td>Correo electrónico del usuario, no nulo y único.</td>
  </tr>
  <tr>
    <td>contrasenia</td>
    <td>VARCHAR(100) NOT NULL</td>
    <td> Contraseña no nula.</td>
  </tr>
  <tr>
    <td>fecha_registro</td>
    <td>DATE NOT NULL DEFAULT CURRENT_DATE</td>
    <td>Fecha de creación/registro de la cuenta, no nula y generada por defecto.</td>
  </tr>
  <tr>
    <td>foto_perfil</td>
    <td>TEXT DEFAULT '/imagenes/perfil-default.jpeg'</td>
    <td>URL o ruta de la foto de perfil, por defecto asigna una.</td>
  </tr>
</table>

## Categoría

<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_categoria</td>
    <td>SERIAL PRIMARY KEY</td>
    <td>Identificador único de la categoría autogenerado.</td>
  </tr>
  <tr>
    <td>nombre</td>
    <td>VARCHAR(100) NOT NULL</td>
    <td>Nombre de la categoría, no nulo.</td>
  </tr>
  <tr>
    <td>descripción</td>
    <td>TEXT</td>
    <td>Breve texto sobre que abarca esta categoría</td>
  </tr>
</table>

## Contexto
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_contexto</td>
    <td>SERIAL PRIMARY KEY</td>
    <td>Identificador único del contexto autogenerado.</td>
  </tr>
  <tr>
    <td>origen</td>
    <td>VARCHAR(100) NOT NULL</td>
    <td>Lugar, situación donde surgió (“TV”, “Redes”, etc), no nulo.</td>
  </tr>
  <tr>
    <td>medio_fuente</td>
    <td>VARCHAR(100)</td>
    <td>En que programa, evento, red social surgió</td>
  </tr>
  <tr>
    <td>Fecha_original</td>
    <td>DATE</td>
    <td>Cuando ocurrió la situación que originó el meme</td>
  </tr>
</table>


## Meme
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_meme</td>
    <td>SERIAL PRIMARY KEY</td>
    <td>Identificador único del meme autogenerado.</td>
  </tr>
  <tr>
    <td>titulo</td>
    <td>VARCHAR(100) NOT NULL</td>
    <td>Palabra o frase como se conoce al meme, no nula.</td>
  </tr>
  <tr>
    <td>media_url</td>
    <td>TEXT NOT NULL</td>
    <td>link al video o foto del meme, no nulo.</td>
  </tr>

  <tr>
    <td>descripcion</td>
    <td>TEXT NOT NULL</td>
    <td>Breve texto sobre el meme, no nula.</td>
  </tr>
  <tr>
    <td>protagonistas</td>
    <td>VARCHAR(200)</td>
    <td>Si son famosos, nombre de las personas involucradas</td>
  </tr>
  <tr>
    <td>usuario_id</td>
    <td>INT REFERENCES usuarios (usuario_id) </td>
    <td>FK a <code>usuario_id</code></td>
  </tr>
  <tr>
    <td>categoria_id</td>
    <td>INT</td>
    <td>FK a <code>categoria_id</code></td>
  </tr>
  <tr>
    <td>contexto_id</td>
    <td>INT</td>
    <td>FK a <code>contexto_id</code></td>
  </tr> 
</table>

## Comentario
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_comentario</td>
    <td>SERIAL</td>
    <td>Identificador único del comentario(Primary Key)</td>
  </tr>
  <tr>
    <td>contenido</td>
    <td>TEXT</td>
    <td>texto del comentario</td>
  </tr>
  <tr>
    <td>Fecha</td>
    <td>DATE</td>
    <td>Fecha en la que se realizó el comentario</td>
  </tr>
  <tr>
    <td>likes</td>
    <td>INTEGER</td>
    <td>Cantidad de me gusta que recibió el comentario</td>
  </tr>
  <tr>
    <td>meme_id</td>
    <td>INTEGER</td>
    <td>FK a <code>meme_id</code></td>
  </tr>
  <tr>
    <td>usuario_id</td>
    <td>INTEGER</td>
    <td>FK a <code>usuario_id</code></td>
  </tr>
</table>

## Ranking 
Tabla intermedia entre Usuario y Meme, para luego armar un ranking de los memes mejor puntuados y realizar un promedio de puntaje de cada meme
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_ranking</td>
    <td>SERIAL</td>
    <td>Identificador único del ranking(Primary Key)</td>
  </tr>
  <tr>
    <td>meme_id</td>
    <td>INTEGER</td>
    <td>FK a <code>meme_id</code></td>
  </tr>
  <tr>
    <td>usuario_id</td>
    <td>INTEGER</td>
    <td>FK a <code>usuario_id</code></td>
  </tr>
  <tr>
    <td>puntaje</td>
    <td>INT</td>
    <td>puntaje que el usuario le dió al meme </code></td>
  </tr>  
</table>

## Usuario_categoria_fav
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_cat_fav</td>
    <td>SERIAL</td>
    <td>Identificador único de la categoria favorita(Primary Key)</td>
  </tr>
  <tr>
    <td>categoria_id</td>
    <td>INTEGER</td>
    <td>FK a <code>categoria_id</code></td>
  </tr>
  <tr>
    <td>usuario_id</td>
    <td>INTEGER</td>
    <td>FK a <code>usuario_id</code></td>
  </tr>
</table>

## Usuario_meme_guardado
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Campo</th>
    <th>Tipo de dato</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>id_meme_guardado</td>
    <td>SERIAL</td>
    <td>Identificador único del meme guardado(Primary Key)</td>
  </tr>
  <tr>
    <td>meme_id</td>
    <td>INTEGER</td>
    <td>FK a <code>meme_id</code></td>
  </tr>
  <tr>
    <td>usuario_id</td>
    <td>INTEGER</td>
    <td>FK a <code>usuario_id</code></td>
  </tr>
</table>











