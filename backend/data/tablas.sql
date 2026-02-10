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
    puntaje INT NOT NULL,
    PRIMARY KEY (meme_id, usuario_id)  
);

create table comentarios (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    descripcion_palabra VARCHAR(50) NOT NULL CHECK (descripcion_palabra !~ '\s'),
    reaccion VARCHAR(20),
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

insert into usuarios (nombre_completo, nombre_usuario, email, contrasenia, foto_perfil)
values ('Cuenta Prueba', 'cuenta_fake', 'fake@gmail.com', 'cuentafake', '/imagenes/perfil-default.jpeg'),
('Harry Potter', 'the_survivor', 'harry_potha@gmail.com', 'SoyElElegido', 'https://i.pinimg.com/736x/33/7f/57/337f57646677e61040d64e0e71ccea1b.jpg'),
('Hermione Granger', 'Tejiendo_libertad_elfatica', 'hermione@gmail.com', 'liberandoElfos', 'https://i.pinimg.com/474x/04/d4/61/04d461a767b470af9dc45680f81873ad.jpg'),
('Ron Weasley', 'Rey_Weasley', 'pelirrojo@gmail.com', 'aguanteElQuidditch', 'https://i.pinimg.com/474x/e9/b2/bc/e9b2bc88585ab37921a93f81fed4a08a.jpg'),
('Remus Lupin', 'Lunatico_Moony', 'alphaLoco@gmail.com', 'Unlobodelaviejaescuela', 'https://i.blogs.es/343e9b/remus-lupin-1-/500_333.jpeg'),
('Draco Malfoy', 'SangrePura_origin', 'Draco@gmail.com', 'RealMago', 'https://pbs.twimg.com/media/EYrqIRJUEAALqUd.png');

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
('TV', 'Serie "Casados con hijos"', '2005-11-10'),
('Redes', 'Publicación personal en Twitter', '2013-07-06'),
('TV', 'Programa ShowMatch: Bailando por un sueño', '2014-06-24'),
('TV', 'Programa Casados con Hijos', '2005-08-24'),
('Redes', 'Youtube', '2015-12-16'),
('Redes', 'Facebook, Twitter e Instagram', '2017-03-01'),
('Telenovela Argentina', 'Telenovela "Floricienta"', '2004-12-01'),
('Redes', 'Twitter', '2012-03-03'),
('Redes', 'Instagram', '2017-05-15'),
('Redes', 'Youtube', '2018-09-20');

insert into memes (titulo, imagen_url, video_url, descripcion, protagonistas, usuario_id, categoria_id, contexto_id)
values ('El goat siendo el goat', 'https://pbs.twimg.com/media/Fq0SGCkXgAEJyQL.jpg', 'https://youtube.com/shorts/DqwxvNdmrKQ?si=76PFQXy4EhEsjPnX', 'Meme basado en una frase espontanea de Lionel Messi durante una entrevista posterior a un partido del Mundial Qatar 2022. Este captura el momento en el que Messi, visiblemente molesto, le dice "Anda Pa` allá, Bobo" a un contrincante del equipo opuesto. Este meme se usa para expresar enojo, hartazgo o marcarle un límite a otro de forma directa y humoristica.', 'Lionel Messi', 1, 1, 1),
('Take it easy, Take it easy...', 'https://pbs.twimg.com/media/Gbzvu85WMBkXasW.jpg', 'https://youtu.be/jhMHzUwBOsA?si=zxSwiYdmxFBsio9B', 'Este meme captura un momento de desdén y superioridad mediática. Surgió durante un movil en vivo, en donde se desato un tenso cruce entre Moria Casán y la vedette uruguaya Andrea Ghidone. El conflicto se desato porque Moría sentía que Andrea estaba siendo irrespetuosa o estaba intentando ocupar un lugar que no le correspondia frente a las figuras consagradas de Argentina. Declarando de forma clara la celebre frase "No te pases de la raya, respetá a las figuras argentinas. No te sientas que este es tu territorio. Si bien te recibimos muy bien, take it easy , take it easy". Actualmente se usa para poner límites o expresar una actitud de superioridad de forma humoristica.', 'Moria Casán', 1, 13, 2),
('Hermosa mañana verda?', 'https://pbs.twimg.com/media/E6rAfb1WQAEz4SC.png', 'https://youtu.be/DVjFkrkgfsc?si=v-69JmQ4XIAyRqgX', 'La famosa frase surgida de una pelicula, surge de la escena en donde Guillermo camina con actitud triunfante tras una victoria, citando "Buen día... Hermosa mañana verda?. Actualmente se utiliza para para refregar una victoria al día siguiente que ocurra.', 'Guillermo Francella', 1, 19, 3),
('Estoy de novia', 'https://pbs.twimg.com/media/EtLA9yJXUAQQeOD.jpg', NULL, 'Surgió en el programa de Mirtha, quién intentaba consultarle a Carrió sobre temas de politica, pero en cambio Carrió la interrumpe de forma inesperada diciendo "Tengo Novio". Actualmente se utiliza para presumir una relación que puede o no ser real de forma humoristica', 'Lilita Carrió', 1, 13, 4),
('¡Tres empanadas para 2 personas!', 'https://pbs.twimg.com/media/EU9s7IkXsAIJ0HW.jpg', 'https://youtu.be/q10LsZlR7tk?si=NwwEIU5npCBJuSu0', 'El meme surge a partir de que Antonio (un personaje de clase media-alta que presume de su estatus) sale de la casa de sus parientes extremadamente pobres comiendo una empanada, cuando se sienta en el auto le comenta a su hermano (que lo esperaba dentro del mismo) "¿Sábes qué tenían para comer?... ¡Tres empanadas! Me partieron el alma... ¡Tres empanadas que les sobraron de ayer para dos personas!" mostrando una lástima falsa. Actualmentese utiliza para humorear sobre la pobreza en algún ambiente.', 'Luis Brandoni como Antonio Musicardi', 1, 14, 5),
('Hagale una pregunta a la tarada!!', 'https://www.diariopanorama.com/fotos/notas/2023/08/17/paola-argento-458163-081726.jpg', 'https://youtu.be/8STCF1fVczM?si=bRLwDDAEQNM4wze3', 'Surgió de un episodio en el que Coki con su clásico tono burlón invita a la gente a comprar una respuesta de su hermana con un cartel que dice: "Hágale una pregunta a la tarada", burlandose de la supuesta falta de inteligencia de su hermana y sacando plata de la misma. Actualmente se usa para burlarse de una respuesta obvia o burlarse con ironia del otro.', 'Darío y Luisana Lopilato como Coki y Paola Argento', 1, 13, 6),
('Avión privado.. Así se viaja!!', 'https://media.tycsports.com/files/2021/09/23/335733/riquelme-ameal-meme-fort_w862.jpg', NULL, 'La foto proviene de la cuenta de twitter de Ricardo, en esta se aprecia a Fort con un ostentoso tapado de piel y gafas de sol posando frente a su avión privado, esperando para ir a Miami, personificando el exceso y el lujo que lo caracterizaban. Actualmente se usa para representar una situación donde "se llega con estilo", ostentación, sentirse "millonario" o demostrar superioridad.', 'Ricardo Fort', 1, 12, 7),
('La onee', 'https://i.pinimg.com/736x/9e/a9/07/9ea907a087c67b700ba995bb8adf7c60.jpg', NULL, 'En el meme se puede ver a Moria con un gesto de escepticismo, desprecio o incredulidad, teniendo los hombros ligeramente encogidos y una mueca lateral. Esta imagen captura el sentimiento de estar escuchando algo que no convence o que resulta "patetico". Actualmente se usa como reacción a una mentira obvia o algo poco creíble.', 'Moria Casán', 1, 13, 8),
('Estoy en el loquero JUJUUJUJU', 'https://pbs.twimg.com/media/Foi1dd4WcAIFwYi.jpg', 'https://youtu.be/j-bJogQrgss?si=7FSy4n6Ql1S47vfe', 'El meme surgió en un capitulo del programa en el que Pepe, ante las constantes frustraciones de su vida familiar y económica, termina perdiendo la razón y es internado en un hospital psiquiatrico. Entre que esta amarrado con la camisa de fuerza y mira hacia arriba con una expresión de derrota, captura perfectamente el momento de un colapso mental. Actualmente se usa para representar de forma humoristica la perdida de cordura ante las situaciones de la vida.', 'Guillermo Francella como Pepe Argento', 1, 20, 9),
('Se enojo Limón', 'https://pbs.twimg.com/media/FN2fd_iWYAU9X2K.jpg', 'https://youtu.be/NhKVUFVCjnA?si=DtGTkxAywt_US5el', 'El meme surge de una interacción cotidiana y graciosa entre Limón (un caniche) y su dueño (Alejandro). En el clip, el dueño intenta quitarle un pedazo de papel que el perro tiene en la boca. A pesar de los pedidos (como el famoso "me prestás el papelito"), Limón responde con gruñidos feroces y una cara de enojo muy marcada. Actualmente se usa para representar el mal humor repentino de una persona o cuando alguien es mesquino en querer compartir algo."', 'Alejandro y Limón', 1, 12, 10),
('#NoAflojemos', 'https://elsubmarinojujuy.com.ar/wp-content/uploads/Fotos_Archivo/nacionales/macri-no_aflojemos.jpg', NULL, 'La foto fue publicada simultaneamente en varias plataformas, fue parte del pilar de la campaña #NoAflojemos, lanzada para motivar a sus seguidores y reforzar el apoyo a su gestión. Según Macri, la frase surgió porque, al recorrer el país, la gente le decía constantemente "No aflojes Mauricio", decidiendo invertir el mensaje. Actualmente se usa para representar falsa motivación entre otras cosas.', 'Mauricio Macri', 1, 2, 11),
('Manifiesto', 'https://pbs.twimg.com/media/F2o4yxmWEAEJuCf.jpg', NULL, 'En la telenovela, Malala era conocida por sus planes malvados representados con humor, este meme la muestra rodeada de velas y con los ojos cerrados, intentando hacer un ritual o "hechizo". Actualmente se usa para representar el deseo de que algo suceda.', 'María Rosa Fugazot como Malala', 1, 13, 12),
('El comandante', 'https://i.pinimg.com/originals/34/66/2f/34662f8daaf677f71524d4e75c64c393.jpg', NULL, 'La foto, que Ricardo subió a sus redes en uno de sus tantos viajes, fue tomada en una joyería de lujo en Miami, donde se ve a Fort luciendo su caracteristico estilo, donde usa anteojos de sol, muchos anillos, entre otros. Actualmente se usa para representar las ganas de gastar plata en algo, o insinuar ser una "diva".', 'Ricardo Fort', 1, 20, 13),
('y este salamin??', 'https://i.pinimg.com/736x/6d/f9/a4/6df9a4638df5ae7c52193d4d5b5f1a03.jpg', NULL, 'El meme surge a partir de una imagen publicada por Marley en su cuenta personal, la cual fue editada por algún usuario de internet, agregandole la frase "De que fiambreria saliste salamin", siendo esta una jerga argentina. Actualmente se usa para cuestionar la inteligencia de alguien, o mismo rebajandolo.', 'Marley', 1, 20, 14),
('Permitime dudarlo..', 'https://i.pinimg.com/1200x/65/21/46/652146abfe919c4e247af4df1a127926.jpg', 'https://youtu.be/9VP1epw9ikE?si=viQrup0EJekDr2EG', 'El meme surge de un vídeo de youtube publicado por Martín, en donde (en su sección Faranews) analizando una noticia de la farándula argentina que le parece poco creíble, hace el gesto con las manos junto con la frase "permitime dudarlo..". Este meme se hizo tan viral que actualmente no solo es parte de su comunidad sino de uso universal, mayormente se usa para desmentir a alguien, o dudar de algo.', 'Martín Cirio', 1, 14, 15);

insert into puntuaciones_memes (meme_id, usuario_id, puntaje)
values (1, 1, 5),
(1, 2, 5),
(1, 3, 4),
(1, 4, 5),
(1, 5, 4),
(1, 6, 2);

insert into comentarios (contenido, descripcion_palabra, reaccion, editado, meme_id, usuario_id)
values ('El día que messi se saco las ganas, y dijo lo que todos queriamos decir', 'GOAT', NULL, false, 1, 1),
('Mirala a la pulga!, mira que a mi me bardearon, pero ver como saco a pasear a ese fantasma fue mágico', 'Épico', '🔥', true, 1, 2),
('Buena respuesta, aveces la gente necesitan que la ubiquen', 'Firme', '🙏', false, 1, 3),
('Un fenomeno el 10!!, se la mando a guardar nomas', 'Groso', '😎', false, 1, 4),
('Que momentazo cuando lo vi en vivo!!', 'Momentazo', NULL, false, 1, 5),
('Este es tu idolo??, un maleducado', 'Inaceptable', '😡', true, 1, 6);

insert into likes_comentarios (usuario_id, comentario_id)
values (2, 1),
(3, 1),
(4, 1),
(1, 2),
(4, 2),
(4, 3),
(5, 3),
(1, 4),
(2, 4),
(5, 4),
(1, 5),
(2, 5),
(4, 5);

