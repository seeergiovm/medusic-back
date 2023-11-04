import {pool} from '../db.js'

// Envia un mensaje de un usuario a otro
export const enviarMensaje = async (req, res) => {
  try {
    const { idUsuarioEmisor, idUsuarioReceptor, mensaje } = req.body;

    // Realiza la inserción del mensaje en la base de datos
    const [result] = await pool.query(
      `INSERT INTO Conversa (idUsuarioEmisor, idUsuarioReceptor, mensaje, sendDate, leido) 
        VALUES (?, ?, ?, NOW(), 'No')`,
      [idUsuarioEmisor, idUsuarioReceptor, mensaje]
    );

    res.status(200).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener mensajes de una conversación
export const getListConversaciones = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const [rows] = await pool.query(
      `SELECT DISTINCT 
        c.idUsuarioEmisor, 
        eEmisor.username as usernameEmisor,
        eEmisor.profilePicture as profilePictureEmisor,
        c.idUsuarioReceptor,
        eReceptor.username as usernameReceptor,
        eReceptor.profilePicture as profilePictureReceptor,
        c.leido AS mensajesLeidos,
        c.sendDate
      FROM Conversa c
      LEFT JOIN Usuario eEmisor ON c.idUsuarioEmisor = eEmisor.idUsuario
      LEFT JOIN Usuario eReceptor ON c.idUsuarioReceptor = eReceptor.idUsuario
      WHERE (c.idUsuarioEmisor = ? OR c.idUsuarioReceptor = ?)
        AND c.sendDate = (
          SELECT MAX(sendDate)
          FROM Conversa
          WHERE (idUsuarioEmisor = c.idUsuarioEmisor AND idUsuarioReceptor = c.idUsuarioReceptor)
            OR (idUsuarioEmisor = c.idUsuarioReceptor AND idUsuarioReceptor = c.idUsuarioEmisor)
        )
      ORDER BY c.sendDate DESC`,
      [idUsuario, idUsuario]
    );

    const conversaciones = [];
    const uniqueConversations = new Set();

    rows.forEach(row => {
      // Ordenar los identificadores de usuario para evitar duplicados
      const orderedIds = [row.idUsuarioEmisor, row.idUsuarioReceptor].sort((a, b) => a - b);

      // Crear una clave única para la conversación
      const conversationKey = `${orderedIds[0]}-${orderedIds[1]}`;

      // Verificar si ya existe esta conversación en la lista
      if (!uniqueConversations.has(conversationKey)) {
        uniqueConversations.add(conversationKey);
        //Marca como leído si el último mensaje no leído lo ha realizado el usuario loggeado

        const conversacion = {
          idUsuarioEmisor: row.idUsuarioEmisor,
          usernameEmisor: row.usernameEmisor,
          profilePictureEmisor: row.profilePictureEmisor,
          idUsuarioReceptor: row.idUsuarioReceptor,
          usernameReceptor: row.usernameReceptor,
          profilePictureReceptor: row.profilePictureReceptor,
          mensajesLeidos: (idUsuario == row.idUsuarioEmisor) ? 'Si' : row.mensajesLeidos
        };

        conversaciones.push(conversacion);
      }
    });

    res.status(200).json({ conversaciones });

  } catch (error) {
    console.error('Error al obtener las conversaciones del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener mensajes de una conversación
export const getConversacion = async (req, res) => {
  try {
    const { idUsuarioEmisor, idUsuarioReceptor } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM Conversa WHERE (idUsuarioEmisor = ? AND idUsuarioReceptor = ?) OR (idUsuarioEmisor = ? AND idUsuarioReceptor = ?) ORDER BY sendDate`,
      [idUsuarioEmisor, idUsuarioReceptor, idUsuarioReceptor, idUsuarioEmisor]
    );

    res.status(200).json({ mensajes: rows });
  } catch (error) {
    console.error('Error al obtener mensajes de la conversación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const checkMessages = async (req, res) => {
  try {
    const { idUsuarioEmisor, idUsuarioReceptor } = req.params;

    // Marca los mensajes de la conversación como leídos
    await pool.query(
      `UPDATE Conversa SET leido = 'Si' WHERE idUsuarioEmisor = ? AND idUsuarioReceptor = ?`,
      [idUsuarioEmisor, idUsuarioReceptor]
    );

    res.status(200).json({ message: 'Mensajes marcados como leídos correctamente' });
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Verifica si un usuario ha solicitado colaborar con otro usuario con anterioridad
export const verifyCollaboration = async (req, res) => {

  try {
    const { idUsuarioLogged, idUsuarioOtro } = req.body;

    console.log(idUsuarioLogged, idUsuarioOtro)

    const [rows] = await pool.query(
      `SELECT * FROM Conversa
      WHERE (idUsuarioEmisor = ? AND idUsuarioReceptor = ?)
        AND (mensaje = '¡Me gustaría colaborar contigo!')`,
      [idUsuarioLogged, idUsuarioOtro]
    );

    console.log(rows)

    if(rows.length > 0) {
      res.send({ hasCollaboration: true });
    } else {
      res.send({ hasCollaboration: false });
    }

  } catch (error) { 
    console.error('Error al verificar la colaboración:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// Crea una conversación para que puedan comunicarse dos usuarios artistas
export const createChat = async (req, res) => {

  try {
    const { idUsuarioLogged, idUsuarioOtro } = req.body;

    console.log(idUsuarioLogged, idUsuarioOtro)
    let mensaje = '¡Me gustaría colaborar contigo!';

    const [result] = await pool.query(
      `INSERT INTO Conversa (idUsuarioEmisor, idUsuarioReceptor, mensaje, sendDate, leido) 
        VALUES (?, ?, ?, NOW(), 'No')`,
      [idUsuarioLogged, idUsuarioOtro, mensaje]
    );

    console.log(result)

    const [resultUsername] = await pool.query(
      'SELECT username FROM usuario WHERE idUsuario = ?',
      [idUsuarioLogged]
    );

    const usernameLogged = resultUsername[0].username;

    const notificationContent = `A <strong>${usernameLogged}</strong> le gustaría colaborar contigo.`;

    // Insertar la notificación en la tabla Notificacion
    const [resultNotification] = await pool.query(
      `INSERT INTO notificacion 
        (sendDate, content, typeContent, idUsuario, isRead, idUsuarioFollow) 
        VALUES (NOW(), ?, 'follow', ?, 'No', ?)`,
      [notificationContent, idUsuarioOtro, idUsuarioLogged]
    );

    res.send({ message: 'Ok' });

  } catch (error) { 
    console.error('Error al verificar la colaboración:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}