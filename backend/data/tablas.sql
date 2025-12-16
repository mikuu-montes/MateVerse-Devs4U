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

create table memes (
    id_meme SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    media_url TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    protagonistas VARCHAR(200),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    categoria_id INT REFERENCES categorias (id_categoria),
    contexto_id INT REFERENCES contextos (id_contexto)
);

create table calificaciones (
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    meme_id INT NOT NULL REFERENCES memes (id_meme),
    estrellas INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE
);

create table comentarios (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    meme_id INT NOT NULL REFERENCES memes (id_meme),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    UNIQUE (usuario_id, meme_id)
);

create table likes_comentarios (
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    comentario_id INT NOT NULL REFERENCES comentarios (id_comentario),
    PRIMARY KEY (usuario_id, comentario_id)
);

create table usuarios_categorias_favs (
    categoria_id INT NOT NULL REFERENCES categorias (id_categoria),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    PRIMARY KEY (categoria_id, usuario_id)
);

create table usuarios_memes_guardados (
    meme_id INT NOT NULL REFERENCES memes (id_meme),
    usuario_id INT NOT NULL REFERENCES usuarios (id_usuario),
    PRIMARY KEY (meme_id, usuario_id)
);