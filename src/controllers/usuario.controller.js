import {pool} from '../db.js'
import { generateToken, sendPasswordResetEmail } from '../utils/authUtils.js'


//PRUEBA
//Añade una imagen asociada a un usuario a la BD
export const subirImagen = async (req, res) => {
  try {

    const { profilePicture, idUsuario }= req.body;

    await pool.query('START TRANSACTION');

    const [rows] = await pool.query(`UPDATE usuario SET profilePicture=? WHERE idUsuario=?`
    , [profilePicture, idUsuario]);

    console.log(rows)
    if (rows.affectedRows === 0) {
      return res.status(200).json({ error: 'No se ha actualizado la imagen de perfil del usuario' });
    }
    
    await pool.query('COMMIT');

    res.send('Imagen subida correctamente.');
  } catch (error) {

    await pool.query('ROLLBACK');

    console.error('Error al subir la imagen:', error);
    res.status(500).send('Error al subir la imagen.');
  }
}


// CONTROL PETICIONES
// Devuelve info del usuario a traves de su ID (para editar perfil)
export const getUsuario = async (req, res) => {
  try {
    const {idUsuario} = req.params;

    const [rows] = await pool.query(`SELECT * FROM usuario WHERE idUsuario=?`, 
    [idUsuario]);

    console.log(rows[0])

    res.send(rows[0])

  } catch (error) {
    console.error('Error al verificar el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// Devuelve toda la información del perfil de un usuario
export const getPerfilUsuario = async (req, res) => {
  try {
    const {idUsuario} = req.params;

    const [rowsUsuario] = await pool.query(
      'SELECT * FROM usuario WHERE idUsuario = ?',
      [idUsuario]
    );

    const [rowsPublicaciones] = await pool.query(
      'SELECT * FROM publicacion WHERE idUsuario = ?',
      [idUsuario]
    );

    const [rowsPublicacionFav] = await pool.query(
      `SELECT 
        publicacion.*,
        COUNT(megusta.idUsuario) AS likesCount
      FROM publicacion
      LEFT JOIN megusta ON publicacion.idPublicacion = megusta.idPublicacion
      WHERE publicacion.idUsuario = ?
      GROUP BY publicacion.idPublicacion
      ORDER BY likesCount DESC
      LIMIT 1`,
      [idUsuario]
    );

    const [rowsSeguidos] = await pool.query(
      'SELECT COUNT(*) AS numSeguidos FROM sigue WHERE idUsuarioSigue = ?',
      [idUsuario]
    );
    
    const [rowsSeguidores] = await pool.query(
      'SELECT COUNT(*) AS numSeguidores FROM sigue WHERE idUsuarioSeguido = ?',
      [idUsuario]
    );

    const usuarioConPublicaciones = {
      usuario: {
        ...rowsUsuario[0],
        numPublicaciones: rowsPublicaciones.length,
        numSeguidos: rowsSeguidos[0].numSeguidos,
        numSeguidores: rowsSeguidores[0].numSeguidores
      }, 
      publicaciones: rowsPublicaciones.map(row => ({
        idPublicacion: row.idPublicacion,
        publicationDate: row.publicationDate,
        descripcion: row.descripcion,
        attachedFile: row.attachedFile,
        isEvent: row.isEvent
      })),
      publicacionDestacada: rowsPublicacionFav[0]
    };

    console.log(usuarioConPublicaciones);

    res.send(usuarioConPublicaciones)

  } catch (error) {
    console.error('Error al obtener detalles del usuario y sus publicaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Verifica si un usuario ha dado seguir a otro usuario
export const verifyFollow = async (req, res) => {

  try {
    const { idUsuarioLogged, idUsuarioOtro } = req.body;

    console.log(idUsuarioLogged, idUsuarioOtro)

    const [rows] = await pool.query(
      `SELECT * FROM Sigue WHERE idUsuarioSigue = ? AND idUsuarioSeguido = ?`,
      [idUsuarioLogged, idUsuarioOtro]
    );

    console.log(rows)

    if(rows.length > 0) {
      res.send({ hasFollow: true });
    } else {
      res.send({ hasFollow: false });
    }

  } catch (error) { 
    console.error('Error al verificar el follow:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// Agrega el follow de un usuario a otro usuario
export const addFollow = async (req, res) => {

  try {
    const { idUsuarioLogged, idUsuarioOtro } = req.body;

    console.log(idUsuarioLogged, idUsuarioOtro)

    let result;

    [result] = await pool.query(`INSERT INTO sigue (
      idUsuarioSigue, idUsuarioSeguido
    ) 
    VALUES (?, ?)`, 
    [idUsuarioLogged, idUsuarioOtro]);

    console.log(result);

    res.send({message:'OK: addFollow'});

  } catch (error) { 
    console.error('Error al agregar follow:', error);
    // res.status(500).json({ error: 'Error interno del servidor: Error al agregar un follow' });
  }
}

// Agrega el like de un usuario a una publicación
export const removeFollow = async (req, res) => {

  try {
    const { idUsuarioLogged, idUsuarioOtro } = req.body;

    console.log(idUsuarioLogged, idUsuarioOtro)

    let result;

    [result] = await pool.query(
      `DELETE FROM sigue WHERE idUsuarioSigue = ? AND idUsuarioSeguido = ?`,
      [idUsuarioLogged, idUsuarioOtro]
    );

    console.log(result);

    res.send({message:'OK: removeFollow'});

  } catch (error) { 
    console.error('Error al elimnarfollow:', error);
    res.status(500).json({ error: 'Error interno del servidor: Error al eliminar un follow' });
  }
}



// Crea una cuenta de usuario
export const createUsuario = async (req, res) => {

  try {
    const {username, fullname, password, rol, mail, birthday, country, profilePicture, biography, creationDate} = req.body;

    let result;
    if(rol === 'artista') {
      const {artisticName, dedication, musicalGenres} = req.body;

      [result] = await pool.query(`INSERT INTO usuario (
        username, fullname, passw, rol, mail, birthday, country, profilePicture, biography,
        creationDate, artisticName, dedication, musicalGenres
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [username, fullname, password, rol, mail, birthday, country, profilePicture, biography, creationDate, artisticName, dedication, musicalGenres]);

    } else {
      const {favsArtists} = req.body;
      
      [result] = await pool.query(`INSERT INTO usuario (
        username, fullname, passw, rol, mail, birthday, country, profilePicture, biography,
        creationDate, favsArtists
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [username, fullname, password, rol, mail, birthday, country, profilePicture, biography, creationDate, favsArtists]);
    }

    console.log(result)
    console.log(username, fullname, password, rol, mail, birthday, country, profilePicture, biography, creationDate)

    console.log("Archivo: " + req);

    res.send('OK')

  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export const updateUsuario = async (req, res) => {
  try {
    const {idUsuario, username, fullname, rol, mail, country, biography} = req.body;

    console.log(username, mail, fullname, country, biography, idUsuario)

    let result;
    if(rol === 'artista') {
      const {artisticName, dedication, musicalGenres} = req.body;

      [result] = await pool.query(`UPDATE usuario SET
        username=?, mail=?, fullname=?, country=?, biography=?, artisticName=?, dedication=?, musicalGenres=?
        WHERE (idUsuario=?)`,
        [username, mail, fullname, country, biography, artisticName, dedication, musicalGenres, idUsuario]);

    } else {
      const {favsArtists} = req.body;
      
      [result] = await pool.query(`UPDATE usuario SET
        username=?, mail=?, fullname=?, country=?, biography=?, favsArtists=?
        WHERE (idUsuario=?)`, 
      [username, mail, fullname, country, biography, favsArtists, idUsuario]);
    }


    console.log(result)

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Se han actualizado los datos correctamente.' });
    } else {
      res.status(200).json({ message: 'No se realizaron cambios.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }

}

// Actualizar contraseña usuario
export const updatePassword = async (req, res) => {
  try {
    const {idUsuario, oldPassword, newPassword} = req.body;

    console.log(idUsuario, oldPassword, newPassword)

    let rows, result;

    [rows] = await pool.query(`SELECT passw FROM usuario WHERE idUsuario=?`,
      [idUsuario]);

    console.log('Introducida:' + oldPassword +' real:' + rows[0].passw);
    
    if(!rows.length ||oldPassword !== rows[0].passw) {
      return res.status(200).json({ message: 'La contraseña actual no es correcta.' });
    }

    [result] = await pool.query(`UPDATE usuario SET passw=? WHERE (idUsuario=?)`,
      [newPassword, idUsuario]);

    console.log(result)

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Se ha actualizado la contraseña correctamente.' });
    } else {
      res.status(200).json({ message: 'No se realizaron cambios.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }

}

export const deleteUsuario = async (req, res) => {
  try {
    const {idUsuario} = req.params;

    console.log(idUsuario)

    let rows, result;

    [rows] = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [idUsuario]);

    if (!rows.length) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    // Eliminar el usuario
    [result] = await pool.query('DELETE FROM usuario WHERE idUsuario = ?', [idUsuario]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Su cuenta ha sido eliminada correctamente.' });
    } else {
      res.status(200).json({ message: 'No se ha podido eliminar la cuenta' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }

}


export const login = async (req, res) => {
  try {
    console.log('LOGIN')
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos.' });
    }

    const [rows] = await pool.query(`
      SELECT *
      FROM usuario
      WHERE username=? AND passw=?`,
      [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];

    // Genera un token
    const token = generateToken(usuario.idUsuario, '5h');

    console.log(usuario);
    res.send({
      token,
      usuario
    });
  } catch (error) {
    console.error('Error al verificar el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// Enviar correo con los datos de inicio de sesión
export const recoverPassword = async (req, res) => {
  try {
    const { mail } = req.params;


    const [rows] = await pool.query(`
      SELECT username, fullname, passw FROM usuario WHERE mail=?`,
      [mail]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No existe ninguna cuenta asociada a ese correo electrónico.' });
    }

    let datosLogin = rows[0];

    await sendPasswordResetEmail(mail, datosLogin);

    res.status(200).json({ message: 'Se ha enviado un correo electrónico con los datos de su cuenta' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Busqueda filtrada de usuarios por nombre de usuario
export const buscarUsuarios = async (req, res) => {
  try {
    const { termino, idUsuarioLoggeado } = req.params;

    const [usuarios] = await pool.query(
      'SELECT idUsuario, username, profilePicture, rol FROM usuario WHERE username LIKE ? AND idUsuario != ?',
      [`%${termino}%`, idUsuarioLoggeado]
    );
    console.log(termino)
    console.log(usuarios);

    res.json(usuarios);

  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



