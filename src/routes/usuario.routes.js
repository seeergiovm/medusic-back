import {Router} from 'express'
import { getUsuario, createUsuario, updateUsuario, deleteUsuario, login, buscarUsuarios} 
  from '../controllers/usuario.controller.js'

const router = Router()

router.post('/usuario/get', getUsuario)

router.post('/usuario/create', createUsuario)

router.put('/usuario', updateUsuario)

router.delete('/usuario', deleteUsuario)

router.post('/login', login)

router.get('/usuario/buscar/:termino', buscarUsuarios)



export default router