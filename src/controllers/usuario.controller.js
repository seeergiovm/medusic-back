import {pool} from '../db.js'
import jwt from 'jsonwebtoken';

export const getUsuario = async (req, res) => {
  
  try {
    const {username} = req.body;

    const [rows] = await pool.query(`SELECT * FROM usuario WHERE username=?`, 
    [username]);

    console.log(rows[0])

    res.send('OK')
    
  } catch (error) {
    console.error('Error al verificar el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

export const createUsuario = async (req, res) => {

  try {
    //FALTA TRATAR LA IMAGEN DE PERFIL
    const {username, fullname, passw, rol, mail, birthday, country, biography, creationDate} = req.body;

    if(rol === 'artista') {
      const {artisticName, dedication, musicalGenres} = req.body;

      const [rows] = await pool.query(`INSERT INTO usuario (
        username, fullname, passw, rol, mail, birthday, country, biography,
        creationDate, artisticName, dedication, musicalGenres
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [username, fullname, passw, rol, mail, birthday, country, biography, creationDate, artisticName, dedication, musicalGenres]);

    } else {
      const {favsArtists} = req.body;
      
      const [rows] = await pool.query(`INSERT INTO usuario (
        username, fullname, passw, rol, mail, birthday, country, biography,
        creationDate, favsArtists
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [username, fullname, passw, rol, mail, birthday, country, biography, creationDate, favsArtists]);
    }

    console.log(username, fullname, passw, rol, mail, birthday, country, biography, creationDate)

    // console.log(rows)
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
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const usuario = rows[0];

    console.log(usuario);
    res.send('OK');
  } catch (error) {
    console.error('Error al verificar el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};





