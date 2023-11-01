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

    res.send('OK')

  } catch (error) { 
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}


// Devuelve toda la información de una publicación según su id
export const getPublicacion = async (req, res) => {
  try {
    const {idPublicacion} = req.params;

    const [rows] = await pool.query(
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

    const publicacion = rows[0];

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
    const { idUsuario, idPublicacion } = req.body;

    console.log(idUsuario, idPublicacion)

    let result;

    [result] = await pool.query(`INSERT INTO megusta (
      idUsuario, idPublicacion
    ) 
    VALUES (?, ?)`, 
    [idUsuario, idPublicacion]);

    console.log(result);

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