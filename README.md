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
    <td>SERIAL</td>
    <td>Identificador único del usuario (Primary Key)</td>
  </tr>
  <tr>
    <td>nombre_completo</td>
    <td>VARCHAR(100)</td>
    <td>Nombre y apellido del usuario</td>
  </tr>
  <tr>
    <td>nombre_usuario</td>
    <td>VARCHAR(100)</td>
    <td>Nombre de usuario o nickname</td>
  </tr>
  <tr>
    <td>email</td>
    <td>VARCHAR(100)</td>
    <td>Correo electrónico del usuario</td>
  </tr>
  <tr>
    <td>contrasenia</td>
    <td>VARCHAR(100)</td>
    <td> hashed, no visible</td>
  </tr>
  <tr>
    <td>fecha_creacion</td>
    <td>DATE</td>
    <td>Fecha de creación de la cuenta</td>
  </tr>
  <tr>
    <td>foto_perfil</td>
    <td>TEXT</td>
    <td>URL de la foto de perfil</td>
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
    <td>SERIAL</td>
    <td>Identificador único del meme(Primary Key)</td>
  </tr>
  <tr>
    <td>titulo</td>
    <td>VARCHAR(100)</td>
    <td>Palabra o frase como se conoce al meme</td>
  </tr>
  <tr>
    <td>imagen_url</td>
    <td>TEXT</td>
    <td>link a la foto del meme</td>
  </tr>
  <tr>
    <td>video_url</td>
    <td>TEXT</td>
    <td>link al video del meme</td>
  </tr>

  <tr>
    <td>descripcion</td>
    <td>TEXT</td>
    <td>Breve texto sobre el meme</td>
  </tr>
  <tr>
    <td>protagonistas</td>
    <td>VARCHAR(200)</td>
    <td>Si son famosos, nombre de las personas involucradas</td>
  </tr>
  <tr>
    <td>usuario_id</td>
    <td>INTEGER</td>
    <td>FK a <code>usuario_id</code></td>
  </tr>
  <tr>
    <td>categoria_id</td>
    <td>INTEGER</td>
    <td>FK a <code>categoria_id</code></td>
  </tr>
  <tr>
    <td>contexto_id</td>
    <td>INTEGER</td>
    <td>FK a <code>contexto_id</code></td>
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
    <td>SERIAL</td>
    <td>Identificador único de la categoría(Primary Key)</td>
  </tr>
  <tr>
    <td>nombre</td>
    <td>VARCHAR(100)</td>
    <td>Nombre de la categoría</td>
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
    <td>SERIAL</td>
    <td>Identificador único del contexto(Primary Key)</td>
  </tr>
  <tr>
    <td>origen</td>
    <td>VARCHAR(100)</td>
    <td>Lugar, situación donde surgió (“TV”, “Redes”, etc)</td>
  </tr>
  <tr>
    <td>medio_fuente</td>
    <td>VARCHAR(100)</td>
    <td>En que programa, evento, red social surgió</td>
  </tr>
  <tr>
    <td>fecha_original</td>
    <td>DATE</td>
    <td>Cuando ocurrió la situación que originó el meme</td>
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
    <td>fecha_creacion</td>
    <td>DATE</td>
    <td>Fecha en la que se realizó el comentario</td>
  </tr>
  <tr>
    <td>likes</td>
    <td>INTEGER</td>
    <td>Cantidad de me gusta que recibió el comentario</td>
  </tr>
  <tr>
    <td>editado</td>
    <td>BOOLEANO</td>
    <td>Indica si el comentario fue o no editado</td>
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
    <td>DECIMAL(2,1)</td>
    <td>puntaje que el usuario le dió al meme </code></td>
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











