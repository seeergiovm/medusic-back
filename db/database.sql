CREATE DATABASE IF NOT EXISTS medusicdb;

USE medusicdb;

-- Tabla de Usuarios
CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255),
    passw VARCHAR(255) NOT NULL,
    rol VARCHAR(255) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    birthday DATE,
    country VARCHAR(255),
    biography TEXT,
    profilePicture MEDIUMTEXT,
    creationDate DATE,
    artisticName VARCHAR(255),
    dedication VARCHAR(255),
    musicalGenres VARCHAR(255),
    favsArtists VARCHAR(255)
);

-- INSERT INTO Usuario (username, fullname, passw, rol, mail, birthday, country, biography,
--     profilePicture, creationDate, artisticName, dedication, musicalGenres, favsArtists)
--     VALUES ('sergiovm', 'Sergio Vargas Martín', 'password', 'artista', 'sergiovargas@correo.ugr.es',
--     '1998-02-06', 'España', 'Sergio es un talentoso y apasionado artista español conocido por su habilidad para fusionar diversos elementos artísticos y explorar nuevas formas de expresión. Nació en Almería, y desde temprana edad mostró un profundo interés por la música.',
--     'rutaImagen', '2023-10-15', 'Sergix', 'Cantante', 'Pop, Rock', NULL);


-- Tabla de Conversaciones
CREATE TABLE Conversa (
    idMensaje INT PRIMARY KEY AUTO_INCREMENT,
    idUsuarioEmisor INT,
    idUsuarioReceptor INT,
    sendDate DATETIME,
    mensaje TEXT,
    leido VARCHAR(10),
    FOREIGN KEY (idUsuarioEmisor) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idUsuarioReceptor) REFERENCES Usuario(idUsuario)
);


-- Tabla de Notificaciones
CREATE TABLE Notificacion (
    idNotificacion INT PRIMARY KEY AUTO_INCREMENT,
    sendDate DATETIME,
    content TEXT,
    typeContent VARCHAR(255),
    isRead VARCHAR(10),
    idPublicacionLike INT,
    idUsuarioFollow INT,
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

-- Tabla de Publicaciones
CREATE TABLE Publicacion (
    idPublicacion INT PRIMARY KEY AUTO_INCREMENT,
    publicationDate DATETIME,
    descripcion TEXT,
    attachedFile MEDIUMTEXT,
    isEvent VARCHAR(50),
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

-- Tabla de Seguimiento
CREATE TABLE Sigue (
    idUsuarioSigue INT,
    idUsuarioSeguido INT,
    PRIMARY KEY (idUsuarioSigue, idUsuarioSeguido),
    FOREIGN KEY (idUsuarioSigue) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idUsuarioSeguido) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);


-- Tabla de Comentarios
CREATE TABLE Comenta (
    idComentario INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT,
    idPublicacion INT,
    comment TEXT,
    commentDate DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(idPublicacion) ON DELETE CASCADE
);

-- Tabla de MeGusta
CREATE TABLE MeGusta (
    idUsuario INT,
    idPublicacion INT,
    PRIMARY KEY (idUsuario, idPublicacion),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(idPublicacion) ON DELETE CASCADE
);