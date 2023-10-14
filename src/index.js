import express from 'express'
import {pool}  from './db.js'

const app = express()

app.get('/ping', async (req, res) => {
  // res.send('pong')
  const [result] = await pool.query('SELECT 1 + 1 AS result')
  res.json(result[0])
});

app.get('/usuario', (req, res) => res.send('obteniendo usuarios'))

app.post('/usuario', (req, res) => res.send('creando usuarios'))

app.put('/usuario', (req, res) => res.send('actualizar usuarios'))

app.delete('/usuario', (req, res) => res.send('borrar usuarios'))


app.listen(3000)
console.log('Server running on port 3000');