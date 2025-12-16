/*Estructura de como estan creados las tablas de las entidades*/

create table usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(100) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    foto_perfil TEXT
);


/*CURRENT_DATE automaticamente la bdd lo a

CREATE TABLE meme(id_meme INT PRIMARY KEY, titulo VARCHAR(100), imagen_url TEXT, descripcion TEXT, protagonistas VARCHAR(200), id_usuario INT FOREIGN KEY, id_categoria INT FOREIGN KEY, id_contexto INT FOREIGN KEY);
