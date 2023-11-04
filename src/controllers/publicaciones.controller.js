import {pool} from '../db.js'

// Crea una publicacion asociada a un usuario
export const createPublicacion = async (req, res) => {

  try {
    const { publicationDate, descripcion, attachedFile, isEvent, idUsuario } = req.body;

    console.log(publicationDate, descripcion, attachedFile, isEvent, idUsuario)

    let result;

    [result] = await pool.query(`INSERT INTO publicacion (
      publicationDate, descripcion, attachedFile, isEvent, idUsuario
    ) 
    VALUES (?, ?, ?, ?, ?)`, 
    [publicationDate, descripcion, attachedFile, isEvent, idUsuario]);

    console.log(result)

    res.send({message:'OK'})

  } catch (error) { 
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}


// Devuelve toda la información de una publicación según su id
export const getPublicacion = async (req, res) => {
  try {
    const {idPublicacion} = req.params;

    const [rowsPublicacion] = await pool.query(
      `SELECT 
        usuario.username, 
        usuario.profilePicture, 
        publicacion.*,
        COUNT(megusta.idUsuario) AS likesCount
      FROM publicacion
      LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
      LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
      WHERE publicacion.idPublicacion=?
      GROUP BY publicacion.idPublicacion`,
      [idPublicacion]
    );

    const publicacion = rowsPublicacion[0];

    const [rowsComentarios] = await pool.query(
      `SELECT comenta.*, usuario.username 
      FROM comenta 
      LEFT JOIN usuario ON comenta.idUsuario = usuario.idUsuario
      WHERE comenta.idPublicacion = ?
      ORDER BY comenta.commentDate DESC;`,
      [idPublicacion]
    );

    const comentarios = rowsComentarios;

    // Agregar la lista de comentarios al objeto de la publicación
    publicacion.comentarios = comentarios;

    console.log(publicacion);

    res.send(publicacion);

  } catch (error) {
    console.error('Error al obtener detalles del usuario y sus publicaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Verifica si un usuario ha dado like a una publicación
export const verifyLike = async (req, res) => {

  try {
    const { idUsuario, idPublicacion } = req.body;

    console.log(idUsuario, idPublicacion)

    const [rows] = await pool.query(
      `SELECT * FROM MeGusta WHERE idUsuario = ? AND idPublicacion = ?`,
      [idUsuario, idPublicacion]
    );

    console.log(rows)

    if(rows.length > 0) {
      res.send({ hasLiked: true });
    } else {
      res.send({ hasLiked: false });
    }

  } catch (error) { 
    console.error('Error al agregar like:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// Agrega el like de un usuario a una publicación
export const addLike = async (req, res) => {

  try {
    const { idUsuario, idPublicacion, idUsuarioPublicacion } = req.body;

    console.log(idUsuario, idPublicacion, idUsuarioPublicacion)

    let resultLike;

    [resultLike] = await pool.query(`INSERT INTO megusta (
      idUsuario, idPublicacion
    ) 
    VALUES (?, ?)`, 
    [idUsuario, idPublicacion]);

    console.log(resultLike);

    const [resultUsername] = await pool.query(
      'SELECT username FROM usuario WHERE idUsuario = ?',
      [idUsuario]
    );

    const usernameLogged = resultUsername[0].username;

    const notificationContent = `<strong>${usernameLogged}</strong> ha dado me gusta a tu publicación.`;

    // Insertar la notificación en la tabla Notificacion
    const [resultNotification] = await pool.query(
      `INSERT INTO notificacion 
        (sendDate, content, typeContent, idUsuario, isRead, idPublicacionLike) 
        VALUES (NOW(), ?, 'like', ?, 'No', ?)
      `,
      [notificationContent, idUsuarioPublicacion, idPublicacion]
    );


    res.send({message:'OK: addLike'});

  } catch (error) { 
    console.error('Error al agregar like:', error);
    // res.status(500).json({ error: 'Error interno del servidor: Error al agregar un like' });
  }
}

// Agrega el like de un usuario a una publicación
export const removeLike = async (req, res) => {

  try {
    const { idUsuario, idPublicacion } = req.body;

    console.log(idUsuario, idPublicacion)

    let result;

    [result] = await pool.query(
      `DELETE FROM megusta WHERE idUsuario = ? AND idPublicacion = ?`,
      [idUsuario, idPublicacion]
    );

    console.log(result);

    res.send({message:'OK: removeLike'});

  } catch (error) { 
    console.error('Error al elimnar like:', error);
    res.status(500).json({ error: 'Error interno del servidor: Error al eliminar un  like' });
  }
}

// Crea un nuevo comentario asociado a una publicacion
export const addComentario = async (req, res) => {

  try {
    const { idUsuario, idPublicacion, comment, commentDate } = req.body;

    console.log(idUsuario, idPublicacion, comment, commentDate)

    let result;

    [result] = await pool.query(`INSERT INTO comenta (
      idUsuario, idPublicacion, comment, commentDate
    ) 
    VALUES (?, ?, ?, ?)`, 
    [idUsuario, idPublicacion, comment, commentDate]);

    console.log(result)

    res.send({message:'OK'})

  } catch (error) { 
    console.error('Error al crear un comentario:', error);
    res.status(500).json({ error: 'Error interno del servidor: Creando comentario' });
  }
}

// Devuelve las publicaciones en la sección de Mis seguidores
export const getPublicacionMisSeguidores = async (req, res) => {
  try {
    const { idUsuario, idPublicacionActual, type } = req.body;

    let queryCondition = '';
    let orderDirection = '';

    //Control de si es la primera publicación, la siguiente o la anterior
    if (type === 'first') {
      queryCondition = '';
      orderDirection = 'DESC';
    } else if (type === 'next') {
      queryCondition = ` AND publicacion.idPublicacion < ${idPublicacionActual}`;
      orderDirection = 'DESC';
    } else if (type === 'previous') {
      queryCondition = `AND publicacion.idPublicacion > ${idPublicacionActual}`;
      orderDirection = 'ASC';
    } else {
      res.status(400).json({ message: 'Tipo de consulta no válido.' });
      return;
    }

    const [resultSeguidos] = await pool.query(
      'SELECT idUsuarioSeguido FROM Sigue WHERE idUsuarioSigue = ?',
      [idUsuario]
    );

    if (resultSeguidos.length === 0) {
      res.status(404).json({ message: 'No hay publicaciones de los usuarios que sigues.' });
      return;
    }

    let idsSeguidos = resultSeguidos.map((row) => row.idUsuarioSeguido);

    // Obtener la publicación según el caso
    const [resultPublicaciones] = await pool.query(
      `SELECT 
      usuario.username, 
      usuario.profilePicture, 
      publicacion.*,
      COUNT(megusta.idUsuario) AS likesCount
      FROM publicacion
      LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
      LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
      WHERE publicacion.idUsuario IN (?) ${queryCondition}
      GROUP BY publicacion.idPublicacion
      ORDER BY idPublicacion ${orderDirection}
      LIMIT 1;
      `,
      [idsSeguidos, idPublicacionActual]
    );

    if (resultPublicaciones.length === 0) {
      res.status(404).json({ message: 'No hay publicaciones posteriores.' });
      return;
    }

    const siguientePublicacion = resultPublicaciones[0];
    const idPublicacion = siguientePublicacion.idPublicacion;

    const [rowsComentarios] = await pool.query(
      `SELECT comenta.*, usuario.username 
      FROM comenta 
      LEFT JOIN usuario ON comenta.idUsuario = usuario.idUsuario
      WHERE comenta.idPublicacion = ?
      ORDER BY comenta.commentDate DESC;`,
      [idPublicacion]
    );

    const comentarios = rowsComentarios;

    // Agregar la lista de comentarios al objeto de la publicación
    siguientePublicacion.comentarios = comentarios;

    res.json(siguientePublicacion);
  } catch (error) {
    console.error('Error al obtener siguiente publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Devuelve las publicaciones en la sección de Explorar
export const getPublicacionExplorar = async (req, res) => {
  try {
    const { idUsuarioLogged, idsVistos} = req.body;

    console.log('explorar')
    //Control de no repetir publicaciones ya vistas
    const exclusionCondition = idsVistos.length > 0 ? `AND publicacion.idPublicacion NOT IN (${idsVistos.map(() => "?").join(",")})` : "";

    // Obtener la publicación
    const [resultPublicaciones] = await pool.query(
      `SELECT 
        usuario.username, 
        usuario.profilePicture, 
        publicacion.*,
        COUNT(megusta.idUsuario) AS likesCount
      FROM publicacion
      LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
      LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
      WHERE publicacion.publicationDate >= NOW() - INTERVAL 1 WEEK
        AND publicacion.idUsuario != ?
        ${exclusionCondition}
      GROUP BY publicacion.idPublicacion
      ORDER BY RAND() * COUNT(*)
      LIMIT 1;
      `,
      [idUsuarioLogged, ...idsVistos]
    );

    let siguientePublicacion;

    if (resultPublicaciones.length === 0) {
      const [resultPublicaciones2] = await pool.query(
        `SELECT 
          usuario.username, 
          usuario.profilePicture, 
          publicacion.*,
          COUNT(megusta.idUsuario) AS likesCount
        FROM publicacion
        LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
        LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
        WHERE publicacion.publicationDate >= NOW() - INTERVAL 4 WEEK
          AND publicacion.idUsuario != ?
          ${exclusionCondition}
        GROUP BY publicacion.idPublicacion
        ORDER BY RAND() * COUNT(*)
        LIMIT 1;
        `,
        [idUsuarioLogged, ...idsVistos]
      );
      
      if (resultPublicaciones2.length === 0) {
        res.status(404).json({ message: 'No hay publicaciones posteriores.' });
        return;
      }
      siguientePublicacion = resultPublicaciones2[0];

    } else {
      siguientePublicacion = resultPublicaciones[0];
    }

    const idPublicacion = siguientePublicacion.idPublicacion;

    const [rowsComentarios] = await pool.query(
      `SELECT comenta.*, usuario.username 
      FROM comenta 
      LEFT JOIN usuario ON comenta.idUsuario = usuario.idUsuario
      WHERE comenta.idPublicacion = ?
      ORDER BY comenta.commentDate DESC;`,
      [idPublicacion]
    );

    const comentarios = rowsComentarios;

    // Agregar la lista de comentarios al objeto de la publicación
    siguientePublicacion.comentarios = comentarios;

    res.json(siguientePublicacion);
  } catch (error) {
    console.error('Error al obtener siguiente publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// Devuelve las publicaciones en la sección de Explorar
export const getPublicacionConciertos = async (req, res) => {
  try {
    const { idUsuarioLogged, idsVistos} = req.body;

    console.log('conciertos')
    //Control de no repetir publicaciones ya vistas
    const exclusionCondition = idsVistos.length > 0 ? `AND publicacion.idPublicacion NOT IN (${idsVistos.map(() => "?").join(",")})` : "";

    // Obtener la publicación
    const [resultPublicaciones] = await pool.query(
      `SELECT 
        usuario.username, 
        usuario.profilePicture, 
        publicacion.*,
        COUNT(megusta.idUsuario) AS likesCount
      FROM publicacion
      LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
      LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
      WHERE publicacion.publicationDate >= NOW() - INTERVAL 1 WEEK
        AND publicacion.idUsuario != ?
        AND publicacion.isEvent='Si'
        ${exclusionCondition}
      GROUP BY publicacion.idPublicacion
      ORDER BY RAND() * COUNT(*)
      LIMIT 1;
      `,
      [idUsuarioLogged, ...idsVistos]
    );

    if (resultPublicaciones.length === 0) {
      const [resultPublicaciones2] = await pool.query(
        `SELECT 
          usuario.username, 
          usuario.profilePicture, 
          publicacion.*,
          COUNT(megusta.idUsuario) AS likesCount
        FROM publicacion
        LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
        LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
        WHERE publicacion.publicationDate >= NOW() - INTERVAL 4 WEEK
          AND publicacion.idUsuario != ?
          AND publicacion.isEvent='Si'
          ${exclusionCondition}
        GROUP BY publicacion.idPublicacion
        ORDER BY RAND() * COUNT(*)
        LIMIT 1;
        `,
        [idUsuarioLogged, ...idsVistos]
      );
      
      if (resultPublicaciones2.length === 0) {
        res.status(404).json({ message: 'No hay publicaciones posteriores.' });
        return;
      }
    }

    const siguientePublicacion = resultPublicaciones[0];
    const idPublicacion = siguientePublicacion.idPublicacion;

    const [rowsComentarios] = await pool.query(
      `SELECT comenta.*, usuario.username 
      FROM comenta 
      LEFT JOIN usuario ON comenta.idUsuario = usuario.idUsuario
      WHERE comenta.idPublicacion = ?
      ORDER BY comenta.commentDate DESC;`,
      [idPublicacion]
    );

    const comentarios = rowsComentarios;

    // Agregar la lista de comentarios al objeto de la publicación
    siguientePublicacion.comentarios = comentarios;

    res.json(siguientePublicacion);
  } catch (error) {
    console.error('Error al obtener siguiente publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};