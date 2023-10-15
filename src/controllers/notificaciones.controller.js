import {pool} from '../db.js'

export const getNotificaciones = async (req, res) => {
  
  try {
    const {id} = req.params;

    const [rows] = await pool.query(`SELECT * FROM notificacion WHERE idUsuario=?`, 
    [id]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'No tienes notificaciones.' });
    }

    const notificaciones = rows
    console.log(rows)

    res.send(notificaciones)
    
  } catch (error) {
    console.error('Error al verificar el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}