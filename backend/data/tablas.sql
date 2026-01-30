 /*Estructura de como estan creados las tablas de las entidades*/

CREATE EXTENSION IF NOT EXISTS unaccent;

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
    fecha_publicacion DATE NOT NULL DEFAULT CURRENT_DATE
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

insert into usuarios (nombre_completo, nombre_usuario, email, contrasenia)
values ('Cuenta Prueba', 'cuenta_fake', 'fake@gmail.com', 'cuentafake');

insert into categorias (nombre)
values ('Fútbol argentino'),
('Política'),
('Economía'),
('Vida universitaria'),
('Mate'),
('Asado'),
('Trámites'),
('Transporte público'),
('Trabajo'),
('Familia argentina'),
('Barrio'),
('Redes sociales'),
('Televisión argentina'),
('Frases típicas'),
('Cuarentena'),
('Escuela'),
('Tecnología'),
('Amor'),
('Clásicos'),
('Random argentino'),
('Deporte');

insert into contextos (origen, medio_fuente, fecha_original)
values ('TV', 'Partido Argentina vs Paises Bajos (cuartos de final) en el Mundial 2022', '2022-12-09'),
('TV / Mediatico','Movil en vivo para el programa "Intrusos"', '2011-07-14'),
('Pelicula Argentina', 'Pelicula "Extermineitors IV: Como hermanos gemelos"', '1992-07-02'),
('TV', 'Programa de tv "La noche de Mirtha Legrand"', '2015-11-02'),
('TV', 'Pelicula "Esperando la carroza"', '1985-05-06'),
('TV', 'Serie "Casados con hijos"', '2005-11-10');

insert into memes (titulo, imagen_url, video_url, descripcion, protagonistas, usuario_id, categoria_id, contexto_id)
values ('El goat siendo el goat', 'https://pbs.twimg.com/media/Fq0SGCkXgAEJyQL.jpg', 'https://youtube.com/shorts/DqwxvNdmrKQ?si=76PFQXy4EhEsjPnX', 'Meme basado en una frase espontanea de Lionel Messi durante una entrevista posterior a un partido del Mundial Qatar 2022. Este captura el momento en el que Messi, visiblemente molesto, le dice "Anda Pa` allá, Bobo" a un contrincante del equipo opuesto. Este meme se usa para expresar enojo, hartazgo o marcarle un límite a otro de forma directa y humoristica.', 'Lionel Messi', 1, 1, 1),
('Take it easy, Take it easy...', 'https://pbs.twimg.com/media/Gbzvu85WMBkXasW.jpg', 'https://youtu.be/jhMHzUwBOsA?si=zxSwiYdmxFBsio9B', 'Este meme captura un momento de desdén y superioridad mediática. Surgió durante un movil en vivo, en donde se desato un tenso cruce entre Moria Casán y la vedette uruguaya Andrea Ghidone. El conflicto se desato porque Moría sentía que Andrea estaba siendo irrespetuosa o estaba intentando ocupar un lugar que no le correspondia frente a las figuras consagradas de Argentina. Declarando de forma clara la celebre frase "No te pases de la raya, respetá a las figuras argentinas. No te sientas que este es tu territorio. Si bien te recibimos muy bien, take it easy , take it easy". Actualmente se usa para poner límites o expresar una actitud de superioridad de forma humoristica.', 'Moria Casán', 1, 13, 2),
('Hermosa mañana verda?', 'https://pbs.twimg.com/media/E6rAfb1WQAEz4SC.png', 'https://youtu.be/DVjFkrkgfsc?si=v-69JmQ4XIAyRqgX', 'La famosa frase surgida de una pelicula, surge de la escena en donde Guillermo camina con actitud triunfante tras una victoria, citando "Buen día... Hermosa mañana verda?. Actualmente se utiliza para para refregar una victoria al día siguiente que ocurra.', 'Guillermo Francella', 1, 19, 3),
('Estoy de novia', 'https://pbs.twimg.com/media/EtLA9yJXUAQQeOD.jpg', NULL, 'Surgió en el programa de Mirtha, quién intentaba consultarle a Carrió sobre temas de politica, pero en cambio Carrió la interrumpe de forma inesperada diciendo "Tengo Novio". Actualmente se utiliza para presumir una relación que puede o no ser real de forma humoristica', 'Lilita Carrió', 1, 13, 4),
('¡Tres empanadas para 2 personas!', 'https://pbs.twimg.com/media/EU9s7IkXsAIJ0HW.jpg', 'https://youtu.be/q10LsZlR7tk?si=NwwEIU5npCBJuSu0', 'El meme surge a partir de que Antonio (un personaje de clase media-alta que presume de su estatus) sale de la casa de sus parientes extremadamente pobres comiendo una empanada, cuando se sienta en el auto le comenta a su hermano (que lo esperaba dentro del mismo) "¿Sábes qué tenían para comer?... ¡Tres empanadas! Me partieron el alma... ¡Tres empanadas que les sobraron de ayer para dos personas!" mostrando una lástima falsa. Actualmentese utiliza para humorear sobre la pobreza en algún ambiente.', 'Luis Brandoni como Antonio Musicardi', 1, 14, 5),
('Hagale una pregunta a la tarada!!', 'https://www.diariopanorama.com/fotos/notas/2023/08/17/paola-argento-458163-081726.jpg', 'https://youtu.be/8STCF1fVczM?si=bRLwDDAEQNM4wze3', 'Surgió de un episodio en el que Coki con su clásico tono burlón invita a la gente a comprar una respuesta de su hermana con un cartel que dice: "Hágale una pregunta a la tarada", burlandose de la supuesta falta de inteligencia de su hermana y sacando plata de la misma. Actualmente se usa para burlarse de una respuesta obvia o burlarse con ironia del otro.', 'Darío y Luisana Lopilato como Coki y Paola Argento', 1, 13, 6);
