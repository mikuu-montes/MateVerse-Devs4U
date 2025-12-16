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
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

create table contextos (
    id_contexto SERIAL PRIMARY KEY,
    origen VARCHAR(100) NOT NULL,
    medio_fuente VARCHAR(100),
    fecha_original DATE
);

create table calificaciones (
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    meme_id INT NOT NULL REFERENCES memes (id_meme),
    estrellas INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    fecha_cracion DATE NOT NULL DEFAULT CURRENT_DATE
);

create table memes (
    id_meme SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    media_url TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    protagonistas VARCHAR(200),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    categoria_id INT REFERENCES categorias (id_categoria),
    context_id INT REFERENCES contextos (id_contexto)
);

CREATE TABLE likes_comentarios (
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    comentario_id INT NOT NULL REFERENCES comentarios (id_comentario)
);

create table comentarios (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    meme_id INT NOT NULL REFERENCES memes (id_meme),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario)
);

create table usuarios_categorias_favs (
    id_cat_fav SERIAL PRIMARY KEY,
    categoria_id INT NOT NULL REFERENCES categorias (id_categoria),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario)
)

create table usuarios_memes_guardados (
    id_meme_guardado SERIAL PRIMARY KEY,
    meme_id INT NOT NULL REFERENCES memes (id_meme),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario)
)
