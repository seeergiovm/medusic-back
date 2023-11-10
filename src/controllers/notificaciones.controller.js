import {pool} from '../db.js'

export const getNotificaciones = async (req, res) => {
  
  try {
    const {idUsuario} = req.params;

    const [rows] = await pool.query(`SELECT * FROM notificacion WHERE idUsuario=? ORDER BY sendDate DESC LIMIT 50`, 
    [idUsuario]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No tienes notificaciones' });
    }

    // Procesar las notificaciones para obtener información adicional
    const notificaciones = await Promise.all(
      rows.map(async (notificacion) => {
        if (notificacion.typeContent === 'like') {
          // Si es una notificación de "like", obtiene la imagen asociada a la publicación
          const [publicacionResult] = await pool.query(
            'SELECT attachedFile FROM publicacion WHERE idPublicacion = ?',
            [notificacion.idPublicacionLike]
          );
          notificacion.imagen = publicacionResult[0].attachedFile;
        } else if (notificacion.typeContent === 'follow') {
          // Si es una notificación de "follow", obtiene la imagen asociada al usuario que sigue
          const [usuarioResult] = await pool.query(
            'SELECT profilePicture FROM usuario WHERE idUsuario = ?',
            [notificacion.idUsuarioFollow]
          );
          notificacion.imagen = usuarioResult[0].profilePicture;
        }
        return notificacion;
      })
    );

    console.log(rows)

    res.send(notificaciones)
    
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}