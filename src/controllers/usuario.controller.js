import {pool} from '../db.js'
import { generateToken, sendPasswordResetEmail } from '../utils/authUtils.js'


//PRUEBA
//Añade una imagen asociada a un usuario a la BD
export const subirImagen = async (req, res) => {
  try {
    // obtener la ruta de la imagen en req.file.path
    console.log(req.file);

    const rutaImagen = req.file.path.replace(/\\/g, '/');
    const idUsuario = req.body.idUsuario;

    await pool.query('START TRANSACTION');

    const [rows] = await pool.query(`UPDATE usuario SET profilePicture=? WHERE idUsuario=?`
    , [rutaImagen, idUsuario]);

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
//Devuelve info del usuario a traves de su ID
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
  // TO DO
  // try {
  //   const { termino } = req.params;

  //   const [usuarios] = await pool.query(
  //     'SELECT idUsuario, username, profilePicture, rol FROM usuario WHERE username LIKE ?',
  //     [`%${termino}%`]
  //   );
  //   console.log(termino)
  //   console.log(usuarios);

  //   res.json(usuarios);

  // } catch (error) {
  //   console.error('Error al buscar usuarios:', error);
  //   res.status(500).json({ error: 'Error interno del servidor.' });
  // }
};

// Crea una cuenta de usuario
export const createUsuario = async (req, res) => {

  try {
    const {username, fullname, password, rol, mail, birthday, country, biography, creationDate} = req.body;

    let result;
    if(rol === 'artista') {
      const {artisticName, dedication, musicalGenres} = req.body;

      [result] = await pool.query(`INSERT INTO usuario (
        username, fullname, passw, rol, mail, birthday, country, biography,
        creationDate, artisticName, dedication, musicalGenres
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [username, fullname, password, rol, mail, birthday, country, biography, creationDate, artisticName, dedication, musicalGenres]);

    } else {
      const {favsArtists} = req.body;
      
      [result] = await pool.query(`INSERT INTO usuario (
        username, fullname, passw, rol, mail, birthday, country, biography,
        creationDate, favsArtists
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [username, fullname, password, rol, mail, birthday, country, biography, creationDate, favsArtists]);
    }

    console.log(result)
    console.log(username, fullname, password, rol, mail, birthday, country, biography, creationDate)

    //Añadir imagen

    // No funciona
    // const rutaImagen = req.file.path.replace(/\\/g, '/');
    
    // console.log("Archivo: " + req);

    // const idUsuario = result.insertId;

    // const [rows] = await pool.query(`UPDATE usuario SET profilePicture=? WHERE idUsuario=?`
    // , [rutaImagen, idUsuario]);

    // console.log(rows)
    // if (rows.affectedRows === 0) {
    //   return res.status(200).json({ error: 'No se ha actualizado la imagen de perfil del usuario' });
    // }
    

    res.send('OK')

  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export const updateUsuario = (req, res) => res.send('actualizar usuarios')

export const deleteUsuario = (req, res) => res.send('borrar usuarios')


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
    const { termino } = req.params;

    const [usuarios] = await pool.query(
      'SELECT idUsuario, username, profilePicture, rol FROM usuario WHERE username LIKE ?',
      [`%${termino}%`]
    );
    console.log(termino)
    console.log(usuarios);

    res.json(usuarios);

  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



