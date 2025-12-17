 /*Estructura de como estan creados las tablas de las entidades*/

create table usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(100) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    foto_perfil TEXT DEFAULT '/imagenes/perfil-default.jpeg'
);

create table categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

create table contextos (
    id_contexto SERIAL PRIMARY KEY,
    origen VARCHAR(100) NOT NULL,
    medio_fuente VARCHAR(100) NOT NULL,
    fecha_original DATE
);

create table memes (
    id_meme SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    imagen_url TEXT NOT NULL,
    video_url TEXT,
    descripcion TEXT NOT NULL,
    protagonistas VARCHAR(200),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias (id_categoria),
    contexto_id INT NOT NULL REFERENCES contextos (id_contexto) ON DELETE CASCADE,
    fecha_publicacion DATE NOT NULL
);

create table puntuaciones_memes (
    meme_id INT NOT NULL REFERENCES memes (id_meme) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    puntaje DECIMAL(2,1) NOT NULL,
    PRIMARY KEY (meme_id, usuario_id)
    
);


create table comentarios (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    editado BOOLEAN NOT NULL DEFAULT FALSE,
    meme_id INT NOT NULL REFERENCES memes (id_meme) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario) ON DELETE CASCADE
    
);

create table likes_comentarios (
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    comentario_id INT NOT NULL REFERENCES comentarios (id_comentario) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, comentario_id)
);



create table usuarios_memes_guardados (
    meme_id INT NOT NULL REFERENCES memes (id_meme) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    PRIMARY KEY (meme_id, usuario_id)
);