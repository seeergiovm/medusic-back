CREATE DATABASE IF NOT EXISTS medusicdb;

USE medusicdb;

-- Tabla de Usuarios
CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    passw VARCHAR(255) NOT NULL,
    rol VARCHAR(255),
    mail VARCHAR(255),
    birthday DATE,
    country VARCHAR(255),
    biography TEXT,
    profilePicture VARCHAR(255),
    creationDate DATE,
    artisticName VARCHAR(255),
    dedication VARCHAR(255),
    musicalGenres VARCHAR(255),
    favsArtists VARCHAR(255)
);

-- Tabla de Conversaciones
CREATE TABLE Conversa (
    idMensaje INT PRIMARY KEY AUTO_INCREMENT,
    idUsuarioEmisor INT,
    idUsuarioReceptor INT,
    sendDate DATETIME,
    mensaje TEXT,
    FOREIGN KEY (idUsuarioEmisor) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idUsuarioReceptor) REFERENCES Usuario(idUsuario)
);

-- Tabla de Eventos
CREATE TABLE Evento (
    idEvento INT PRIMARY KEY AUTO_INCREMENT,
    publicationDate DATE,
    startDate DATETIME,
    ubication VARCHAR(255),
    musicalGenres VARCHAR(255),
    descripcion TEXT,
    img VARCHAR(255),
    ticketLink VARCHAR(500),
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- Tabla de Ubicación de Evento
CREATE TABLE UbicacionEvento (
    idUbicacionEvento INT PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(255),
    city VARCHAR(255),
    place VARCHAR(255),
    idEvento INT,
    FOREIGN KEY (idEvento) REFERENCES Evento(idEvento)
);

-- Tabla de Notificaciones
CREATE TABLE Notificacion (
    idNotificacion INT PRIMARY KEY AUTO_INCREMENT,
    sendDate DATETIME,
    content TEXT,
    typeContent VARCHAR(255),
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

-- Tabla de Publicaciones
CREATE TABLE Publicacion (
    idPublicacion INT PRIMARY KEY AUTO_INCREMENT,
    publicationDate DATETIME,
    descripcion TEXT,
    attachedFile VARCHAR(255),
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