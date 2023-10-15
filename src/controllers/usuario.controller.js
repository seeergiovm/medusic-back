import {pool}  from '../db.js'

export const getUsuario = (req, res) => res.send('obteniendo usuarios')

export const createUsuario = async (req, res) => {

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
}

export const updateUsuario = (req, res) => res.send('actualizar usuarios')

export const deleteUsuario = (req, res) => res.send('borrar usuarios')