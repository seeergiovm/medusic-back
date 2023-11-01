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

    //TODO

    const [rows] = await pool.query(
      `SELECT usuario.username, usuario.profilePicture, publicacion.* FROM publicacion
       LEFT JOIN usuario ON publicacion.idUsuario = usuario.idUsuario
       WHERE publicacion.idPublicacion=?`,
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