/*Estructura de como estan creados las tablas de las entidades*/

CREATE TABLE usuarios(id_usuario INT PRIMARY KEY, nombre_completo VARCHAR(100) NOT NULL, nombre_usuario VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, contrasenia VARCHAR(100) NOT NULL, fecha_creacion DATE DEFAULT CURRENT_DATE, foto_perfil TEXT);
/*CURRENT_DATE automaticamente la bdd lo agrega*/

CREATE TABLE meme(id_meme INT PRIMARY KEY, titulo VARCHAR(100), imagen_url TEXT, descripcion TEXT, protagonistas VARCHAR(200), id_usuario INT FOREIGN KEY, id_categoria INT FOREIGN KEY, id_contexto INT FOREIGN KEY);
