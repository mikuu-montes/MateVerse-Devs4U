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
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
)

